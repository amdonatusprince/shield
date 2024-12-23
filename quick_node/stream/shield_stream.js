// Add protocol constants at the top
const PROTOCOL_IDS = {
    MARGINFI: {
        MAIN: 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA'
    },
    JUPITER: {
        SWAPS: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
        LIMIT_ORDER: 'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu',
        DCA: 'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M'
    },
    OPENBOOK: {
        V2: 'opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb'
    },
    RAYDIUM: {
        OPEN_BOOK: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
        STABLE_SWAP_AMM: '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h',
        STAKING: 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q',
        STANDARD_AMM: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
        CONCENTRATED_LIQUIDITY: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
    }
};

function main(stream, protocolFilter = null) {
    let data = typeof stream === 'string' ? JSON.parse(stream) : stream;
    
    if (Array.isArray(data) && Array.isArray(data[0])) {
        data = data.flat();
    }
    
    const transactions = Array.isArray(data) ? data : [data];
    const filtered = [];

    // Helper function to check if a program ID matches any protocol
    const findMatchingProtocol = (programId) => {
        for (const [protocol, subProtocols] of Object.entries(PROTOCOL_IDS)) {
            for (const [subType, id] of Object.entries(subProtocols)) {
                if (programId === id) {
                    return { protocol, subType };
                }
            }
        }
        return null;
    };

    // Loop through each transaction
    for (const tx of transactions) {
        // Check if transaction matches any protocol we're tracking
        const matchingProtocol = findMatchingProtocol(tx.programId);
        
        if (matchingProtocol && (!protocolFilter || matchingProtocol.protocol === protocolFilter)) {
            filtered.push(processTransaction({ ...tx, ...matchingProtocol }));
            continue;
        }

        // Check program invocations
        if (tx.programInvocations) {
            for (const invocation of tx.programInvocations) {
                const matchingInvocation = findMatchingProtocol(invocation.programId);
                
                if (matchingInvocation && (!protocolFilter || matchingInvocation.protocol === protocolFilter)) {
                    const protocolLogs = tx.logs.filter(
                        log => log.includes(invocation.programId) || log.includes('Instruction:')
                    );

                    const instructionType = protocolLogs
                        .find(log => log.includes('Instruction:'))
                        ?.split('Instruction: ')[1] || 'Unknown';

                    const filteredTx = {
                        signature: tx.signature,
                        slot: tx.slot,
                        blockTime: tx.blockTime,
                        type: instructionType,
                        protocol: matchingInvocation.protocol,
                        subType: matchingInvocation.subType,
                        programId: invocation.programId,
                        accounts: invocation.instruction.accounts,
                        tokenBalanceChanges: invocation.instruction.tokenBalances || [],
                        success: tx.success,
                        logs: protocolLogs,
                        rawInstruction: invocation.instruction
                    };
                    
                    filtered.push(processTransaction(filteredTx));
                    break;
                }
            }
        }
    }

    return filtered;
}

// Helper function to process individual transactions
function processTransaction(tx) {
    const userWallet = tx.accounts[2]?.pubkey || null;
    const userAccount = tx.accounts.find(acc => acc.pubkey === userWallet);
    const balanceChange = userAccount ? userAccount.postBalance - userAccount.preBalance : 0;
    
    const tokenTransfers = tx.tokenBalanceChanges.map(token => ({
        mint: token.mint,
        owner: token.owner,
        amount: token.uiTokenAmount.uiAmount,
        decimals: token.uiTokenAmount.decimals,
        rawAmount: token.uiTokenAmount.amount
    }));

    const accounts = tx.accounts.map(acc => ({
        address: acc.pubkey,
        balanceChange: acc.postBalance - acc.preBalance
    }));

    return {
        transactionId: tx.signature,
        blockSlot: tx.slot,
        timestamp: tx.blockTime,
        success: tx.success,
        type: tx.type,
        protocol: tx.protocol,
        subType: tx.subType,
        program: tx.programId,
        userWallet,
        userBalanceChange: balanceChange,
        tokenTransfers,
        accountChanges: accounts,
        instruction: {
            index: tx.rawInstruction.index,
            data: tx.rawInstruction.data
        },
        logs: tx.logs.filter(log => 
            !log.includes('invoke') && 
            !log.includes('success') &&
            !log.includes('consumed')
        ),
        processedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
}
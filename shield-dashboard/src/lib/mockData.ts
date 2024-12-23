export const mockStreamData = {
    data: [
      {
        transactionId: "tx1",
        protocol: "Jupiter",
        timestamp: Date.now() - 1000,
        success: true,
        userWallet: "wallet1",
        type: "swap",
        tokenTransfers: [
          {
            mint: "SOL",
            amount: 1.5,
            owner: "wallet1",
            decimals: 9
          }
        ]
      },
      // Add more mock transactions...
    ]
  };
  
  export const mockProtocolStats = {
    Jupiter: {
      transactionCount: 1500,
      successRate: 98.5,
      uniqueUsers: ["wallet1", "wallet2"],
      totalVolume: 25000,
      failedTxs: 15
    },
    // Add more protocols...
  };
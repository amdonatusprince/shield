/**
 * Main entry point for all transaction queries
 * @param {Object} stream - Transaction stream containing data array
 * @param {Object} options - Query options
 * @param {string} options.type - Type of query to perform
 * @param {string} [options.protocol] - Protocol name for protocol-specific queries
 * @param {number} [options.limit] - Number of results to return
 * @param {number} [options.timeframe] - Timeframe in seconds for time-based queries
 * @param {number} [options.threshold] - Threshold value for filtering transactions
 * @param {Function} [options.callback] - Callback function for alerts
 * @param {string} [options.walletAddress] - Wallet address for wallet-specific queries
 * @param {string} [options.mintAddress] - Token mint address for token-specific queries
 * @returns {*} Query results based on type
 * 
 * Available query types:
 * - 'all': Get all transactions with optional limit
 * - 'byProtocol': Get transactions for specific protocol
 * - 'volume': Get volume statistics for a protocol
 * - 'activeWallets': Get list of active wallets for a protocol
 * - 'transferStats': Get token transfer statistics for a protocol
 * - 'alertLarge': Monitor and alert on large transactions
 * - 'multiProtocolStats': Get comparative statistics across protocols
 * - 'dailyStats': Get daily statistics for a protocol
 * - 'walletSearch': Search transactions related to a wallet
 * - 'protocolFees': Calculate protocol fee statistics
 * - 'valueTransferred': Calculate total value transferred for a token
 */


/**
 * Get all transactions from the stream
 * @param {Object} stream - Transaction stream
 * @param {number} [limit] - Optional limit on number of results
 * @returns {Array} Array of transactions
 */

function getAllTransactions(stream, limit = null) {
    const transactions = stream.data;
    return limit ? transactions.slice(0, limit) : transactions;
  }
  
  /**
 * Get transactions filtered by protocol
 * @param {Object} stream - Transaction stream
 * @param {string} protocol - Protocol name to filter by
 * @param {number} [limit] - Optional limit on number of results
 * @returns {Array} Filtered transactions
 */

  function getTransactionsByProtocol(stream, protocol, limit = null) {
    const transactions = stream.data.filter(tx => 
      tx.protocol?.toLowerCase() === protocol.toLowerCase()
    );
    return limit ? transactions.slice(0, limit) : transactions;
  }
  
  /**
 * Calculate protocol volume statistics
 * @param {Object} stream - Transaction stream
 * @param {string} protocol - Protocol name
 * @param {number} timeframe - Timeframe in seconds
 * @returns {Object} Volume statistics by token
 */

  function getProtocolVolume(stream, protocol, timeframe) {
    const now = Math.floor(Date.now() / 1000);
    const startTime = now - timeframe;
  
    const transactions = stream.data.filter(
      (tx) => tx.protocol === protocol && tx.timestamp >= startTime && tx.success
    );
  
    const volumeByToken = transactions.reduce((acc, tx) => {
      tx.tokenTransfers.forEach((transfer) => {
        const key = transfer.mint;
        acc[key] = (acc[key] || 0) + Math.abs(transfer.amount);
      });
      return acc;
    }, {});
  
    return {
      protocol,
      timeframe,
      volumeByToken,
      transactionCount: transactions.length,
    };
  }
  
  /**
 * Get list of active wallets for a protocol
 * @param {Object} stream - Transaction stream
 * @param {string} protocol - Protocol name
 * @returns {Array} List of unique wallet addresses
 */

  function getActiveWallets(stream, protocol) {
    return [
      ...new Set(
        stream.data
          .filter((tx) => tx.protocol === protocol && tx.success)
          .map((tx) => tx.userWallet)
      ),
    ];
  }
  
  /**
 * Get token transfer statistics for a protocol
 * @param {Object} stream - Transaction stream
 * @param {string} protocol - Protocol name
 * @returns {Object} Token transfer statistics
 */

  function getTokenTransferStats(stream, protocol) {
    const transactions = stream.data.filter(
      (tx) =>
        tx.protocol === protocol && tx.success && tx.tokenTransfers.length > 0
    );
  
    const stats = transactions.reduce((acc, tx) => {
      tx.tokenTransfers.forEach((transfer) => {
        const key = transfer.mint;
        if (!acc[key]) {
          acc[key] = {
            totalVolume: 0,
            transferCount: 0,
            uniqueWallets: new Set(),
            averageAmount: 0,
            decimals: transfer.decimals,
          };
        }
  
        acc[key].totalVolume += Math.abs(transfer.amount);
        acc[key].transferCount += 1;
        acc[key].uniqueWallets.add(transfer.owner);
        acc[key].averageAmount = acc[key].totalVolume / acc[key].transferCount;
      });
      return acc;
    }, {});
  
    Object.keys(stats).forEach((key) => {
      stats[key].uniqueWallets = Array.from(stats[key].uniqueWallets);
    });
  
    return stats;
  }
  
  /**
 * Monitor for large transactions
 * @param {Object} stream - Transaction stream
 * @param {number} threshold - Minimum transaction value
 * @param {Function} callback - Callback function for alerts
 */

  function alertOnLargeTransactions(stream, threshold, callback) {
    stream.data.forEach((tx) => {
      const totalValue = tx.tokenTransfers.reduce(
        (sum, transfer) => sum + Math.abs(transfer.amount),
        0
      );
  
      if (totalValue >= threshold) {
        callback({
          transactionId: tx.transactionId,
          timestamp: tx.timestamp,
          value: totalValue,
          protocol: tx.protocol,
          type: tx.type,
        });
      }
    });
  }

/**
 * Compare statistics across different protocols
 * @param {Object} stream - Transaction stream
 * @returns {Object} Multi-protocol statistics
 */

  function getMultiProtocolStats(stream) {
    const stats = {};
  
    stream.data.forEach((tx) => {
      if (!tx.protocol) return;
  
      if (!stats[tx.protocol]) {
        stats[tx.protocol] = {
          transactionCount: 0,
          successRate: 0,
          uniqueUsers: new Set(),
          totalVolume: 0,
          failedTxs: 0,
        };
      }
  
      stats[tx.protocol].transactionCount++;
      stats[tx.protocol].uniqueUsers.add(tx.userWallet);
  
      if (!tx.success) {
        stats[tx.protocol].failedTxs++;
      }
  
      const txVolume = tx.tokenTransfers.reduce(
        (sum, transfer) => sum + Math.abs(transfer.amount),
        0
      );
      stats[tx.protocol].totalVolume += txVolume;
    });
  
    Object.keys(stats).forEach((protocol) => {
      const protocolStats = stats[protocol];
      protocolStats.successRate =
        ((protocolStats.transactionCount - protocolStats.failedTxs) /
          protocolStats.transactionCount) *
        100;
      protocolStats.uniqueUsers = Array.from(protocolStats.uniqueUsers);
    });
  
    return stats;
  }
  
  /**
 * Get daily statistics for a protocol
 * @param {Object} stream - Transaction stream
 * @param {string} protocol - Protocol name
 * @returns {Object} Daily statistics
 */

  function getDailyStats(stream, protocol) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = Math.floor(today.getTime() / 1000);
  
    const todayTxs = stream.data.filter(
      (tx) => tx.protocol === protocol && tx.timestamp >= startOfDay
    );
  
    const tokenVolumes = {};
    todayTxs.forEach((tx) => {
      tx.tokenTransfers.forEach((transfer) => {
        const key = transfer.mint;
        tokenVolumes[key] = (tokenVolumes[key] || 0) + Math.abs(transfer.amount);
      });
    });
  
    return {
      date: today.toISOString().split("T")[0],
      transactionCount: todayTxs.length,
      uniqueUsers: new Set(todayTxs.map((tx) => tx.userWallet)).size,
      tokenVolumes,
      successRate: todayTxs.length
        ? (todayTxs.filter((tx) => tx.success).length / todayTxs.length) * 100
        : 0,
      failedTransactions: todayTxs.filter((tx) => !tx.success).length,
      averageTransactionSize: todayTxs.length
        ? Object.values(tokenVolumes).reduce((a, b) => a + b, 0) / todayTxs.length
        : 0,
    };
  }
  
  /**
 * Search transactions related to a wallet address
 * @param {Object} stream - Transaction stream
 * @param {string} walletAddress - Wallet address to search for
 * @returns {Object} Wallet transaction analysis
 */

  function searchTransactionsByWallet(stream, walletAddress) {
    const transactions = stream.data.filter(
      (tx) =>
        tx.userWallet === walletAddress ||
        tx.tokenTransfers.some((transfer) => transfer.owner === walletAddress) ||
        tx.accountChanges.some((change) => change.address === walletAddress)
    );
  
    return {
      walletAddress,
      transactionCount: transactions.length,
      successRate: transactions.length
        ? (transactions.filter((tx) => tx.success).length / transactions.length) *
          100
        : 0,
      protocols: [...new Set(transactions.map((tx) => tx.protocol))],
      tokenInteractions: transactions.reduce((acc, tx) => {
        tx.tokenTransfers.forEach((transfer) => {
          const key = transfer.mint;
          if (!acc[key]) {
            acc[key] = {
              totalVolume: 0,
              transactionCount: 0,
              lastInteraction: null,
            };
          }
          acc[key].totalVolume += Math.abs(transfer.amount);
          acc[key].transactionCount++;
          acc[key].lastInteraction = Math.max(
            acc[key].lastInteraction || 0,
            tx.timestamp
          );
        });
        return acc;
      }, {}),
      transactions: transactions.sort((a, b) => b.timestamp - a.timestamp),
    };
  }
  
  /**
 * Calculate fees paid per protocol
 * @param {Object} stream - Transaction stream
 * @param {string} [protocol] - Optional protocol name to filter by
 * @returns {Object} Fee statistics by protocol
 */

  function calculateProtocolFees(stream, protocol = null) {
    const feeStats = stream.data.reduce((acc, tx) => {
      if (protocol && tx.protocol !== protocol) return acc;
  
      const protocolName = tx.protocol || "unknown";
      if (!acc[protocolName]) {
        acc[protocolName] = {
          totalFees: 0,
          transactionCount: 0,
          averageFee: 0,
          feesByType: {},
          highestFee: {
            amount: 0,
            transactionId: null,
          },
        };
      }
  
      const fee = Math.abs(
        tx.accountChanges.reduce(
          (sum, change) =>
            change.balanceChange < 0 ? sum + change.balanceChange : sum,
          0
        )
      );
  
      acc[protocolName].totalFees += fee;
      acc[protocolName].transactionCount++;
      acc[protocolName].averageFee =
        acc[protocolName].totalFees / acc[protocolName].transactionCount;
  
      const txType = tx.type || "unknown";
      if (!acc[protocolName].feesByType[txType]) {
        acc[protocolName].feesByType[txType] = {
          total: 0,
          count: 0,
          average: 0,
        };
      }
      acc[protocolName].feesByType[txType].total += fee;
      acc[protocolName].feesByType[txType].count++;
      acc[protocolName].feesByType[txType].average =
        acc[protocolName].feesByType[txType].total /
        acc[protocolName].feesByType[txType].count;
  
      if (fee > acc[protocolName].highestFee.amount) {
        acc[protocolName].highestFee = {
          amount: fee,
          transactionId: tx.transactionId,
        };
      }
  
      return acc;
    }, {});
  
    return feeStats;
  }
  
  /**
 * Calculate total value transferred for a specific token
 * @param {Object} stream - Transaction stream
 * @param {string} mintAddress - Token mint address
 * @returns {Object} Token transfer analysis
 */

  function calculateTotalValueTransferred(stream, mintAddress) {
    const transfers = stream.data.flatMap((tx) =>
      tx.tokenTransfers.filter((transfer) => transfer.mint === mintAddress)
    );
  
    const analysis = {
      mintAddress,
      totalTransfers: transfers.length,
      totalVolume: transfers.reduce(
        (sum, transfer) => sum + Math.abs(transfer.amount),
        0
      ),
      uniqueSenders: new Set(transfers.map((t) => t.owner)).size,
      averageTransferSize: transfers.length
        ? transfers.reduce((sum, t) => sum + Math.abs(t.amount), 0) /
          transfers.length
        : 0,
      largestTransfer: Math.max(...transfers.map((t) => Math.abs(t.amount))),
      decimals: transfers[0]?.decimals || 0,
      timeStats: {
        firstTransfer: transfers.length
          ? Math.min(
              ...stream.data
                .filter((tx) =>
                  tx.tokenTransfers.some((t) => t.mint === mintAddress)
                )
                .map((tx) => tx.timestamp)
            )
          : null,
        lastTransfer: transfers.length
          ? Math.max(
              ...stream.data
                .filter((tx) =>
                  tx.tokenTransfers.some((t) => t.mint === mintAddress)
                )
                .map((tx) => tx.timestamp)
            )
          : null,
      },
      volumeByProtocol: stream.data
        .filter((tx) => tx.tokenTransfers.some((t) => t.mint === mintAddress))
        .reduce((acc, tx) => {
          const protocol = tx.protocol || "unknown";
          const volume = tx.tokenTransfers
            .filter((t) => t.mint === mintAddress)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
          acc[protocol] = (acc[protocol] || 0) + volume;
          return acc;
        }, {}),
    };
  
    return analysis;
  }

  function main(stream, options = {}) {
  const { 
    type, 
    protocol, 
    limit, 
    timeframe, 
    threshold, 
    callback,
    walletAddress,
    mintAddress 
  } = options;

  switch (type) {
    case 'all':
      return getAllTransactions(stream, limit);
    case 'byProtocol':
      return getTransactionsByProtocol(stream, protocol, limit);
    case 'volume':
      return getProtocolVolume(stream, protocol, timeframe);
    case 'activeWallets':
      return getActiveWallets(stream, protocol);
    case 'transferStats':
      return getTokenTransferStats(stream, protocol);
    case 'alertLarge':
      return alertOnLargeTransactions(stream, threshold, callback);
    case 'multiProtocolStats':
      return getMultiProtocolStats(stream);
    case 'dailyStats':
      return getDailyStats(stream, protocol);
    case 'walletSearch':
      return searchTransactionsByWallet(stream, walletAddress);
    case 'protocolFees':
      return calculateProtocolFees(stream, protocol);
    case 'valueTransferred':
      return calculateTotalValueTransferred(stream, mintAddress);
    default:
      return stream;
  }
}
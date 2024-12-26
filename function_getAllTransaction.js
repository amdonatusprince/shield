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
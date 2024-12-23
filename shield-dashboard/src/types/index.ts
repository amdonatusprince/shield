export interface Transaction {
  transactionId: string;
  protocol: string;
  timestamp: number;
  success: boolean;
  userWallet: string;
  type: string;
  tokenTransfers: Array<{
    mint: string;
    amount: number;
    owner: string;
    decimals: number;
  }>;
}

export interface ProtocolStats {
  transactionCount: number;
  successRate: number;
  uniqueUsers: string[];
  totalVolume: number;
  failedTxs: number;
}

export interface StreamData {
  data: Transaction[];
}

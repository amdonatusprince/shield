import axios from 'axios';
import useSWR from 'swr';
import { StreamData, Transaction, ProtocolStats } from '@/types';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const API_URL = process.env.NEXT_QUICKNODE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_QUICKNODE_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});

export async function fetchStreamData(): Promise<StreamData> {
  try {
    const response = await api.post('', {
      options: {
        type: 'all',
        limit: 100 // Adjust limit as needed
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stream data:', error);
    throw error;
  }
}

export async function fetchProtocolStats(): Promise<Record<string, ProtocolStats>> {
  try {
    const response = await api.post('', {
      options: {
        type: 'multiProtocolStats'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching protocol stats:', error);
    throw error;
  }
}

export async function fetchProtocolTransactions(protocol: string): Promise<Transaction[]> {
  try {
    const response = await api.post('', {
      options: {
        type: 'byProtocol',
        protocol,
        limit: 50 // Adjust limit as needed
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching protocol transactions:', error);
    throw error;
  }
}

export async function fetchDailyStats(protocol: string) {
  try {
    const response = await api.post('', {
      options: {
        type: 'dailyStats',
        protocol
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    throw error;
  }
}

// Custom hook for data fetching with SWR
export function useStreamData() {
  const fetcher = async () => {
    const data = await fetchStreamData();
    return data;
  };

  return useSWR('streamData', fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    revalidateOnFocus: true
  });
}

export function useProtocolStats() {
  const fetcher = async () => {
    const data = await fetchProtocolStats();
    return data;
  };

  return useSWR('protocolStats', fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    revalidateOnFocus: true
  });
}

export function useProtocolTransactions(protocol: string) {
  const fetcher = async () => {
    const data = await fetchProtocolTransactions(protocol);
    return data;
  };

  return useSWR(`protocol-${protocol}`, fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    revalidateOnFocus: true
  });
}

export function useDailyStats(protocol: string) {
  const fetcher = async () => {
    const data = await fetchDailyStats(protocol);
    return data;
  };

  return useSWR(`dailyStats-${protocol}`, fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    revalidateOnFocus: true
  });
}

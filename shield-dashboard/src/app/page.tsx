'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useStreamData } from '@/lib/api';
import { mockStreamData, mockProtocolStats } from '@/lib/mockData';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { data, error } = useStreamData();

  console.log(data, "data from api");
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shield Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Recent Transactions">
          <div className="space-y-4">
            {mockStreamData.data.map((tx) => (
              <div key={tx.transactionId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{tx.protocol}</span>
                  <span className="text-sm text-gray-600">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`text-sm ${tx.success ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.success ? 'Success' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Protocol Statistics">
          {Object.entries(mockProtocolStats).map(([protocol, stats]) => (
            <div key={protocol} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">{protocol}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Transactions</span>
                  <span>{stats.transactionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <span>{stats.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume</span>
                  <span>${stats.totalVolume.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </main>
  );
}
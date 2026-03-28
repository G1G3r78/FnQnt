// app/watchlist/WatchlistClient.tsx
'use client';

import { useState } from 'react';
import { removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';
import Link from 'next/link';

export default function WatchlistClient({ initialItems }: { initialItems: StockWithData[] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<string | null>(null);

  const handleRemove = async (symbol: string) => {
    setLoading(symbol);
    try {
      const result = await removeFromWatchlist(symbol);
      if (result.success) {
        setItems(items.filter(item => item.symbol !== symbol));
        toast.success(`Removed ${symbol} from watchlist`);
      } else {
        toast.error(result.error || 'Failed to remove from watchlist');
      }
    } catch (error) {
      toast.error('Failed to remove from watchlist');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-700">
          <tr className="text-left">
            <th className="pb-4 px-4">Symbol</th>
            <th className="pb-4 px-4">Company</th>
            <th className="pb-4 px-4">Added</th>
            <th className="pb-4 px-4">Actions</th>
           </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.symbol} className="border-b border-gray-800 hover:bg-gray-900/50">
              <td className="py-4 px-4">
                <Link 
                  href={`/stock/${item.symbol}`}
                  className="font-mono font-semibold text-yellow-500 hover:text-yellow-400"
                >
                  {item.symbol}
                </Link>
              </td>
              <td className="py-4 px-4">{item.company}</td>
              <td className="py-4 px-4 text-gray-400">
                {new Date(item.addedAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => handleRemove(item.symbol)}
                  disabled={loading === item.symbol}
                  className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  {loading === item.symbol ? 'Removing...' : 'Remove'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// app/watchlist/page.tsx
import { getWatchlist } from '@/lib/actions/watchlist.actions';
import WatchlistClient from './WatchlistClient';

export default async function WatchlistPage() {
  const watchlistItems = await getWatchlist();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      
      {watchlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Your watchlist is empty</p>
          <p className="text-gray-500 mt-2">Start adding stocks to track your favorite companies</p>
        </div>
      ) : (
        <WatchlistClient initialItems={watchlistItems} />
      )}
    </div>
  );
}
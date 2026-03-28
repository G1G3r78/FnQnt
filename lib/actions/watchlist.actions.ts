// lib/actions/watchlist.actions.ts
'use server';

import { Watchlist, WatchlistDocument } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getWatchlist(): Promise<StockWithData[]> {
  try {
    const user = await getCurrentUser();
    if (!user?.email) return [];

    await connectToDatabase();
    
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');
    
    const dbUser = await db.collection('user').findOne({ email: user.email });
    if (!dbUser) return [];
    
    const userId = dbUser.id || dbUser._id?.toString();
    if (!userId) return [];

    const watchlist = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
    
    // Convert to StockWithData format
    return watchlist.map(item => ({
      userId: item.userId,
      symbol: item.symbol,
      company: item.company,
      addedAt: item.addedAt,
    }));
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return { success: false, error: 'User not authenticated' };
    }

    await connectToDatabase();
    
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');
    
    const dbUser = await db.collection('user').findOne({ email: user.email });
    if (!dbUser) return { success: false, error: 'User not found' };
    
    const userId = dbUser.id || dbUser._id?.toString();
    if (!userId) return { success: false, error: 'User ID not found' };

    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error adding to watchlist:', error);
    if (error.code === 11000) {
      return { success: false, error: 'Stock already in watchlist' };
    }
    return { success: false, error: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(symbol: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return { success: false, error: 'User not authenticated' };
    }

    await connectToDatabase();
    
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');
    
    const dbUser = await db.collection('user').findOne({ email: user.email });
    if (!dbUser) return { success: false, error: 'User not found' };
    
    const userId = dbUser.id || dbUser._id?.toString();
    if (!userId) return { success: false, error: 'User ID not found' };

    const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    
    if (result.deletedCount === 0) {
      return { success: false, error: 'Stock not found in watchlist' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
}

export async function isInWatchlist(symbol: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user?.email) return false;

    await connectToDatabase();
    
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return false;
    
    const dbUser = await db.collection('user').findOne({ email: user.email });
    if (!dbUser) return false;
    
    const userId = dbUser.id || dbUser._id?.toString();
    if (!userId) return false;

    const exists = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    return !!exists;
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}
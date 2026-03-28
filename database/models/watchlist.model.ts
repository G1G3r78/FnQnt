// database/models/watchlist.model.ts
import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface WatchlistDocument extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<WatchlistDocument>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Prevent duplicate symbols per user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist: Model<WatchlistDocument> =
  (models?.Watchlist as Model<WatchlistDocument>) || model<WatchlistDocument>("Watchlist", WatchlistSchema);
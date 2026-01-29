
import { LedgerEntry } from '@/types';

export interface AnalysisLog {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  timestamp: Date;
  rowNumber?: number;
}

export interface SuspiciousTransaction extends LedgerEntry {
  flags: string[];
  riskScore: number;
}

const SUSPICIOUS_KEYWORDS = [
  'casino', 'bet', 'poker', 'draftkings', 'fanduel',
  'club', 'nightclub', 'bar', 'liquor',
  'spa', 'massage', 'retreat',
  'luxury', 'gucci', 'lv', 'prada', 'rolex',
  'gift card', 'donation', 'charity',
  'amazon', 'paypal', 'venmo', 'cash app',
  'withdrawal', 'cash', 'atm'
];

/**
 * Phase 1: The Dragnet
 * Fast, rule-based filtering to find initial suspects.
 * Runs on the client-side.
 */
export const forensicDragnet = (entry: LedgerEntry, index: number): { isSuspicious: boolean; flags: string[]; log?: AnalysisLog } => {
  const flags: string[] = [];
  const description = entry.description.toLowerCase();
  const date = new Date(entry.date);
  
  // 1. Weekend Check
  const day = date.getDay();
  if (day === 0 || day === 6) {
    // Only flag weekends if it's not a generic "Subscription" or "Rent"
    if (!description.includes('rent') && !description.includes('server') && !description.includes('subscription')) {
      flags.push('Weekend Transaction');
    }
  }

  // 2. Round Number Check (e.g. $500.00, $1000.00)
  // Suspicious if > $100 and perfectly round
  if (entry.amount > 100 && entry.amount % 100 === 0) {
    flags.push('Round Dollar Amount');
  }

  // 3. Keyword Check
  const matchedKeyword = SUSPICIOUS_KEYWORDS.find(k => description.includes(k));
  if (matchedKeyword) {
    flags.push(`Suspicious Keyword: "${matchedKeyword}"`);
  }

  // 4. Benford's Law (Simplified) - Leading digit check could be added here
  
  // 5. Duplicate Check (Need context for this, handled in batch)

  const isSuspicious = flags.length > 0;
  
  let log: AnalysisLog | undefined;
  if (isSuspicious) {
    log = {
      id: Math.random().toString(36).substr(2, 9),
      message: `Row #${index}: Flagged - ${flags.join(', ')} (${entry.description} - $${entry.amount})`,
      type: flags.length > 1 ? 'danger' : 'warning',
      timestamp: new Date(),
      rowNumber: index
    };
  }

  return { isSuspicious, flags, log };
};

/**
 * Helper to calculate statistical anomalies on the full dataset
 */
export const calculateDatasetStats = (entries: LedgerEntry[]) => {
  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
  const avgAmount = totalAmount / entries.length;
  // ... more math stats
  return { totalAmount, avgAmount };
};

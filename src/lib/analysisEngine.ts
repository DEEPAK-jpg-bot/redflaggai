import { 
  MonthlyRevenue, 
  CustomerData, 
  PersonalExpense, 
  EBITDABridge, 
  QoEReport,
  LedgerEntry,
  BankTransaction,
  RiskLevel 
} from '@/types';
import { PERSONAL_EXPENSE_KEYWORDS, EXPENSE_CATEGORIES } from './mockData';

// ========================
// REVENUE ANALYSIS ENGINE
// ========================

/**
 * Analyze revenue discrepancies between ledger entries and bank deposits.
 * Flags months where booked revenue exceeds deposits by more than threshold.
 * 
 * Detection Logic:
 * 1. Group ledger revenue entries by month
 * 2. Group bank deposits by month
 * 3. Calculate discrepancy = (ledger - deposits) / deposits * 100
 * 4. Flag if discrepancy > 10% (configurable threshold)
 * 5. Validate chronological consistency
 * 
 * Red Flags Detected:
 * - Revenue inflation: Booking revenue that doesn't correspond to cash
 * - Fictitious sales: Recording sales that never happened
 * - Timing manipulation: Recording revenue in wrong periods
 * - Proof of Cash violations: Ledger doesn't reconcile to bank
 */
export const analyzeRevenueDiscrepancy = (
  ledgerEntries: LedgerEntry[],
  bankTransactions: BankTransaction[],
  thresholdPercent: number = 10
): { monthlyData: MonthlyRevenue[]; discrepancyFound: boolean; flaggedMonths: string[]; proofOfCashVariance: number } => {
  // Group revenue by month with validation
  const revenueByMonth: Record<string, number> = {};
  const depositsByMonth: Record<string, number> = {};

  // Track cumulative for proof of cash
  let totalBookedRevenue = 0;
  let totalActualDeposits = 0;

  // Process ledger entries - only positive revenue amounts
  ledgerEntries
    .filter(e => e.type === 'revenue' && e.amount > 0)
    .forEach(entry => {
      if (!isValidDate(entry.date)) return;
      const month = entry.date.substring(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + entry.amount;
      totalBookedRevenue += entry.amount;
    });

  // Process bank transactions - only positive deposits
  bankTransactions
    .filter(t => t.type === 'deposit' && t.amount > 0)
    .forEach(transaction => {
      if (!isValidDate(transaction.date)) return;
      const month = transaction.date.substring(0, 7);
      depositsByMonth[month] = (depositsByMonth[month] || 0) + transaction.amount;
      totalActualDeposits += transaction.amount;
    });

  // Get all months, sorted chronologically
  const months = [...new Set([...Object.keys(revenueByMonth), ...Object.keys(depositsByMonth)])].sort();
  const flaggedMonths: string[] = [];

  // Validate chronological consistency - look for suspicious patterns
  let previousMonthRevenue = 0;
  let consecutiveIncreasesAboveThreshold = 0;

  const monthlyData: MonthlyRevenue[] = months.map(month => {
    const bookedRevenue = Math.round(revenueByMonth[month] || 0);
    const actualDeposits = Math.round(depositsByMonth[month] || 0);
    const discrepancy = bookedRevenue - actualDeposits;
    
    // Calculate percentage - avoid division by zero
    const discrepancyPercentage = actualDeposits > 0 
      ? (discrepancy / actualDeposits) * 100 
      : (bookedRevenue > 0 ? 100 : 0);
    
    // Flag if discrepancy exceeds threshold (positive discrepancy = revenue > deposits)
    let flagged = discrepancyPercentage > thresholdPercent;

    // Additional check: suspicious month-over-month revenue jumps without corresponding deposits
    if (previousMonthRevenue > 0 && bookedRevenue > previousMonthRevenue * 1.5) {
      const depositGrowth = actualDeposits / (depositsByMonth[months[months.indexOf(month) - 1]] || 1);
      if (depositGrowth < 1.2) {
        // Revenue jumped 50%+ but deposits didn't follow
        flagged = true;
        consecutiveIncreasesAboveThreshold++;
      }
    }
    previousMonthRevenue = bookedRevenue;

    if (flagged) {
      flaggedMonths.push(formatMonth(month));
    }

    return {
      month: formatMonth(month),
      bookedRevenue,
      actualDeposits,
      discrepancy,
      discrepancyPercentage: Math.round(discrepancyPercentage * 10) / 10,
      flagged,
    };
  });

  // Proof of Cash: Total variance between ledger and bank
  const proofOfCashVariance = totalBookedRevenue - totalActualDeposits;

  return {
    monthlyData,
    discrepancyFound: flaggedMonths.length > 0 || Math.abs(proofOfCashVariance) > totalBookedRevenue * 0.05,
    flaggedMonths,
    proofOfCashVariance,
  };
};

// ========================
// PERSONAL EXPENSE DETECTION
// ========================

/**
 * Detect personal expenses using multi-factor analysis.
 * 
 * Detection Methods:
 * 1. Keyword matching: Check descriptions against known personal expense keywords
 * 2. Category mismatch: Expenses categorized suspiciously (e.g., "Disney" as "Office Supplies")
 * 3. Amount analysis: High-value expenses that warrant scrutiny
 * 4. Vendor analysis: Known luxury/personal vendors
 * 5. Pattern analysis: Weekend transactions, round numbers, recurring personal items
 * 
 * Severity Levels (weighted scoring):
 * - High: Score >= 2.5 (multiple red flags or > $10k)
 * - Medium: Score >= 1.5 ($1k-$10k or some flags)
 * - Low: Score < 1.5 (< $1k, single flag)
 */
export const detectPersonalExpenses = (ledgerEntries: LedgerEntry[]): PersonalExpense[] => {
  const personalExpenses: PersonalExpense[] = [];
  const processedIds = new Set<string>();

  ledgerEntries
    .filter(e => e.type === 'expense' && e.amount > 0)
    .forEach(entry => {
      const description = entry.description.toLowerCase();
      const category = entry.category.toLowerCase();
      
      // Check against keyword patterns
      const matchedKeywords = PERSONAL_EXPENSE_KEYWORDS.filter(keyword => 
        description.includes(keyword.toLowerCase())
      );

      // Check for category-description mismatch (suspicious categorization)
      const categoryMismatch = detectCategoryMismatch(description, category);
      
      // Check for luxury vendor patterns
      const luxuryVendor = detectLuxuryVendor(description);

      // Check for weekend transactions (potential personal use)
      const isWeekendTransaction = checkWeekendTransaction(entry.date);

      // Check for round number amounts (potential fabrication)
      const isRoundAmount = entry.amount % 1000 === 0 && entry.amount >= 5000;

      if (matchedKeywords.length > 0 || categoryMismatch || luxuryVendor || (isWeekendTransaction && entry.amount > 500)) {
        // Generate unique ID to prevent duplicates
        const expenseId = `exp_${hashString(entry.date + entry.description + entry.amount)}`;
        
        if (!processedIds.has(expenseId)) {
          processedIds.add(expenseId);
          
          // Build flag reason
          const reasons: string[] = [];
          if (matchedKeywords.length > 0) {
            reasons.push(`Keyword: "${matchedKeywords.join('", "')}"`);
          }
          if (categoryMismatch) {
            reasons.push(`Suspicious categorization as "${entry.category}"`);
          }
          if (luxuryVendor) {
            reasons.push("Luxury/personal vendor detected");
          }
          if (isWeekendTransaction && entry.amount > 500) {
            reasons.push("Weekend transaction");
          }
          if (isRoundAmount) {
            reasons.push("Suspicious round amount");
          }

          // Calculate severity based on weighted scoring
          const severity = calculateExpenseSeverity(
            entry.amount, 
            matchedKeywords.length, 
            categoryMismatch,
            luxuryVendor,
            isWeekendTransaction
          );

          personalExpenses.push({
            id: expenseId,
            date: entry.date,
            vendor: entry.description,
            amount: entry.amount,
            category: entry.category,
            flagReason: reasons.join(' | '),
            severity,
          });
        }
      }
    });

  // Sort by severity first, then by amount (highest first)
  return personalExpenses.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    return severityDiff !== 0 ? severityDiff : b.amount - a.amount;
  });
};

/**
 * Detect if expense category doesn't match the description
 * E.g., "Disney World" categorized as "Office Supplies" is suspicious
 */
function detectCategoryMismatch(description: string, category: string): boolean {
  const suspiciousCombinations: Record<string, string[]> = {
    'office supplies': ['vacation', 'resort', 'disney', 'spa', 'golf', 'cruise', 'hotel', 'flight', 'airline'],
    'training & education': ['tuition', 'private school', 'daycare', 'nanny'],
    'team building': ['family', 'vacation', 'resort', 'anniversary', 'birthday'],
    'employee wellness': ['spa', 'resort', 'golf', 'country club', 'gym membership'],
    'vehicle expenses': ['porsche', 'ferrari', 'lamborghini', 'tesla model s', 'bmw m', 'mercedes amg', 'maserati'],
    'professional services': ['landscaping', 'pool service', 'home repair', 'interior design'],
    'marketing': ['gift', 'personal', 'family dinner', 'anniversary'],
    'office equipment': ['home theater', 'gaming', 'appliance', 'furniture store'],
  };

  const categoryLower = category.toLowerCase();
  const suspiciousKeywords = suspiciousCombinations[categoryLower] || [];
  
  return suspiciousKeywords.some(keyword => description.includes(keyword));
}

/**
 * Detect luxury vendors that are likely personal expenses
 */
function detectLuxuryVendor(description: string): boolean {
  const luxuryPatterns = [
    /ritz\s*carlton/i,
    /four\s*seasons/i,
    /st\.?\s*regis/i,
    /mandarin\s*oriental/i,
    /waldorf/i,
    /country\s*club/i,
    /yacht\s*club/i,
    /private\s*jet/i,
    /netjets/i,
    /tiffany/i,
    /cartier/i,
    /hermes/i,
    /rolex/i,
    /louis\s*vuitton/i,
    /gucci/i,
    /prada/i,
    /chanel/i,
    /bergdorf/i,
    /neiman\s*marcus/i,
    /saks\s*fifth/i,
    /nordstrom/i,
    /whole\s*foods/i, // Personal groceries
    /costco/i, // Personal shopping
    /amazon\s*prime/i, // Personal subscription
    /netflix/i,
    /spotify/i,
    /disney\s*\+/i,
  ];

  return luxuryPatterns.some(pattern => pattern.test(description));
}

/**
 * Check if transaction occurred on weekend (personal use indicator)
 */
function checkWeekendTransaction(dateStr: string): boolean {
  if (!isValidDate(dateStr)) return false;
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Calculate expense severity based on weighted scoring system
 */
function calculateExpenseSeverity(
  amount: number, 
  keywordMatches: number, 
  hasCategoryMismatch: boolean,
  isLuxuryVendor: boolean = false,
  isWeekend: boolean = false
): 'high' | 'medium' | 'low' {
  let score = 0;
  
  // Amount-based scoring (primary factor)
  if (amount > 10000) score += 3;
  else if (amount > 5000) score += 2;
  else if (amount > 3000) score += 1.5;
  else if (amount > 1000) score += 1;
  else if (amount > 500) score += 0.5;
  
  // Keyword match bonus (each match adds confidence)
  score += Math.min(keywordMatches * 0.5, 1.5);
  
  // Category mismatch is a strong indicator
  if (hasCategoryMismatch) score += 1.5;
  
  // Luxury vendor is a strong indicator
  if (isLuxuryVendor) score += 1;
  
  // Weekend transaction adds minor suspicion
  if (isWeekend) score += 0.25;
  
  if (score >= 2.5) return 'high';
  if (score >= 1.5) return 'medium';
  return 'low';
}

// ========================
// CUSTOMER CHURN ANALYSIS
// ========================

/**
 * Calculate customer churn risk based on spending patterns.
 * 
 * Detection Criteria:
 * 1. Significant spend decrease (> 50% drop from peak)
 * 2. Already flagged customers (from data source)
 * 3. Consecutive month declines
 * 4. Customer concentration risk (single customer > 20% of revenue)
 * 
 * Business Impact:
 * - Customer concentration risk if top customers are churning
 * - Revenue sustainability concerns
 * - Acquisition valuation adjustments
 */
export const calculateCustomerChurn = (customers: CustomerData[]): {
  churnRisk: boolean;
  atRiskCustomers: string[];
  churnDetails: Array<{ name: string; percentChange: number; trend: string }>;
  concentrationRisk: boolean;
  topCustomerPercentage: number;
} => {
  const atRiskCustomers: string[] = [];
  const churnDetails: Array<{ name: string; percentChange: number; trend: string }> = [];

  // Calculate total spend for concentration analysis
  const totalSpend = customers.reduce((sum, c) => sum + c.month1Spend + c.month2Spend + c.month3Spend, 0);
  let maxCustomerSpend = 0;

  customers.forEach(customer => {
    const customerTotalSpend = customer.month1Spend + customer.month2Spend + customer.month3Spend;
    if (customerTotalSpend > maxCustomerSpend) {
      maxCustomerSpend = customerTotalSpend;
    }

    // Calculate actual percentage change from month 1 to month 3
    const calculatedChange = customer.month1Spend > 0
      ? ((customer.month3Spend - customer.month1Spend) / customer.month1Spend) * 100
      : 0;

    // Check multiple risk indicators
    const hasSignificantDrop = calculatedChange < -50 || customer.percentageChange < -50;
    const isFlagged = customer.flagged;
    const hasConsecutiveDeclines = 
      customer.month3Spend < customer.month2Spend && 
      customer.month2Spend < customer.month1Spend;
    
    // Check if customer stopped paying entirely
    const hasChurned = customer.month3Spend === 0 && customer.month1Spend > 0;

    if (hasSignificantDrop || isFlagged || (hasConsecutiveDeclines && calculatedChange < -30) || hasChurned) {
      atRiskCustomers.push(customer.name);
      churnDetails.push({
        name: customer.name,
        percentChange: Math.round(calculatedChange),
        trend: customer.trend,
      });
    }
  });

  // Calculate customer concentration risk
  const topCustomerPercentage = totalSpend > 0 ? (maxCustomerSpend / totalSpend) * 100 : 0;
  const concentrationRisk = topCustomerPercentage > 20;

  return {
    churnRisk: atRiskCustomers.length > 0,
    atRiskCustomers,
    churnDetails,
    concentrationRisk,
    topCustomerPercentage: Math.round(topCustomerPercentage),
  };
};

// ========================
// WORKING CAPITAL ANALYSIS
// ========================

/**
 * Analyze working capital trends to detect potential issues
 * 
 * Detection:
 * - Unusual AR aging (customers not paying)
 * - Inventory build-up (slow-moving stock)
 * - AP manipulation (delaying vendor payments)
 */
export const analyzeWorkingCapital = (
  ledgerEntries: LedgerEntry[],
  bankTransactions: BankTransaction[]
): { 
  cashFlowHealth: 'good' | 'moderate' | 'poor';
  avgDaysToDeposit: number;
  paymentDelayRisk: boolean;
} => {
  // Simplified working capital analysis based on cash flow patterns
  const revenues = ledgerEntries.filter(e => e.type === 'revenue').sort((a, b) => a.date.localeCompare(b.date));
  const deposits = bankTransactions.filter(t => t.type === 'deposit').sort((a, b) => a.date.localeCompare(b.date));

  // Calculate average time between booking revenue and receiving deposit
  let totalDaysDelay = 0;
  let matchCount = 0;

  revenues.forEach(rev => {
    // Find the next deposit after this revenue entry
    const nextDeposit = deposits.find(d => d.date >= rev.date && Math.abs(d.amount - rev.amount) < rev.amount * 0.1);
    if (nextDeposit) {
      const revDate = new Date(rev.date);
      const depDate = new Date(nextDeposit.date);
      const daysDiff = Math.round((depDate.getTime() - revDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 0 && daysDiff <= 90) {
        totalDaysDelay += daysDiff;
        matchCount++;
      }
    }
  });

  const avgDaysToDeposit = matchCount > 0 ? Math.round(totalDaysDelay / matchCount) : 30;
  
  // Determine cash flow health
  let cashFlowHealth: 'good' | 'moderate' | 'poor' = 'good';
  if (avgDaysToDeposit > 45) cashFlowHealth = 'poor';
  else if (avgDaysToDeposit > 30) cashFlowHealth = 'moderate';

  // Check for payment delay risk (expenses growing faster than deposits)
  const expenses = ledgerEntries.filter(e => e.type === 'expense');
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
  const paymentDelayRisk = totalExpenses > totalDeposits * 0.9;

  return {
    cashFlowHealth,
    avgDaysToDeposit,
    paymentDelayRisk,
  };
};

// ========================
// EBITDA BRIDGE CALCULATION
// ========================

/**
 * Compute adjusted EBITDA by adding back personal expenses and other adjustments.
 * 
 * EBITDA Bridge:
 * Reported Net Income
 * + Personal Expense Add-backs (owner perks run through business)
 * + Other Adjustments (one-time expenses, non-recurring items)
 * = True Adjusted EBITDA
 * 
 * This gives buyers a clearer picture of actual business profitability.
 */
export const computeAdjustedEBITDA = (
  reportedNetIncome: number,
  personalExpenses: PersonalExpense[],
  otherAdjustments: number = 0
): EBITDABridge => {
  // Sum all personal expenses for add-back
  const personalExpenseAddBack = personalExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    reportedNetIncome,
    personalExpenseAddBack,
    otherAdjustments,
    trueAdjustedEBITDA: reportedNetIncome + personalExpenseAddBack + otherAdjustments,
  };
};

// ========================
// RISK SCORING ENGINE
// ========================

/**
 * Generate overall risk score (0-100) based on multiple factors.
 * 
 * Scoring Weights:
 * - Revenue discrepancy: Up to 40 points
 * - Personal expenses: Up to 30 points
 * - Customer churn: Up to 30 points
 * 
 * Score Interpretation:
 * - 0-39: Low risk - Minor or no issues found
 * - 40-69: Medium risk - Some concerns warrant attention
 * - 70-100: High risk - Significant red flags detected
 */
export const generateRiskScore = (report: Partial<QoEReport>): number => {
  let score = 0;
  let factors: string[] = [];

  // Revenue discrepancy contributes up to 40 points
  if (report.revenueAnalysis?.discrepancyFound && report.revenueAnalysis.monthlyData) {
    const maxDiscrepancy = Math.max(
      ...report.revenueAnalysis.monthlyData
        .filter(m => m.flagged)
        .map(m => Math.abs(m.discrepancyPercentage))
    );
    
    // Scale: 10% discrepancy = 5 points, 50% = 25 points, 100%+ = 40 points
    const revenueScore = Math.min(40, maxDiscrepancy * 0.4);
    score += revenueScore;
    
    if (revenueScore > 20) {
      factors.push(`Significant revenue inflation detected (${maxDiscrepancy.toFixed(0)}%)`);
    }
  }

  // Personal expenses contribute up to 30 points
  if (report.personalExpenses && report.personalExpenses.length > 0) {
    const totalPersonal = report.personalExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const highSeverityCount = report.personalExpenses.filter(e => e.severity === 'high').length;
    
    // Base: $10k = 15 points, $50k = 30 points
    let personalScore = Math.min(20, (totalPersonal / 50000) * 20);
    // Bonus for high severity items
    personalScore += Math.min(10, highSeverityCount * 2.5);
    
    score += personalScore;
    
    if (totalPersonal > 10000) {
      factors.push(`$${(totalPersonal / 1000).toFixed(0)}k in likely personal expenses`);
    }
  }

  // Customer churn contributes up to 30 points
  if (report.customerChurn?.churnRisk && report.customerChurn.atRiskCustomers) {
    const atRiskCount = report.customerChurn.atRiskCustomers.length;
    // Each at-risk customer = 10 points, max 30
    const churnScore = Math.min(30, atRiskCount * 10);
    score += churnScore;
    
    if (atRiskCount > 0) {
      factors.push(`${atRiskCount} major customer${atRiskCount > 1 ? 's' : ''} at risk`);
    }
  }

  return Math.min(100, Math.round(score));
};

/**
 * Get risk level from score
 */
export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

// ========================
// HELPER FUNCTIONS
// ========================

/**
 * Format month string (YYYY-MM) to readable format (Jan 2024)
 */
const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = parseInt(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return monthStr;
  return `${monthNames[monthIndex]} ${year}`;
};

/**
 * Validate date string format (YYYY-MM-DD)
 */
function isValidDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}(-\d{2})?$/;
  return regex.test(dateStr);
}

/**
 * Simple hash function for generating IDs
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get risk color based on level
 */
export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'high': return 'risk-high';
    case 'medium': return 'risk-medium';
    case 'low': return 'risk-low';
  }
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

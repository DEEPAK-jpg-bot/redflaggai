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
 * 
 * Red Flags Detected:
 * - Revenue inflation: Booking revenue that doesn't correspond to cash
 * - Fictitious sales: Recording sales that never happened
 * - Timing manipulation: Recording revenue in wrong periods
 */
export const analyzeRevenueDiscrepancy = (
  ledgerEntries: LedgerEntry[],
  bankTransactions: BankTransaction[],
  thresholdPercent: number = 10
): { monthlyData: MonthlyRevenue[]; discrepancyFound: boolean; flaggedMonths: string[] } => {
  // Group revenue by month with validation
  const revenueByMonth: Record<string, number> = {};
  const depositsByMonth: Record<string, number> = {};

  // Process ledger entries - only positive revenue amounts
  ledgerEntries
    .filter(e => e.type === 'revenue' && e.amount > 0)
    .forEach(entry => {
      if (!isValidDate(entry.date)) return;
      const month = entry.date.substring(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + entry.amount;
    });

  // Process bank transactions - only positive deposits
  bankTransactions
    .filter(t => t.type === 'deposit' && t.amount > 0)
    .forEach(transaction => {
      if (!isValidDate(transaction.date)) return;
      const month = transaction.date.substring(0, 7);
      depositsByMonth[month] = (depositsByMonth[month] || 0) + transaction.amount;
    });

  // Get all months, sorted chronologically
  const months = [...new Set([...Object.keys(revenueByMonth), ...Object.keys(depositsByMonth)])].sort();
  const flaggedMonths: string[] = [];

  const monthlyData: MonthlyRevenue[] = months.map(month => {
    const bookedRevenue = Math.round(revenueByMonth[month] || 0);
    const actualDeposits = Math.round(depositsByMonth[month] || 0);
    const discrepancy = bookedRevenue - actualDeposits;
    
    // Calculate percentage - avoid division by zero
    const discrepancyPercentage = actualDeposits > 0 
      ? (discrepancy / actualDeposits) * 100 
      : (bookedRevenue > 0 ? 100 : 0);
    
    // Flag if discrepancy exceeds threshold (positive discrepancy = revenue > deposits)
    const flagged = discrepancyPercentage > thresholdPercent;
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

  return {
    monthlyData,
    discrepancyFound: flaggedMonths.length > 0,
    flaggedMonths,
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
 * 
 * Severity Levels:
 * - High: > $3,000 or multiple red flags
 * - Medium: $1,000 - $3,000
 * - Low: < $1,000
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

      if (matchedKeywords.length > 0 || categoryMismatch || luxuryVendor) {
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

          // Calculate severity based on multiple factors
          const severity = calculateExpenseSeverity(entry.amount, matchedKeywords.length, categoryMismatch);

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

  // Sort by amount (highest first) then by severity
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
    'office supplies': ['vacation', 'resort', 'disney', 'spa', 'golf', 'cruise'],
    'training & education': ['tuition', 'private school', 'daycare'],
    'team building': ['family', 'vacation', 'resort'],
    'employee wellness': ['spa', 'resort', 'golf'],
    'vehicle expenses': ['porsche', 'ferrari', 'lamborghini', 'tesla', 'bmw', 'mercedes'],
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
    /tiffany/i,
    /cartier/i,
    /hermes/i,
    /rolex/i,
  ];

  return luxuryPatterns.some(pattern => pattern.test(description));
}

/**
 * Calculate expense severity based on multiple factors
 */
function calculateExpenseSeverity(
  amount: number, 
  keywordMatches: number, 
  hasCategoryMismatch: boolean
): 'high' | 'medium' | 'low' {
  let score = 0;
  
  // Amount-based scoring
  if (amount > 10000) score += 3;
  else if (amount > 5000) score += 2;
  else if (amount > 3000) score += 1.5;
  else if (amount > 1000) score += 1;
  
  // Keyword match bonus
  score += keywordMatches * 0.5;
  
  // Category mismatch is a strong indicator
  if (hasCategoryMismatch) score += 1;
  
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
} => {
  const atRiskCustomers: string[] = [];
  const churnDetails: Array<{ name: string; percentChange: number; trend: string }> = [];

  customers.forEach(customer => {
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

    if (hasSignificantDrop || isFlagged || (hasConsecutiveDeclines && calculatedChange < -30)) {
      atRiskCustomers.push(customer.name);
      churnDetails.push({
        name: customer.name,
        percentChange: Math.round(calculatedChange),
        trend: customer.trend,
      });
    }
  });

  return {
    churnRisk: atRiskCustomers.length > 0,
    atRiskCustomers,
    churnDetails,
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

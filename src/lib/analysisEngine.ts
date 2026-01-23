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
import { PERSONAL_EXPENSE_KEYWORDS } from './mockData';

// Analyze revenue discrepancies between ledger and bank
export const analyzeRevenueDiscrepancy = (
  ledgerEntries: LedgerEntry[],
  bankTransactions: BankTransaction[]
): { monthlyData: MonthlyRevenue[]; discrepancyFound: boolean; flaggedMonths: string[] } => {
  // Group by month
  const revenueByMonth: Record<string, number> = {};
  const depositsByMonth: Record<string, number> = {};

  ledgerEntries
    .filter(e => e.type === 'revenue')
    .forEach(entry => {
      const month = entry.date.substring(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + entry.amount;
    });

  bankTransactions
    .filter(t => t.type === 'deposit')
    .forEach(transaction => {
      const month = transaction.date.substring(0, 7);
      depositsByMonth[month] = (depositsByMonth[month] || 0) + transaction.amount;
    });

  const months = [...new Set([...Object.keys(revenueByMonth), ...Object.keys(depositsByMonth)])].sort();
  const flaggedMonths: string[] = [];

  const monthlyData: MonthlyRevenue[] = months.map(month => {
    const bookedRevenue = Math.round(revenueByMonth[month] || 0);
    const actualDeposits = Math.round(depositsByMonth[month] || 0);
    const discrepancy = bookedRevenue - actualDeposits;
    const discrepancyPercentage = actualDeposits > 0 ? (discrepancy / actualDeposits) * 100 : 0;
    
    // Flag if discrepancy > 10%
    const flagged = discrepancyPercentage > 10;
    if (flagged) {
      flaggedMonths.push(formatMonth(month));
    }

    return {
      month: formatMonth(month),
      bookedRevenue,
      actualDeposits,
      discrepancy,
      discrepancyPercentage,
      flagged,
    };
  });

  return {
    monthlyData,
    discrepancyFound: flaggedMonths.length > 0,
    flaggedMonths,
  };
};

// Detect personal expenses using keyword matching
export const detectPersonalExpenses = (ledgerEntries: LedgerEntry[]): PersonalExpense[] => {
  const personalExpenses: PersonalExpense[] = [];

  ledgerEntries
    .filter(e => e.type === 'expense')
    .forEach(entry => {
      const description = entry.description.toLowerCase();
      const matchedKeywords = PERSONAL_EXPENSE_KEYWORDS.filter(keyword => 
        description.includes(keyword.toLowerCase())
      );

      if (matchedKeywords.length > 0) {
        personalExpenses.push({
          id: `exp_${Math.random().toString(36).substr(2, 9)}`,
          date: entry.date,
          vendor: entry.description,
          amount: entry.amount,
          category: entry.category,
          flagReason: `Keyword: "${matchedKeywords.join('", "')}" - Likely personal expense`,
          severity: entry.amount > 3000 ? 'high' : entry.amount > 1000 ? 'medium' : 'low',
        });
      }
    });

  return personalExpenses.sort((a, b) => b.amount - a.amount);
};

// Calculate customer churn risk
export const calculateCustomerChurn = (customers: CustomerData[]): {
  churnRisk: boolean;
  atRiskCustomers: string[];
} => {
  const atRiskCustomers = customers
    .filter(c => c.flagged || c.percentageChange < -50)
    .map(c => c.name);

  return {
    churnRisk: atRiskCustomers.length > 0,
    atRiskCustomers,
  };
};

// Compute adjusted EBITDA
export const computeAdjustedEBITDA = (
  reportedNetIncome: number,
  personalExpenses: PersonalExpense[],
  otherAdjustments: number = 0
): EBITDABridge => {
  const personalExpenseAddBack = personalExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    reportedNetIncome,
    personalExpenseAddBack,
    otherAdjustments,
    trueAdjustedEBITDA: reportedNetIncome + personalExpenseAddBack + otherAdjustments,
  };
};

// Generate overall risk score (0-100)
export const generateRiskScore = (report: Partial<QoEReport>): number => {
  let score = 0;

  // Revenue discrepancy contributes up to 40 points
  if (report.revenueAnalysis?.discrepancyFound) {
    const maxDiscrepancy = Math.max(...report.revenueAnalysis.monthlyData.map(m => m.discrepancyPercentage));
    score += Math.min(40, maxDiscrepancy * 0.8);
  }

  // Personal expenses contribute up to 30 points
  if (report.personalExpenses && report.personalExpenses.length > 0) {
    const totalPersonal = report.personalExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    score += Math.min(30, (totalPersonal / 1000) * 1.5);
  }

  // Customer churn contributes up to 30 points
  if (report.customerChurn?.churnRisk) {
    score += report.customerChurn.atRiskCustomers.length * 15;
  }

  return Math.min(100, Math.round(score));
};

// Get risk level from score
export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

// Format month string
const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

// Get risk color based on level
export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'high': return 'risk-high';
    case 'medium': return 'risk-medium';
    case 'low': return 'risk-low';
  }
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

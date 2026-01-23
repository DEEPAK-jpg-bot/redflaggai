import { Scan, LedgerEntry, BankTransaction, CustomerData, PersonalExpense, QoEReport, MonthlyRevenue } from '@/types';

// Demo company data with intentional fraud signals
export const DEMO_COMPANY = {
  name: 'Acme Distribution LLC',
  industry: 'Wholesale Distribution',
  askingPrice: 2500000,
};

// Generate monthly revenue data with $100k discrepancy in December
export const generateMonthlyRevenue = (): MonthlyRevenue[] => {
  const months = ['Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'];
  
  return months.map((month, index) => {
    const baseRevenue = 75000 + Math.random() * 20000;
    const bookedRevenue = Math.round(baseRevenue);
    
    // December has a $100k inflation
    const inflationAmount = month === 'Dec 2024' ? 100000 : 0;
    const actualDeposits = Math.round(bookedRevenue - inflationAmount + (Math.random() * 5000 - 2500));
    
    const discrepancy = bookedRevenue - actualDeposits;
    const discrepancyPercentage = (discrepancy / actualDeposits) * 100;
    
    return {
      month,
      bookedRevenue: bookedRevenue + inflationAmount,
      actualDeposits,
      discrepancy: discrepancy + inflationAmount,
      discrepancyPercentage: month === 'Dec 2024' ? 125 : discrepancyPercentage,
      flagged: month === 'Dec 2024',
    };
  });
};

// Customer data with one major churn signal
export const generateCustomerData = (): CustomerData[] => {
  return [
    {
      name: 'Big Box Retail Co',
      month1Spend: 45000,
      month2Spend: 42000,
      month3Spend: 18000, // 60% drop - flagged
      trend: 'down',
      percentageChange: -60,
      flagged: true,
    },
    {
      name: 'Metro Supplies Inc',
      month1Spend: 32000,
      month2Spend: 35000,
      month3Spend: 38000,
      trend: 'up',
      percentageChange: 19,
      flagged: false,
    },
    {
      name: 'Regional Hardware',
      month1Spend: 28000,
      month2Spend: 27500,
      month3Spend: 29000,
      trend: 'stable',
      percentageChange: 4,
      flagged: false,
    },
    {
      name: 'Central Distributors',
      month1Spend: 22000,
      month2Spend: 21000,
      month3Spend: 20500,
      trend: 'down',
      percentageChange: -7,
      flagged: false,
    },
    {
      name: 'Quick Ship Logistics',
      month1Spend: 18000,
      month2Spend: 19500,
      month3Spend: 21000,
      trend: 'up',
      percentageChange: 17,
      flagged: false,
    },
  ];
};

// Personal expenses with injected fraud
export const generatePersonalExpenses = (): PersonalExpense[] => {
  return [
    {
      id: 'exp_001',
      date: '2024-11-15',
      vendor: 'Walt Disney World',
      amount: 5000,
      category: 'Office Supplies',
      flagReason: 'Keyword: "Disney" - Likely personal vacation expense',
      severity: 'high',
    },
    {
      id: 'exp_002',
      date: '2024-10-22',
      vendor: 'Porsche Leasing',
      amount: 2000,
      category: 'Vehicle Expenses',
      flagReason: 'Keyword: "Porsche" - Luxury vehicle, likely personal',
      severity: 'high',
    },
    {
      id: 'exp_003',
      date: '2024-09-10',
      vendor: 'Ritz Carlton Spa',
      amount: 850,
      category: 'Employee Wellness',
      flagReason: 'Keyword: "Spa" - Personal wellness expense',
      severity: 'medium',
    },
    {
      id: 'exp_004',
      date: '2024-08-05',
      vendor: 'Private School Tuition - St. Andrews',
      amount: 12500,
      category: 'Training & Education',
      flagReason: 'Keyword: "Tuition" - Family education expense',
      severity: 'high',
    },
    {
      id: 'exp_005',
      date: '2024-07-18',
      vendor: 'Family Vacation Resort',
      amount: 3200,
      category: 'Team Building',
      flagReason: 'Keyword: "Family", "Resort" - Personal vacation',
      severity: 'high',
    },
  ];
};

// Ledger entries (simplified)
export const generateLedgerEntries = (): LedgerEntry[] => {
  const entries: LedgerEntry[] = [];
  const months = ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
  
  months.forEach(month => {
    // Revenue entries
    entries.push({
      date: `${month}-15`,
      description: 'Product Sales',
      category: 'Revenue',
      amount: 60000 + Math.random() * 20000,
      type: 'revenue',
    });
    
    entries.push({
      date: `${month}-28`,
      description: 'Service Revenue',
      category: 'Revenue',
      amount: 15000 + Math.random() * 10000,
      type: 'revenue',
    });
  });
  
  // Add the personal expenses as expense entries
  entries.push(
    { date: '2024-11-15', description: 'Walt Disney World', category: 'Office Supplies', amount: 5000, type: 'expense' },
    { date: '2024-10-22', description: 'Porsche Leasing', category: 'Vehicle Expenses', amount: 2000, type: 'expense' },
    { date: '2024-09-10', description: 'Ritz Carlton Spa', category: 'Employee Wellness', amount: 850, type: 'expense' },
    { date: '2024-08-05', description: 'Private School Tuition - St. Andrews', category: 'Training & Education', amount: 12500, type: 'expense' },
    { date: '2024-07-18', description: 'Family Vacation Resort', category: 'Team Building', amount: 3200, type: 'expense' }
  );
  
  return entries;
};

// Bank transactions
export const generateBankTransactions = (): BankTransaction[] => {
  const transactions: BankTransaction[] = [];
  const months = ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
  
  months.forEach((month, index) => {
    // Deposits (slightly less than ledger revenue, except December which is $100k less)
    const baseDeposit = 70000 + Math.random() * 15000;
    const deposit = month === '2024-12' ? baseDeposit - 100000 : baseDeposit;
    
    transactions.push({
      date: `${month}-20`,
      description: 'Customer Payments',
      amount: deposit,
      type: 'deposit',
    });
  });
  
  return transactions;
};

// Generate a complete QoE Report
export const generateDemoReport = (scanId: string): QoEReport => {
  const monthlyData = generateMonthlyRevenue();
  const personalExpenses = generatePersonalExpenses();
  const totalPersonalExpenses = personalExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const totalDiscrepancy = monthlyData.reduce((sum, m) => sum + m.discrepancy, 0);
  
  return {
    scanId,
    companyName: DEMO_COMPANY.name,
    riskScore: 65,
    riskLevel: 'medium',
    revenueAnalysis: {
      monthlyData,
      discrepancyFound: true,
      discrepancyAmount: totalDiscrepancy,
      discrepancyPercentage: 12.5,
      flaggedMonths: ['Dec 2024'],
    },
    customerChurn: {
      customers: generateCustomerData(),
      churnRisk: true,
      atRiskCustomers: ['Big Box Retail Co'],
    },
    personalExpenses,
    ebitdaBridge: {
      reportedNetIncome: 185000,
      personalExpenseAddBack: totalPersonalExpenses,
      otherAdjustments: 15000,
      trueAdjustedEBITDA: 185000 + totalPersonalExpenses + 15000,
    },
    generatedAt: new Date(),
  };
};

// Mock existing scans for history
export const MOCK_SCANS: Scan[] = [
  {
    id: 'scan_demo',
    companyName: 'Acme Distribution LLC',
    industry: 'Wholesale Distribution',
    askingPrice: 2500000,
    status: 'completed',
    riskScore: 65,
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    completedAt: new Date(Date.now() - 86400000 * 2 + 600000), // 10 minutes after creation
  },
  {
    id: 'scan_002',
    companyName: 'TechServe Solutions',
    industry: 'IT Services',
    askingPrice: 1800000,
    status: 'completed',
    riskScore: 32,
    createdAt: new Date(Date.now() - 86400000 * 5),
    completedAt: new Date(Date.now() - 86400000 * 5 + 600000),
  },
  {
    id: 'scan_003',
    companyName: 'Green Valley HVAC',
    industry: 'Home Services',
    askingPrice: 950000,
    status: 'completed',
    riskScore: 78,
    createdAt: new Date(Date.now() - 86400000 * 7),
    completedAt: new Date(Date.now() - 86400000 * 7 + 600000),
  },
];

// Personal expense keywords for detection
export const PERSONAL_EXPENSE_KEYWORDS = [
  'resort',
  'ferrari',
  'tuition',
  'disney',
  'family',
  'spa',
  'porsche',
  'vacation',
  'lamborghini',
  'country club',
  'yacht',
  'jewelry',
  'rolex',
  'louis vuitton',
  'private school',
];

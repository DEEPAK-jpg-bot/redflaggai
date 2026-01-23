// Core Types for RedFlag.ai

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
}

export interface Scan {
  id: string;
  companyName: string;
  industry: string;
  askingPrice: number;
  status: 'processing' | 'completed' | 'failed';
  riskScore?: number;
  createdAt: Date;
  completedAt?: Date;
  report?: QoEReport;
}

export interface QoEReport {
  scanId: string;
  companyName: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  revenueAnalysis: RevenueAnalysis;
  customerChurn: CustomerChurnAnalysis;
  personalExpenses: PersonalExpense[];
  ebitdaBridge: EBITDABridge;
  generatedAt: Date;
}

export interface RevenueAnalysis {
  monthlyData: MonthlyRevenue[];
  discrepancyFound: boolean;
  discrepancyAmount: number;
  discrepancyPercentage: number;
  flaggedMonths: string[];
}

export interface MonthlyRevenue {
  month: string;
  bookedRevenue: number;
  actualDeposits: number;
  discrepancy: number;
  discrepancyPercentage: number;
  flagged: boolean;
}

export interface CustomerChurnAnalysis {
  customers: CustomerData[];
  churnRisk: boolean;
  atRiskCustomers: string[];
}

export interface CustomerData {
  name: string;
  month1Spend: number;
  month2Spend: number;
  month3Spend: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
  flagged: boolean;
}

export interface PersonalExpense {
  id: string;
  date: string;
  vendor: string;
  amount: number;
  category: string;
  flagReason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface EBITDABridge {
  reportedNetIncome: number;
  personalExpenseAddBack: number;
  otherAdjustments: number;
  trueAdjustedEBITDA: number;
}

export interface LedgerEntry {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'revenue' | 'expense';
}

export interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ProcessingStep {
  id: string;
  message: string;
  status: 'pending' | 'processing' | 'completed';
  timestamp?: Date;
}

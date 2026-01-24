// Core Types for RedFlag.ai

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_started_at: string | null;
  subscription_ends_at: string | null;
  scans_used_this_month: number;
  monthly_scan_limit: number;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionPlan = 'free' | 'hunter' | 'firm';

export interface SubscriptionInfo {
  subscribed: boolean;
  plan: SubscriptionPlan;
  scansPerMonth: number;
  subscriptionEnd: string | null;
  productId: string | null;
}

export interface Scan {
  id: string;
  companyName: string;
  industry: string;
  askingPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  riskScore?: number;
  riskLevel?: RiskLevel;
  createdAt: Date;
  completedAt?: Date;
  report?: QoEReport;
}

export interface DbScan {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  asking_price: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  risk_score: number | null;
  risk_level: RiskLevel | null;
  revenue_analysis: RevenueAnalysis | null;
  personal_expenses: PersonalExpense[] | null;
  customer_churn: CustomerChurnAnalysis | null;
  ebitda_bridge: EBITDABridge | null;
  ledger_data: LedgerEntry[] | null;
  bank_data: BankTransaction[] | null;
  created_at: string;
  completed_at: string | null;
}

export interface QoEReport {
  scanId: string;
  companyName: string;
  riskScore: number;
  riskLevel: RiskLevel;
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

// Stripe pricing
export const STRIPE_PRICES = {
  hunter: {
    priceId: "price_1SsyZSGVnyAmg0cgJZb1dqcX",
    productId: "prod_TqfvkBS9gynTsl",
    name: "Hunter",
    price: 495,
    scansPerMonth: 1,
  },
  firm: {
    priceId: "price_1SsyZZGVnyAmg0cgIqqeKM6J",
    productId: "prod_TqfvqmpRhH6Tkr",
    name: "Firm",
    price: 2495,
    scansPerMonth: 10,
  },
} as const;

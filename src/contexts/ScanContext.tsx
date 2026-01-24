import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Scan, QoEReport, LedgerEntry, BankTransaction, RevenueAnalysis, CustomerChurnAnalysis, PersonalExpense, EBITDABridge, RiskLevel } from '@/types';
import { generateDemoReport, generateCustomerData } from '@/lib/mockData';
import { analyzeRevenueDiscrepancy, detectPersonalExpenses, calculateCustomerChurn, computeAdjustedEBITDA, generateRiskScore, getRiskLevel } from '@/lib/analysisEngine';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Json } from '@/integrations/supabase/types';

interface ScanContextType {
  scans: Scan[];
  isLoading: boolean;
  createScan: (companyName: string, industry: string, askingPrice: number, ledgerData?: LedgerEntry[], bankData?: BankTransaction[]) => Promise<Scan>;
  completeScan: (scanId: string, ledgerData: LedgerEntry[], bankData: BankTransaction[]) => Promise<void>;
  getScan: (scanId: string) => Scan | undefined;
  getReport: (scanId: string) => Promise<QoEReport | null>;
  refreshScans: () => Promise<void>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};

interface ScanProviderProps {
  children: ReactNode;
}

interface DbScanRow {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  asking_price: number;
  status: string;
  risk_score: number | null;
  risk_level: string | null;
  revenue_analysis: Json | null;
  personal_expenses: Json | null;
  customer_churn: Json | null;
  ebitda_bridge: Json | null;
  ledger_data: Json | null;
  bank_data: Json | null;
  created_at: string;
  completed_at: string | null;
}

const convertDbScanToScan = (dbScan: DbScanRow): Scan => ({
  id: dbScan.id,
  companyName: dbScan.company_name,
  industry: dbScan.industry,
  askingPrice: Number(dbScan.asking_price),
  status: dbScan.status as Scan['status'],
  riskScore: dbScan.risk_score ?? undefined,
  riskLevel: (dbScan.risk_level as RiskLevel) ?? undefined,
  createdAt: new Date(dbScan.created_at),
  completedAt: dbScan.completed_at ? new Date(dbScan.completed_at) : undefined,
});

export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const refreshScans = async () => {
    if (!user) {
      setScans([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scans:', error);
      setIsLoading(false);
      return;
    }

    const convertedScans = (data as DbScanRow[]).map(convertDbScanToScan);
    setScans(convertedScans);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshScans();
    } else {
      setScans([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const createScan = async (
    companyName: string, 
    industry: string, 
    askingPrice: number,
    ledgerData?: LedgerEntry[],
    bankData?: BankTransaction[]
  ): Promise<Scan> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scans')
      .insert({
        user_id: user.id,
        company_name: companyName,
        industry,
        asking_price: askingPrice,
        status: 'processing',
        ledger_data: ledgerData ? JSON.parse(JSON.stringify(ledgerData)) : null,
        bank_data: bankData ? JSON.parse(JSON.stringify(bankData)) : null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const newScan = convertDbScanToScan(data as DbScanRow);
    setScans(prev => [newScan, ...prev]);
    
    return newScan;
  };

  const completeScan = async (scanId: string, ledgerData: LedgerEntry[], bankData: BankTransaction[]) => {
    if (!user) throw new Error('User not authenticated');

    // Run the analysis
    const revenueAnalysis = analyzeRevenueDiscrepancy(ledgerData, bankData);
    const personalExpenses = detectPersonalExpenses(ledgerData);
    
    // Generate customer data
    const customers = generateCustomerData();
    const churnAnalysis = calculateCustomerChurn(customers);
    
    // Calculate EBITDA
    const reportedNetIncome = 185000;
    const ebitdaBridge = computeAdjustedEBITDA(reportedNetIncome, personalExpenses, 15000);
    
    // Generate risk score
    const partialReport = {
      revenueAnalysis: {
        ...revenueAnalysis,
        discrepancyAmount: revenueAnalysis.monthlyData.reduce((sum, m) => sum + m.discrepancy, 0),
        discrepancyPercentage: Math.max(...revenueAnalysis.monthlyData.map(m => m.discrepancyPercentage)),
      },
      personalExpenses,
      customerChurn: {
        customers,
        ...churnAnalysis,
      },
    };
    
    const riskScore = generateRiskScore(partialReport);
    const riskLevel = getRiskLevel(riskScore);

    // Update the scan in database - convert to JSON-compatible format
    const { error } = await supabase
      .from('scans')
      .update({
        status: 'completed',
        risk_score: riskScore,
        risk_level: riskLevel,
        revenue_analysis: JSON.parse(JSON.stringify(partialReport.revenueAnalysis)),
        personal_expenses: JSON.parse(JSON.stringify(personalExpenses)),
        customer_churn: JSON.parse(JSON.stringify(partialReport.customerChurn)),
        ebitda_bridge: JSON.parse(JSON.stringify(ebitdaBridge)),
        ledger_data: JSON.parse(JSON.stringify(ledgerData)),
        bank_data: JSON.parse(JSON.stringify(bankData)),
        completed_at: new Date().toISOString(),
      })
      .eq('id', scanId);

    if (error) throw new Error(error.message);

    // Update local state
    setScans(prev => prev.map(scan => 
      scan.id === scanId 
        ? { 
            ...scan, 
            status: 'completed' as const, 
            riskScore,
            riskLevel,
            completedAt: new Date(),
          }
        : scan
    ));
  };

  const getScan = (scanId: string): Scan | undefined => {
    return scans.find(s => s.id === scanId);
  };

  const getReport = async (scanId: string): Promise<QoEReport | null> => {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .maybeSingle();

    if (error || !data) return null;

    const dbScan = data as DbScanRow;
    
    if (dbScan.status !== 'completed' || !dbScan.revenue_analysis) {
      // Return demo report for demo scans
      return generateDemoReport(scanId);
    }

    return {
      scanId: dbScan.id,
      companyName: dbScan.company_name,
      riskScore: dbScan.risk_score || 0,
      riskLevel: (dbScan.risk_level as RiskLevel) || 'low',
      revenueAnalysis: dbScan.revenue_analysis as unknown as RevenueAnalysis,
      customerChurn: (dbScan.customer_churn as unknown as CustomerChurnAnalysis) || { customers: [], churnRisk: false, atRiskCustomers: [] },
      personalExpenses: (dbScan.personal_expenses as unknown as PersonalExpense[]) || [],
      ebitdaBridge: (dbScan.ebitda_bridge as unknown as EBITDABridge) || { reportedNetIncome: 0, personalExpenseAddBack: 0, otherAdjustments: 0, trueAdjustedEBITDA: 0 },
      generatedAt: new Date(dbScan.completed_at || dbScan.created_at),
    };
  };

  return (
    <ScanContext.Provider value={{
      scans,
      isLoading,
      createScan,
      completeScan,
      getScan,
      getReport,
      refreshScans,
    }}>
      {children}
    </ScanContext.Provider>
  );
};

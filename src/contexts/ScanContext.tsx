import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Scan, QoEReport } from '@/types';
import { MOCK_SCANS, generateDemoReport } from '@/lib/mockData';

interface ScanContextType {
  scans: Scan[];
  currentScan: Scan | null;
  currentReport: QoEReport | null;
  createScan: (companyName: string, industry: string, askingPrice: number) => Scan;
  completeScan: (scanId: string) => void;
  getScan: (scanId: string) => Scan | undefined;
  getReport: (scanId: string) => QoEReport | null;
  setCurrentScan: (scan: Scan | null) => void;
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

export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
  const [scans, setScans] = useState<Scan[]>(MOCK_SCANS);
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);
  const [currentReport, setCurrentReport] = useState<QoEReport | null>(null);
  const [reports] = useState<Map<string, QoEReport>>(new Map([
    ['scan_demo', generateDemoReport('scan_demo')],
  ]));

  const createScan = (companyName: string, industry: string, askingPrice: number): Scan => {
    const newScan: Scan = {
      id: 'scan_' + Math.random().toString(36).substr(2, 9),
      companyName,
      industry,
      askingPrice,
      status: 'processing',
      createdAt: new Date(),
    };
    
    setScans(prev => [newScan, ...prev]);
    setCurrentScan(newScan);
    
    return newScan;
  };

  const completeScan = (scanId: string) => {
    const report = generateDemoReport(scanId);
    reports.set(scanId, report);
    
    setScans(prev => prev.map(scan => 
      scan.id === scanId 
        ? { 
            ...scan, 
            status: 'completed' as const, 
            riskScore: report.riskScore,
            completedAt: new Date(),
            report,
          }
        : scan
    ));
    
    setCurrentReport(report);
  };

  const getScan = (scanId: string): Scan | undefined => {
    return scans.find(s => s.id === scanId);
  };

  const getReport = (scanId: string): QoEReport | null => {
    // First check if it's in our reports map
    if (reports.has(scanId)) {
      return reports.get(scanId)!;
    }
    
    // Generate demo report for any scan
    const scan = scans.find(s => s.id === scanId);
    if (scan && scan.status === 'completed') {
      const report = generateDemoReport(scanId);
      report.companyName = scan.companyName;
      reports.set(scanId, report);
      return report;
    }
    
    return null;
  };

  return (
    <ScanContext.Provider value={{
      scans,
      currentScan,
      currentReport,
      createScan,
      completeScan,
      getScan,
      getReport,
      setCurrentScan,
    }}>
      {children}
    </ScanContext.Provider>
  );
};

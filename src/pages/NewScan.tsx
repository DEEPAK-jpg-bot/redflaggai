import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Sparkles, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useScan } from '@/contexts/ScanContext';
import { DEMO_COMPANY, generateLedgerEntries, generateBankTransactions } from '@/lib/mockData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import LiveAnalysisFeed from '@/components/LiveAnalysisFeed';
import { AnalysisLog, forensicDragnet } from '@/lib/forensicEngine';
import Papa from 'papaparse';
import { LedgerEntry, BankTransaction } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const INDUSTRIES = ['Wholesale Distribution', 'IT Services', 'Home Services', 'Manufacturing', 'Retail', 'Healthcare', 'SaaS', 'Professional Services'];

const PROCESSING_STEPS = [
  'Parsing Ledgers...',
  'Cross-referencing Bank Deposits...',
  'Scanning for Personal Expenses...',
  'Analyzing Customer Concentration...',
  'Calculating EBITDA...',
  'Generating Risk Score...',
  'Compiling Report...',
];

const NewScan: React.FC = () => {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [scanId, setScanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [analysisLogs, setAnalysisLogs] = useState<AnalysisLog[]>([]);
  const [ledgerFile, setLedgerFile] = useState<File | null>(null);
  const [bankFile, setBankFile] = useState<File | null>(null);

  const { createScan, completeScan, scanLimitInfo, checkScanLimit } = useScan();
  const navigate = useNavigate();

  // Check scan limit on mount
  useEffect(() => {
    checkScanLimit().catch(console.error);
  }, []);

  const handleUseDemoData = () => {
    setCompanyName(DEMO_COMPANY.name);
    setIndustry(DEMO_COMPANY.industry);
    setAskingPrice(DEMO_COMPANY.askingPrice.toString());
  };

  const handleStartProcessing = async () => {
    setLimitError(null);
    setIsProcessing(true);

    try {
      // Check scan limit before proceeding
      const limitInfo = await checkScanLimit();
      if (!limitInfo.canCreate) {
        setLimitError(limitInfo.message);
        setIsProcessing(false);
        toast.error('Scan limit reached', { description: limitInfo.message });
        return;
      }

      // 1. Parsing Phase
      let parsedLedger: LedgerEntry[] = [];

      // Use demo data if no file, otherwise parse real file
      if (!ledgerFile) {
        parsedLedger = generateLedgerEntries();
        // Simulate "Dragnet" on demo data
        parsedLedger.forEach((entry, i) => {
          const { isSuspicious, log } = forensicDragnet(entry, i);
          if (log) setAnalysisLogs(prev => [...prev, log]);
        });
      } else {
        // Real CSV Parsing
        await new Promise<void>((resolve, reject) => {
          Papa.parse(ledgerFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              // Map CSV columns to LedgerEntry type (Basic mapping)
              parsedLedger = results.data.map((row: any) => ({
                date: row.Date || row.date || new Date().toISOString(),
                description: row.Description || row.description || 'Unknown',
                category: row.Category || row.category || 'Uncategorized',
                amount: parseFloat(row.Amount || row.amount || '0'),
                type: (parseFloat(row.Amount || row.amount || '0') < 0) ? 'expense' : 'revenue'
              }));

              // SECURITY: Prevent DoS and High AI Costs
              if (parsedLedger.length > 5000) {
                reject(new Error("Massive file support (5,000+ rows) is coming soon for Enterprise users. Please use a smaller file for now."));
                return;
              }

              resolve();
            },
            error: (err) => reject(err)
          });
        });
      }

      const bankData = generateBankTransactions(); // Keep bank mock for now if file missing

      // 2. Intelligent Batch Analysis (AI Loop)
      const BATCH_SIZE = 50;
      const totalBatches = Math.ceil(parsedLedger.length / BATCH_SIZE);
      let contextSummary = "";

      for (let i = 0; i < totalBatches; i++) {
        const batch = parsedLedger.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
        setProcessingStep(i + 1);

        // Run Local Forensic Dragnet first (Instant)
        batch.forEach((entry, idx) => {
          const { log } = forensicDragnet(entry, (i * BATCH_SIZE) + idx);
          if (log) setAnalysisLogs(prev => [...prev, log]);
        });

        // Call AI Edge Function (Throttled)
        try {
          // Visual feedback
          setAnalysisLogs(prev => [...prev, {
            id: `batch-${i}`,
            message: `🤖 AI Analyzing Batch ${i + 1}/${totalBatches}...`,
            type: 'info',
            timestamp: new Date()
          }]);

          const { data, error } = await supabase.functions.invoke('analyze-batch', {
            body: {
              batchId: i,
              transactions: batch,
              contextSummary
            }
          });

          if (!error && data?.suspicious_items) {
            data.suspicious_items.forEach((item: any) => {
              setAnalysisLogs(prev => [...prev, {
                id: Math.random().toString(),
                message: `🚩 AI FLAGGED: ${item.description} - ${item.reason}`,
                type: 'danger',
                timestamp: new Date()
              }]);
            });
            contextSummary = data.new_context_summary || contextSummary;
          }

        } catch (err) {
          console.error("AI Batch failed (skipping):", err);
        }

        // Artificial delay to respect Rate Limits + UX pacing
        await new Promise(r => setTimeout(r, 2000));
      }

      // 3. Completion
      setAnalysisLogs(prev => [...prev, {
        id: 'done',
        type: 'success',
        message: 'ANALYSIS COMPLETE. REPORT GENERATED.',
        timestamp: new Date()
      }]);

      const scan = await createScan(companyName, industry, Number(askingPrice), parsedLedger, bankData);
      setScanId(scan.id);
      await completeScan(scan.id, parsedLedger, bankData);

      setTimeout(() => navigate(`/scan/${scan.id}/report`), 1500);
    } catch (error) {
      console.error('Error processing scan:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setLimitError(errorMessage);
      toast.error('Scan failed', { description: errorMessage });
      setIsProcessing(false);
      setStep(2);
    }
  };

  const progress = (processingStep / 40) * 100;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Scan</h1>
          <p className="text-muted-foreground">Analyze a company's financials for red flags</p>
        </div>

        {/* Scan limit info */}
        {scanLimitInfo && (
          <Alert variant={scanLimitInfo.canCreate ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {scanLimitInfo.canCreate ? 'Scans Available' : 'Scan Limit Reached'}
            </AlertTitle>
            <AlertDescription>
              {scanLimitInfo.message}
              {!scanLimitInfo.canCreate && (
                <Button variant="link" className="p-0 h-auto ml-2" onClick={() => navigate('/pricing')}>
                  Upgrade Plan
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Limit error */}
        {limitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{limitError}</AlertDescription>
          </Alert>
        )}

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Enter details about the target company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (<SelectItem key={ind} value={ind}>{ind}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Asking Price ($)</Label>
                <Input id="price" type="number" value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} placeholder="2,500,000" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setStep(2)} disabled={!companyName || !industry || !askingPrice}>Continue</Button>
                <Button variant="outline" onClick={handleUseDemoData}><Sparkles className="mr-2 h-4 w-4" />Use Demo Data</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Financial Data</CardTitle>
              <CardDescription>Upload the company's accounting ledger and bank statements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept=".csv"
                className="hidden"
                id="ledger-upload"
                onChange={(e) => e.target.files?.[0] && setLedgerFile(e.target.files[0])}
              />
              <Label htmlFor="ledger-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center">
                  <Upload className={`mx-auto h-10 w-10 ${ledgerFile ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <p className="mt-2 font-medium">{ledgerFile ? ledgerFile.name : "Accounting Ledger (CSV)"}</p>
                  <p className="text-sm text-muted-foreground">{ledgerFile ? "Click to replace" : "Drag & drop or click to upload"}</p>
                </div>
              </Label>
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 font-medium">Bank Statement (CSV)</p>
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleStartProcessing} disabled={isProcessing}>Analyze Files</Button>
                <Button variant="secondary" onClick={handleStartProcessing} disabled={isProcessing}><Sparkles className="mr-2 h-4 w-4" />Use Demo Data</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0">
              <CardTitle>Analyzing {companyName}</CardTitle>
              <CardDescription>
                AI Forensic Engine is scanning transaction patterns...
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <LiveAnalysisFeed
                logs={analysisLogs}
                isScanning={isProcessing}
                progress={progress}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewScan;

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

      setStep(3);
      
      // Generate demo data
      const ledgerData = generateLedgerEntries();
      const bankData = generateBankTransactions();
      
      // Create the scan
      const scan = await createScan(companyName, industry, Number(askingPrice), ledgerData, bankData);
      setScanId(scan.id);
      
      // Simulate processing steps
      let currentStep = 0;
      const interval = setInterval(async () => {
        currentStep++;
        setProcessingStep(currentStep);
        if (currentStep >= PROCESSING_STEPS.length) {
          clearInterval(interval);
          
          // Complete the scan with analysis
          await completeScan(scan.id, ledgerData, bankData);
          
          setTimeout(() => navigate(`/scan/${scan.id}/report`), 500);
        }
      }, 800);
    } catch (error) {
      console.error('Error processing scan:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setLimitError(errorMessage);
      toast.error('Scan failed', { description: errorMessage });
      setIsProcessing(false);
      setStep(2);
    }
  };

  const progress = (processingStep / PROCESSING_STEPS.length) * 100;

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
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 font-medium">Accounting Ledger (CSV)</p>
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Analyzing {companyName}</CardTitle>
              <CardDescription>Please wait while we scan for red flags...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="h-2" />
              <div className="rounded-lg bg-primary p-4 font-mono text-sm text-primary-foreground">
                {PROCESSING_STEPS.slice(0, processingStep + 1).map((msg, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i < processingStep ? <CheckCircle className="h-4 w-4 text-success" /> : <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewScan;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, AlertTriangle, TrendingDown, DollarSign, Loader2, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useScan } from '@/contexts/ScanContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatPercentage } from '@/lib/analysisEngine';
import PricingModal from '@/components/PricingModal';
import BlurredContent from '@/components/BlurredContent';
import { QoEReport } from '@/types';

const Report: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getReport } = useScan();
  const { subscription, isAuthenticated } = useAuth();
  const [showPricing, setShowPricing] = useState(false);
  const [report, setReport] = useState<QoEReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Free users see blurred details but clear KPIs
  const isFreeUser = !subscription.subscribed || subscription.plan === 'free';

  useEffect(() => {
    const loadReport = async () => {
      if (!id) return;
      setIsLoading(true);
      const reportData = await getReport(id);
      setReport(reportData);
      setIsLoading(false);
    };
    loadReport();
  }, [id, getReport]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Report not found</p>
          <Button asChild className="mt-4"><Link to="/dashboard">Back to Dashboard</Link></Button>
        </div>
      </DashboardLayout>
    );
  }

  const riskColorClass = report.riskLevel === 'high' ? 'bg-risk-high' : report.riskLevel === 'medium' ? 'bg-risk-medium' : 'bg-risk-low';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Free user upgrade banner */}
        {isFreeUser && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Viewing Free Report Preview</p>
                <p className="text-sm text-muted-foreground">Upgrade to see full details and download PDF reports</p>
              </div>
            </div>
            <Button onClick={() => setShowPricing(true)}>Upgrade Now</Button>
          </div>
        )}

        {/* Header - KPIs always visible */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
            <div>
              <h1 className="text-2xl font-bold">{report.companyName}</h1>
              <p className="text-muted-foreground">Quality of Earnings Report</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`${riskColorClass} text-white px-4 py-2 rounded-lg text-center`}>
              <div className="text-2xl font-bold">{report.riskScore}/100</div>
              <div className="text-sm capitalize">{report.riskLevel} Risk</div>
            </div>
            <Button onClick={() => setShowPricing(true)} disabled={isFreeUser}>
              <Download className="mr-2 h-4 w-4" />
              {isFreeUser ? 'Upgrade to Download' : 'Download PDF'}
            </Button>
          </div>
        </div>

        {/* KPI Summary Cards - Always visible */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue Discrepancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(report.revenueAnalysis.monthlyData.reduce((sum, m) => sum + Math.max(0, m.discrepancy), 0))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Personal Expenses Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(report.personalExpenses.reduce((sum, e) => sum + e.amount, 0))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">At-Risk Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {report.customerChurn.atRiskCustomers.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">True Adjusted EBITDA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(report.ebitdaBridge.trueAdjustedEBITDA)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart - Blurred for free users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Revenue vs. Cash Verification</CardTitle>
            <CardDescription>Comparing booked revenue against actual bank deposits</CardDescription>
          </CardHeader>
          <CardContent>
            {report.revenueAnalysis.discrepancyFound && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-destructive font-medium">Revenue inflation detected in {report.revenueAnalysis.flaggedMonths.join(', ')}</span>
              </div>
            )}
            <BlurredContent 
              isBlurred={isFreeUser} 
              overlayMessage="Upgrade to view detailed monthly breakdown"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.revenueAnalysis.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="bookedRevenue" name="Booked Revenue" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="actualDeposits" name="Actual Deposits" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </BlurredContent>
          </CardContent>
        </Card>

        {/* Customer Churn - Blurred for free users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5" />Customer Churn Analysis</CardTitle>
            <CardDescription>Top 5 customers and their spending trends</CardDescription>
          </CardHeader>
          <CardContent>
            <BlurredContent 
              isBlurred={isFreeUser} 
              overlayMessage="Upgrade to view customer details"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Month 1</TableHead>
                    <TableHead>Month 2</TableHead>
                    <TableHead>Month 3</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.customerChurn.customers.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{formatCurrency(c.month1Spend)}</TableCell>
                      <TableCell>{formatCurrency(c.month2Spend)}</TableCell>
                      <TableCell>{formatCurrency(c.month3Spend)}</TableCell>
                      <TableCell className={c.percentageChange < 0 ? 'text-destructive' : 'text-success'}>{formatPercentage(c.percentageChange)}</TableCell>
                      <TableCell>{c.flagged && <Badge className="bg-risk-high text-white">At Risk</Badge>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </BlurredContent>
          </CardContent>
        </Card>

        {/* Personal Expenses - Blurred for free users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Personal Expense Detection</CardTitle>
            <CardDescription>Suspicious transactions flagged for review</CardDescription>
          </CardHeader>
          <CardContent>
            <BlurredContent 
              isBlurred={isFreeUser} 
              overlayMessage="Upgrade to view flagged transactions"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Flag Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.personalExpenses.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell>{exp.date}</TableCell>
                      <TableCell className="font-medium">{exp.vendor}</TableCell>
                      <TableCell>{exp.category}</TableCell>
                      <TableCell className="text-destructive font-medium">{formatCurrency(exp.amount)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{exp.flagReason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </BlurredContent>
          </CardContent>
        </Card>

        {/* EBITDA Bridge - Always visible as KPI */}
        <Card>
          <CardHeader>
            <CardTitle>Adjusted EBITDA Bridge</CardTitle>
            <CardDescription>True earnings after removing personal expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b"><span>Reported Net Income</span><span className="font-medium">{formatCurrency(report.ebitdaBridge.reportedNetIncome)}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-success">+ Personal Expenses Added Back</span><span className="font-medium text-success">{formatCurrency(report.ebitdaBridge.personalExpenseAddBack)}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-success">+ Other Adjustments</span><span className="font-medium text-success">{formatCurrency(report.ebitdaBridge.otherAdjustments)}</span></div>
              <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-3"><span className="font-bold">True Adjusted EBITDA</span><span className="font-bold text-lg">{formatCurrency(report.ebitdaBridge.trueAdjustedEBITDA)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PricingModal open={showPricing} onOpenChange={setShowPricing} />
    </DashboardLayout>
  );
};

export default Report;

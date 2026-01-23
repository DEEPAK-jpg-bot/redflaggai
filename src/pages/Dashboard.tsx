import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useScan } from '@/contexts/ScanContext';
import { formatCurrency } from '@/lib/analysisEngine';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { scans } = useScan();

  const completedScans = scans.filter(s => s.status === 'completed');
  const avgRiskScore = completedScans.length > 0 
    ? Math.round(completedScans.reduce((sum, s) => sum + (s.riskScore || 0), 0) / completedScans.length)
    : 0;
  const totalFlags = completedScans.reduce((sum, s) => sum + (s.riskScore && s.riskScore > 50 ? 1 : 0), 0);

  const getRiskBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 70) return <Badge className="bg-risk-high text-white">High Risk</Badge>;
    if (score >= 40) return <Badge className="bg-risk-medium text-white">Medium</Badge>;
    return <Badge className="bg-risk-low text-white">Low Risk</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your due diligence activity.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/scan/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Scan
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Scans
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{scans.length}</div>
              <p className="text-xs text-muted-foreground">Lifetime analyses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Risk Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgRiskScore}/100</div>
              <p className="text-xs text-muted-foreground">Across all scans</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Red Flags Found
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalFlags}</div>
              <p className="text-xs text-muted-foreground">High-risk companies</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your latest financial analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {scans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground">No scans yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first financial analysis to see results here.
                </p>
                <Button asChild>
                  <Link to="/scan/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Scan
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Asking Price</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.slice(0, 5).map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell className="font-medium">{scan.companyName}</TableCell>
                      <TableCell>{scan.industry}</TableCell>
                      <TableCell>{formatCurrency(scan.askingPrice)}</TableCell>
                      <TableCell>
                        {scan.status === 'completed' ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{scan.riskScore}/100</span>
                            {getRiskBadge(scan.riskScore)}
                          </div>
                        ) : (
                          <Badge variant="secondary">Processing</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {scan.status === 'completed' && (
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/scan/${scan.id}/report`}>View Report</Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

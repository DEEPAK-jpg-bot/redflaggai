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
import { FileText, Eye } from 'lucide-react';
import { useScan } from '@/contexts/ScanContext';
import { formatCurrency } from '@/lib/analysisEngine';

const History: React.FC = () => {
  const { scans } = useScan();

  const getRiskBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 70) return <Badge className="bg-risk-high text-white">High Risk</Badge>;
    if (score >= 40) return <Badge className="bg-risk-medium text-white">Medium</Badge>;
    return <Badge className="bg-risk-low text-white">Low Risk</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-white">Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-destructive text-white">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scan History</h1>
          <p className="text-muted-foreground">View all your past financial analyses</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Scans</CardTitle>
            <CardDescription>Complete list of companies you've analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            {scans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground">No scans yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your scan history will appear here.
                </p>
                <Button asChild>
                  <Link to="/scan/new">Start Your First Scan</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Asking Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell className="font-medium">{scan.companyName}</TableCell>
                      <TableCell>{scan.industry}</TableCell>
                      <TableCell>{formatCurrency(scan.askingPrice)}</TableCell>
                      <TableCell>{getStatusBadge(scan.status)}</TableCell>
                      <TableCell>
                        {scan.riskScore ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{scan.riskScore}/100</span>
                            {getRiskBadge(scan.riskScore)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {scan.status === 'completed' && (
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/scan/${scan.id}/report`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
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

export default History;

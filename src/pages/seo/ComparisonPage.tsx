import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Clock, DollarSign, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const comparisonData = [
  { feature: 'Time to First Results', redflag: '10 minutes', traditional: '2-4 weeks' },
  { feature: 'Cost per Analysis', redflag: 'From $495/mo', traditional: '$15,000 - $50,000' },
  { feature: 'Revenue Verification', redflag: true, traditional: true },
  { feature: 'Personal Expense Detection', redflag: true, traditional: true },
  { feature: 'Customer Churn Analysis', redflag: true, traditional: true },
  { feature: 'EBITDA Adjustments', redflag: true, traditional: true },
  { feature: 'PDF Export', redflag: true, traditional: true },
  { feature: 'White Label Reports', redflag: true, traditional: true },
  { feature: 'AI-Powered Detection', redflag: true, traditional: false },
  { feature: 'Instant Results', redflag: true, traditional: false },
  { feature: 'Unlimited Re-runs', redflag: true, traditional: false },
  { feature: 'Self-Service', redflag: true, traditional: false },
  { feature: 'Bank Statement Analysis', redflag: true, traditional: true },
  { feature: 'Working Capital Analysis', redflag: true, traditional: true },
];

const ComparisonPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>RedFlag.ai vs Traditional QoE Firms | Due Diligence Software Comparison</title>
        <meta name="description" content="Compare RedFlag.ai automated Quality of Earnings analysis with traditional accounting firm QoE reports. Get results in minutes vs weeks at a fraction of the cost." />
        <meta name="keywords" content="QoE comparison, quality of earnings software, automated due diligence, M&A analysis tools, accounting firm alternative" />
        <link rel="canonical" href="https://redflag.ai/compare" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                RedFlag.ai vs. Traditional QoE Firms
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See why search fund operators and PE firms are using AI-powered analysis 
                before engaging expensive accounting firms.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="text-center p-6">
                <Clock className="h-10 w-10 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold text-primary">100x Faster</div>
                <p className="text-muted-foreground">Minutes vs. weeks for initial analysis</p>
              </Card>
              <Card className="text-center p-6">
                <DollarSign className="h-10 w-10 mx-auto mb-4 text-success" />
                <div className="text-3xl font-bold text-success">95% Savings</div>
                <p className="text-muted-foreground">Compared to traditional QoE costs</p>
              </Card>
              <Card className="text-center p-6">
                <Zap className="h-10 w-10 mx-auto mb-4 text-warning" />
                <div className="text-3xl font-bold text-warning">Self-Service</div>
                <p className="text-muted-foreground">No scheduling, no waiting</p>
              </Card>
            </div>

            {/* Feature Comparison Table */}
            <Card className="mb-16">
              <CardHeader>
                <CardTitle>Feature Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-4">Feature</th>
                        <th className="text-center py-4 px-4 bg-primary/5">
                          <div className="font-bold text-primary">RedFlag.ai</div>
                        </th>
                        <th className="text-center py-4 px-4">Traditional Firms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{row.feature}</td>
                          <td className="py-3 px-4 text-center bg-primary/5">
                            {typeof row.redflag === 'boolean' ? (
                              row.redflag ? (
                                <Check className="h-5 w-5 text-success mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground mx-auto" />
                              )
                            ) : (
                              <span className="font-medium text-primary">{row.redflag}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof row.traditional === 'boolean' ? (
                              row.traditional ? (
                                <Check className="h-5 w-5 text-success mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground mx-auto" />
                              )
                            ) : (
                              <span className="text-muted-foreground">{row.traditional}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* When to Use Each */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="p-6 border-primary">
                <h3 className="text-xl font-bold mb-4 text-primary">Use RedFlag.ai When...</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>You're screening multiple deals and need quick red flag detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>You want to validate seller claims before the LOI stage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Budget is limited for preliminary due diligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>You need same-day results for time-sensitive deals</span>
                  </li>
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Use Traditional QoE When...</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span>You need a formal audit opinion for lenders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span>The deal requires in-person management interviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span>You're past LOI and in final due diligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span>Complex situations require expert judgment</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center p-8 bg-primary/5 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Ready to accelerate your due diligence?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join hundreds of search fund operators who use RedFlag.ai to screen deals 
                before engaging expensive advisors.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">Start Your Free Trial</Link>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ComparisonPage;
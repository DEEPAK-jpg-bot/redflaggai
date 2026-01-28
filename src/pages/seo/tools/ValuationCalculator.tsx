import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const industryMultiples: Record<string, { low: number; mid: number; high: number }> = {
  hvac: { low: 3, mid: 4, high: 5 },
  plumbing: { low: 2.5, mid: 3.5, high: 4.5 },
  landscaping: { low: 2, mid: 3, high: 4 },
  roofing: { low: 2.5, mid: 3.5, high: 4.5 },
  dental: { low: 4, mid: 5.5, high: 7 },
  saas: { low: 4, mid: 6, high: 10 },
  ecommerce: { low: 3, mid: 4, high: 5 },
  manufacturing: { low: 3.5, mid: 4.5, high: 6 },
  'home-services': { low: 3, mid: 4, high: 5 },
  insurance: { low: 1.5, mid: 2, high: 2.5 },
  other: { low: 3, mid: 4, high: 5 },
};

const ValuationCalculator: React.FC = () => {
  const [ebitda, setEbitda] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [industry, setIndustry] = useState<string>('other');
  const [customMultiple, setCustomMultiple] = useState<number[]>([4]);
  const [askingPrice, setAskingPrice] = useState<number>(0);

  // Risk factors
  const [ownerDependency, setOwnerDependency] = useState<boolean>(false);
  const [customerConcentration, setCustomerConcentration] = useState<boolean>(false);
  const [decliningRevenue, setDecliningRevenue] = useState<boolean>(false);
  const [recurringRevenue, setRecurringRevenue] = useState<boolean>(false);
  const [strongGrowth, setStrongGrowth] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const multiples = industryMultiples[industry] || industryMultiples.other;
    const selectedMultiple = customMultiple[0];
    
    // Adjust multiple based on risk factors
    let adjustedMultiple = selectedMultiple;
    if (ownerDependency) adjustedMultiple -= 0.5;
    if (customerConcentration) adjustedMultiple -= 0.5;
    if (decliningRevenue) adjustedMultiple -= 0.75;
    if (recurringRevenue) adjustedMultiple += 0.5;
    if (strongGrowth) adjustedMultiple += 0.5;
    adjustedMultiple = Math.max(1, adjustedMultiple);

    const valuation = ebitda * adjustedMultiple;
    const lowValuation = ebitda * multiples.low;
    const highValuation = ebitda * multiples.high;
    
    const askingMultiple = ebitda > 0 ? askingPrice / ebitda : 0;
    const isPriceFair = askingMultiple <= adjustedMultiple + 0.5;
    const discount = askingPrice > 0 ? ((valuation - askingPrice) / valuation) * 100 : 0;

    return {
      valuation,
      lowValuation,
      highValuation,
      adjustedMultiple,
      askingMultiple,
      isPriceFair,
      discount,
      multiples,
    };
  }, [ebitda, industry, customMultiple, askingPrice, ownerDependency, customerConcentration, decliningRevenue, recurringRevenue, strongGrowth]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Small Business Valuation Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Free business valuation calculator using EBITDA multiples. Estimate fair market value for SMB acquisitions with industry-specific multiples.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <Helmet>
        <title>Business Valuation Calculator | EBITDA Multiple Tool | RedFlag.ai</title>
        <meta 
          name="description" 
          content="Free business valuation calculator for M&A. Calculate fair market value using EBITDA multiples with industry-specific benchmarks and risk adjustments." 
        />
        <meta 
          name="keywords" 
          content="business valuation calculator, EBITDA multiple, SMB valuation, business worth, acquisition pricing, search fund valuation" 
        />
        <link rel="canonical" href="https://redflag.ai/tools/valuation-calculator" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/50 via-background to-background pt-12 pb-8">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4 p-2 rounded-full bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Free Calculator</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Business Valuation Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estimate fair market value using EBITDA multiples. 
              Adjust for industry benchmarks and risk factors.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Inputs */}
              <div className="lg:col-span-2 space-y-6">
                {/* Financial Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Financials</CardTitle>
                    <CardDescription>
                      Enter the target company's financial metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ebitda">Adjusted EBITDA / SDE</Label>
                        <Input
                          id="ebitda"
                          type="number"
                          placeholder="500,000"
                          value={ebitda || ''}
                          onChange={(e) => setEbitda(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="revenue">Annual Revenue</Label>
                        <Input
                          id="revenue"
                          type="number"
                          placeholder="2,000,000"
                          value={revenue || ''}
                          onChange={(e) => setRevenue(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hvac">HVAC</SelectItem>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="landscaping">Landscaping</SelectItem>
                          <SelectItem value="roofing">Roofing</SelectItem>
                          <SelectItem value="dental">Dental Practice</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="home-services">Home Services</SelectItem>
                          <SelectItem value="insurance">Insurance Agency</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Industry range: {calculations.multiples.low}x - {calculations.multiples.high}x EBITDA
                      </p>
                    </div>

                    <div>
                      <Label>Valuation Multiple: {customMultiple[0].toFixed(1)}x</Label>
                      <Slider
                        value={customMultiple}
                        onValueChange={setCustomMultiple}
                        min={1}
                        max={10}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Conservative (1x)</span>
                        <span>Aggressive (10x)</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="askingPrice">Seller's Asking Price (optional)</Label>
                      <Input
                        id="askingPrice"
                        type="number"
                        placeholder="2,000,000"
                        value={askingPrice || ''}
                        onChange={(e) => setAskingPrice(Number(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Adjustments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk & Value Adjustments</CardTitle>
                    <CardDescription>
                      These factors adjust the multiple up or down
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={ownerDependency}
                          onChange={(e) => setOwnerDependency(e.target.checked)}
                          className="rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">High Owner Dependency</p>
                          <p className="text-xs text-muted-foreground">-0.5x multiple</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={customerConcentration}
                          onChange={(e) => setCustomerConcentration(e.target.checked)}
                          className="rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">Customer Concentration</p>
                          <p className="text-xs text-muted-foreground">-0.5x multiple</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={decliningRevenue}
                          onChange={(e) => setDecliningRevenue(e.target.checked)}
                          className="rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">Declining Revenue</p>
                          <p className="text-xs text-muted-foreground">-0.75x multiple</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={recurringRevenue}
                          onChange={(e) => setRecurringRevenue(e.target.checked)}
                          className="rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">Strong Recurring Revenue</p>
                          <p className="text-xs text-muted-foreground">+0.5x multiple</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={strongGrowth}
                          onChange={(e) => setStrongGrowth(e.target.checked)}
                          className="rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">Strong Revenue Growth (&gt;15%)</p>
                          <p className="text-xs text-muted-foreground">+0.5x multiple</p>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Valuation Estimate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary">
                      <p className="text-sm font-medium">Estimated Value</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(calculations.valuation)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        at {calculations.adjustedMultiple.toFixed(1)}x adjusted multiple
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground mb-2">Valuation Range</p>
                      <div className="flex justify-between text-sm">
                        <span>Low ({calculations.multiples.low}x)</span>
                        <span className="font-medium">{formatCurrency(calculations.lowValuation)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>High ({calculations.multiples.high}x)</span>
                        <span className="font-medium">{formatCurrency(calculations.highValuation)}</span>
                      </div>
                    </div>

                    {askingPrice > 0 && (
                      <>
                        <Separator />
                        <div className={`p-4 rounded-lg ${calculations.isPriceFair ? 'bg-success/10' : 'bg-destructive/10'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {calculations.isPriceFair ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            )}
                            <span className="font-medium">
                              {calculations.isPriceFair ? 'Fair Price' : 'Overpriced'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Asking: {formatCurrency(askingPrice)} ({calculations.askingMultiple.toFixed(1)}x)
                          </p>
                          {calculations.discount !== 0 && (
                            <Badge variant={calculations.discount > 0 ? 'default' : 'destructive'} className="mt-2">
                              {calculations.discount > 0 ? 'Undervalued by' : 'Overvalued by'} {Math.abs(calculations.discount).toFixed(0)}%
                            </Badge>
                          )}
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Validate these numbers with real data
                      </p>
                      <Button className="w-full" asChild>
                        <Link to="/signup">
                          Verify Financials
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Educational Content */}
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Understanding Business Valuation</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">EBITDA vs SDE</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      <strong>SDE (Seller's Discretionary Earnings)</strong> includes owner salary; 
                      used for owner-operated businesses under $5M.
                    </p>
                    <p className="mt-2">
                      <strong>EBITDA</strong> excludes owner salary; used for larger businesses 
                      with professional management.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Multiple Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>Higher multiples for:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Recurring revenue</li>
                      <li>Low owner dependency</li>
                      <li>Growing revenue</li>
                      <li>Diversified customers</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Needed</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Sellers often present optimistic EBITDA. Always verify:
                    </p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Add-backs are legitimate</li>
                      <li>Revenue matches bank deposits</li>
                      <li>Expenses are properly categorized</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* CTA */}
            <section className="mt-12 text-center p-8 bg-primary/5 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">
                Don't Trust Seller-Provided Numbers
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                This calculator is only as good as the inputs. 
                Upload actual financials to verify EBITDA and detect red flags before you buy.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">Start Free Analysis</Link>
              </Button>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ValuationCalculator;

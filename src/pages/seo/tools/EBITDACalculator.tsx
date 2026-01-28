import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, DollarSign, Plus, ArrowRight } from 'lucide-react';

const EBITDACalculator: React.FC = () => {
  const [revenue, setRevenue] = useState<number>(0);
  const [netIncome, setNetIncome] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(0);
  const [depreciation, setDepreciation] = useState<number>(0);
  const [amortization, setAmortization] = useState<number>(0);
  
  // Add-backs
  const [ownerSalary, setOwnerSalary] = useState<number>(0);
  const [ownerBenefits, setOwnerBenefits] = useState<number>(0);
  const [personalExpenses, setPersonalExpenses] = useState<number>(0);
  const [oneTimeExpenses, setOneTimeExpenses] = useState<number>(0);
  const [relatedPartyRent, setRelatedPartyRent] = useState<number>(0);

  const calculations = useMemo(() => {
    const ebitda = netIncome + interest + taxes + depreciation + amortization;
    const totalAddBacks = ownerSalary + ownerBenefits + personalExpenses + oneTimeExpenses + relatedPartyRent;
    const adjustedEbitda = ebitda + totalAddBacks;
    const ebitdaMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
    const adjustedMargin = revenue > 0 ? (adjustedEbitda / revenue) * 100 : 0;

    return {
      ebitda,
      totalAddBacks,
      adjustedEbitda,
      ebitdaMargin,
      adjustedMargin,
    };
  }, [revenue, netIncome, interest, taxes, depreciation, amortization, ownerSalary, ownerBenefits, personalExpenses, oneTimeExpenses, relatedPartyRent]);

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
    name: 'EBITDA Calculator with Add-Backs',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Free EBITDA calculator for M&A due diligence. Calculate adjusted EBITDA with common add-backs for small business acquisitions.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Calculate Adjusted EBITDA',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Start with Net Income',
        text: 'Enter the net income from the profit and loss statement',
      },
      {
        '@type': 'HowToStep',
        name: 'Add back Interest, Taxes, Depreciation, Amortization',
        text: 'Add back non-operating and non-cash expenses to get EBITDA',
      },
      {
        '@type': 'HowToStep',
        name: 'Identify Add-Backs',
        text: 'Add back owner compensation, personal expenses, and one-time costs',
      },
      {
        '@type': 'HowToStep',
        name: 'Calculate Adjusted EBITDA',
        text: 'Sum EBITDA and add-backs to get true earning power',
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>EBITDA Calculator with Add-Backs | Free M&A Tool | RedFlag.ai</title>
        <meta 
          name="description" 
          content="Free EBITDA calculator for business acquisitions. Calculate adjusted EBITDA with owner add-backs, personal expenses, and one-time costs. Essential for search fund due diligence." 
        />
        <meta 
          name="keywords" 
          content="EBITDA calculator, adjusted EBITDA, SDE calculator, owner add-backs, business valuation, M&A calculator, search fund tools" 
        />
        <link rel="canonical" href="https://redflag.ai/tools/ebitda-calculator" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
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
              EBITDA Calculator with Add-Backs
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate adjusted EBITDA for business acquisitions. 
              Include common owner add-backs to determine true earning power.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calculator Inputs */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Financial Inputs
                    </CardTitle>
                    <CardDescription>
                      Enter values from the P&L statement (annual figures)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="revenue">Annual Revenue</Label>
                        <Input
                          id="revenue"
                          type="number"
                          placeholder="1,000,000"
                          value={revenue || ''}
                          onChange={(e) => setRevenue(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="netIncome">Net Income</Label>
                        <Input
                          id="netIncome"
                          type="number"
                          placeholder="150,000"
                          value={netIncome || ''}
                          onChange={(e) => setNetIncome(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="interest">Interest Expense</Label>
                        <Input
                          id="interest"
                          type="number"
                          placeholder="10,000"
                          value={interest || ''}
                          onChange={(e) => setInterest(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxes">Income Taxes</Label>
                        <Input
                          id="taxes"
                          type="number"
                          placeholder="30,000"
                          value={taxes || ''}
                          onChange={(e) => setTaxes(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="depreciation">Depreciation</Label>
                        <Input
                          id="depreciation"
                          type="number"
                          placeholder="20,000"
                          value={depreciation || ''}
                          onChange={(e) => setDepreciation(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="amortization">Amortization</Label>
                        <Input
                          id="amortization"
                          type="number"
                          placeholder="5,000"
                          value={amortization || ''}
                          onChange={(e) => setAmortization(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add-Backs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Common Add-Backs
                    </CardTitle>
                    <CardDescription>
                      Expenses that will be eliminated or adjusted post-acquisition
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ownerSalary">Owner Salary (above market)</Label>
                        <Input
                          id="ownerSalary"
                          type="number"
                          placeholder="50,000"
                          value={ownerSalary || ''}
                          onChange={(e) => setOwnerSalary(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Excess over market-rate replacement
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="ownerBenefits">Owner Benefits & Perks</Label>
                        <Input
                          id="ownerBenefits"
                          type="number"
                          placeholder="25,000"
                          value={ownerBenefits || ''}
                          onChange={(e) => setOwnerBenefits(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Health insurance, retirement, etc.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="personalExpenses">Personal Expenses</Label>
                        <Input
                          id="personalExpenses"
                          type="number"
                          placeholder="15,000"
                          value={personalExpenses || ''}
                          onChange={(e) => setPersonalExpenses(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Vehicles, travel, meals, etc.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="oneTimeExpenses">One-Time Expenses</Label>
                        <Input
                          id="oneTimeExpenses"
                          type="number"
                          placeholder="20,000"
                          value={oneTimeExpenses || ''}
                          onChange={(e) => setOneTimeExpenses(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Legal fees, equipment, rebranding
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="relatedPartyRent">Related Party Rent (above market)</Label>
                        <Input
                          id="relatedPartyRent"
                          type="number"
                          placeholder="10,000"
                          value={relatedPartyRent || ''}
                          onChange={(e) => setRelatedPartyRent(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Excess rent paid to owner's LLC
                        </p>
                      </div>
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
                      Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground">EBITDA</p>
                      <p className="text-2xl font-bold">{formatCurrency(calculations.ebitda)}</p>
                      <p className="text-sm text-muted-foreground">
                        {calculations.ebitdaMargin.toFixed(1)}% margin
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground">Total Add-Backs</p>
                      <p className="text-xl font-bold text-success">
                        +{formatCurrency(calculations.totalAddBacks)}
                      </p>
                    </div>

                    <Separator />

                    <div className="p-4 rounded-lg bg-primary/10 border border-primary">
                      <p className="text-sm font-medium">Adjusted EBITDA</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(calculations.adjustedEbitda)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {calculations.adjustedMargin.toFixed(1)}% adjusted margin
                      </p>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Typical Valuation Multiples:</p>
                      <ul className="space-y-1">
                        <li>• 3x: {formatCurrency(calculations.adjustedEbitda * 3)}</li>
                        <li>• 4x: {formatCurrency(calculations.adjustedEbitda * 4)}</li>
                        <li>• 5x: {formatCurrency(calculations.adjustedEbitda * 5)}</li>
                      </ul>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Verify these add-backs with automated analysis
                      </p>
                      <Button className="w-full" asChild>
                        <Link to="/signup">
                          Validate Add-Backs
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
              <h2 className="text-2xl font-bold mb-6">Understanding EBITDA Add-Backs</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What is Adjusted EBITDA?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      Adjusted EBITDA represents the true earning power of a business by adding back 
                      expenses that won't continue after acquisition. This includes owner compensation 
                      above market rate, personal expenses, and one-time costs.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Why Do Add-Backs Matter?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      Small business owners often run personal expenses through the business. 
                      Identifying legitimate add-backs can significantly increase the valuation—
                      but buyers must verify each add-back is real and defensible.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* CTA */}
            <section className="mt-12 text-center p-8 bg-primary/5 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">
                Verify Your Add-Backs Are Real
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Sellers often inflate add-backs to justify higher valuations. 
                RedFlag.ai analyzes the actual financial data to validate each adjustment.
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

export default EBITDACalculator;

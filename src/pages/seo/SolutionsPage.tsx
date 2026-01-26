import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Building2, Users, Briefcase, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const solutions = [
  {
    icon: Target,
    title: 'Search Fund Operators',
    description: 'Individual operators sourcing and evaluating SMB acquisitions',
    features: [
      'Screen multiple deals quickly before committing resources',
      'Validate seller-provided financials before the LOI',
      'Identify EBITDA add-backs to negotiate better valuations',
      'Build confidence with investment committee presentations',
    ],
    cta: 'Perfect for: Self-funded searchers, traditional search funds, and entrepreneurship-through-acquisition',
  },
  {
    icon: Building2,
    title: 'Private Equity Firms',
    description: 'Lower middle market PE firms evaluating platform and add-on acquisitions',
    features: [
      'Rapidly triage deal flow with preliminary QoE analysis',
      'Standardize due diligence across your portfolio',
      'White-label reports for LP and lender presentations',
      'API access for integration with existing workflows',
    ],
    cta: 'Perfect for: Firms with $5M-$50M EBITDA targets seeking operational efficiency',
  },
  {
    icon: Users,
    title: 'Fund-of-Funds & LPs',
    description: 'Investors backing search funds and emerging managers',
    features: [
      'Review searcher deal submissions with independent analysis',
      'Standardize evaluation criteria across multiple searchers',
      'Faster turnaround for investment committee reviews',
      'Track portfolio company financial health over time',
    ],
    cta: 'Perfect for: Search fund investors, family offices, and institutional LPs',
  },
  {
    icon: Briefcase,
    title: 'M&A Advisors',
    description: 'Investment bankers and business brokers facilitating transactions',
    features: [
      'Pre-screen seller financials before taking listings',
      'Identify issues early to avoid deal failures',
      'Add value with preliminary QoE in your engagement',
      'Accelerate buyer due diligence timelines',
    ],
    cta: 'Perfect for: Boutique investment banks and business brokers',
  },
];

const SolutionsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Due Diligence Solutions | Search Funds, PE Firms, M&A Advisors | RedFlag.ai</title>
        <meta name="description" content="Automated Quality of Earnings analysis for search fund operators, private equity firms, fund-of-funds, and M&A advisors. Screen deals faster with AI-powered red flag detection." />
        <meta name="keywords" content="search fund due diligence, PE deal screening, M&A analysis software, fund-of-funds tools, acquisition analysis" />
        <link rel="canonical" href="https://redflag.ai/solutions" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4">
                Solutions for Every Stage of the Deal
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether you're a solo searcher or a PE firm, RedFlag.ai helps you 
                make faster, more confident acquisition decisions.
              </p>
            </div>

            <div className="space-y-12">
              {solutions.map((solution, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-primary/5 p-8 flex flex-col justify-center">
                      <solution.icon className="h-12 w-12 text-primary mb-4" />
                      <CardTitle className="text-2xl mb-2">{solution.title}</CardTitle>
                      <CardDescription className="text-base">{solution.description}</CardDescription>
                    </div>
                    <CardContent className="md:w-2/3 p-8">
                      <ul className="space-y-4 mb-6">
                        {solution.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-3">
                            <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground italic">{solution.cta}</p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* Use Cases */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-center mb-12">Common Use Cases</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-3">Pre-LOI Screening</h3>
                  <p className="text-muted-foreground">
                    Run a quick analysis on seller-provided financials before signing an LOI. 
                    Identify major red flags that could be deal-breakers without spending 
                    $20,000+ on traditional QoE.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-3">Valuation Negotiation</h3>
                  <p className="text-muted-foreground">
                    Discover personal expenses being run through the business that should be 
                    added back to EBITDA. Use findings to negotiate better purchase prices 
                    or deal terms.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-3">Deal Pipeline Triage</h3>
                  <p className="text-muted-foreground">
                    PE firms reviewing dozens of deals per month can quickly separate 
                    opportunities worth pursuing from those with fundamental financial issues.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-3">Seller Preparation</h3>
                  <p className="text-muted-foreground">
                    Business owners preparing for sale can run their own analysis to identify 
                    and address issues before buyers discover them during due diligence.
                  </p>
                </Card>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-20 text-center p-8 bg-primary/5 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Find the right solution for your needs</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Start with a free scan to see RedFlag.ai in action on your own deal data.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SolutionsPage;
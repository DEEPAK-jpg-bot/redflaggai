import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, DollarSign, Zap, Shield } from 'lucide-react';

interface Alternative {
  name: string;
  category: string;
  description: string;
  pros: string[];
  cons: string[];
  pricing: string;
  timeToComplete: string;
  bestFor: string;
}

const alternatives: Alternative[] = [
  {
    name: 'Big 4 Accounting Firms',
    category: 'Traditional QoE',
    description: 'Deloitte, PwC, EY, and KPMG offer comprehensive Quality of Earnings reports for larger transactions.',
    pros: [
      'Comprehensive analysis',
      'Strong reputation with lenders',
      'Full legal defensibility',
    ],
    cons: [
      '$50,000 - $150,000+ per engagement',
      '4-8 week turnaround',
      'Overkill for sub-$10M deals',
      'Minimum deal size requirements',
    ],
    pricing: '$50K - $150K+',
    timeToComplete: '4-8 weeks',
    bestFor: 'Deals over $25M with institutional lenders',
  },
  {
    name: 'Regional CPA Firms',
    category: 'Traditional QoE',
    description: 'Mid-size accounting firms that specialize in transaction advisory services.',
    pros: [
      'More affordable than Big 4',
      'Personal attention',
      'Often have industry expertise',
    ],
    cons: [
      '$15,000 - $40,000 per engagement',
      '2-4 week turnaround',
      'Quality varies significantly',
      'May lack specialized M&A experience',
    ],
    pricing: '$15K - $40K',
    timeToComplete: '2-4 weeks',
    bestFor: 'Deals $5M-$25M with bank financing',
  },
  {
    name: 'Freelance CFOs & Consultants',
    category: 'Fractional Services',
    description: 'Independent financial consultants who perform QoE-style analysis on a project basis.',
    pros: [
      'Most affordable option',
      'Flexible scope',
      'Fast turnaround possible',
    ],
    cons: [
      'No standardized methodology',
      'Quality highly variable',
      'Limited liability coverage',
      'May miss industry-specific issues',
    ],
    pricing: '$3K - $10K',
    timeToComplete: '1-2 weeks',
    bestFor: 'Self-funded searchers on tight budgets',
  },
  {
    name: 'DIY Spreadsheet Analysis',
    category: 'Self-Service',
    description: 'Building your own financial models and analysis in Excel or Google Sheets.',
    pros: [
      'Free (besides your time)',
      'Full control over analysis',
      'Learn the business deeply',
    ],
    cons: [
      'Extremely time-consuming',
      'Easy to miss red flags',
      'No fraud detection capabilities',
      'Confirmation bias risk',
    ],
    pricing: 'Free',
    timeToComplete: '20-40 hours',
    bestFor: 'Very early screening only',
  },
];

const AlternativesPage: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Quality of Earnings Alternatives: Complete Comparison Guide',
    description: 'Compare Big 4 firms, regional CPAs, freelance consultants, and automated tools for M&A due diligence.',
    author: {
      '@type': 'Organization',
      name: 'RedFlag.ai',
    },
  };

  return (
    <>
      <Helmet>
        <title>Quality of Earnings Alternatives: Big 4 vs CPA vs RedFlag.ai</title>
        <meta 
          name="description" 
          content="Compare Quality of Earnings report providers: Big 4 accounting firms ($50K+), regional CPAs ($15K), and RedFlag.ai automated analysis. Find the right fit for your deal size." 
        />
        <meta 
          name="keywords" 
          content="QoE alternatives, quality of earnings cost, Big 4 QoE, CPA due diligence, automated QoE, M&A financial analysis" 
        />
        <link rel="canonical" href="https://redflag.ai/alternatives" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/50 via-background to-background pt-16 pb-12">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4">Buyer's Guide</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Quality of Earnings Alternatives
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From $150,000 Big 4 engagements to free DIY analysis. 
              Find the right QoE approach for your deal size and timeline.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Quick Comparison Table */}
            <section className="mb-16 overflow-x-auto">
              <h2 className="text-2xl font-bold mb-6">Quick Comparison</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Option</th>
                    <th className="text-left p-3">Cost</th>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-primary/5">
                    <td className="p-3 font-medium">
                      RedFlag.ai
                      <Badge className="ml-2" variant="default">Recommended</Badge>
                    </td>
                    <td className="p-3">$495/mo</td>
                    <td className="p-3">10 minutes</td>
                    <td className="p-3">Pre-LOI screening, search funds</td>
                  </tr>
                  {alternatives.map((alt) => (
                    <tr key={alt.name} className="border-b">
                      <td className="p-3 font-medium">{alt.name}</td>
                      <td className="p-3">{alt.pricing}</td>
                      <td className="p-3">{alt.timeToComplete}</td>
                      <td className="p-3">{alt.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* RedFlag.ai Advantage */}
            <section className="mb-16">
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    Why RedFlag.ai is Different
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-bold mb-1">10-Minute Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Screen deals before committing $20K+ to traditional QoE
                      </p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-bold mb-1">$495/Month</h3>
                      <p className="text-sm text-muted-foreground">
                        Unlimited pre-screening vs. $15K+ per traditional engagement
                      </p>
                    </div>
                    <div className="text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-bold mb-1">AI-Powered Detection</h3>
                      <p className="text-sm text-muted-foreground">
                        100+ fraud signals trained on thousands of deals
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Detailed Alternatives */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Detailed Comparison</h2>
              <div className="space-y-6">
                {alternatives.map((alt) => (
                  <Card key={alt.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">{alt.category}</Badge>
                          <CardTitle>{alt.name}</CardTitle>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{alt.pricing}</p>
                          <p className="text-sm text-muted-foreground">{alt.timeToComplete}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{alt.description}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2 text-success">Pros</h4>
                          <ul className="space-y-1">
                            {alt.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-success" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-destructive">Cons</h4>
                          <ul className="space-y-1">
                            {alt.cons.map((con, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <X className="h-4 w-4 text-destructive" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <p className="mt-4 text-sm">
                        <strong>Best for:</strong> {alt.bestFor}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* When to Use What */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Which Option Should You Choose?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Use RedFlag.ai When...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <span>Screening deals before signing an LOI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <span>Evaluating multiple opportunities simultaneously</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <span>You need results in hours, not weeks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <span>Deal size under $10M (self-funded search)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Add Traditional QoE When...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <span>Bank/SBA financing requires formal QoE</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <span>Deal size exceeds $15M</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <span>Complex working capital adjustments needed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <span>You need legal defensibility for investors</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center p-8 bg-primary/5 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">
                Start with RedFlag.ai, Upgrade When Needed
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Screen your deal in 10 minutes. If it passes, invest in comprehensive QoE. 
                Save $15,000+ by filtering bad deals early.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">Start Free Scan</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AlternativesPage;

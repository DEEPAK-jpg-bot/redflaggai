import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, FileText, PieChart, ArrowRight } from 'lucide-react';

const tools = [
  {
    title: 'EBITDA Calculator with Add-Backs',
    description: 'Calculate adjusted EBITDA by adding back owner compensation, personal expenses, and one-time costs.',
    icon: Calculator,
    href: '/tools/ebitda-calculator',
    features: ['Net income to EBITDA bridge', 'Common add-back categories', 'Valuation multiples'],
  },
  {
    title: 'Business Valuation Calculator',
    description: 'Estimate fair market value using industry-specific EBITDA multiples and risk adjustments.',
    icon: TrendingUp,
    href: '/tools/valuation-calculator',
    features: ['Industry benchmarks', 'Risk factor adjustments', 'Asking price analysis'],
  },
];

const comingSoon = [
  {
    title: 'Proof of Cash Analyzer',
    description: 'Upload bank statements and ledger to reconcile booked revenue against deposits.',
    icon: FileText,
  },
  {
    title: 'Customer Concentration Tool',
    description: 'Analyze revenue by customer to identify concentration risk.',
    icon: PieChart,
  },
];

const ToolsIndex: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free M&A Due Diligence Tools',
    description: 'Free calculators and tools for business acquisition analysis',
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: tool.title,
      url: `https://redflag.ai${tool.href}`,
    })),
  };

  return (
    <>
      <Helmet>
        <title>Free M&A Due Diligence Tools | EBITDA & Valuation Calculators | RedFlag.ai</title>
        <meta 
          name="description" 
          content="Free tools for business acquisition analysis. EBITDA calculator with add-backs, valuation calculator with industry multiples, and more." 
        />
        <meta 
          name="keywords" 
          content="EBITDA calculator, business valuation tool, M&A calculator, due diligence tools, search fund resources" 
        />
        <link rel="canonical" href="https://redflag.ai/tools" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/50 via-background to-background pt-16 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Free Due Diligence Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Calculators and analyzers to help you evaluate acquisition targets. 
              No signup required.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Available Tools */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Available Now</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {tools.map((tool) => (
                  <Card key={tool.href} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <tool.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                      </div>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                        {tool.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                      <Button className="w-full" asChild>
                        <Link to={tool.href}>
                          Use Calculator
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Coming Soon */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {comingSoon.map((tool, idx) => (
                  <Card key={idx} className="opacity-60">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <tool.icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                      </div>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center p-8 bg-primary/5 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">
                Want Automated Analysis?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                These calculators help with quick estimates. 
                For comprehensive financial analysis with fraud detection, try RedFlag.ai.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">Start Free Scan</Link>
              </Button>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ToolsIndex;

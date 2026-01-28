import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building2, Factory, Home, Laptop, ShoppingCart, Wrench, Leaf, Shield, HardHat, Stethoscope } from 'lucide-react';
import { industries } from '@/data/industryData';

const iconMap: Record<string, React.ElementType> = {
  hvac: Wrench,
  'dental-practice': Stethoscope,
  saas: Laptop,
  plumbing: Wrench,
  landscaping: Leaf,
  roofing: HardHat,
  manufacturing: Factory,
  ecommerce: ShoppingCart,
  'home-services': Home,
  'insurance-agency': Shield,
};

const IndustriesIndex: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Industry-Specific Quality of Earnings Analysis',
    description: 'Specialized due diligence analysis for SMB acquisitions across multiple industries',
    numberOfItems: industries.length,
    itemListElement: industries.map((ind, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: `${ind.name} Quality of Earnings`,
      url: `https://redflag.ai/industries/${ind.slug}`,
    })),
  };

  return (
    <>
      <Helmet>
        <title>Industry-Specific Quality of Earnings Analysis | RedFlag.ai</title>
        <meta 
          name="description" 
          content="Specialized QoE analysis for HVAC, dental practices, SaaS, manufacturing, e-commerce, and more. AI-powered due diligence tailored to your industry." 
        />
        <meta 
          name="keywords" 
          content="industry QoE analysis, sector due diligence, HVAC acquisition, dental practice sale, SaaS due diligence, manufacturing M&A" 
        />
        <link rel="canonical" href="https://redflag.ai/industries" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/50 via-background to-background pt-16 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Industry-Specific Due Diligence
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every industry has unique red flags and EBITDA add-backs. 
              Our AI is trained on thousands of deals across these sectors.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {industries.map((ind) => {
              const Icon = iconMap[ind.slug] || Building2;
              return (
                <Card key={ind.slug} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{ind.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {ind.heroSubtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p><strong>Typical Deal:</strong> {ind.avgDealSize}</p>
                      <p><strong>Multiple:</strong> {ind.avgAskingMultiple}</p>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/industries/${ind.slug}`}>
                        Explore {ind.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center p-8 bg-primary/5 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Don't See Your Industry?</h2>
            <p className="text-muted-foreground mb-6">
              Our AI analyzes patterns across all SMB types. Upload your deal data 
              and we'll detect red flags specific to your target's business model.
            </p>
            <Button size="lg" asChild>
              <Link to="/signup">Start Free Analysis</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default IndustriesIndex;

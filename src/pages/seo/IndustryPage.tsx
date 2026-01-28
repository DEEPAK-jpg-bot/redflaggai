import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, DollarSign, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import { getIndustryBySlug, industries } from '@/data/industryData';

const IndustryPage: React.FC = () => {
  const { industry } = useParams<{ industry: string }>();
  const data = industry ? getIndustryBySlug(industry) : undefined;

  if (!data) {
    return <Navigate to="/industries" replace />;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `RedFlag.ai ${data.name} Analysis`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: data.metaDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free initial scan',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.metaDescription} />
        <meta name="keywords" content={`${data.name} quality of earnings, ${data.name} due diligence, ${data.name} acquisition, ${data.name} M&A, ${data.name} valuation`} />
        <link rel="canonical" href={`https://redflag.ai/industries/${data.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/50 via-background to-background pt-16 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Building2 className="w-3 h-3 mr-1" />
                {data.name} Industry
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.heroTitle}</h1>
              <p className="text-xl text-muted-foreground mb-8">{data.heroSubtitle}</p>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>Avg Deal: {data.avgDealSize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Typical Multiple: {data.avgAskingMultiple}</span>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Analyze {data.name} Deal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {/* Red Flags Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                Common {data.name} Red Flags We Detect
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.commonRedFlags.map((flag, idx) => (
                  <Card key={idx} className="border-l-4 border-l-destructive">
                    <CardContent className="p-4">
                      <p className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        {flag}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* EBITDA Add-backs */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-success" />
                Typical {data.name} EBITDA Add-Backs
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.ebitdaAddBacks.map((addback, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                        <span>{addback}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Key Metrics */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Key {data.name} Metrics We Analyze</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.keyMetrics.map((metric, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4 text-center">
                      <p className="font-medium">{metric}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">{data.name} Due Diligence FAQs</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {data.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Other Industries */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Explore Other Industries</h2>
              <div className="flex flex-wrap gap-2">
                {industries
                  .filter((ind) => ind.slug !== data.slug)
                  .slice(0, 6)
                  .map((ind) => (
                    <Button key={ind.slug} variant="outline" size="sm" asChild>
                      <Link to={`/industries/${ind.slug}`}>{ind.name}</Link>
                    </Button>
                  ))}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/industries">View All →</Link>
                </Button>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center p-8 bg-primary/5 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Analyze Your {data.name} Acquisition?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Upload the target's financials and get red flag detection in 10 minutes.
                No credit card required for your first scan.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">Start Free {data.name} Scan</Link>
              </Button>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default IndustryPage;

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is a Quality of Earnings (QoE) Report?',
        a: 'A Quality of Earnings report is a due diligence analysis that verifies the accuracy and sustainability of a company\'s reported earnings. It examines revenue recognition, expense categorization, and cash flow to identify potential red flags that could affect business valuation.',
      },
      {
        q: 'Who uses RedFlag.ai?',
        a: 'RedFlag.ai is designed for search fund operators, private equity firms, fund-of-funds, M&A advisors, and independent sponsors who need to quickly assess acquisition targets before committing to expensive traditional due diligence.',
      },
      {
        q: 'How is this different from a traditional accounting firm QoE?',
        a: 'Traditional QoE reports from accounting firms take 2-4 weeks and cost $15,000-$50,000. RedFlag.ai delivers initial red flag detection in minutes at a fraction of the cost, helping you decide which deals merit further due diligence.',
      },
    ],
  },
  {
    category: 'Analysis & Detection',
    questions: [
      {
        q: 'What is Proof of Cash analysis?',
        a: 'Proof of Cash is a critical verification procedure that reconciles booked revenue in the accounting ledger against actual bank deposits. This detects revenue recognition timing issues, fictitious sales, or cash diversion.',
      },
      {
        q: 'How does the EBITDA Bridge work?',
        a: 'The EBITDA Bridge starts with reported net income and adds back identified personal expenses, non-recurring items, and owner adjustments to calculate True Adjusted EBITDA—the actual earning power of the business.',
      },
      {
        q: 'What personal expenses does RedFlag.ai detect?',
        a: 'Our AI detects vacation travel, luxury vehicles, country club memberships, family expenses miscategorized as business costs, personal services, and items where the expense category doesn\'t match the vendor description.',
      },
      {
        q: 'How accurate is the customer concentration analysis?',
        a: 'We analyze 3 months of customer spending patterns to identify revenue concentration risk and churning customers. We flag when any single customer represents more than 20% of revenue or shows significant spending decline.',
      },
    ],
  },
  {
    category: 'Technical & Data',
    questions: [
      {
        q: 'What file formats are supported?',
        a: 'We accept CSV files for both accounting ledger exports and bank statements. Most accounting software (QuickBooks, Xero, FreshBooks) can export to CSV format.',
      },
      {
        q: 'Is my financial data secure?',
        a: 'Yes. All data is encrypted in transit and at rest. We use bank-level security with SOC 2 compliance. Your data is never shared and is automatically deleted after 90 days.',
      },
      {
        q: 'Can I download and share reports?',
        a: 'Paid plans include PDF export with white-label options. You can share reports with investment committees, lenders, or co-investors.',
      },
    ],
  },
  {
    category: 'Pricing & Plans',
    questions: [
      {
        q: 'What\'s included in the free scan?',
        a: 'Free users get one scan per month with full KPI visibility (risk score, EBITDA totals) but blurred details (specific flagged transactions, vendor names). Upgrade to see all details and download reports.',
      },
      {
        q: 'Do unused scans roll over?',
        a: 'Yes! Unused scans roll over to the next month, up to 2x your monthly limit. Never lose scans you\'ve paid for.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Absolutely. Cancel anytime from your account settings. You\'ll retain access until the end of your billing period.',
      },
    ],
  },
];

const FAQPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Quality of Earnings FAQ | RedFlag.ai Due Diligence Software</title>
        <meta name="description" content="Frequently asked questions about Quality of Earnings reports, EBITDA adjustments, Proof of Cash analysis, and automated due diligence for M&A transactions." />
        <meta name="keywords" content="quality of earnings FAQ, QoE report questions, EBITDA bridge explained, proof of cash, M&A due diligence, search fund software" />
        <link rel="canonical" href="https://redflag.ai/faq" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about Quality of Earnings analysis and RedFlag.ai
              </p>
            </div>

            {faqs.map((category) => (
              <div key={category.category} className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            <div className="mt-16 text-center p-8 bg-primary/5 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Our team is here to help you make confident acquisition decisions.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:support@redflag.ai">Contact Support</a>
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* FAQ Schema for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.flatMap(cat => cat.questions.map(q => ({
            '@type': 'Question',
            name: q.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.a,
            },
          }))),
        })}
      </script>
    </>
  );
};

export default FAQPage;
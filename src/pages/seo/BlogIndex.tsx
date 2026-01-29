import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const blogPosts = [
  // HIGH-PRIORITY QUICK WINS (Featured)
  {
    slug: 'verify-company-legitimate-2025',
    title: 'How to Verify a Company is Legitimate in 2025: The 5-Minute Checklist',
    description: 'Stop business scams before they start. Our 5-minute ritual for verifying any company, registration number, and VAT status globally.',
    category: 'Guide',
    date: '2024-02-01',
    readTime: '5 min read',
    featured: true,
  },
  {
    slug: 'due-diligence-report-cost-comparison',
    title: 'The £19.99 Due Diligence Report vs. £25,000 Full Diligence: What\'s the Difference?',
    description: 'Why you shouldn\'t spend £25k on due diligence for a deal that should have been killed in 10 minutes for less than a pizza.',
    category: 'ROI',
    date: '2024-01-28',
    readTime: '6 min read',
    featured: true,
  },
  {
    slug: 'shell-company-red-flags',
    title: 'Shell Company Red Flags: 7 Signs You\'re Dealing with a Fake Business',
    description: 'Learn the industrial-grade patterns of shell companies, phantom offices, and virtual company fronts used in M&A fraud.',
    category: 'Horror Stories',
    date: '2024-01-25',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'commodity-trading-phantom-shipment-fraud',
    title: 'Commodity Trading Fraud Alert: The "Phantom Shipment" Scam Costing Traders Millions',
    description: 'How freight forwarders and suppliers collaborate to fake bills of lading and steal cargo in 2025.',
    category: 'Industry',
    date: '2024-01-22',
    readTime: '10 min read',
    featured: true,
  },
  {
    slug: 'pre-acquisition-due-diligence-kill-fast',
    title: 'Pre-Acquisition Due Diligence: Kill Bad Deals in 48 Hours, Not 48 Days',
    description: 'The "Kill Fast" strategy for search funds and PE firms. Focus your energy on the 1% of deals that actually matter.',
    category: 'Strategy',
    date: '2024-01-20',
    readTime: '12 min read',
    featured: true,
  },

  // CATEGORY A: HORROR STORIES
  { slug: '2m-lesson-commodity-trader-fraud', title: 'The $2M Lesson: How a Commodity Trader Lost Everything to a Shell Company', description: 'A cautionary tale of due diligence failure in the oil & gas sector.', category: 'Horror Stories', date: '2024-01-15', readTime: '10 min read', featured: false },
  { slug: '9-common-acquisition-frauds-2025', title: '9 Most Common Small Business Acquisition Frauds in 2025', description: 'Real case studies of fraud every buyer should know.', category: 'Horror Stories', date: '2024-01-14', readTime: '12 min read', featured: false },
  { slug: 'phantom-suppliers-ghost-freight-forwarders', title: 'Phantom Suppliers: How "Ghost" Freight Forwarders Are Stealing Cargo', description: 'The rise of double-brokerage scams in 2025.', category: 'Horror Stories', date: '2024-01-12', readTime: '7 min read', featured: false },
  { slug: 'vitalcaring-case-hidden-liabilities', title: 'The VitalCaring Case: Hidden Liabilities That Cost Buyers 43% of Profits', description: 'Hidden debt and legal traps in healthcare acquisitions.', category: 'Horror Stories', date: '2024-01-10', readTime: '9 min read', featured: false },
  { slug: 'infogrid-vs-aquicore-fake-revenue', title: 'Infogrid vs Aquicore: When Sellers Triple Fake Revenue to Close Deals', description: 'Anatomy of revenue overstatement.', category: 'Horror Stories', date: '2024-01-08', readTime: '11 min read', featured: false },
  { slug: 'hong-kong-virtual-office-scam', title: 'How a "Legitimate" Supplier in HK Turned Out to be a Virtual Office', description: 'Verifying physical presence in international trade.', category: 'Horror Stories', date: '2024-01-07', readTime: '6 min read', featured: false },
  { slug: 'save-mart-arbitration-earn-out-gamesmanship', title: 'The Save Mart Arbitration: Why Earn-Out Gamesmanship Cost $70M', description: 'The hidden risks in deal structuring.', category: 'Horror Stories', date: '2024-01-06', readTime: '10 min read', featured: false },
  { slug: 'brooge-energy-anatomy-of-revenue-overstatement', title: 'Brooge Energy: Anatomy of an 80% Revenue Overstatement SPAC Fraud', description: 'A deeper look at public market vs private due diligence.', category: 'Horror Stories', date: '2024-01-05', readTime: '13 min read', featured: false },
  { slug: 'meta-due-diligence-failures', title: 'When the Due Diligence Firm Itself is a Fraud: Meta-Failures', description: 'How to verify your advisors.', category: 'Horror Stories', date: '2024-01-04', readTime: '8 min read', featured: false },

  // CATEGORY B: HOW-TO GUIDES
  { slug: 'verify-company-5-minutes', title: 'How to Verify a Company is Legitimate in Under 5 Minutes', description: 'A practical, technical guide for procurement teams.', category: 'Guide', date: '2024-01-03', readTime: '5 min read', featured: false },
  { slug: 'pre-acquisition-screening-checklist', title: 'The Pre-Acquisition Screening Checklist: Kill Bad Deals in 48 Hours', description: 'Efficiency protocol for searchers.', category: 'Guide', date: '2024-01-02', readTime: '6 min read', featured: false },
  { slug: 'shell-company-detection-10-red-flags', title: 'How to Check if a Company is a Shell Company: 10 Red Flags', description: 'Industrial-grade detection methods.', category: 'Guide', date: '2024-01-01', readTime: '8 min read', featured: false },
  { slug: 'verify-international-suppliers-country-guide', title: 'Verifying International Suppliers: A Country-by-Country Guide', description: 'Covering 35+ jurisdictions.', category: 'Guide', date: '2023-12-30', readTime: '20 min read', featured: false },
  { slug: 'detect-revenue-fraud-small-business', title: 'How to Detect Revenue Fraud When Buying a Small Business', description: 'Forensic methods for private deals.', category: 'Guide', date: '2023-12-28', readTime: '15 min read', featured: false },
  { slug: 'phantom-customer-detection-round-tripping', title: 'Phantom Customer Detection: How to Spot Round-Tripped Cash', description: 'Advanced cash flow analysis.', category: 'Guide', date: '2023-12-25', readTime: '8 min read', featured: false },
  { slug: 'verify-bill-of-lading-real', title: 'How to Verify a Bill of Lading is Real (Trade Finance Security)', description: 'Ship tracking and doc verification.', category: 'Guide', date: '2023-12-23', readTime: '6 min read', featured: false },
  { slug: '3-step-company-check-before-lawyer', title: 'The 3-Step Company Check Anyone Can Do (Before Hiring a Lawyer)', description: 'Save on legal fees by screening early.', category: 'Guide', date: '2023-12-21', readTime: '4 min read', featured: false },
  { slug: 'credit-check-private-company-cheap', title: 'How to Run a Credit Check on a Private Company (Without Spending $500)', description: 'Affordable risk data sources.', category: 'Guide', date: '2023-12-19', readTime: '7 min read', featured: false },
  { slug: 'kyb-compliance-2025-automation', title: 'KYB Compliance in 2025: Automating Know Your Business Verification', description: 'Future-proofing your onboarding.', category: 'Guide', date: '2023-12-17', readTime: '10 min read', featured: false },

  // CATEGORY C: INDUSTRY DEEP DIVES
  { slug: 'commodity-trading-due-diligence-guide', title: 'Commodity Trading Due Diligence: Checking Counterparties', description: 'Oil, metals, and agri-trader protocols.', category: 'Industry', date: '2023-12-15', readTime: '9 min read', featured: false },
  { slug: 'freight-forwarder-verification-8-checks', title: 'Freight Forwarder Verification: 8 Checks Before Shipping', description: 'Preventing logistics scams.', category: 'Industry', date: '2023-12-14', readTime: '7 min read', featured: false },
  { slug: 'procurement-fraud-prevention-manager-protocol', title: 'Procurement Fraud Prevention: The Manager\'s Protocol', description: 'Building a secure supply chain.', category: 'Industry', date: '2023-12-12', readTime: '11 min read', featured: false },
  { slug: 'private-equity-red-flag-screening-pre-data-room', title: 'Private Equity Red Flag Screening: What to Check Before the Data Room', description: 'Pre-LOI targets.', category: 'Industry', date: '2023-12-10', readTime: '8 min read', featured: false },
  { slug: 'trade-finance-fraud-prevention-ai-vs-manual', title: 'Trade Finance Fraud Prevention: AI Tools vs. Manual Checking', description: 'Evolving trade security.', category: 'Industry', date: '2023-12-08', readTime: '10 min read', featured: false },
  { slug: 'family-office-investment-screening', title: 'Family Office Investment Screening: Competing with Institutional Diligence', description: 'Small team advantage.', category: 'Industry', date: '2023-12-06', readTime: '9 min read', featured: false },
  { slug: 'logistics-provider-verification-double-brokerage', title: 'Logistics Provider Verification: Detecting Double-Brokerage Scams', description: 'Carrier security.', category: 'Industry', date: '2023-12-04', readTime: '8 min read', featured: false },
  { slug: 'cryptocurrency-exchange-kyb-partners', title: 'Cryptocurrency Exchange Due Diligence: KYB for Partners', description: 'Digital asset security.', category: 'Industry', date: '2023-12-02', readTime: '10 min read', featured: false },
  { slug: 'real-estate-reit-verification-counterparties', title: 'Real Estate Investment Trust Verification: Checking Counterparties', description: 'Property deal risk.', category: 'Industry', date: '2023-11-30', readTime: '9 min read', featured: false },
  { slug: 'emerging-market-due-diligence-playbook', title: 'Emerging Market Due Diligence: High-Risk Country Playbook', description: 'Global risk navigation.', category: 'Industry', date: '2023-11-28', readTime: '12 min read', featured: false },

  // CATEGORY D: ROI & COST
  { slug: 'why-due-diligence-costs-25k', title: 'Why Full Due Diligence Costs £25,000 (And How to Pre-Screen for £20)', description: 'The economics of search funds.', category: 'ROI', date: '2023-11-25', readTime: '7 min read', featured: false },
  { slug: '90-percent-cost-reduction-procurement-automation', title: 'The 90% Cost Reduction: Automating Vendor Verification', description: 'Efficiency in procurement.', category: 'ROI', date: '2023-11-22', readTime: '6 min read', featured: false },
  { slug: 'due-diligence-cost-calculator-manual-vs-ai', title: 'Due Diligence Cost Calculator: Manual vs. AI-Powered', description: 'Interactive math for CFOs.', category: 'ROI', date: '2023-11-20', readTime: '5 min read', featured: false },
  { slug: 'small-pe-firms-vs-kkr-level-diligence', title: 'How Small PE Firms Can Compete with KKR-Level Diligence', description: 'Democratizing data.', category: 'ROI', date: '2023-11-18', readTime: '8 min read', featured: false },
  { slug: 'hidden-cost-of-not-verifying-145k-loss', title: 'The Hidden Cost of NOT Verifying: $145k Average Fraud Loss', description: 'Risk of ignorance.', category: 'ROI', date: '2023-11-15', readTime: '10 min read', featured: false },
  { slug: 'red-flag-due-diligence-kill-fast-strategy', title: 'Red Flag Due Diligence: The "Kill Fast" Strategy That Saves Millions', description: 'Portfolio management at speed.', category: 'ROI', date: '2023-11-12', readTime: '7 min read', featured: false },
  { slug: 'evaluate-50-percent-more-deals-without-headcount', title: 'How to Evaluate 50% More Deals Without Adding Headcount', description: 'Scaling deal flow.', category: 'ROI', date: '2023-11-10', readTime: '6 min read', featured: false },
  { slug: 'ai-vs-intern-manual-research-cost', title: 'AI vs. Intern: The True Cost of Manual Company Research', description: 'Speed vs sweat equity.', category: 'ROI', date: '2023-11-08', readTime: '5 min read', featured: false },
  { slug: 'the-19-99-due-diligence-report-whats-missing', title: 'The £19.99 Due Diligence Report: What\'s Missing vs. Full Diligence?', description: 'Defensive pricing analysis.', category: 'ROI', date: '2023-11-05', readTime: '8 min read', featured: false },
  { slug: 'calculating-roi-pre-acquisition-screening', title: 'Calculating ROI on Pre-Acquisition Screening Tools', description: 'Hard numbers for committees.', category: 'ROI', date: '2023-11-01', readTime: '6 min read', featured: false },

  // CATEGORY E: TECHNICAL AUTHORITY
  { slug: 'ubo-verification-2025-guide', title: 'Understanding Ultimate Beneficial Ownership (UBO) in 2025', description: 'Peeling back corporate layers.', category: 'Technical', date: '2023-10-28', readTime: '14 min read', featured: false },
  { slug: 'psychology-of-business-fraud-smart-people', title: 'The Psychology of Business Fraud: Why Smart People Fall for Scams', description: 'Cognitive biases in M&A.', category: 'Technical', date: '2023-10-25', readTime: '9 min read', featured: false },
  { slug: 'benfords-law-financial-fraud-detection', title: 'Benford\'s Law and Financial Statement Fraud Detection', description: 'Mathematical patterns in earnings.', category: 'Technical', date: '2023-10-22', readTime: '8 min read', featured: false },
  { slug: 'whois-data-for-due-diligence-domain-secrets', title: 'WHOIS Data for Due Diligence: What Domain Records Reveal', description: 'Digital footprint analysis.', category: 'Technical', date: '2023-10-20', readTime: '7 min read', featured: false },
  { slug: 'sanctions-screening-ofac-un-eu-traders', title: 'Sanctions Screening 101: OFAC, UN, and EU List Checking', description: 'Global compliance for traders.', category: 'Technical', date: '2023-10-18', readTime: '11 min read', featured: false },
  { slug: 'metadata-approach-document-forgery-trade-finance', title: 'The Metadata Approach: How AI Detects Document Forgery', description: 'Beyond OCR.', category: 'Technical', date: '2023-10-15', readTime: '10 min read', featured: false },
  { slug: 'behavioral-biometrics-b2b-fraud-detection', title: 'Behavioral Biometrics in B2B Fraud Detection', description: 'Beyond KYC.', category: 'Technical', date: '2023-10-12', readTime: '9 min read', featured: false },
  { slug: 'graph-ai-due-diligence-hidden-networks', title: 'Graph AI in Due Diligence: Mapping Hidden Corporate Networks', description: 'Visualizing shell webs.', category: 'Technical', date: '2023-10-10', readTime: '12 min read', featured: false },

  // CATEGORY F: COMPARISONS
  { slug: 'redflags-ai-vs-traditional-credit-reports', title: 'RedFlags AI vs. Traditional Credit Reports: When to Use Which', description: 'Fraud vs Credit risk.', category: 'Comparison', date: '2023-10-05', readTime: '6 min read', featured: false },
  { slug: 'datasite-vs-pre-screening-tools', title: 'Datasite vs. Pre-Screening Tools: Do You Need Both?', description: 'Complementary tech stack.', category: 'Comparison', date: '2023-10-02', readTime: '5 min read', featured: false },
  { slug: 'dun-bradstreet-alternative-real-time-verification', title: 'Dun & Bradstreet Alternative: Real-Time for Under £20', description: 'Modernizing verification.', category: 'Comparison', date: '2023-09-30', readTime: '7 min read', featured: false },
  { slug: 'ai-due-diligence-tools-compared-keye-toltiq', title: 'AI Due Diligence Tools Compared: Keye vs. ToltIQ vs. RedFlags AI', description: 'Feature shootout.', category: 'Comparison', date: '2023-09-25', readTime: '10 min read', featured: false },
  { slug: 'diy-due-diligence-vs-automated-platforms', title: 'DIY Due Diligence vs. Automated Platforms: A Buyer\'s Guide', description: 'Build vs Buy.', category: 'Comparison', date: '2023-09-20', readTime: '8 min read', featured: false },
  { slug: 'lexisnexis-vs-instant-verification-apis', title: 'When to Use LexisNexis vs. Instant Verification APIs', description: 'Professional vs Programmatic.', category: 'Comparison', date: '2023-09-15', readTime: '9 min read', featured: false },
];

const BlogIndex: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const featuredPosts = blogPosts.filter(p => p.featured);
  const regularPosts = blogPosts.filter(p => {
    if (activeCategory) return p.category === activeCategory && !p.featured;
    return !p.featured;
  });

  const categories = Array.from(new Set(blogPosts.map(p => p.category)));

  return (
    <>
      <Helmet>
        <title>RedFlags AI Blog | Fraud Prevention & Pre-Due Diligence Insights</title>
        <meta name="description" content="Expert guides on verifying companies, detecting shell companies, and stopping M&A fraud. Learn the 'Kill Fast' strategy for due diligence." />
        <meta name="keywords" content="verify company, fraud prevention blog, due diligence strategy, shell company red flags, M&A risk management" />
        <link rel="canonical" href="https://redflag.ai/blog" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 tracking-tight">Blog & Expert Resources</h1>
              <p className="text-xl text-muted-foreground">
                Stop fraud before it starts. The pre-due diligence playbook for the modern acquirer.
              </p>
            </div>

            {/* Featured Posts */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">High-Priority Insights</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <Card key={post.slug} className="hover:shadow-lg transition-all border-primary/10 hover:border-primary/30">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                      <CardTitle className="text-lg leading-tight">
                        <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{post.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Posts */}
            <div>
              <div className="md:flex md:items-center md:justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Explore the Ecosystem</h2>
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${!activeCategory ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'}`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {regularPosts.map((post) => (
                  <Card key={post.slug} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">{post.category}</Badge>
                            <span className="text-sm text-muted-foreground">{post.readTime}</span>
                          </div>
                          <Link to={`/blog/${post.slug}`} className="group">
                            <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2">{post.description}</p>
                          </Link>
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="mt-4 md:mt-0 md:ml-6 flex items-center text-primary font-medium hover:underline whitespace-nowrap"
                        >
                          Read guide <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Strategy Sidebar Teaser */}
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-zinc-900 rounded-2xl border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">Kill Bad Deals Fast</h3>
                <p className="text-zinc-400 mb-6 font-mono text-sm">
                  Pre-due diligence isn't about finding the perfect deal. It's about eliminating
                  the 95% of scams, shell companies, and fraudulent sellers in the first 48 hours.
                </p>
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800" asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </div>
              <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10">
                <h3 className="text-xl font-bold mb-4">Democratizing Due Diligence</h3>
                <p className="text-muted-foreground mb-6 text-sm italic">
                  "We used RedFlags AI to screen 40 suppliers in three days. Our previous
                  manual process would have taken months and likely missed the two
                  high-risk shell companies the AI flagged instantly."
                </p>
                <p className="text-xs font-bold">— Head of Procurement, Global Agri-Trade</p>
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="mt-16 p-12 bg-zinc-50 rounded-2xl text-center border border-zinc-100">
              <h2 className="text-3xl font-bold mb-4">Join the Fraud-Free Network</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Get high-priority fraud alerts and M&A due diligence strategies
                delivered to your inbox every Tuesday. No fluff, just red flags.
              </p>
              <div className="flex max-w-md mx-auto gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md">
                  Join
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogIndex;
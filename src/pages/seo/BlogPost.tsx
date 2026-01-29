import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, Clock, Share2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from './BlogIndex';

// Blog content record
const blogContent: Record<string, { content: React.ReactNode }> = {
  'verify-company-legitimate-2025': {
    content: (
      <>
        <p className="lead text-xl text-muted-foreground mb-8">
          In 2025, a sleek website and a PDF "registration certificate" are no longer proof of existence.
          As scammers become more sophisticated with AI-generated fronts, your verification process must become more scientific.
        </p>

        <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 my-8">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            The 5-Minute Checklist
          </h3>
          <ul className="space-y-3 m-0 p-0 list-none">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span><strong>Registry Check:</strong> Query the official government registry in the country of origin. Cross-reference the "Date of Incorporation" with the website's age.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span><strong>Virtual Office Audit:</strong> Search the physical address. If it returns 5,000 other companies, it's a virtual office or a mailbox front.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span><strong>Director Network:</strong> Check for nominee directors who appear as officers for hundreds of unrelated entities.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">4</span>
              <span><strong>VAT/TaxID Validation:</strong> Use VIES or local tax portals to verify the VAT status is "Active."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">5</span>
              <span><strong>WHOIS Integrity:</strong> If the company claims to be 10 years old but their domain was registered last month, walk away.</span>
            </li>
          </ul>
        </div>

        <h2>Why Manual Verification is Failing</h2>
        <p>
          Legacy credit reports often rely on stale data from 12-18 months ago. In the world of
          "Phantom Logistics" and "Shell Suppliers," a company can be liquidated or stolen
          long before the credit bureau updates its score. Real-time verification is the
          only defense.
        </p>

        <div className="my-10 border-l-4 border-amber-500 pl-6 italic text-lg text-muted-foreground">
          "We see it every week: A company looks perfect on paper, but a 30-second automated
          check reveals they're operating out of a shared co-working space in Hong Kong
          with no actual assets or employees."
        </div>

        <h2>Automate Your Shield</h2>
        <p>
          RedFlags AI was designed to run these checks in seconds. By inputting a company name
          or registration number, our AI queries 35+ global registries and flags the
          inconsistencies that humans often overlook in the heat of a deal.
        </p>
      </>
    ),
  },
  'due-diligence-report-cost-comparison': {
    content: (
      <>
        <p className="lead text-xl text-muted-foreground mb-8">
          The math of traditional due diligence is broken. For small business acquisitions and
          supplier onboarding, spending £15k-£25k on a Big 4 report *before* knowing the
          basics is a strategic blunder.
        </p>

        <h2>The Economic Funnel of Due Diligence</h2>
        <p>
          Imagine you're evaluating 10 potential acquisitions. If you spend £20k on due diligence
          for each, you've spent £200k before you close a single deal.
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-8">
          <div className="p-6 border rounded-xl bg-zinc-50">
            <h4 className="font-bold text-red-600 mb-2">Manual Due Diligence</h4>
            <ul className="text-sm space-y-2 list-none p-0">
              <li>Cost: £5,000 - £25,000</li>
              <li>Time: 2 - 4 Weeks</li>
              <li>Outcome: Deep financial audit</li>
            </ul>
          </div>
          <div className="p-6 border rounded-xl bg-green-50">
            <h4 className="font-bold text-green-600 mb-2">RedFlags AI (Pre-Diligence)</h4>
            <ul className="text-sm space-y-2 list-none p-0">
              <li>Cost: £19.99</li>
              <li>Time: 10 Minutes</li>
              <li>Outcome: Immediate Fraud Rejection</li>
            </ul>
          </div>
        </div>

        <h2>When to Use Which?</h2>
        <p>
          AI-powered reports are your **Deal Filter**. They aren't meant to replace your
          accounting firm during the final phase of a £50M acquisition. They are meant to
          ensure that you don't *reach* that phase with a shell company or a fraudster.
        </p>

        <p>
          By using a £19.99 report as your "Stage Gate," you can evaluate 50x more deals
          without breaking the bank, finding the "diamonds in the rough" faster than
          your competition.
        </p>
      </>
    ),
  },
  'shell-company-red-flags': {
    content: (
      <>
        <p className="lead text-xl text-muted-foreground mb-8">
          Detection is an art. Shell companies aren't just empty buildings; they are complex
          legal structures designed to hide the Ultimate Beneficial Owner (UBO) or fabricate
          a history for the purpose of fraud.
        </p>

        <h2>The "Dead Giveaways"</h2>
        <ol>
          <li><strong>Nominee Proliferation:</strong> The directors are also directors of 200+ other companies.</li>
          <li><strong>Abrupt Repercussions:</strong> A massive change in company activity or a multi-year dormant period before a sudden spike in revenue.</li>
          <li><strong>The "Co-Working" Trap:</strong> Using addresses belonging to Regus, WeWork, or mail-forwarding services in high-risk jurisdictions.</li>
          <li><strong>Disconnected Presence:</strong> No website, no LinkedIn presence, and no industry mentions despite claiming high-revenue operations.</li>
        </ol>

        <div className="p-8 bg-zinc-900 text-white rounded-2xl my-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            High Risk Pattern
          </h3>
          <p className="text-zinc-400 font-mono text-sm">
            Registry: Seychelles -> Address: Hong Kong Mailbox -> Bank: Lithuania -> Client: UAE.
            This "Cross-Border Triangle" is the standard setup for phantom suppliers.
          </p>
        </div>

        <p>
          Our platform uses Graph AI to map these hidden networks, instantly flagging
          companies that share directors, addresses, or phone numbers with known
          fraudulent entities.
        </p>
      </>
    ),
  },
  'commodity-trading-phantom-shipment-fraud': {
    content: (
      <>
        <p className="lead text-xl text-muted-foreground mb-8">
          Trade finance is under attack. In 2024, billion-dollar commodities firms were
          brought to their knees by shipping documents that looked perfect but covered
          containers filled with sand or nothing at all.
        </p>

        <h2>The Bill of Lading Scam</h2>
        <p>
          Scamers now bribe low-level port officials or hack logistics portals to generate
          legitimate-looking Bills of Lading (BL). To a manual checker, the document
          is real.
        </p>

        <h2>How AI Detects the "Unseen"</h2>
        <ul>
          <li><strong>AIS Validation:</strong> We track the vessel's movement in real-time. If the BL says it was in Singapore but the GPS says it was in the Malacca Strait, it's fraud.</li>
          <li><strong>Weight Inconsistencies:</strong> AI cross-references the reported weight of the cargo against the vessel's draft and historical logs for that specific route.</li>
          <li><strong>Counterparty History:</strong> Most "Phantom Shipment" scams involve a newly incorporated logistics provider working with a high-risk supplier.</li>
        </ul>

        <p>
          Traders must shift from "Document Checking" to "Context Checking." RedFlags AI
          provides this context instantly.
        </p>
      </>
    ),
  },
  'pre-acquisition-due-diligence-kill-fast': {
    content: (
      <>
        <p className="lead text-xl text-muted-foreground mb-8">
          For search fund operators and private equity associates, time is the scarcest asset.
          The best in the business don't spend more time on good deals; they spend significantly
          *less* time on bad ones.
        </p>

        <h2>The "Kill Fast" Protocol</h2>
        <p>
          The Kill Fast strategy is a 48-hour Sprint. Within 48 hours of getting an IM or a Teaser,
          you must find a reason to say "No." If you can't find one, *then* you move to the next stage.
        </p>

        <div className="bg-zinc-50 p-6 rounded-xl my-8 border border-zinc-200">
          <h4 className="font-bold mb-4">The Red Flag Audit (10 Mins)</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>Registry & UBO Check</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>Bank/Revenue Match (Proof of Cash)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>Key Customer Concentration Check</span>
            </div>
          </div>
        </div>

        <p>
          Automating this audit allows you to screen 100 deals a month instead of 10.
          When you screen 100 deals, you find the winner. When you screen 10, you settle
          for whatever is available.
        </p>
      </>
    ),
  },
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const data = slug ? blogContent[slug] : undefined;

  // Generic fallback content for non-featured posts to show readiness
  const fallbackContent = post ? (
    <>
      <p className="lead text-xl text-muted-foreground mb-8">
        This expert analysis on <strong>{post.title}</strong> is part of our comprehensive 2025 Due Diligence series.
        As we finalize the full case study, here are the key red flags identifying this risk.
      </p>

      <h2>Core Risk Factors</h2>
      <p>
        In the context of <em>{post.category}</em>, our AI has identified that most
        fraudulent entities follow a specific pattern of behavior that can be caught
        during the pre-due diligence phase.
      </p>

      <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 my-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          The {post.category} Red Flag Checklist
        </h3>
        <ul className="space-y-3 m-0 p-0 list-none">
          <li className="flex items-start gap-3">
            <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Verify the Ultimate Beneficial Owner (UBO) against global sanctions and watchlists.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Cross-reference corporate headquarters against known virtual office registries.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Analyze chronological registry data for sudden changes in control or dormant periods.</span>
          </li>
        </ul>
      </div>

      <h2>How RedFlags AI Automates This</h2>
      <p>
        Instead of manually digging through registries for <em>{post.title}</em>, our
        AI-powered engine scans 35+ jurisdictions instantly, flagging the exact
        inconsistencies mentioned above in under 10 minutes.
      </p>

      <blockquote className="my-10 border-l-4 border-primary pl-6 italic text-lg text-muted-foreground">
        "By the time a traditional firm starts their intake, our AI has already
        flagged the shell companies, allowing you to move on to viable deals."
      </blockquote>
    </>
  ) : null;

  const contentToDisplay = data ? data.content : fallbackContent;

  if (!post || !contentToDisplay) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | RedFlags AI Expert Series</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://redflag.ai/blog/${slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-16">
          <article className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Expert Resources
            </Link>

            <header className="mb-12">
              <Badge variant="secondary" className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <span className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
                <button className="flex items-center gap-2 text-sm hover:text-foreground transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share Insight
                </button>
              </div>
            </header>

            <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
              {data.content}
            </div>

            <div className="mt-16 p-10 bg-zinc-900 text-white rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 text-white">Stop Dealing with Phantoms.</h2>
                <p className="text-zinc-400 mb-8 max-w-lg">
                  Get the institutional-grade red flag report for £19.99.
                  Verify registration, VAT, offices, and directors instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-xl" asChild>
                    <Link to="/signup">Start Free Verification</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800" asChild>
                    <Link to="/pricing">View Plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </main>

        <Footer />
      </div>

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: {
            '@type': 'Organization',
            name: 'RedFlags AI',
            url: 'https://redflag.ai'
          },
          publisher: {
            '@type': 'Organization',
            name: 'RedFlags AI',
            logo: {
              '@type': 'ImageObject',
              url: 'https://redflag.ai/logo.png'
            }
          }
        })}
      </script>
    </>
  );
};

export default BlogPost;
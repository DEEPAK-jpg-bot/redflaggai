import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, Clock, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from './BlogIndex';

// Blog content - in production this would come from a CMS
const blogContent: Record<string, { content: React.ReactNode }> = {
  'what-is-quality-of-earnings': {
    content: (
      <>
        <p className="lead text-xl text-muted-foreground mb-8">
          A Quality of Earnings (QoE) report is an essential due diligence tool that goes beyond 
          standard financial statements to reveal the true financial health of an acquisition target.
        </p>
        
        <h2>What Does a QoE Report Analyze?</h2>
        <p>
          A comprehensive Quality of Earnings analysis examines several key areas to validate 
          the sustainability and accuracy of a company's reported earnings:
        </p>
        <ul>
          <li><strong>Revenue Quality</strong> - Verifying that reported revenue is real, recurring, and sustainable</li>
          <li><strong>EBITDA Adjustments</strong> - Identifying owner perks and personal expenses to calculate True Adjusted EBITDA</li>
          <li><strong>Working Capital Requirements</strong> - Analyzing the cash needed to run day-to-day operations</li>
          <li><strong>Customer Concentration</strong> - Assessing risk from over-reliance on key customers</li>
          <li><strong>Expense Normalization</strong> - Separating one-time expenses from recurring costs</li>
        </ul>

        <h2>Why QoE Reports Matter for Acquisitions</h2>
        <p>
          When acquiring a business, the purchase price is typically based on a multiple of EBITDA. 
          A QoE report helps buyers:
        </p>
        <ol>
          <li>Validate that seller-reported EBITDA is accurate and sustainable</li>
          <li>Identify add-backs that increase the True Adjusted EBITDA</li>
          <li>Discover red flags that could affect the business post-acquisition</li>
          <li>Negotiate better deal terms based on findings</li>
          <li>Satisfy lender requirements for SBA or bank financing</li>
        </ol>

        <h2>Traditional QoE vs. Automated Analysis</h2>
        <p>
          Traditional QoE reports from accounting firms provide thorough analysis but come with 
          significant costs and timeline requirements:
        </p>
        <table className="w-full border-collapse my-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Factor</th>
              <th className="text-left py-2 px-4">Traditional QoE</th>
              <th className="text-left py-2 px-4">Automated (RedFlag.ai)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">Timeline</td>
              <td className="py-2 px-4">2-4 weeks</td>
              <td className="py-2 px-4">10 minutes</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Cost</td>
              <td className="py-2 px-4">$15,000 - $50,000</td>
              <td className="py-2 px-4">From $495/month</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Best For</td>
              <td className="py-2 px-4">Final due diligence</td>
              <td className="py-2 px-4">Deal screening</td>
            </tr>
          </tbody>
        </table>

        <h2>Key Takeaways</h2>
        <p>
          A Quality of Earnings report is not optional for serious acquirers. Use automated tools 
          like RedFlag.ai for preliminary screening, then engage traditional QoE providers for 
          deals that pass initial due diligence.
        </p>
      </>
    ),
  },
  'ebitda-addbacks-search-funds': {
    content: (
      <>
        <p className="lead text-xl text-muted-foreground mb-8">
          Search fund operators often underestimate True Adjusted EBITDA because they miss 
          legitimate add-backs. Here are the top five most commonly overlooked adjustments.
        </p>

        <h2>1. Owner Compensation Above Market Rate</h2>
        <p>
          Many small business owners pay themselves well above market rate for their role. 
          If the owner pays themselves $300,000 but a replacement GM would cost $150,000, 
          the $150,000 difference should be added back to EBITDA.
        </p>

        <h2>2. Family Members on Payroll</h2>
        <p>
          It's common for spouses, children, or relatives to be on payroll with little or no 
          actual work contribution. These salaries and associated benefits are add-backs.
        </p>

        <h2>3. Personal Vehicle Expenses</h2>
        <p>
          Luxury vehicles used primarily for personal purposes, along with associated fuel, 
          insurance, and maintenance costs, should be added back. Look for high-end brands 
          like Mercedes, BMW, Tesla Model S/X, and especially exotic cars.
        </p>

        <h2>4. Travel and Entertainment</h2>
        <p>
          Vacation travel disguised as "conferences" or "client meetings" is extremely common. 
          Look for:
        </p>
        <ul>
          <li>Resort and vacation destinations</li>
          <li>Theme park entries</li>
          <li>Cruise lines</li>
          <li>Expensive restaurant charges in vacation cities</li>
        </ul>

        <h2>5. Professional Services for Personal Use</h2>
        <p>
          This includes personal legal work, personal financial planning, and personal insurance 
          premiums being paid through the business.
        </p>

        <h2>How RedFlag.ai Helps</h2>
        <p>
          Our AI-powered analysis automatically scans expense ledgers for these patterns, 
          flagging likely personal expenses and calculating their impact on Adjusted EBITDA. 
          This gives you negotiation leverage and a clearer picture of the business's true 
          earning power.
        </p>
      </>
    ),
  },
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const content = slug ? blogContent[slug] : undefined;

  if (!post || !content) {
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
        <title>{post.title} | RedFlag.ai Blog</title>
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
            {/* Back Link */}
            <Link 
              to="/blog" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-12">
              <Badge variant="secondary" className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {content.content}
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-primary/5 rounded-2xl text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to analyze your next deal?</h2>
              <p className="text-muted-foreground mb-6">
                Get AI-powered red flag detection in minutes, not weeks.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">Start Your Free Trial</Link>
              </Button>
            </div>
          </article>
        </main>

        <Footer />
      </div>

      {/* Article Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: {
            '@type': 'Organization',
            name: 'RedFlag.ai',
          },
        })}
      </script>
    </>
  );
};

export default BlogPost;
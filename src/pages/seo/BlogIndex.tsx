import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const blogPosts = [
  {
    slug: 'what-is-quality-of-earnings',
    title: 'What is a Quality of Earnings Report? Complete Guide for 2024',
    description: 'Learn everything about QoE reports: what they analyze, why they matter for M&A, and how to interpret the findings for smarter acquisition decisions.',
    category: 'Education',
    date: '2024-01-15',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'ebitda-addbacks-search-funds',
    title: 'Top 5 EBITDA Add-backs Search Funders Often Miss',
    description: 'Common owner perks and personal expenses that should be added back when calculating True Adjusted EBITDA for small business valuations.',
    category: 'Due Diligence',
    date: '2024-01-10',
    readTime: '6 min read',
    featured: true,
  },
  {
    slug: 'proof-of-cash-explained',
    title: 'The Role of Proof of Cash in Small Business Acquisitions',
    description: 'How reconciling bank deposits to booked revenue catches revenue recognition issues, fictitious sales, and cash diversion in acquisition targets.',
    category: 'Due Diligence',
    date: '2024-01-05',
    readTime: '5 min read',
    featured: false,
  },
  {
    slug: 'why-qoe-takes-3-weeks',
    title: 'Why Traditional QoE Reports Take 3 Weeks (and How to Get One in 10 Minutes)',
    description: 'Breaking down the traditional QoE process and how AI-powered analysis delivers comparable red flag detection at a fraction of the time and cost.',
    category: 'Industry Insights',
    date: '2024-01-01',
    readTime: '7 min read',
    featured: true,
  },
  {
    slug: 'customer-concentration-risk',
    title: 'Customer Concentration Risk: The Silent Deal Killer',
    description: 'How to identify and assess customer concentration in acquisition targets, and what thresholds should trigger deeper due diligence.',
    category: 'Risk Analysis',
    date: '2023-12-28',
    readTime: '5 min read',
    featured: false,
  },
  {
    slug: 'working-capital-pegs',
    title: 'Understanding Working Capital Pegs in SBA and M&A Transactions',
    description: 'A practical guide to working capital adjustments, how they affect deal pricing, and common negotiation strategies for buyers and sellers.',
    category: 'Deal Structure',
    date: '2023-12-20',
    readTime: '6 min read',
    featured: false,
  },
];

const BlogIndex: React.FC = () => {
  const featuredPosts = blogPosts.filter(p => p.featured);
  const regularPosts = blogPosts.filter(p => !p.featured);

  return (
    <>
      <Helmet>
        <title>Quality of Earnings & Due Diligence Blog | RedFlag.ai</title>
        <meta name="description" content="Expert insights on Quality of Earnings analysis, EBITDA adjustments, M&A due diligence, and search fund best practices. Learn to evaluate acquisitions smarter." />
        <meta name="keywords" content="quality of earnings blog, QoE guide, M&A due diligence tips, EBITDA adjustments, search fund resources" />
        <link rel="canonical" href="https://redflag.ai/blog" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Blog & Resources</h1>
              <p className="text-xl text-muted-foreground">
                Expert insights on Quality of Earnings, due diligence, and M&A best practices
              </p>
            </div>

            {/* Featured Posts */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <Card key={post.slug} className="hover:shadow-lg transition-shadow">
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
              <h2 className="text-2xl font-bold mb-6">All Articles</h2>
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
                            <p className="text-muted-foreground">{post.description}</p>
                          </Link>
                        </div>
                        <Link 
                          to={`/blog/${post.slug}`} 
                          className="mt-4 md:mt-0 md:ml-6 flex items-center text-primary hover:underline"
                        >
                          Read more <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="mt-16 p-8 bg-primary/5 rounded-2xl text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Get the latest insights on M&A due diligence and search fund best practices 
                delivered to your inbox.
              </p>
              <div className="flex max-w-md mx-auto gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Subscribe
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
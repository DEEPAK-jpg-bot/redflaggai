import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <AlertTriangle className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">RedFlag.ai</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Automated Quality of Earnings analysis for Search Funds and PE Investors.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/alternatives" className="hover:text-foreground transition-colors">Alternatives</Link></li>
              <li><Link to="/signup" className="hover:text-foreground transition-colors">Start Free Trial</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Industries</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/industries/hvac" className="hover:text-foreground transition-colors">HVAC</Link></li>
              <li><Link to="/industries/saas" className="hover:text-foreground transition-colors">SaaS</Link></li>
              <li><Link to="/industries/dental-practice" className="hover:text-foreground transition-colors">Dental</Link></li>
              <li><Link to="/industries/ecommerce" className="hover:text-foreground transition-colors">E-commerce</Link></li>
              <li><Link to="/industries" className="hover:text-foreground transition-colors">View All →</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/tools" className="hover:text-foreground transition-colors">Free Tools</Link></li>
              <li><Link to="/tools/ebitda-calculator" className="hover:text-foreground transition-colors">EBITDA Calculator</Link></li>
              <li><Link to="/tools/valuation-calculator" className="hover:text-foreground transition-colors">Valuation Calculator</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/solutions" className="hover:text-foreground transition-colors">Solutions</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              <li><a href="mailto:support@redflag.ai" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RedFlag.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

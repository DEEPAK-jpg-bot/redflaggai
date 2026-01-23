import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Eye } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-32">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">Trusted by 500+ Search Funds</span>
          </div>
          
          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Don't Buy a{' '}
            <span className="relative">
              <span className="relative z-10 text-destructive">Lemon</span>
              <span className="absolute bottom-2 left-0 h-3 w-full bg-destructive/20 -rotate-1" />
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Automated Financial Due Diligence in 10 Minutes. 
            Upload financials, detect fraud, and get your Quality of Earnings report instantly.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link to="/signup">
                Start Free Scan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <Link to="/login">
                View Demo Report
              </Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm">10-Minute Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="text-sm">100+ Fraud Signals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

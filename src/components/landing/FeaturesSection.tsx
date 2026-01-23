import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileSearch, 
  TrendingDown, 
  AlertTriangle, 
  Calculator,
  Clock,
  FileText
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'Revenue Verification',
    description: 'Cross-reference accounting ledgers with actual bank deposits to catch revenue inflation.',
  },
  {
    icon: TrendingDown,
    title: 'Customer Churn Detection',
    description: 'Identify at-risk customers and declining revenue streams before you close.',
  },
  {
    icon: AlertTriangle,
    title: 'Personal Expense Detection',
    description: 'AI-powered scanning for lifestyle expenses hidden as business costs.',
  },
  {
    icon: Calculator,
    title: 'Adjusted EBITDA',
    description: 'See the true earnings after removing owner add-backs and one-time expenses.',
  },
  {
    icon: Clock,
    title: '10-Minute Analysis',
    description: 'What takes accountants weeks, we do in minutes with institutional-grade accuracy.',
  },
  {
    icon: FileText,
    title: 'PDF Reports',
    description: 'Professional Quality of Earnings reports ready to share with investors and lenders.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-secondary/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything You Need for Pre-Acquisition Due Diligence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stop flying blind. RedFlag.ai catches the issues that kill deals.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

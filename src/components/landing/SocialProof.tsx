import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Michael Chen',
    role: 'Search Fund Principal',
    company: 'Alpine Capital',
    content: 'RedFlag caught $200K in personal expenses the seller had buried in the books. Saved our deal.',
    initials: 'MC',
  },
  {
    name: 'Sarah Martinez',
    role: 'VP, Due Diligence',
    company: 'Blackstone Growth',
    content: 'We use RedFlag as our first-pass screen. It cuts our preliminary analysis time by 80%.',
    initials: 'SM',
  },
  {
    name: 'David Thompson',
    role: 'Managing Partner',
    company: 'Main Street Capital',
    content: 'The customer churn analysis alone is worth the subscription. Found concentration risk we missed.',
    initials: 'DT',
  },
];

const SocialProof: React.FC = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="mb-20 grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">500+</div>
            <div className="mt-1 text-muted-foreground">Search Funds</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">$2.4B</div>
            <div className="mt-1 text-muted-foreground">Deals Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">847</div>
            <div className="mt-1 text-muted-foreground">Red Flags Caught</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">10 min</div>
            <div className="mt-1 text-muted-foreground">Avg. Analysis Time</div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Trusted by Leading Investors
          </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-6 text-foreground">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

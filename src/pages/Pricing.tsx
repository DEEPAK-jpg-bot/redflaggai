import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PRICES } from '@/types';
import { toast } from 'sonner';

const plans = [
  {
    key: 'hunter' as const,
    name: 'Hunter',
    price: '$495',
    period: '/mo',
    description: 'For individual search fund operators',
    features: ['1 Deep Scan per month', 'Roll-over unused credits', 'PDF Reports', 'Email support'],
  },
  {
    key: 'firm' as const,
    name: 'Firm',
    price: '$2,495',
    period: '/mo',
    description: 'For PE firms and fund-of-funds',
    features: ['10 Deep Scans per month', 'White Label reports', 'Priority support', 'API access', 'Team accounts'],
    popular: true,
  },
];

const Pricing: React.FC = () => {
  const { session, isAuthenticated, subscription } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planKey: 'hunter' | 'firm') => {
    if (!isAuthenticated || !session) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoadingPlan(planKey);
    try {
      const priceId = STRIPE_PRICES[planKey].priceId;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">RedFlag.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild><Link to="/dashboard">Dashboard</Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
                <Button asChild><Link to="/signup">Get Started</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">Choose the plan that fits your deal flow</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = subscription.plan === plan.key;
            return (
              <Card key={plan.name} className={plan.popular ? 'border-primary ring-2 ring-primary relative' : ''}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-success text-white text-xs font-medium px-3 py-1 rounded-full">YOUR PLAN</span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-success flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.key)}
                    disabled={loadingPlan !== null || isCurrentPlan}
                  >
                    {loadingPlan === plan.key && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isCurrentPlan ? 'Current Plan' : 'Start 7-Day Trial'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Pricing;

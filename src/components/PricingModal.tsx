import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PRICES } from '@/types';
import { toast } from 'sonner';

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

const PricingModal: React.FC<PricingModalProps> = ({ open, onOpenChange }) => {
  const { session, isAuthenticated } = useAuth();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upgrade to Download Reports</DialogTitle>
          <DialogDescription>Choose a plan to unlock PDF exports and advanced features</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? 'border-primary ring-2 ring-primary' : ''}>
              <CardHeader>
                {plan.popular && <span className="text-xs font-medium text-primary mb-2">MOST POPULAR</span>}
                <CardTitle>{plan.name}</CardTitle>
                <div><span className="text-3xl font-bold">{plan.price}</span><span className="text-muted-foreground">{plan.period}</span></div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" />{f}</li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === plan.key && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Start 7-Day Trial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;

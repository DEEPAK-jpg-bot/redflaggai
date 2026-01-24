import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { user, profile, subscription, session } = useAuth();
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || '';

  const handleManageSubscription = async () => {
    if (!session) return;
    
    setIsManagingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    } finally {
      setIsManagingSubscription(false);
    }
  };

  const getPlanBadge = () => {
    switch (subscription.plan) {
      case 'hunter':
        return <Badge className="bg-primary text-primary-foreground">Hunter Plan</Badge>;
      case 'firm':
        return <Badge className="bg-primary text-primary-foreground">Firm Plan</Badge>;
      default:
        return <Badge variant="secondary">Free Plan</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Subscription
                {getPlanBadge()}
              </CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-muted-foreground capitalize">{subscription.plan} - {subscription.scansPerMonth} scan{subscription.scansPerMonth > 1 ? 's' : ''}/month</p>
                </div>
                {subscription.subscribed && (
                  <Button 
                    variant="outline" 
                    onClick={handleManageSubscription}
                    disabled={isManagingSubscription}
                  >
                    {isManagingSubscription && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Manage Subscription
                  </Button>
                )}
              </div>
              {subscription.subscriptionEnd && (
                <p className="text-sm text-muted-foreground">
                  Renews on {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={displayName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" defaultValue={profile?.company_name || ''} placeholder="Your firm or fund name" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Scan Completion Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when your scan is ready</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Summary</p>
                    <p className="text-sm text-muted-foreground">Receive a weekly digest of your activity</p>
                  </div>
                  <Button variant="outline" size="sm">Disabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently remove your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

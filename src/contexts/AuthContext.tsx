import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, SubscriptionInfo, SubscriptionPlan } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  profile: Profile | null;
  subscription: SubscriptionInfo;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const defaultSubscription: SubscriptionInfo = {
  subscribed: false,
  plan: 'free',
  scansPerMonth: 1,
  subscriptionEnd: null,
  productId: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(defaultSubscription);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile | null;
  };

  const refreshProfile = async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  };

  const refreshSubscription = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      if (data) {
        setSubscription({
          subscribed: data.subscribed,
          plan: (data.plan || 'free') as SubscriptionPlan,
          scansPerMonth: data.scansPerMonth || 1,
          subscriptionEnd: data.subscriptionEnd,
          productId: data.productId,
        });
      }
    } catch (err) {
      console.error('Error refreshing subscription:', err);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Check if this is a new signup
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', newSession.user.id)
            .maybeSingle();

          // AUTHORIZATION CHECK: Only for signups (no existing profile)
          const AUTHORIZED_DOMAINS = ['redflag.ai', 'google.com']; // Example domains
          const AUTHORIZED_EMAILS = ['tester@redflag.ai', 'jay@redflag.ai'];

          const isDomainAuthorized = AUTHORIZED_DOMAINS.some(domain => newSession.user.email?.endsWith(`@${domain}`));
          const isEmailAuthorized = AUTHORIZED_EMAILS.includes(newSession.user.email ?? '');

          if (!existingProfile && !isDomainAuthorized && !isEmailAuthorized) {
            // Not authorized - sign them back out immediately
            await supabase.auth.signOut();
            toast.error('Unauthorized', { description: 'Your email is not on the authorized signup list.' });
            return;
          }

          // Proceed with profile fetch
          const profileData = await fetchProfile(newSession.user.id);
          if (profileData) {
            setProfile(profileData);
          }

          refreshSubscription();
        } else {
          setProfile(null);
          setSubscription(defaultSubscription);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setIsLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Refresh subscription periodically (every 60 seconds)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      refreshSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [session]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signup = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: name,
        },
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setSubscription(defaultSubscription);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      subscription,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      signInWithGoogle,
      logout,
      refreshSubscription,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

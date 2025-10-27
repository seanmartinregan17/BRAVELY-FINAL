import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Check, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { AuthUser } from "@/lib/auth";

interface SubscriptionGuardProps {
  user: AuthUser;
  children: React.ReactNode;
}

export default function SubscriptionGuard({ user, children }: SubscriptionGuardProps) {
  // Check user's subscription status
  const { data: userProfile, isLoading } = useQuery<any>({
    queryKey: [`/api/user/${user.id}`],
  });

  // Development and creator bypass
  const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const isCreator = user.username === 'Seanmartinregan@aol.com' || user.email === 'Seanmartinregan@aol.com' || user.username === 'Seanmartinregan';
  
  // Check if user is in trial period
  const isInTrial = userProfile?.trialEndDate && new Date() < new Date(userProfile.trialEndDate);
  
  // Extended access for development and new users
  const hasExtendedAccess = isDevelopment || !userProfile?.trialEndDate;
  
  const isSubscriptionActive = userProfile?.subscriptionStatus === 'active' || isCreator || isInTrial || hasExtendedAccess;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isSubscriptionActive) {
    // Check if trial has expired
    const trialExpired = userProfile?.trialEndDate && new Date() > new Date(userProfile.trialEndDate);
    const daysLeft = userProfile?.trialEndDate 
      ? Math.max(0, Math.ceil((new Date(userProfile.trialEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            {trialExpired ? (
              <>
                <h1 className="text-2xl font-bold mb-2 text-foreground">Trial Expired</h1>
                <p className="text-muted-foreground">
                  Your 7-day free trial has ended. Continue your mental health journey with Bravely Premium.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2 text-foreground">Upgrade to Premium</h1>
                <p className="text-muted-foreground">
                  Continue your mental health journey beyond the free trial with full access to all features.
                </p>
              </>
            )}
          </div>

          {/* Trial Status or Subscription Benefits */}
          {!trialExpired && daysLeft > 0 && (
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                </div>
                <p className="text-sm text-blue-800">
                  in your free trial
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg flex items-center justify-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Bravely Premium
              </CardTitle>
              <div className="text-3xl font-bold text-primary">
                $10<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              {!trialExpired && daysLeft > 0 && (
                <p className="text-sm text-primary/80 mt-2">
                  Continue after your trial ends
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  "Unlimited exposure therapy sessions",
                  "Real-time GPS route tracking",
                  "Comprehensive progress analytics",
                  "Interactive CBT tools & exercises",
                  "Motivational quotes & daily tips",
                  "Secure data storage & privacy",
                  "Priority customer support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Free vs Premium Comparison */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-center">Why Premium?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Free Access
                  </span>
                  <span className="text-muted-foreground">Limited trial</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-primary/10 rounded border border-primary/20">
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-primary" />
                    Premium Access
                  </span>
                  <span className="text-primary font-medium">Full experience</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="space-y-3">
            <Link href="/subscribe">
              <Button className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg">
                {trialExpired ? 'Subscribe Now' : 'Upgrade to Premium'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Cancel anytime. No hidden fees.</p>
              <p className="mt-1">Secure payment powered by Stripe</p>
            </div>
          </div>

          {/* Support Message */}
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-teal-800 leading-relaxed">
                <strong>Your mental health journey matters.</strong> Bravely is designed by someone who understands agoraphobia and anxiety. Your subscription directly supports continued development and keeps this safe space available for everyone who needs it.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
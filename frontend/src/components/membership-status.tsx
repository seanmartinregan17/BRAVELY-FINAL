import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Calendar, Check, ArrowRight, Sparkles } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { useLocation } from "wouter";

interface MembershipStatusProps {
  user: AuthUser;
}

export default function MembershipStatus({ user }: MembershipStatusProps) {
  const [, navigate] = useLocation();

  const isSubscribed = user.subscriptionStatus === "active";
  const isTrialActive = user.trialEndDate && new Date() < new Date(user.trialEndDate);
  const trialDaysLeft = user.trialEndDate 
    ? Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const getMembershipStatus = () => {
    if (isSubscribed) {
      return {
        status: "Premium",
        color: "bg-gradient-to-r from-amber-500 to-yellow-500",
        icon: Crown,
        description: "Full access to all features"
      };
    }
    if (isTrialActive) {
      return {
        status: "Free Trial",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        icon: Sparkles,
        description: `${trialDaysLeft} days remaining`
      };
    }
    return {
      status: "Trial Expired",
      color: "bg-gradient-to-r from-gray-400 to-gray-500",
      icon: Calendar,
      description: "Upgrade to continue using Bravely"
    };
  };

  const membershipInfo = getMembershipStatus();
  const IconComponent = membershipInfo.icon;

  const premiumFeatures = [
    "Unlimited exposure sessions",
    "Advanced progress analytics", 
    "AI-powered goal recommendations",
    "Achievement system & gamification",
    "GPS route tracking",
    "CBT tools & guided exercises",
    "Daily motivational content",
    "Progress export & sharing"
  ];

  return (
    <div className="space-y-6">
      {/* Membership Status Card */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 ${membershipInfo.color} opacity-10`}></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${membershipInfo.color} text-white`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{membershipInfo.status}</CardTitle>
                <p className="text-sm text-muted-foreground">{membershipInfo.description}</p>
              </div>
            </div>
            <Badge variant={isSubscribed ? "default" : isTrialActive ? "secondary" : "destructive"}>
              {isSubscribed ? "Active" : isTrialActive ? "Trial" : "Expired"}
            </Badge>
          </div>
        </CardHeader>

        {/* Trial Progress Bar */}
        {isTrialActive && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trial Progress</span>
                <span>{7 - trialDaysLeft}/7 days used</span>
              </div>
              <Progress value={(7 - trialDaysLeft) / 7 * 100} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Premium Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span>Premium Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className={`w-4 h-4 ${isSubscribed || isTrialActive ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${!isSubscribed && !isTrialActive ? 'text-muted-foreground' : ''}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isSubscribed && (
        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/subscribe")}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            size="lg"
          >
            {isTrialActive ? "Upgrade to Premium" : "Start Your Journey"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          {isTrialActive && (
            <p className="text-center text-xs text-muted-foreground">
              Continue your progress with unlimited access
            </p>
          )}
        </div>
      )}

      {/* Subscription Info */}
      {isSubscribed && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-green-800 mb-2">✓ Premium Member</h3>
            <p className="text-sm text-green-700">
              You have full access to all Bravely features. Thank you for supporting your mental health journey!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Trophy, Target, TrendingUp, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AuthUser } from "@/lib/auth";

interface ProgressSharingProps {
  user: AuthUser;
  weeklyStats: any;
  userProgress: any;
}

export default function ProgressSharing({ user, weeklyStats, userProgress }: ProgressSharingProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateBraveryBadge = async () => {
    setIsGenerating(true);
    
    try {
      // Create a canvas to generate the badge
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 400, 400);
      gradient.addColorStop(0, '#06b6d4'); // cyan
      gradient.addColorStop(1, '#3b82f6'); // blue
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);
      
      // Add border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 360, 360);
      
      // Add title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Bravery Badge', 200, 80);
      
      // Add user name
      ctx.font = 'bold 24px Arial';
      ctx.fillText(user.username, 200, 120);
      
      // Add streak info
      ctx.font = '20px Arial';
      ctx.fillText(`${user.currentStreak} Day Streak!`, 200, 160);
      
      // Add session count
      const thisWeekSessions = weeklyStats?.reduce((sum: number, day: any) => sum + (day.sessions || 0), 0) || 0;
      ctx.fillText(`${thisWeekSessions} Sessions This Week`, 200, 200);
      
      // Add trophy icon (simple text for now)
      ctx.font = '48px Arial';
      ctx.fillText('🏆', 200, 280);
      
      // Add motivational message
      ctx.font = '18px Arial';
      ctx.fillText('Keep Building Your Courage!', 200, 320);
      
      // Add date
      ctx.font = '14px Arial';
      ctx.fillText(new Date().toLocaleDateString(), 200, 350);
      
      // Convert to blob and share
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], 'bravery-badge.png', { type: 'image/png' });
            await navigator.share({
              title: 'My Bravery Progress',
              text: `I've completed ${user.currentStreak} consecutive days of exposure therapy sessions! Building courage one step at a time with Bravely. 💪`,
              files: [file]
            });
          } catch (error) {
            // Fallback to download
            downloadBadge(blob);
          }
        } else {
          // Fallback to download
          downloadBadge(blob);
        }
      }, 'image/png');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate badge. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsGenerating(false);
  };

  const downloadBadge = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bravery-badge.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Badge Downloaded!",
      description: "Your bravery badge has been saved to your device.",
    });
  };

  const shareProgress = async () => {
    const thisWeekSessions = weeklyStats?.reduce((sum: number, day: any) => sum + (day.sessions || 0), 0) || 0;
    const shareText = `I've completed ${user.currentStreak} consecutive days of exposure therapy sessions and ${thisWeekSessions} sessions this week! Building courage one step at a time with Bravely. 💪 #BraveryJourney #MentalHealthMatters`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Bravery Progress',
          text: shareText
        });
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Progress message copied to clipboard.",
      });
    });
  };

  const thisWeekSessions = weeklyStats?.reduce((sum: number, day: any) => sum + (day.sessions || 0), 0) || 0;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-200">Share Your Progress</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/50 dark:bg-blue-900/30 rounded-lg p-3">
              <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-800 dark:text-blue-200">{user.currentStreak}</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">Day Streak</div>
            </div>
            <div className="bg-white/50 dark:bg-blue-900/30 rounded-lg p-3">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-800 dark:text-blue-200">{thisWeekSessions}</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">This Week</div>
            </div>
            <div className="bg-white/50 dark:bg-blue-900/30 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-800 dark:text-blue-200">{userProgress?.totalSessions || 0}</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">Total Sessions</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={generateBraveryBadge}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? "Creating..." : "Bravery Badge"}
            </Button>
            <Button 
              onClick={shareProgress}
              variant="outline"
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Text
            </Button>
          </div>

          <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
            Celebrate your courage and inspire others on their mental health journey
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
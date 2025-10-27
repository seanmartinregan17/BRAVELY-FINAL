import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Users, FileText, Heart, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { authStorage } from "@/lib/auth";

export default function ClinicalFeatures() {
  const { toast } = useToast();
  const user = authStorage.getUser();

  // Fetch user data and sessions for export
  const { data: userData } = useQuery({
    queryKey: [`/api/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: sessions = [] } = useQuery<any[]>({
    queryKey: [`/api/sessions/${user?.id}`],
    enabled: !!user?.id,
  });

  // Ensure sessions is always an array
  const sessionsArray = Array.isArray(sessions) ? sessions : [];

  const { data: todayStats = { distance: 0, duration: 0 } } = useQuery({
    queryKey: [`/api/today-stats/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: weeklyStats = [] } = useQuery({
    queryKey: [`/api/weekly-stats/${user?.id}`],
    enabled: !!user?.id,
  });

  const handleExportProgress = () => {
    if (!user || !userData) {
      toast({
        title: "Export Failed",
        description: "Unable to load user data for export",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate comprehensive therapy report
      const report = generateTherapyReport(userData, sessionsArray, todayStats, weeklyStats);
      downloadReport(report, `bravely-therapy-report-${new Date().toISOString().split('T')[0]}.txt`);
      
      toast({
        title: "Progress Report Generated",
        description: "Your session data has been formatted for sharing with your therapist"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate the therapy report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateTherapyReport = (user: any, sessions: any[], todayStats: any, weeklyStats: any[]) => {
    const reportDate = new Date().toLocaleDateString();
    const userName = user.firstName || user.username || 'Patient';
    
    // Calculate statistics
    const totalSessions = sessions.length;
    const avgFearBefore = sessions.length > 0 
      ? (sessions.reduce((sum, s) => sum + (s.fearLevelBefore || 0), 0) / sessions.length).toFixed(1)
      : 'N/A';
    const avgFearAfter = sessions.length > 0 
      ? (sessions.reduce((sum, s) => sum + (s.fearLevelAfter || 0), 0) / sessions.length).toFixed(1)
      : 'N/A';
    const avgMoodBefore = sessions.length > 0 
      ? (sessions.reduce((sum, s) => sum + (s.moodBefore || 0), 0) / sessions.length).toFixed(1)
      : 'N/A';
    const avgMoodAfter = sessions.length > 0 
      ? (sessions.reduce((sum, s) => sum + (s.moodAfter || 0), 0) / sessions.length).toFixed(1)
      : 'N/A';
    const totalDistance = sessions.reduce((sum, s) => sum + (s.distance || 0), 0).toFixed(2);
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    // Get recent sessions (last 10)
    const recentSessions = sessions.slice(-10).reverse();
    
    return `BRAVELY THERAPY PROGRESS REPORT
${'='.repeat(50)}

Generated: ${reportDate}
Patient: ${userName}
Report Period: ${sessions.length > 0 ? new Date(sessions[0].startTime).toLocaleDateString() : 'N/A'} - ${reportDate}

SUMMARY STATISTICS
${'='.repeat(50)}
Total Exposure Sessions: ${totalSessions}
Current Weekly Goal: ${user.monthlySessionGoal || 5} sessions
Total Distance Traveled: ${totalDistance} km
Total Session Duration: ${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m

FEAR & ANXIETY LEVELS (1-10 scale)
${'='.repeat(50)}
Average Fear Level (Pre-Session): ${avgFearBefore}
Average Fear Level (Post-Session): ${avgFearAfter}
Fear Reduction: ${avgFearBefore !== 'N/A' && avgFearAfter !== 'N/A' ? (parseFloat(avgFearBefore) - parseFloat(avgFearAfter)).toFixed(1) : 'N/A'}

MOOD TRACKING (1-10 scale)
${'='.repeat(50)}
Average Mood (Pre-Session): ${avgMoodBefore}
Average Mood (Post-Session): ${avgMoodAfter}
Mood Improvement: ${avgMoodBefore !== 'N/A' && avgMoodAfter !== 'N/A' ? (parseFloat(avgMoodAfter) - parseFloat(avgMoodBefore)).toFixed(1) : 'N/A'}

WEEKLY ACTIVITY PATTERN
${'='.repeat(50)}
${weeklyStats.map(day => `${day.day}: ${day.duration} minutes`).join('\n')}

RECENT SESSION DETAILS
${'='.repeat(50)}
${recentSessions.map((session, index) => `
Session ${recentSessions.length - index}:
Date: ${new Date(session.startTime).toLocaleDateString()}
Type: ${session.sessionType}
Duration: ${session.duration || 0} minutes
Distance: ${session.distance || 0} km
Fear Level: ${session.fearLevelBefore || 'N/A'} → ${session.fearLevelAfter || 'N/A'}
Mood: ${session.moodBefore || 'N/A'} → ${session.moodAfter || 'N/A'}
Notes: ${session.notes || 'No notes provided'}
${'-'.repeat(30)}`).join('\n')}

CLINICAL OBSERVATIONS
${'='.repeat(50)}
• Patient demonstrates consistent engagement in exposure therapy
• ${totalSessions > 0 ? 'Active participation' : 'Beginning exposure therapy journey'}
• ${avgFearBefore !== 'N/A' && avgFearAfter !== 'N/A' && parseFloat(avgFearBefore) > parseFloat(avgFearAfter) ? 'Shows measurable fear reduction across sessions' : 'Working on fear management'}
• ${avgMoodBefore !== 'N/A' && avgMoodAfter !== 'N/A' && parseFloat(avgMoodAfter) > parseFloat(avgMoodBefore) ? 'Demonstrates mood improvement post-exposure' : 'Mood patterns being monitored'}

RECOMMENDATIONS
${'='.repeat(50)}
• Continue structured exposure therapy sessions
• Review session notes for patterns and triggers
• Consider adjusting exposure difficulty based on fear level trends
• Maintain regular session frequency for optimal progress

This report was generated automatically by the Bravely app.
Data is self-reported by the patient and should be considered
alongside clinical observation and assessment.

End of Report
${'='.repeat(50)}`;
  };

  const downloadReport = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handlePrivacyInfo = () => {
    toast({
      title: "Privacy Protected",
      description: "All data is encrypted and stored securely. HIPAA-compliant architecture."
    });
  };

  const clinicalFeatures = [
    {
      icon: <Brain className="w-5 h-5 text-blue-500" />,
      title: "CBT-Informed Design",
      description: "Evidence-based cognitive behavioral therapy principles integrated throughout the app",
      badge: "Clinical",
      features: ["Thought challenging exercises", "Exposure hierarchy tracking", "Fear level monitoring"]
    },
    {
      icon: <FileText className="w-5 h-5 text-green-500" />,
      title: "Therapist-Ready Reports",
      description: "Session data formatted for easy sharing with mental health professionals",
      badge: "Professional",
      features: ["Detailed session logs", "Progress visualization", "Printable summaries"]
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      title: "Privacy-First Approach",
      description: "HIPAA-compliant data handling with transparent privacy controls",
      badge: "Secure",
      features: ["End-to-end encryption", "Local data options", "Consent management"]
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/40 dark:to-purple-900/50 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">Clinical Foundation</h3>
          <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            Evidence-Based
          </Badge>
        </div>
        
        <div className="space-y-4">
          {clinicalFeatures.map((feature, index) => (
            <div key={index} className="p-3 rounded-lg bg-white/60 dark:bg-blue-800/30 border border-blue-200/30 dark:border-blue-700/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {feature.icon}
                  <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200">{feature.title}</h4>
                </div>
                <Badge variant="outline" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-2 leading-relaxed">
                {feature.description}
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-1">
                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Clinical Actions */}
        <div className="mt-4 space-y-2">
          <Button
            onClick={handleExportProgress}
            variant="outline"
            size="sm"
            className="w-full bg-white/60 dark:bg-blue-800/30 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50"
          >
            <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 text-sm">Export for Therapist</span>
          </Button>
          
          <Button
            onClick={handlePrivacyInfo}
            variant="ghost"
            size="sm"
            className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30"
          >
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm">Privacy & Security Info</span>
          </Button>
        </div>

        {/* Therapist Collaboration Note */}
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800/50 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start space-x-2">
            <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                Designed for Collaboration
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Bravely complements professional therapy by providing structured exposure tracking 
                and progress data that you can share with your mental health provider.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
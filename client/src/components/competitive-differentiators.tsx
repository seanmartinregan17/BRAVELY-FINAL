import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, MapPin, Zap, Shield, Users } from "lucide-react";

export default function CompetitiveDifferentiators() {
  const differentiators = [
    {
      icon: <Heart className="w-5 h-5 text-red-500" />,
      title: "Lived Experience Foundation",
      description: "Built by someone who understands agoraphobia firsthand, ensuring authentic, empathetic design",
      badge: "Authentic",
      color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      title: "GPS-Powered Exposure Tracking",
      description: "Real-time location tracking specifically designed for exposure therapy sessions and distance goals",
      badge: "Unique",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
    },
    {
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      title: "CBT-Informed Features",
      description: "Integrated cognitive behavioral therapy tools: thought challenging, grounding, breathing exercises",
      badge: "Clinical",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: "Progressive Goal System",
      description: "AI-powered adaptive goals that grow with user progress, preventing overwhelm while encouraging growth",
      badge: "Smart",
      color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
    },
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      title: "Privacy-First Design",
      description: "HIPAA-compliant architecture with local data storage options and transparent privacy controls",
      badge: "Secure",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      title: "Therapist-Friendly",
      description: "Progress reports and session data designed for easy sharing with mental health professionals",
      badge: "Professional",
      color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-800/30 dark:via-gray-800/40 dark:to-zinc-800/50 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">What Makes Bravely Different</h3>
        </div>
        
        <div className="space-y-3">
          {differentiators.map((item, index) => (
            <div key={index} className={`p-3 rounded-lg border ${item.color}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <h4 className="font-medium text-sm">{item.title}</h4>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 italic">
            "Unlike general mental health apps, Bravely is laser-focused on exposure therapy for agoraphobia, 
            combining personal experience with clinical best practices."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
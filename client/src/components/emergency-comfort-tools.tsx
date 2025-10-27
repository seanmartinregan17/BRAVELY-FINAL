import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Wind, Anchor, Brain, Shield } from "lucide-react";
import { Link } from "wouter";

export default function EmergencyComfortTools() {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyTools = [
    {
      title: "5-4-3-2-1 Grounding",
      description: "Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
      icon: Anchor,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Box Breathing",
      description: "Breathe in for 4, hold for 4, out for 4, hold for 4",
      icon: Wind,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Thought Challenge",
      description: "Is this thought helpful? What would I tell a friend?",
      icon: Brain,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Safe Space Visualization",
      description: "Picture your most comfortable, peaceful place",
      icon: Shield,
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-24 right-4 z-50 bg-red-50 hover:bg-red-100 border-red-200 text-red-700 shadow-lg"
        >
          <Heart className="w-4 h-4 mr-2" />
          SOS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-red-700">Emergency Comfort Tools</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {emergencyTools.map((tool, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${tool.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-800 mb-1">{tool.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="pt-2 border-t">
            <Link href="/cbt-tools" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                Open Full CBT Tools
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
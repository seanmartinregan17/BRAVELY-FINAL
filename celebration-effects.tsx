import { useEffect, useState } from "react";
import { Sparkles, Star, Heart, Trophy } from "lucide-react";

interface CelebrationEffectsProps {
  trigger: "streak" | "goal" | "milestone" | null;
  onComplete?: () => void;
}

export default function CelebrationEffects({ trigger, onComplete }: CelebrationEffectsProps) {
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; icon: string; color: string }>>([]);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      generateParticles();
      
      // Trigger haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      // Auto-complete after animation
      const timer = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  const generateParticles = () => {
    const particleCount = 12;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        icon: getRandomIcon(),
        color: getRandomColor()
      });
    }
    
    setParticles(newParticles);
  };

  const getRandomIcon = () => {
    const icons = ["✨", "🎉", "🏆", "💪", "🌟", "💎", "🎯", "⭐"];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  const getRandomColor = () => {
    const colors = [
      "text-yellow-400",
      "text-blue-400", 
      "text-green-400",
      "text-purple-400",
      "text-pink-400",
      "text-indigo-400"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getCelebrationMessage = () => {
    switch (trigger) {
      case "streak":
        return {
          title: "Streak Extended! 🔥",
          subtitle: "Your consistency is building real courage",
          icon: <Trophy className="w-8 h-8 text-yellow-500" />
        };
      case "goal":
        return {
          title: "Goal Achieved! 🎯",
          subtitle: "You're making incredible progress",
          icon: <Star className="w-8 h-8 text-blue-500" />
        };
      case "milestone":
        return {
          title: "Milestone Reached! 🏆",
          subtitle: "Every step forward matters",
          icon: <Heart className="w-8 h-8 text-pink-500" />
        };
      default:
        return {
          title: "Amazing! ✨",
          subtitle: "Keep up the great work",
          icon: <Sparkles className="w-8 h-8 text-purple-500" />
        };
    }
  };

  if (!isActive) return null;

  const message = getCelebrationMessage();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Particle effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute text-2xl animate-bounce ${particle.color}`}
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${Math.random() * 1000}ms`,
            animationDuration: "2s"
          }}
        >
          {particle.icon}
        </div>
      ))}
      
      {/* Center celebration message */}
      <div className="flex items-center justify-center h-full">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-500">
          <div className="text-center space-y-4">
            <div className="flex justify-center animate-pulse">
              {message.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {message.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {message.subtitle}
              </p>
            </div>
            
            {/* Confetti burst animation */}
            <div className="relative h-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping animation-delay-300" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-ping animation-delay-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add animation delay utility classes to your CSS if not already present
const animationDelayStyles = `
.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}
`;
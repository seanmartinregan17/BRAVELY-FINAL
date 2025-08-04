import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Plus, Star, Heart, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AuthUser } from "@/lib/auth";

interface PersonalWinsProps {
  user: AuthUser;
}

const winTypes = [
  { value: "breakthrough", label: "Breakthrough", icon: "🎯", color: "bg-green-100 text-green-700" },
  { value: "milestone", label: "Milestone", icon: "🏆", color: "bg-blue-100 text-blue-700" },
  { value: "affirmation", label: "Affirmation", icon: "💝", color: "bg-pink-100 text-pink-700" },
  { value: "moment", label: "Proud Moment", icon: "⭐", color: "bg-yellow-100 text-yellow-700" }
];

export default function PersonalWins({ user }: PersonalWinsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [winType, setWinType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wins = [] } = useQuery({
    queryKey: ["/api/personal-wins", user.id],
  });

  const handleSubmit = async () => {
    if (!title.trim() || !winType) return;

    setIsSubmitting(true);
    try {
      await apiRequest("/api/personal-wins", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          title: title.trim(),
          content: content.trim(),
          winType
        })
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/personal-wins", user.id] });
      setIsOpen(false);
      setTitle("");
      setContent("");
      setWinType("");
      
      toast({
        title: "Win added to your Bravery Journal! 🎉",
        description: "Another moment to celebrate your progress"
      });
    } catch (error) {
      toast({
        title: "Failed to save win",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWinTypeInfo = (type: string) => {
    return winTypes.find(wt => wt.value === type) || winTypes[0];
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Trophy className="h-5 w-5" />
            My Wins
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-3 w-3 mr-1" />
                Add Win
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add a Personal Win</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">What happened?</label>
                  <Input
                    placeholder="I conquered my fear of..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Type of win</label>
                  <Select value={winType} onValueChange={setWinType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {winTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Details (optional)</label>
                  <Textarea
                    placeholder="Tell your story..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={500}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleSubmit}
                    disabled={!title.trim() || !winType || isSubmitting}
                    className="flex-1"
                  >
                    Save Win
                  </Button>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {wins.length === 0 ? (
          <div className="text-center py-6 text-purple-600 dark:text-purple-300">
            <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Start collecting your brave moments</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {wins.slice(0, 5).map((win: any) => {
              const typeInfo = getWinTypeInfo(win.winType);
              return (
                <div key={win.id} className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{typeInfo.icon}</span>
                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                          {win.title}
                        </h4>
                      </div>
                      {win.content && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {win.content}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${typeInfo.color}`}>
                          {typeInfo.label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(win.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {wins.length > 5 && (
              <Button variant="ghost" size="sm" className="w-full text-purple-600 hover:text-purple-700">
                View All Wins ({wins.length})
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
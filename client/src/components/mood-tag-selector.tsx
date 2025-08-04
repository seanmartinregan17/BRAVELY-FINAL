import { Badge } from "@/components/ui/badge";

interface MoodTagSelectorProps {
  selectedTag?: string;
  onTagSelect: (tag: string) => void;
}

const moodTags = [
  { value: "anxious", label: "😰 Anxious", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  { value: "neutral", label: "😐 Neutral", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  { value: "accomplished", label: "😊 Accomplished", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  { value: "brave", label: "💪 Brave", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  { value: "reflective", label: "🤔 Reflective", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" }
];

export default function MoodTagSelector({ selectedTag, onTagSelect }: MoodTagSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tag how you felt after this session:
      </label>
      <div className="flex flex-wrap gap-2">
        {moodTags.map((tag) => (
          <Badge
            key={tag.value}
            variant={selectedTag === tag.value ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedTag === tag.value 
                ? "bg-blue-600 text-white" 
                : `${tag.color} hover:opacity-80`
            }`}
            onClick={() => onTagSelect(tag.value)}
          >
            {tag.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
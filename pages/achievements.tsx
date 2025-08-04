import { AuthUser } from "@/lib/auth"

interface AchievementsProps {
  user: AuthUser
}

export default function Achievements({ user }: AchievementsProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  )
}

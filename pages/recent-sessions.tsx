import { AuthUser } from "@/lib/auth"

interface Recent-sessionsProps {
  user: AuthUser
}

export default function Recent-sessions({ user }: Recent-sessionsProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recent-sessions</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  )
}

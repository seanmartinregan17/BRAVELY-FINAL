import { AuthUser } from "@/lib/auth"

interface SettingsProps {
  user: AuthUser
}

export default function Settings({ user }: SettingsProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  )
}

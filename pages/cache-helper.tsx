import { AuthUser } from "@/lib/auth"

interface Cache-helperProps {
  user: AuthUser
}

export default function Cache-helper({ user }: Cache-helperProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cache-helper</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  )
}

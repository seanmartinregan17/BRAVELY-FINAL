import { AuthUser } from "@/lib/auth"

interface Session-detailsProps {
  user: AuthUser
}

export default function Session-details({ user }: Session-detailsProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Session-details</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  )
}

import { AuthUser } from "@/lib/auth"

interface ProgressProps {
  user: AuthUser
}

export default function Progress({ user }: ProgressProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Progress</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  )
}

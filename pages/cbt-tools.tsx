import { AuthUser } from "@/lib/auth"

interface Cbt-toolsProps {
  user: AuthUser
}

export default function Cbt-tools({ user }: Cbt-toolsProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cbt-tools</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  )
}

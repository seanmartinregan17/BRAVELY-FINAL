import { AuthUser } from "@/lib/auth"

interface HomeProps {
  user: AuthUser
}

export default function Home({ user }: HomeProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Bravely, {user.name}!</h1>
      <p className="text-muted-foreground">
        Your personal exposure therapy companion is ready to help you build confidence step by step.
      </p>
    </div>
  )
}
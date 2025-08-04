import { AuthUser } from '@/lib/auth';

interface HomeProps {
  user: AuthUser;
}

export default function Home({ user }: HomeProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Bravely, {user.name}!</h1>
      <p className="text-muted-foreground">Your exposure therapy journey starts here.</p>
    </div>
  );
}
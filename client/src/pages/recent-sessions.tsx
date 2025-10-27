import { AuthUser } from '@/lib/auth';

interface RecentSessionsProps {
  user: AuthUser;
}

export default function RecentSessions({ user }: RecentSessionsProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recent Sessions</h1>
      <p className="text-muted-foreground">View your recent exposure therapy sessions.</p>
    </div>
  );
}
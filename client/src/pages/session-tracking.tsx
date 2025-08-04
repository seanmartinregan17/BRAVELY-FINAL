import { AuthUser } from '@/lib/auth';

interface SessionTrackingProps {
  user: AuthUser;
}

export default function SessionTracking({ user }: SessionTrackingProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Session Tracking</h1>
      <p className="text-muted-foreground">Track your exposure therapy sessions here.</p>
    </div>
  );
}
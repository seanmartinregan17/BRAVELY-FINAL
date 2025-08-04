import { AuthUser } from '@/lib/auth';

interface SessionDetailsProps {
  user: AuthUser;
}

export default function SessionDetails({ user }: SessionDetailsProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Session Details</h1>
      <p className="text-muted-foreground">View detailed information about your session.</p>
    </div>
  );
}
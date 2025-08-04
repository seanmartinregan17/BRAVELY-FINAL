import { AuthUser } from '@/lib/auth';

interface ProgressProps {
  user: AuthUser;
}

export default function Progress({ user }: ProgressProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Progress</h1>
      <p className="text-muted-foreground">Track your progress over time.</p>
    </div>
  );
}
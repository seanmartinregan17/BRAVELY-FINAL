import { AuthUser } from '@/lib/auth';

interface ProfileProps {
  user: AuthUser;
}

export default function Profile({ user }: ProfileProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-muted-foreground">Manage your profile settings.</p>
    </div>
  );
}
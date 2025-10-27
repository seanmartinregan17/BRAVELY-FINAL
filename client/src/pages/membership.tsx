import { AuthUser } from '@/lib/auth';

interface MembershipProps {
  user: AuthUser;
}

export default function Membership({ user }: MembershipProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Membership</h1>
      <p className="text-muted-foreground">Manage your membership.</p>
    </div>
  );
}
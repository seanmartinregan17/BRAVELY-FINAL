import { AuthUser } from '@/lib/auth';

interface SubscribeProps {
  user: AuthUser;
}

export default function Subscribe({ user }: SubscribeProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subscribe</h1>
      <p className="text-muted-foreground">Choose a subscription plan.</p>
    </div>
  );
}
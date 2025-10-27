import { AuthUser } from '@/lib/auth';

interface CbtToolsProps {
  user: AuthUser;
}

export default function CbtTools({ user }: CbtToolsProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CBT Tools</h1>
      <p className="text-muted-foreground">Access cognitive behavioral therapy tools.</p>
    </div>
  );
}
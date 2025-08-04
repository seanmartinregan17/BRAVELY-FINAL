import { AuthUser } from '@/lib/auth';

interface AchievementsPageProps {
  user: AuthUser;
}

export default function AchievementsPage({ user }: AchievementsPageProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>
      <p className="text-muted-foreground">View your achievements and milestones.</p>
    </div>
  );
}
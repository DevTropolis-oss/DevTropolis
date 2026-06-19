import { useState, useEffect } from 'react';
import { GitCommit, GitPullRequest, MessageSquare, Star, TrendingUp, Circle } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: 'commit' | 'pr' | 'review' | 'issue';
  message: string;
  repo: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

interface TrendingRepo {
  id: number;
  name: string;
  stars: number;
  language: string;
  langColor: string;
}

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    type: 'commit',
    message: 'Pushed 3 commits to',
    repo: 'main',
    time: '2m ago',
    icon: <GitCommit size={14} />,
    color: '#FF9E00',
  },
  {
    id: 2,
    type: 'pr',
    message: 'Opened PR #402 on',
    repo: 'neural-api',
    time: '5m ago',
    icon: <GitPullRequest size={14} />,
    color: '#00B4D8',
  },
  {
    id: 3,
    type: 'review',
    message: 'Reviewed PR #398 in',
    repo: 'quantum-core',
    time: '12m ago',
    icon: <MessageSquare size={14} />,
    color: '#FF5400',
  },
  {
    id: 4,
    type: 'commit',
    message: 'Merged branch feat/ into',
    repo: 'dev',
    time: '18m ago',
    icon: <GitCommit size={14} />,
    color: '#FF9E00',
  },
  {
    id: 5,
    type: 'issue',
    message: 'Closed issue #127 in',
    repo: 'city-engine',
    time: '25m ago',
    icon: <Circle size={14} />,
    color: '#90E0EF',
  },
  {
    id: 6,
    type: 'pr',
    message: 'Merged PR #395 on',
    repo: 'data-viz',
    time: '32m ago',
    icon: <GitPullRequest size={14} />,
    color: '#00B4D8',
  },
];

const initialTrending: TrendingRepo[] = [
  { id: 1, name: 'neural-api', stars: 2847, language: 'Rust', langColor: '#DEA584' },
  { id: 2, name: 'quantum-core', stars: 1923, language: 'TypeScript', langColor: '#3178C6' },
  { id: 3, name: 'city-engine', stars: 1541, language: 'Python', langColor: '#3572A5' },
  { id: 4, name: 'data-viz', stars: 982, language: 'Go', langColor: '#00ADD8' },
];

const activityGenerators = [
  { type: 'commit' as const, message: 'Pushed commits to', icon: <GitCommit size={14} />, color: '#FF9E00' },
  { type: 'pr' as const, message: 'Opened PR on', icon: <GitPullRequest size={14} />, color: '#00B4D8' },
  { type: 'review' as const, message: 'Reviewed PR in', icon: <MessageSquare size={14} />, color: '#FF5400' },
  { type: 'issue' as const, message: 'Closed issue in', icon: <Circle size={14} />, color: '#90E0EF' },
];

const repos = ['neural-api', 'quantum-core', 'city-engine', 'data-viz', 'mesh-render', 'flux-db'];

export default function ActivityStream() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [trending, setTrending] = useState<TrendingRepo[]>(initialTrending);

  useEffect(() => {
    // Simulate new activities
    const interval = setInterval(() => {
      const generator = activityGenerators[Math.floor(Math.random() * activityGenerators.length)];
      const repo = repos[Math.floor(Math.random() * repos.length)];
      const newActivity: ActivityItem = {
        id: Date.now(),
        type: generator.type,
        message: generator.message,
        repo,
        time: 'now',
        icon: generator.icon,
        color: generator.color,
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 8));

      // Update trending repos
      setTrending(prev =>
        prev.map(repo => ({
          ...repo,
          stars: repo.stars + Math.floor(Math.random() * 5),
        }))
      );
    }, 8000);

    // Update relative times
    const timeInterval = setInterval(() => {
      setActivities(prev =>
        prev.map((act, i) => {
          if (i === 0 && act.time === 'now') return { ...act, time: '1m ago' };
          return act;
        })
      );
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="fixed left-6 top-24 z-10 w-80 hidden lg:block">
      <div className="holo-panel p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-sm font-bold tracking-[0.15em] uppercase text-white">
            Network Activity
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono-data text-ocean-pale/60 uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-2 mb-5 max-h-[280px] overflow-y-auto scrollbar-hide">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer"
            >
              <div
                className="mt-0.5 p-1.5 rounded-md flex-shrink-0"
                style={{ backgroundColor: `${activity.color}15`, color: activity.color }}
              >
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 leading-relaxed">
                  {activity.message}{' '}
                  <span className="text-magma-bright font-medium">{activity.repo}</span>
                </p>
                <span className="text-[10px] font-mono-data text-ocean-pale/50 mt-0.5 block">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

        {/* Trending Repos */}
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-magma-bright" />
          <h3 className="font-heading text-xs font-bold tracking-[0.12em] uppercase text-ocean-pale">
            Trending Repos
          </h3>
        </div>

        <div className="space-y-2">
          {trending.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: repo.langColor }}
                />
                <span className="text-xs text-white/90 font-medium group-hover:text-magma-bright transition-colors">
                  {repo.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-magma-bright" />
                <span className="text-[11px] font-mono-data text-ocean-pale">
                  {repo.stars.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

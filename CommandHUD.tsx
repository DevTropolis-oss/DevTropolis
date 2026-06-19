import { useState, useEffect } from 'react';
import { Settings, Activity, GitPullRequest, Clock } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ label, value, icon, color }: MetricCardProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 holo-panel">
      <div className={`p-1.5 rounded-lg`} style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-heading uppercase tracking-[0.15em] text-ocean-pale/70">{label}</span>
        <span className="font-mono-data text-sm font-bold text-white">{value}</span>
      </div>
    </div>
  );
}

export default function CommandHUD() {
  const [totalCommits, setTotalCommits] = useState(1247);
  const [activePRs, setActivePRs] = useState(12);
  const [uptime] = useState('99.9%');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Simulate live data updates
    const dataInterval = setInterval(() => {
      setTotalCommits(prev => prev + Math.floor(Math.random() * 3));
      setActivePRs(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(0, prev + (Math.random() > 0.7 ? change : 0));
      });
    }, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 animate-pulse-glow rounded-full overflow-hidden">
            <img
              src="/logo-crystal.png"
              alt="DevTropolis"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-[0.1em] uppercase neon-text">
              DEVTROPOLIS
            </span>
            <span className="text-[9px] font-mono-data tracking-[0.2em] text-ocean-pale/60 uppercase">
              Smart City Dashboard
            </span>
          </div>
        </div>

        {/* Center Metrics */}
        <div className="hidden md:flex items-center gap-3">
          <MetricCard
            label="Total Commits"
            value={totalCommits.toLocaleString()}
            icon={<Activity size={16} />}
            color="#FF9E00"
          />
          <MetricCard
            label="Active PRs"
            value={activePRs.toString()}
            icon={<GitPullRequest size={16} />}
            color="#00B4D8"
          />
          <MetricCard
            label="Uptime"
            value={uptime}
            icon={<Clock size={16} />}
            color="#FF5400"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 holo-panel">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono-data text-xs text-ocean-pale">{currentTime}</span>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-magma-bright/50 group-hover:border-magma-bright transition-all duration-300 group-hover:shadow-glow">
              <img
                src="/avatar.png"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-ocean-deep" />
          </div>
          
          <button className="p-2 rounded-lg holo-panel hover:border-magma-bright/50 transition-all duration-300 hover:shadow-glow group">
            <Settings size={18} className="text-ocean-pale group-hover:text-magma-bright transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}

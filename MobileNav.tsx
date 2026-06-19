import { useState } from 'react';
import { Menu, X, GitCommit, GitPullRequest, MapPin, TrendingUp, Star, Clock } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  language: string;
  langColor: string;
  lastUpdated: string;
  buildHealth: number;
}

const projects: Project[] = [
  { id: 1, name: 'neural-api', language: 'Rust', langColor: '#DEA584', lastUpdated: '2m ago', buildHealth: 98 },
  { id: 2, name: 'quantum-core', language: 'TS', langColor: '#3178C6', lastUpdated: '15m ago', buildHealth: 95 },
  { id: 3, name: 'city-engine', language: 'Python', langColor: '#3572A5', lastUpdated: '1h ago', buildHealth: 87 },
  { id: 4, name: 'data-viz', language: 'Go', langColor: '#00ADD8', lastUpdated: '3h ago', buildHealth: 100 },
];

const recentActivities = [
  { id: 1, type: 'commit', message: 'Pushed to main', time: '2m ago' },
  { id: 2, type: 'pr', message: 'Opened PR #402', time: '5m ago' },
  { id: 3, type: 'review', message: 'Reviewed PR #398', time: '12m ago' },
];

function getHealthColor(health: number): string {
  if (health >= 95) return '#22C55E';
  if (health >= 85) return '#FF9E00';
  if (health >= 70) return '#FF5400';
  return '#EF4444';
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-24 z-20 lg:hidden p-2.5 holo-panel hover:border-magma-bright/50 transition-all duration-300"
      >
        <Menu size={20} className="text-magma-bright" />
      </button>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Content */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-ocean-deep/95 backdrop-blur-xl border-r border-magma-bright/20 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img src="/logo-crystal.png" alt="" className="w-8 h-8 object-contain" />
              <span className="font-heading text-sm font-bold tracking-wider uppercase text-white">
                Menu
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-ocean-pale" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-65px)]">
            {/* Activity Section */}
            <div>
              <h3 className="flex items-center gap-2 font-heading text-xs font-bold tracking-wider uppercase text-ocean-pale mb-3">
                <GitCommit size={14} className="text-magma-bright" />
                Network Activity
              </h3>
              <div className="space-y-2">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5">
                    <div className="p-1.5 rounded-md bg-magma-bright/10 text-magma-bright">
                      {activity.type === 'commit' && <GitCommit size={12} />}
                      {activity.type === 'pr' && <GitPullRequest size={12} />}
                      {activity.type === 'review' && <TrendingUp size={12} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/80 truncate">{activity.message}</p>
                      <span className="text-[10px] font-mono-data text-ocean-pale/50">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Projects Section */}
            <div>
              <h3 className="flex items-center gap-2 font-heading text-xs font-bold tracking-wider uppercase text-ocean-pale mb-3">
                <MapPin size={14} className="text-magma-bright" />
                Project Districts
              </h3>
              <div className="space-y-2">
                {projects.map((project) => {
                  const healthColor = getHealthColor(project.buildHealth);
                  return (
                    <div key={project.id} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: project.langColor }}
                          />
                          <span className="text-sm font-semibold text-white">{project.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-magma-bright" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Clock size={10} className="text-ocean-pale/40" />
                          <span className="text-[10px] font-mono-data text-ocean-pale/50">{project.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${project.buildHealth}%`,
                                background: `linear-gradient(90deg, ${healthColor}, ${healthColor}CC)`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono-data font-bold" style={{ color: healthColor }}>
                            {project.buildHealth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

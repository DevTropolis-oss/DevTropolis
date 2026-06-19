import { useState } from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  language: string;
  langColor: string;
  lastUpdated: string;
  buildHealth: number;
  description: string;
  commits: number;
  issues: number;
}

const projects: Project[] = [
  {
    id: 1,
    name: 'neural-api',
    language: 'Rust',
    langColor: '#DEA584',
    lastUpdated: '2m ago',
    buildHealth: 98,
    description: 'High-performance ML inference engine',
    commits: 482,
    issues: 3,
  },
  {
    id: 2,
    name: 'quantum-core',
    language: 'TypeScript',
    langColor: '#3178C6',
    lastUpdated: '15m ago',
    buildHealth: 95,
    description: 'Distributed computing framework',
    commits: 723,
    issues: 7,
  },
  {
    id: 3,
    name: 'city-engine',
    language: 'Python',
    langColor: '#3572A5',
    lastUpdated: '1h ago',
    buildHealth: 87,
    description: '3D city visualization platform',
    commits: 356,
    issues: 12,
  },
  {
    id: 4,
    name: 'data-viz',
    language: 'Go',
    langColor: '#00ADD8',
    lastUpdated: '3h ago',
    buildHealth: 100,
    description: 'Real-time data streaming pipeline',
    commits: 891,
    issues: 1,
  },
  {
    id: 5,
    name: 'mesh-render',
    language: 'C++',
    langColor: '#F34B7D',
    lastUpdated: '5h ago',
    buildHealth: 92,
    description: 'WebGL mesh rendering library',
    commits: 234,
    issues: 5,
  },
  {
    id: 6,
    name: 'flux-db',
    language: 'Rust',
    langColor: '#DEA584',
    lastUpdated: '8h ago',
    buildHealth: 78,
    description: 'Time-series database engine',
    commits: 567,
    issues: 18,
  },
];

function getHealthColor(health: number): string {
  if (health >= 95) return '#22C55E';
  if (health >= 85) return '#FF9E00';
  if (health >= 70) return '#FF5400';
  return '#EF4444';
}

export default function ProjectDistricts() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <div className="fixed right-6 top-24 z-10 w-[360px] hidden lg:block">
      <div className="holo-panel p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-magma-bright" />
            <h2 className="font-heading text-sm font-bold tracking-[0.15em] uppercase text-white">
              Project Districts
            </h2>
          </div>
          <span className="text-[10px] font-mono-data text-ocean-pale/50 tracking-wider">
            {projects.length} ACTIVE
          </span>
        </div>

        {/* Project List */}
        <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-hide">
          {projects.map((project) => {
            const isSelected = selectedProject === project.id;
            const isHovered = hoveredProject === project.id;
            const healthColor = getHealthColor(project.buildHealth);

            return (
              <div
                key={project.id}
                className={`
                  relative p-3 rounded-lg cursor-pointer transition-all duration-300
                  ${isSelected ? 'bg-white/10 border border-magma-bright/40' : 'hover:bg-white/5 border border-transparent'}
                `}
                onClick={() => setSelectedProject(isSelected ? null : project.id)}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Project Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full ring-2 ring-offset-1 ring-offset-ocean-deep"
                      style={{ backgroundColor: project.langColor, boxShadow: `0 0 0 2px ${project.langColor}40` }}
                    />
                    <span className="text-sm font-semibold text-white group-hover:text-magma-bright transition-colors">
                      {project.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-ocean-pale/40 transition-transform duration-300 ${isSelected ? 'rotate-90' : ''} ${isHovered ? 'text-magma-bright' : ''}`}
                  />
                </div>

                {/* Description */}
                <p className="text-[11px] text-ocean-pale/60 mb-2.5 leading-relaxed">
                  {project.description}
                </p>

                {/* Meta Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-ocean-pale/40" />
                    <span className="text-[10px] font-mono-data text-ocean-pale/50">
                      {project.lastUpdated}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono-data text-ocean-pale/50">
                      {project.commits} commits
                    </span>
                    <span className="text-[10px] font-mono-data text-ocean-pale/50">
                      {project.issues} issues
                    </span>
                  </div>
                </div>

                {/* Build Health Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-data text-ocean-pale/60 uppercase tracking-wider">
                    Health
                  </span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full data-bar transition-all duration-500"
                      style={{
                        width: `${project.buildHealth}%`,
                        background: `linear-gradient(90deg, ${healthColor}, ${healthColor}CC)`,
                      }}
                    />
                  </div>
                  <span
                    className="text-[11px] font-mono-data font-bold"
                    style={{ color: healthColor }}
                  >
                    {project.buildHealth}%
                  </span>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded bg-white/5">
                        <div className="text-lg font-mono-data font-bold text-magma-bright">
                          {project.buildHealth}
                        </div>
                        <div className="text-[9px] text-ocean-pale/50 uppercase tracking-wider">Score</div>
                      </div>
                      <div className="text-center p-2 rounded bg-white/5">
                        <div className="text-lg font-mono-data font-bold text-ocean-light">
                          {project.commits}
                        </div>
                        <div className="text-[9px] text-ocean-pale/50 uppercase tracking-wider">Commits</div>
                      </div>
                      <div className="text-center p-2 rounded bg-white/5">
                        <div className="text-lg font-mono-data font-bold text-magma-deep">
                          {project.issues}
                        </div>
                        <div className="text-[9px] text-ocean-pale/50 uppercase tracking-wider">Issues</div>
                      </div>
                    </div>
                    <button className="w-full mt-3 py-2 rounded-lg bg-magma-bright/20 hover:bg-magma-bright/30 border border-magma-bright/40 text-magma-bright text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-glow">
                      View District
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

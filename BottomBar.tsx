import { useState } from 'react';
import { Sun, Moon, Zap, Terminal } from 'lucide-react';

const systemLogs = [
  '[INFO] City engine initialized - 60 districts loaded',
  '[INFO] Neural mesh rendering at 60 FPS',
  '[OK] Database connection established - flux-db:online',
  '[INFO] Traffic simulation active - 40 data streams',
  '[OK] Git webhook listener running on port 3000',
  '[INFO] Auto-deploy pipeline triggered for neural-api',
  '[OK] CDN cache invalidated - static assets refreshed',
  '[INFO] Real-time sync established with GitHub API',
  '[OK] Build queue processed - 0 pending jobs',
  '[INFO] Monitoring 6 active project districts',
  '[OK] SSL certificates valid - 89 days remaining',
  '[INFO] Scheduled backup completed - 2.4GB archived',
];

const themes = [
  { id: 'daylight', label: 'Daylight', icon: <Sun size={14} /> },
  { id: 'night', label: 'Night', icon: <Moon size={14} /> },
  { id: 'cyber', label: 'Cyber', icon: <Zap size={14} /> },
];

export default function BottomBar() {
  const [activeTheme, setActiveTheme] = useState('cyber');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 h-10 bg-ocean-deep/90 border-t border-magma-bright/20 backdrop-blur-md">
      <div className="flex items-center h-full px-4">
        {/* Terminal Icon */}
        <div className="flex items-center gap-2 mr-4 flex-shrink-0">
          <Terminal size={14} className="text-magma-bright" />
          <span className="text-[10px] font-mono-data text-ocean-pale/60 uppercase tracking-wider hidden sm:inline">
            System
          </span>
        </div>

        {/* Scrolling Log Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...systemLogs, ...systemLogs].map((log, i) => (
              <span key={i} className="text-[11px] font-mono-data text-ocean-pale/50 mx-6">
                {log}
              </span>
            ))}
          </div>
        </div>

        {/* Theme Toggles */}
        <div className="flex items-center gap-1 ml-4 flex-shrink-0">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono-data uppercase tracking-wider
                transition-all duration-300
                ${activeTheme === theme.id
                  ? 'bg-magma-bright/20 text-magma-bright border border-magma-bright/40'
                  : 'text-ocean-pale/40 hover:text-ocean-pale/70 hover:bg-white/5 border border-transparent'
                }
              `}
            >
              {theme.icon}
              <span className="hidden md:inline">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

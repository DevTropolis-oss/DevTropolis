import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('Initializing city grid...');
  const [fadeOut, setFadeOut] = useState(false);

  const phases = [
    'Initializing city grid...',
    'Loading district modules...',
    'Connecting neural pipelines...',
    'Compiling building geometries...',
    'Establishing data streams...',
    'Calibrating holographic UI...',
    'Welcome to DevTropolis.',
  ];

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 2 + 0.5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 800);
        }, 500);
      }
      setProgress(currentProgress);
      
      const phaseIndex = Math.min(
        Math.floor((currentProgress / 100) * phases.length),
        phases.length - 1
      );
      setPhase(phases[phaseIndex]);
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-ocean-deep transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 180, 216, 0.1) 2px, rgba(0, 180, 216, 0.1) 4px)',
          }}
        />
        <div
          className="absolute w-full h-[2px] bg-magma-bright/20"
          style={{
            animation: 'scanline 3s linear infinite',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 animate-pulse-glow rounded-full overflow-hidden">
            <img
              src="/logo-crystal.png"
              alt="DevTropolis"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-magma-bright/30 border border-magma-bright/50 animate-pulse" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-[0.2em] uppercase neon-text mb-2">
            DEVTROPOLIS
          </h1>
          <p className="text-xs font-mono-data text-ocean-pale/50 tracking-[0.3em] uppercase">
            Smart City Dashboard v2.0
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-72 sm:w-96">
          <div className="flex justify-between mb-2">
            <span className="text-[11px] font-mono-data text-ocean-pale/60">{phase}</span>
            <span className="text-[11px] font-mono-data text-magma-bright font-bold">
              {Math.floor(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full data-bar transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-magma-bright"
              style={{
                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-magma-bright/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-magma-bright/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-magma-bright/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-magma-bright/30" />
    </div>
  );
}

import { useState, useCallback } from 'react';
import CityScene from './components/CityScene';
import CommandHUD from './components/CommandHUD';
import ActivityStream from './components/ActivityStream';
import ProjectDistricts from './components/ProjectDistricts';
import BottomBar from './components/BottomBar';
import LoadingScreen from './components/LoadingScreen';
import MobileNav from './components/MobileNav';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-ocean-deep">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* 3D City Scene - Background */}
      <CityScene />

      {/* UI Overlays */}
      {!isLoading && (
        <>
          {/* Top Command HUD */}
          <CommandHUD />

          {/* Left Panel - Activity Stream */}
          <ActivityStream />

          {/* Right Panel - Project Districts */}
          <ProjectDistricts />

          {/* Mobile Navigation Drawer */}
          <MobileNav />

          {/* Bottom Diagnostics Bar */}
          <BottomBar />

          {/* Ambient Overlay Effects */}
          <div className="fixed inset-0 pointer-events-none z-[5]">
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3, 4, 94, 0.6) 100%)',
              }}
            />
            
            {/* Subtle grain texture */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

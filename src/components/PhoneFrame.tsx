import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../context/SoundContext';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [isPhoneView, setIsPhoneView] = useState(true);
  const [currentTime, setCurrentTime] = useState('9:41');
  const { isMuted, toggleMute, playClick } = useSound();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#111317] flex flex-col items-center justify-center p-0 md:p-6 lg:p-8 relative selection:bg-brand selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#3F7D58]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />

      {/* Top Desktop Controls Bar */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[440px] mb-3 px-2 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            <span className="font-semibold text-neutral-200">1:1 Blinkit Mobile OS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClick();
              toggleMute();
            }}
            className="p-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-neutral-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute UI Sounds' : 'Mute UI Sounds'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-brand" />}
          </button>

          <button
            onClick={() => {
              playClick();
              setIsPhoneView(!isPhoneView);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-neutral-300 hover:text-white transition-colors"
          >
            {isPhoneView ? (
              <>
                <Monitor size={14} />
                <span>Full Web</span>
              </>
            ) : (
              <>
                <Smartphone size={14} className="text-brand" />
                <span>Phone Shell</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isPhoneView
            ? 'max-w-[420px] h-[92vh] max-h-[890px] rounded-[50px] shadow-phone border-[8px] border-[#1e2024] bg-surface-cream overflow-hidden flex flex-col'
            : 'max-w-2xl min-h-[95vh] rounded-3xl bg-surface-cream shadow-2xl border border-neutral-800 overflow-hidden flex flex-col'
        }`}
      >
        {/* Phone Frame Status Bar & Dynamic Island */}
        {isPhoneView && (
          <div className="relative bg-brand text-white px-7 pt-3 pb-1 flex items-center justify-between z-30 select-none flex-shrink-0">
            {/* Clock */}
            <span className="text-xs font-bold tracking-tight">{currentTime}</span>

            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-6 bg-black rounded-full dynamic-island flex items-center justify-between px-2 text-white text-[9px] pointer-events-auto cursor-pointer">
              <div className="w-2.5 h-2.5 rounded-full bg-brand flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
              <span className="font-medium text-[10px] text-brand-light">8 mins</span>
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <span className="text-[10px]">5G</span>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.64 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
              </svg>
              {/* Battery */}
              <div className="w-5 h-2.5 rounded-[3px] border border-white/80 p-[1px] flex items-center">
                <div className="w-3/4 h-full bg-white rounded-[1px]" />
              </div>
            </div>
          </div>
        )}

        {/* Inner Phone Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative bg-surface-cream hide-scrollbar">
          {children}
        </div>

        {/* iPhone Home Indicator Bar */}
        {isPhoneView && (
          <div className="w-full bg-surface-card py-1.5 flex justify-center items-center select-none flex-shrink-0 border-t border-stroke-soft">
            <div className="w-32 h-1 bg-neutral-300 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

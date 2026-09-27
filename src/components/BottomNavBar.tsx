import React from 'react';
import { Home, LayoutGrid, Printer, RotateCcw, User } from 'lucide-react';
import { useSound } from '../context/SoundContext';

export type NavTab = 'home' | 'categories' | 'print' | 'reorder' | 'account';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const { playClick } = useSound();

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'categories', label: 'Categories', icon: <LayoutGrid size={20} /> },
    { id: 'print', label: 'Print', icon: <Printer size={20} /> },
    { id: 'reorder', label: 'Reorder', icon: <RotateCcw size={20} /> },
    { id: 'account', label: 'Account', icon: <User size={20} /> },
  ];

  return (
    <nav className="bg-surface-card border-t border-stroke-soft px-2 py-1.5 flex items-center justify-around z-20 shadow-bottom-bar select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              playClick();
              onTabChange(tab.id);
            }}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
              isActive ? 'text-brand' : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] tracking-tight ${isActive ? 'font-extrabold text-brand' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

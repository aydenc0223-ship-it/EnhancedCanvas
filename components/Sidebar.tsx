import React from 'react';
import { GlassCard } from './GlassCard';

interface SidebarProps {
  allCourses: string[];
  activeCourses: string[];
  onToggleCourse: (course: string) => void;
  onToggleAll: (enable: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  allCourses, 
  activeCourses, 
  onToggleCourse, 
  onToggleAll 
}) => {
  return (
    <GlassCard className="p-4 h-full">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h3 className="text-white font-bold uppercase tracking-wider text-sm whitespace-nowrap">Classes</h3>
        <div className="flex space-x-2 text-[10px] text-white/50 whitespace-nowrap">
          <button onClick={() => onToggleAll(true)} className="hover:text-white transition-colors">All</button>
          <span>/</span>
          <button onClick={() => onToggleAll(false)} className="hover:text-white transition-colors">None</button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        {allCourses.map((course) => {
          const isActive = activeCourses.includes(course);
          return (
            <button
              key={course}
              onClick={() => onToggleCourse(course)}
              className={`
                group flex items-center justify-between w-full p-2.5 rounded-xl text-left transition-all duration-300
                ${isActive 
                  ? 'bg-pink-500/20 border border-pink-500/30 text-white shadow-[0_0_15px_-3px_rgba(236,72,153,0.3)]' 
                  : 'bg-white/5 border border-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                }
              `}
            >
              <span className="text-sm font-medium mr-2 leading-tight">{course}</span>
              <div className={`
                flex-shrink-0 w-2 h-2 rounded-full transition-all duration-300
                ${isActive ? 'bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'bg-transparent border border-white/20'}
              `} />
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};

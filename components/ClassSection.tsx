import React from 'react';
import { ClassGroup } from '../types';
import { AssignmentCard } from './AssignmentCard';
import { IconChevronDown, IconChevronUp } from './Icons';
import { GlassCard } from './GlassCard';

interface ClassSectionProps {
  group: ClassGroup;
  onToggle: (courseName: string) => void;
}

export const ClassSection: React.FC<ClassSectionProps> = ({ group, onToggle }) => {
  const assignmentCount = group.assignments.length;

  return (
    <div className="mb-6">
      <div 
        onClick={() => onToggle(group.courseName)}
        className="flex items-center justify-between cursor-pointer mb-3 px-2 group select-none"
      >
        <div className="flex items-center space-x-3">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center 
            bg-gradient-to-br from-pink-500/40 to-indigo-500/40 
            border border-white/20 text-white font-bold text-sm shadow-lg
          `}>
            {group.courseName.substring(0, 2).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide drop-shadow-md">
            {group.courseName}
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/70 border border-white/10">
            {assignmentCount}
          </span>
        </div>
        <div className="text-white/60 group-hover:text-white transition-colors">
          {group.isVisible ? <IconChevronUp className="w-5 h-5" /> : <IconChevronDown className="w-5 h-5" />}
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${group.isVisible ? 'opacity-100' : 'opacity-50 h-0 overflow-hidden'}`}>
        {group.assignments.map(assignment => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
        {assignmentCount === 0 && (
          <GlassCard className="p-4 text-center text-white/40 italic">
            No upcoming assignments
          </GlassCard>
        )}
      </div>
    </div>
  );
};

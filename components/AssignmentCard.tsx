import React, { useState } from 'react';
import { Assignment } from '../types';
import { GlassCard } from './GlassCard';
import { IconRobot, IconChevronDown, IconChevronUp } from './Icons';

interface AssignmentCardProps {
  assignment: Assignment;
  onStartChat: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onStartChat }) => {
  const [expanded, setExpanded] = useState(false);

  const handleStartChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartChat(assignment);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const formattedDate = assignment.startDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = assignment.startDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <GlassCard onClick={toggleExpand} className="mb-4 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:bg-white/15">
      <div className="p-4">
        {/* Course Tag and Expand Icon */}
        <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20 truncate max-w-[200px]">
                {assignment.course}
            </span>
             <div className="text-white/40 group-hover:text-white/70 transition-colors">
                {expanded ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
             </div>
        </div>

        {/* Main Info */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg leading-tight mb-1 group-hover:text-pink-200 transition-colors break-words">
              {assignment.summary}
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Due: <span className="text-white/90 font-medium whitespace-nowrap">{formattedDate}</span> at {formattedTime}
            </p>
          </div>
        </div>

        {/* Expanded Content Area - Description & Action */}
        <div 
          className={`
            transition-all duration-500 ease-in-out overflow-hidden
            ${expanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="bg-black/20 rounded-xl p-4 text-sm text-white/80 border border-white/5 overflow-y-auto max-h-[300px] mb-4 custom-scrollbar">
             <h4 className="text-xs uppercase tracking-wider text-blue-300 mb-2 font-bold">Details</h4>
            <p className="whitespace-pre-wrap leading-relaxed break-words font-light">
              {assignment.description || "No description details provided."}
            </p>
          </div>

          <button
                onClick={handleStartChat}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-500/20 transition-all duration-300 border border-white/10 group-hover:scale-[1.01]"
            >
                <IconRobot className="w-5 h-5" />
                <span>Tackle with AI Tutor</span>
          </button>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500 rounded-full blur-[50px] opacity-20 pointer-events-none"></div>
    </GlassCard>
  );
};

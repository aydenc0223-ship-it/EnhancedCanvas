import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        backdrop-blur-xl bg-white/10 border border-white/20 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] 
        rounded-2xl transition-all duration-300
        ${onClick ? 'cursor-pointer hover:bg-white/15' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

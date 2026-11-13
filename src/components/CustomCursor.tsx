import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only activate custom cursor on non-touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target) {
        const isClickable = 
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer');
        setIsPointer(isClickable);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {/* Focal Dot */}
      <div 
        className={`w-2 h-2 rounded-full transition-all duration-200 custom-cursor-dot ${
          isPointer ? 'bg-[#D72626] scale-150' : 'bg-[#D72626]/80'
        }`} 
      />

      {/* Architectural Crosshair Target Overlay */}
      <div 
        className={`absolute -inset-3 border border-[#D72626]/40 transition-all duration-300 pointer-events-none custom-cursor-crosshair ${
          isPointer ? 'scale-125 border-[#D72626] rotate-45' : 'scale-100'
        }`}
      />
    </div>
  );
};

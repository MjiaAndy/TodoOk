// components/shared/AuroraBackground.tsx
'use client';

export function AuroraBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10 opacity-30
                 bg-gradient-to-tr from-primary via-purple-500 to-accent
                 bg-[length:300%_300%] animate-aurora"
    />
  );
}
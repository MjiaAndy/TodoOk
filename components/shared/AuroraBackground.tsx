'use client';

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950 ">
      
      {/* Orbe de luz 1 */}
      <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),rgba(255,255,255,0))]"></div>
      
      {/* Orbe de luz 2 */}
      <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),rgba(255,255,255,0))]"></div>

      {/* Orbe de luz 3 */}
      <div className="absolute bottom-0 right-[30%] top-[20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),rgba(255,255,255,0))]"></div>

    </div>
  );
}


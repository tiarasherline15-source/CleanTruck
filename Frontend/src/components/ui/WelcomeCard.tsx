import { useState, useEffect } from "react";

const welcomeSubtitles = [
  "Ready to make your environment cleaner today?",
  "Your next waste collection is right on schedule.",
  "Every small action today creates a cleaner tomorrow.",
  "Track your pickups and eco impact in real time.",
  "Recycling made easy right from your doorstep.",
];

const SUBTITLE_ROTATE_MS = 3 * 60 * 1000;

interface WelcomeCardProps {
  userName: string;
  children?: React.ReactNode;
}

export const WelcomeCard = ({ userName, children }: WelcomeCardProps) => {
  const [now, setNow] = useState(new Date());
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const clockTimer = setInterval(() => setNow(new Date()), 1000);
    const subtitleTimer = setInterval(
      () => setSubtitleIndex((i) => (i + 1) % welcomeSubtitles.length),
      SUBTITLE_ROTATE_MS
    );
    return () => {
      clearInterval(clockTimer);
      clearInterval(subtitleTimer);
    };
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const liveTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const liveDate = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 sm:p-6 animate-fade-in-up"
      style={{
        backgroundColor: "#0F6E56",
        boxShadow: "0 16px 36px -18px rgba(15, 110, 86, 0.45)",
      }}
    >
      
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full animate-float-slow" style={{ backgroundColor: "rgba(29, 158, 117, 0.45)" }}>
          <div className="absolute right-12 top-12 h-10 w-10 rounded-full" style={{ backgroundColor: "rgba(159, 225, 203, 0.3)" }} />
          <div className="absolute right-20 top-20 h-3 w-3 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} />
          <div className="absolute right-6 bottom-14 h-5 w-5 rounded-full" style={{ backgroundColor: "rgba(225, 245, 238, 0.25)" }} />
        </div>
        
        <div className="absolute top-12 right-44 h-24 w-24 rounded-full animate-float" style={{ backgroundColor: "rgba(159, 225, 203, 0.16)", animationDelay: "1.2s" }}>
          <div className="absolute left-5 top-7 h-6 w-6 rounded-full" style={{ backgroundColor: "rgba(29, 158, 117, 0.5)" }} />
          <div className="absolute left-10 top-10 h-2 w-2 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }} />
        </div>
        
        <div className="absolute -bottom-8 right-24 h-28 w-28 rounded-full animate-float-slow" style={{ backgroundColor: "rgba(29, 158, 117, 0.3)", animationDelay: "2s" }}>
          <div className="absolute left-7 top-7 h-7 w-7 rounded-full" style={{ backgroundColor: "rgba(225, 245, 238, 0.3)" }} />
        </div>
       
        <div className="absolute top-20 right-12 h-2 w-2 rounded-full animate-float" style={{ backgroundColor: "rgba(255, 255, 255, 0.35)", animationDelay: "0.4s" }} />
        <div className="absolute top-36 right-20 h-1.5 w-1.5 rounded-full animate-float-slow" style={{ backgroundColor: "rgba(159, 225, 203, 0.7)", animationDelay: "2.6s" }} />
        <div className="absolute bottom-16 left-1/2 h-2 w-2 rounded-full animate-float" style={{ backgroundColor: "rgba(159, 225, 203, 0.4)", animationDelay: "3.4s" }} />
      </div>

      <div className="relative z-10 max-w-2xl">
       
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "rgba(29, 158, 117, 0.35)", color: "#E1F5EE" }}
          >
            
            {greeting} · {liveDate}
          </span>
          <span className="text-xs font-semibold tabular-nums" style={{ color: "#9FE1CB" }}>
            {liveTime}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold leading-snug text-white">
          Welcome back, <span className="text-[#9FE1CB] text-lg sm:text-xl">{userName}</span>
        </h1>

        <p
          key={subtitleIndex}
          className="mt-2 text-sm animate-fade-in"
          style={{ color: "#C9EBDD" }}
        >
          {welcomeSubtitles[subtitleIndex]}
        </p>

       
        {children && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

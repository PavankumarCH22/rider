import React from "react";

export default function BikeAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-panel border border-panelLine rounded-2xl glass overflow-hidden relative select-none">
      <style>{`
        .scene-3d {
          perspective: 600px;
          width: 200px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-center: center;
          transform-style: preserve-3d;
        }
        
        .bike-3d {
          width: 160px;
          height: 100px;
          transform-style: preserve-3d;
          animation: ride-3d 3.5s ease-in-out infinite;
        }
        
        .layer-back {
          transform: translateZ(-12px);
        }
        
        .layer-mid {
          transform: translateZ(0px);
        }
        
        .layer-front {
          transform: translateZ(12px);
        }
        
        .layer-beam {
          transform: translateZ(18px);
          animation: beam-pulse 1.5s infinite alternate;
        }

        .wheel-3d {
          animation: spin-3d 0.5s linear infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        
        .bike-shadow {
          animation: shadow-3d 3.5s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        
        .speed-line-3d {
          stroke-dasharray: 8, 16;
          animation: speed-trail-3d 0.8s linear infinite;
        }
        
        .line-1 { animation-delay: 0s; }
        .line-2 { animation-delay: 0.25s; }
        .line-3 { animation-delay: 0.5s; }

        @keyframes ride-3d {
          0%, 100% {
            transform: rotateY(-22deg) rotateX(12deg) rotateZ(-1deg) translateY(0) translateZ(-10px);
          }
          25% {
            transform: rotateY(-5deg) rotateX(8deg) rotateZ(1deg) translateY(-3px) translateZ(10px);
          }
          50% {
            transform: rotateY(22deg) rotateX(12deg) rotateZ(2deg) translateY(1px) translateZ(30px);
          }
          75% {
            transform: rotateY(5deg) rotateX(14deg) rotateZ(-1deg) translateY(-2px) translateZ(10px);
          }
        }
        
        @keyframes shadow-3d {
          0%, 100% {
            transform: scale(0.85) translateX(-8px);
            opacity: 0.18;
          }
          25% {
            transform: scale(0.95) translateX(-2px);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.1) translateX(8px);
            opacity: 0.35;
          }
          75% {
            transform: scale(0.95) translateX(2px);
            opacity: 0.25;
          }
        }
        
        @keyframes spin-3d {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes speed-trail-3d {
          0% {
            stroke-dashoffset: 24;
            opacity: 0;
            transform: translateZ(-20px) translateX(20px);
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            stroke-dashoffset: -24;
            opacity: 0;
            transform: translateZ(-20px) translateX(-40px);
          }
        }
        
        @keyframes beam-pulse {
          0%, 100% {
            opacity: 0.25;
            transform: translateZ(18px) scaleY(1);
          }
          50% {
            opacity: 0.4;
            transform: translateZ(18px) scaleY(1.08);
          }
        }
      `}</style>

      {/* 3D Scene Wrapper */}
      <div className="scene-3d">
        <div className="bike-3d">
          <svg
            viewBox="0 0 160 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="beam3D" x1="112" y1="42" x2="160" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--color-accent, #FFC845)" stopOpacity="0.85" />
                <stop offset="100%" stopColor="var(--color-accent, #FFC845)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="body3D" x1="30" y1="20" x2="120" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--color-accent, #FFC845)" />
                <stop offset="50%" stopColor="var(--color-primary, #38bdf8)" />
                <stop offset="100%" stopColor="var(--color-accent, #FFC845)" />
              </linearGradient>
            </defs>

            {/* Speed trails (rendered in 3D space) */}
            <g style={{ transform: "translateZ(-40px)" }}>
              <line className="speed-line-3d line-1" x1="-10" y1="32" x2="30" y2="32" stroke="var(--color-primary, #38bdf8)" strokeWidth="2" strokeLinecap="round" />
              <line className="speed-line-3d line-2" x1="-20" y1="50" x2="20" y2="50" stroke="var(--color-accent, #FFC845)" strokeWidth="1.5" strokeLinecap="round" />
              <line className="speed-line-3d line-3" x1="-15" y1="65" x2="25" y2="65" stroke="var(--color-primary, #38bdf8)" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* 3D Ground Shadow */}
            <ellipse
              className="bike-shadow"
              cx="75"
              cy="85"
              rx="40"
              ry="4"
              fill="rgba(0,0,0,0.5)"
            />

            {/* BACK LAYER: Exhaust, engine details, back side cover */}
            <g className="layer-back" style={{ transformStyle: "preserve-3d" }}>
              {/* Exhaust pipe */}
              <path
                d="M 32,68 L 56,65 C 58,64 60,66 60,68 C 60,70 58,72 56,72 L 32,72 Z"
                fill="#475569"
                stroke="#1e293b"
                strokeWidth="1"
              />
              {/* Engine casing */}
              <circle cx="48" cy="68" r="8" fill="#334155" />
            </g>

            {/* MID LAYER: Main body, wheels, road line */}
            <g className="layer-mid" style={{ transformStyle: "preserve-3d" }}>
              {/* Road dashes */}
              <line
                x1="5"
                y1="85"
                x2="155"
                y2="85"
                stroke="var(--color-panelLine, #334155)"
                strokeWidth="1.5"
                strokeDasharray="8, 12"
              />

              {/* Rear Wheel (Spinning) */}
              <g className="wheel-3d">
                <circle cx="45" cy="70" r="12" stroke="var(--color-text, #e2e8f0)" strokeWidth="3.5" fill="var(--color-bg, #0f172a)" />
                <circle cx="45" cy="70" r="5" stroke="var(--color-muted, #475569)" strokeWidth="1.5" fill="#1e293b" />
                <line x1="45" y1="58" x2="45" y2="82" stroke="var(--color-muted, #475569)" strokeWidth="1.5" />
                <line x1="33" y1="70" x2="57" y2="70" stroke="var(--color-muted, #475569)" strokeWidth="1.5" />
              </g>

              {/* Front Wheel (Spinning) */}
              <g className="wheel-3d">
                <circle cx="105" cy="70" r="12" stroke="var(--color-text, #e2e8f0)" strokeWidth="3.5" fill="var(--color-bg, #0f172a)" />
                <circle cx="105" cy="70" r="5" stroke="var(--color-muted, #475569)" strokeWidth="1.5" fill="#1e293b" />
                <line x1="105" y1="58" x2="105" y2="82" stroke="var(--color-muted, #475569)" strokeWidth="1.5" />
                <line x1="93" y1="70" x2="117" y2="70" stroke="var(--color-muted, #475569)" strokeWidth="1.5" />
              </g>

              {/* Scooter Chassis Main Loop */}
              <path
                d="M 45,70 C 45,50 52,42 68,42 C 80,42 85,55 86,69"
                fill="url(#body3D)"
              />
              
              {/* Floorboard platform */}
              <path
                d="M 52,69 L 85,69 C 90,69 92,67 93,62 L 98,42"
                stroke="url(#body3D)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* FRONT LAYER: Handlebars, steering column, seat, front shield */}
            <g className="layer-front" style={{ transformStyle: "preserve-3d" }}>
              {/* Seat */}
              <path
                d="M 45,43 C 45,39 52,36 62,36 C 70,36 74,38 74,43 Z"
                fill="var(--color-text, #e2e8f0)"
                stroke="var(--color-panelLine, #475569)"
                strokeWidth="1"
              />

              {/* Front steering fork */}
              <line
                x1="105"
                y1="70"
                x2="99"
                y2="36"
                stroke="var(--color-text, #e2e8f0)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Handlebars */}
              <path
                d="M 90,36 L 102,36 C 104,36 106,35 106,33"
                stroke="var(--color-text, #e2e8f0)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Rear fender */}
              <path
                d="M 32,70 C 32,56 58,56 58,70"
                stroke="var(--color-accent, #FFC845)"
                strokeWidth="3"
                fill="none"
              />

              {/* Headlight cup */}
              <circle cx="106" cy="40" r="4.5" fill="var(--color-text, #e2e8f0)" />
              <circle cx="107" cy="40" r="2.5" fill="var(--color-accent, #FFC845)" />
            </g>

            {/* HEADLIGHT BEAM LAYER (frontmost 3D depth) */}
            <g className="layer-beam" style={{ transformStyle: "preserve-3d" }}>
              <polygon
                points="108,40 160,20 160,65"
                fill="url(#beam3D)"
              />
            </g>
          </svg>
        </div>
      </div>

      <p className="mt-6 text-xs font-semibold tracking-widest text-accent uppercase animate-pulse">
        Comparing live fare estimates...
      </p>
    </div>
  );
}

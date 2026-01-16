import { useEffect, useState } from 'react';

interface WaveLogoProps {
  size?: number;
  className?: string;
}

export default function WaveLogo({ size = 48, className = '' }: WaveLogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background circle with gradient */}
      <div 
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0284c7 100%)',
          boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)',
        }}
      >
        {/* Animated waves inside the container */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          {/* Wave 1 - Back wave (lighter) */}
          <path
            fill="rgba(255, 255, 255, 0.15)"
            d="M0 60 Q 25 45, 50 60 T 100 60 L 100 100 L 0 100 Z"
          >
            <animate
              attributeName="d"
              dur="3s"
              repeatCount="indefinite"
              values="
                M0 60 Q 25 45, 50 60 T 100 60 L 100 100 L 0 100 Z;
                M0 55 Q 25 70, 50 55 T 100 55 L 100 100 L 0 100 Z;
                M0 60 Q 25 45, 50 60 T 100 60 L 100 100 L 0 100 Z
              "
            />
          </path>

          {/* Wave 2 - Middle wave */}
          <path
            fill="rgba(255, 255, 255, 0.25)"
            d="M0 65 Q 25 55, 50 65 T 100 65 L 100 100 L 0 100 Z"
          >
            <animate
              attributeName="d"
              dur="2.5s"
              repeatCount="indefinite"
              values="
                M0 65 Q 25 55, 50 65 T 100 65 L 100 100 L 0 100 Z;
                M0 70 Q 25 80, 50 70 T 100 70 L 100 100 L 0 100 Z;
                M0 65 Q 25 55, 50 65 T 100 65 L 100 100 L 0 100 Z
              "
            />
          </path>

          {/* Wave 3 - Front wave (most visible) */}
          <path
            fill="rgba(255, 255, 255, 0.35)"
            d="M0 75 Q 25 65, 50 75 T 100 75 L 100 100 L 0 100 Z"
          >
            <animate
              attributeName="d"
              dur="2s"
              repeatCount="indefinite"
              values="
                M0 75 Q 25 65, 50 75 T 100 75 L 100 100 L 0 100 Z;
                M0 70 Q 25 85, 50 70 T 100 70 L 100 100 L 0 100 Z;
                M0 75 Q 25 65, 50 75 T 100 75 L 100 100 L 0 100 Z
              "
            />
          </path>

          {/* Sun/moon reflection sparkle */}
          <circle cx="75" cy="30" r="8" fill="rgba(255, 255, 255, 0.4)">
            <animate
              attributeName="opacity"
              dur="3s"
              repeatCount="indefinite"
              values="0.4;0.7;0.4"
            />
            <animate
              attributeName="r"
              dur="3s"
              repeatCount="indefinite"
              values="8;10;8"
            />
          </circle>
          
          {/* Small sparkle */}
          <circle cx="65" cy="38" r="3" fill="rgba(255, 255, 255, 0.3)">
            <animate
              attributeName="opacity"
              dur="2s"
              repeatCount="indefinite"
              values="0.3;0.6;0.3"
            />
          </circle>
        </svg>
      </div>

      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}

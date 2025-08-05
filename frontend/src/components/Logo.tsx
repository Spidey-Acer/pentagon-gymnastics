interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'colorful';
  showText?: boolean;
  className?: string;
}

export default function Logo({ 
  size = 'md', 
  variant = 'colorful', 
  showText = true,
  className = ''
}: LogoProps) {
  const sizes = {
    sm: { container: 'w-6 h-6', text: 'text-sm' },
    md: { container: 'w-8 h-8', text: 'text-lg' },
    lg: { container: 'w-12 h-12', text: 'text-xl' },
    xl: { container: 'w-16 h-16', text: 'text-2xl' }
  };

  const variants = {
    light: {
      pentagon: '#ffffff',
      inner: '#f0f9ff',
      gymnast: '#1e40af',
      stroke: '#60a5fa'
    },
    dark: {
      pentagon: '#1e40af',
      inner: '#3b82f6',
      gymnast: '#ffffff',
      stroke: '#60a5fa'
    },
    colorful: {
      pentagon: 'url(#pentagonGradient)',
      inner: 'url(#innerGradient)',
      gymnast: '#1e40af',
      stroke: '#60a5fa'
    }
  };

  const colors = variants[variant];

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizes[size].container} mr-2`}>
        <svg
          className={sizes[size].container}
          viewBox="0 0 100 100"
          fill="none"
        >
          <defs>
            <linearGradient id="pentagonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          {/* Outer Pentagon */}
          <polygon
            points="50,10 80,35 70,75 30,75 20,35"
            fill={colors.pentagon}
            stroke={colors.stroke}
            strokeWidth="2"
          />
          
          {/* Inner Pentagon */}
          <polygon
            points="50,22 68,40 60,62 40,62 32,40"
            fill={colors.inner}
            opacity="0.8"
          />
          
          {/* Dumbbell Icon */}
          <g transform="translate(50,45)">
            {/* Left weight */}
            <rect x="-18" y="-4" width="6" height="8" rx="1" fill={colors.gymnast} />
            {/* Right weight */}
            <rect x="12" y="-4" width="6" height="8" rx="1" fill={colors.gymnast} />
            {/* Handle */}
            <rect x="-12" y="-1" width="24" height="2" rx="1" fill={colors.gymnast} />
            {/* Handle grips */}
            <circle cx="-8" cy="0" r="0.5" fill={colors.stroke} opacity="0.7" />
            <circle cx="-4" cy="0" r="0.5" fill={colors.stroke} opacity="0.7" />
            <circle cx="0" cy="0" r="0.5" fill={colors.stroke} opacity="0.7" />
            <circle cx="4" cy="0" r="0.5" fill={colors.stroke} opacity="0.7" />
            <circle cx="8" cy="0" r="0.5" fill={colors.stroke} opacity="0.7" />
          </g>
        </svg>
        
        {/* Animated sparkles for larger sizes */}
        {(size === 'lg' || size === 'xl') && (
          <>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1 -left-1 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-300"></div>
            <div className="absolute -bottom-1 right-0 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
          </>
        )}
      </div>
      
      {showText && (
        <span className={`font-bold ${sizes[size].text} ${
          variant === 'light' ? 'text-white' : 
          variant === 'dark' ? 'text-gray-900' : 
          'bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'
        }`}>
          Pentagon Gymnastics
        </span>
      )}
    </div>
  );
}

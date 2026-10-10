import React from 'react';

const BackgroundCircles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Shared SVG Gradients Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          {/* Main Red Radial Gradient */}
          <radialGradient id="redGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C0202A" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#E0B09D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C0202A" stopOpacity="0" />
          </radialGradient>

          {/* Linear Red-to-Peach Ring Gradient */}
          <linearGradient id="redLinearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C0202A" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#E0B09D" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0E2044" stopOpacity="0.4" />
          </linearGradient>

          {/* Deep Red Radial Glow */}
          <radialGradient id="deepRedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C0202A" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#C0202A" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#C0202A" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Top-Left Animated Corner SVG */}
      <div className="absolute -top-20 -left-20 sm:-top-28 sm:-left-28 md:-top-36 md:-left-36 w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] opacity-40 sm:opacity-50 transition-opacity duration-300">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background Glow */}
          <circle cx="200" cy="200" r="190" fill="url(#redGlowGrad)" className="animate-pulse-glow" />
          
          {/* Outer Clockwise Spinning Dashed Ring */}
          <g className="animate-spin-slow" style={{ transformOrigin: '200px 200px' }}>
            <circle cx="200" cy="200" r="170" stroke="url(#redLinearGrad)" strokeWidth="2.5" strokeDasharray="12 12" strokeOpacity="0.7" />
            <circle cx="200" cy="200" r="150" stroke="#C0202A" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.4" />
            <circle cx="370" cy="200" r="6" fill="#C0202A" />
            <circle cx="30" cy="200" r="4" fill="#E0B09D" />
          </g>

          {/* Inner Counter-Clockwise Spinning Ring */}
          <g className="animate-spin-reverse-slow" style={{ transformOrigin: '200px 200px' }}>
            <circle cx="200" cy="200" r="120" stroke="url(#redLinearGrad)" strokeWidth="2" strokeDasharray="20 10" strokeOpacity="0.6" />
            <circle cx="200" cy="200" r="90" stroke="#C0202A" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="200" cy="80" r="5" fill="#C0202A" />
          </g>

          {/* Pulsing Core Center */}
          <circle cx="200" cy="200" r="60" fill="#C0202A" fillOpacity="0.12" stroke="#C0202A" strokeWidth="2" className="animate-pulse-glow" />
          <circle cx="200" cy="200" r="20" fill="url(#redLinearGrad)" className="animate-pulse" />
        </svg>
      </div>

      {/* Top-Right Animated Corner SVG */}
      <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 md:-top-32 md:-right-32 w-64 h-64 sm:w-80 sm:h-80 md:w-[24rem] md:h-[24rem] opacity-35 sm:opacity-45 transition-opacity duration-300">
        <svg viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="180" cy="180" r="165" fill="url(#deepRedGlow)" className="animate-pulse-glow" />
          
          {/* Spinning Outer Ring */}
          <g className="animate-spin-slow" style={{ transformOrigin: '180px 180px' }}>
            <circle cx="180" cy="180" r="145" stroke="url(#redLinearGrad)" strokeWidth="2" strokeDasharray="16 8" strokeOpacity="0.6" />
            <circle cx="180" cy="180" r="115" stroke="#C0202A" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.4" />
            <circle cx="325" cy="180" r="5" fill="#C0202A" />
          </g>

          {/* Counter-Spinning Geometric Ring */}
          <g className="animate-spin-reverse-slow" style={{ transformOrigin: '180px 180px' }}>
            <circle cx="180" cy="180" r="85" stroke="url(#redLinearGrad)" strokeWidth="2.5" strokeDasharray="10 15" strokeOpacity="0.7" />
            <circle cx="180" cy="95" r="4" fill="#E0B09D" />
          </g>

          <circle cx="180" cy="180" r="40" fill="#C0202A" fillOpacity="0.15" stroke="#C0202A" strokeWidth="1.5" />
          <circle cx="180" cy="180" r="12" fill="#C0202A" fillOpacity="0.7" />
        </svg>
      </div>

      {/* Bottom-Left Animated Corner SVG */}
      <div className="absolute -bottom-20 -left-20 sm:-bottom-28 sm:-left-28 md:-bottom-36 md:-left-36 w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] opacity-35 sm:opacity-45 transition-opacity duration-300">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="200" cy="200" r="185" fill="url(#redGlowGrad)" className="animate-pulse-glow" />
          
          {/* Spinning Ring */}
          <g className="animate-spin-reverse-slow" style={{ transformOrigin: '200px 200px' }}>
            <circle cx="200" cy="200" r="160" stroke="url(#redLinearGrad)" strokeWidth="2" strokeDasharray="14 10" strokeOpacity="0.65" />
            <circle cx="200" cy="200" r="125" stroke="#C0202A" strokeWidth="1.5" strokeDasharray="5 10" strokeOpacity="0.4" />
            <circle cx="360" cy="200" r="5" fill="#C0202A" />
          </g>

          {/* Inner Spinning Ring */}
          <g className="animate-spin-slow" style={{ transformOrigin: '200px 200px' }}>
            <circle cx="200" cy="200" r="90" stroke="url(#redLinearGrad)" strokeWidth="2" strokeDasharray="8 8" strokeOpacity="0.7" />
            <circle cx="200" cy="110" r="4" fill="#E0B09D" />
          </g>

          <circle cx="200" cy="200" r="50" fill="#C0202A" fillOpacity="0.1" stroke="#C0202A" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Bottom-Right Animated Corner SVG */}
      <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 md:-bottom-32 md:-right-32 w-68 h-68 sm:w-88 sm:h-88 md:w-[26rem] md:h-[26rem] opacity-40 sm:opacity-50 transition-opacity duration-300">
        <svg viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="190" cy="190" r="175" fill="url(#deepRedGlow)" className="animate-pulse-glow" />
          
          {/* Outer Spin Ring */}
          <g className="animate-spin-slow" style={{ transformOrigin: '190px 190px' }}>
            <circle cx="190" cy="190" r="150" stroke="url(#redLinearGrad)" strokeWidth="2.5" strokeDasharray="18 12" strokeOpacity="0.7" />
            <circle cx="190" cy="190" r="120" stroke="#C0202A" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.45" />
            <circle cx="340" cy="190" r="6" fill="#C0202A" />
          </g>

          {/* Inner Counter Spin Ring */}
          <g className="animate-spin-reverse-slow" style={{ transformOrigin: '190px 190px' }}>
            <circle cx="190" cy="190" r="85" stroke="url(#redLinearGrad)" strokeWidth="2" strokeDasharray="10 10" strokeOpacity="0.6" />
            <circle cx="190" cy="105" r="4" fill="#E0B09D" />
          </g>

          <circle cx="190" cy="190" r="45" fill="#C0202A" fillOpacity="0.15" stroke="#C0202A" strokeWidth="2" className="animate-pulse-glow" />
          <circle cx="190" cy="190" r="14" fill="url(#redLinearGrad)" />
        </svg>
      </div>

      {/* Floating Ambient Glowing Soft Orbs for Modern Aesthetic */}
      <div className="absolute top-1/3 -left-16 w-80 h-80 bg-gradient-to-tr from-[#C0202A]/15 to-[#E0B09D]/10 rounded-full blur-3xl animate-float-subtle" />
      <div className="absolute bottom-1/3 -right-16 w-80 h-80 bg-gradient-to-bl from-[#C0202A]/15 to-[#0E2044]/10 rounded-full blur-3xl animate-float-subtle" style={{ animationDelay: '-4s' }} />
    </div>
  );
};

export default BackgroundCircles;

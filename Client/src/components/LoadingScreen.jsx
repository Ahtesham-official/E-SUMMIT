import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const phrases = [
  'Think beyond the obvious.',
  'Question what exists.',
  "Imagine what's next.",
];

const LoadingScreen = ({ onComplete }) => {
  const textRef = useRef(null);
  const overlayRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const animatePhrase = (index) => {
      if (index >= phrases.length) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => onComplete(),
        });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            setCurrentIndex(index + 1);
            animatePhrase(index + 1);
          }, 80);
        },
      });

      // Faster: fade in + slide up
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
      )
        // Shorter hold
        .to(textRef.current, { opacity: 1, duration: 0.4 })
        // Fade out + slide up
        .to(textRef.current, {
          opacity: 0,
          y: -25,
          duration: 0.35,
          ease: 'power2.in',
        });
    };

    animatePhrase(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Strong red radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(192,32,42,0.45) 0%, rgba(192,32,42,0.18) 35%, rgba(192,32,42,0.04) 60%, transparent 80%)',
        }}
      />

      {/* Animated text */}
      <p
        ref={textRef}
        className="SixCaps text-center text-[#0E2044] px-6 relative z-10"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 6rem)',
          letterSpacing: '0.05em',
          lineHeight: 1.1,
          opacity: 0,
        }}
      >
        {phrases[currentIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;

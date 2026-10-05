import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BackgroundRibbon from '../assets/Images/ESUMMIT-RIBBON.png';
import Calender from '../assets/Images/calendar.svg';

const Hero = ({ animate, onRegisterClick }) => {
  const ribbonRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const metaRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    if (!animate) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Ribbon enters diagonally from bottom-right
    tl.fromTo(
      ribbonRef.current,
      { x: '30%', y: '80%', opacity: 0, rotate: -20, scale: 0.8 },
      { x: '25%', y: '18%', opacity: 1, rotate: -12, scale: 1, duration: 1.1, ease: 'power4.out' },
      0
    )
    .fromTo(labelRef.current,   { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.15)
    .fromTo(titleRef.current,   { y: 60,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.6  }, 0.3)
    .fromTo(taglineRef.current, { y: 50,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.45)
    .fromTo(metaRef.current,    { y: 30,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.5  }, 0.58)
    .fromTo(descRef.current,    { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0.68)
    .fromTo(buttonsRef.current, { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0.78);
  }, [animate]);

  return (
    <section id="hero" className="relative w-full h-screen flex flex-col justify-center px-6 sm:px-10 md:px-16 overflow-hidden pt-[10vh]">
      {/* Background large 27 */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full flex justify-center items-center opacity-20 z-[-1] pointer-events-none">
        <h1 className="text-[50vw] md:text-[35vw] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#E0B09D] to-[#E8E9F2]">27</h1>
      </div>

      {/* Background ribbon — animated diagonally */}
      <div className='absolute z-0 top-0 h-full w-full left-0 flex items-center justify-end overflow-hidden pointer-events-none'>
        <img
          ref={ribbonRef}
          src={BackgroundRibbon}
          alt=""
          style={{ opacity: 0 }}
          className="lg:w-[70vw] w-[110vw] md:w-[90vw]"
        />
      </div>

      {/* Main text content */}
      <div className="w-full md:w-3/5 flex flex-col z-10 pb-8 md:pb-16">
        <div ref={labelRef} className="presented-by flex w-full text-[1.2rem] sm:text-[1.5rem] md:text-[1.8rem] font-bold tracking-widest text-red-600 mb-2" style={{ opacity: 0 }}>
          EDIC PRESENTS
        </div>

        <h1 ref={titleRef} className="timesNewRoman text-[3.5rem] sm:text-[4.5rem] md:text-[5rem] lg:text-[6rem] leading-none text-[#0E2044]" style={{ opacity: 0 }}>
          E-SUMMIT<span className="text-[#C0202A]">'27</span>
        </h1>
        <h2 ref={taglineRef} className="SixCaps text-[2.5rem] sm:text-[3rem] md:text-[3.8rem] leading-none text-[#0E2044] mt-4 tracking-wide" style={{ opacity: 0 }}>
          IDEAS. PEOPLE. IMPACT.
        </h2>

        <div ref={metaRef} className="mt-6 md:mt-8 flex flex-col gap-3" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 text-gray-700 font-medium text-sm sm:text-base">
            <img src={Calender} className='w-5 h-5 opacity-70' alt="Calendar"/>
            <span>21st &amp; 22nd January 2027</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 font-medium text-sm sm:text-base">
            <div className="w-5 h-5 flex justify-center items-center border border-gray-400 rounded-full opacity-70 shrink-0">
              <span className="text-xs">📍</span>
            </div>
            <span>TCET, Mumbai</span>
          </div>
        </div>

        <p ref={descRef} className="mt-6 text-gray-600 max-w-md text-sm sm:text-base" style={{ opacity: 0 }}>
          A platform where ideas spark, people connect and impact drives the future.
        </p>

        <div ref={buttonsRef} className="mt-6 md:mt-8 flex flex-wrap gap-4" style={{ opacity: 0 }}>
          <button
            className="navyBg text-white px-6 sm:px-8 py-3 rounded text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
            onClick={onRegisterClick}
          >
            EXPLORE &amp; REGISTER -&gt;
          </button>
          <button
            className="bg-transparent border border-gray-400 text-[#0E2044] px-6 sm:px-8 py-3 rounded text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors"
            onClick={onRegisterClick}
          >
            REGISTER NOW -&gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

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
    const isMobile = window.innerWidth < 768;
    const finalY = isMobile ? '18%' : '18%';
    const finalX = isMobile ? '35%' : '25%';
    const finalScale = isMobile ? 2.3 : 1;

    tl.fromTo(
      ribbonRef.current,
      { x: '30%', y: '80%', opacity: 0, rotate: -20, scale: 0.8 },
      { x: finalX, y: finalY, opacity: 1, rotate: -12, scale: finalScale, duration: 1.1, ease: 'power4.out' },
      0
    )
      .fromTo(labelRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.15)
      .fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.3)
      .fromTo(taglineRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.45)
      .fromTo(metaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.58)
      .fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0.68)
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0.78);
  }, [animate]);

  return (
    <section id="hero" className="relative w-full min-h-screen h-auto sm:h-screen flex flex-col justify-center px-4 sm:px-10 md:px-16 overflow-hidden pt-[12vh] sm:pt-[10vh] pb-10 sm:pb-0">
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
          className="hero-ribbon w-[84vw] md:w-[90vw] lg:w-[70vw]"
        />
      </div>

      {/* Main text content */}
      <div className="w-full md:w-3/5 flex flex-col items-center md:items-start text-center md:text-left z-10 pb-4 sm:pb-8 md:pb-16">
        <div ref={labelRef} className="presented-by flex justify-center md:justify-start w-full text-[0.85rem] sm:text-[1.15rem] md:text-[1.35rem] font-bold tracking-widest text-red-600 mb-1.5 sm:mb-2" style={{ opacity: 0 }}>
          EDIC PRESENTS
        </div>

        <div className="w-fit max-w-full flex flex-col items-center md:items-start">
          <h1 ref={titleRef} className="presented-by text-[2.8rem] min-[380px]:text-[3.4rem] min-[480px]:text-[4.2rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-black sm:font-extrabold tracking-tighter sm:tracking-tight leading-none text-[#0E2044] whitespace-nowrap text-center md:text-left transform scale-y-[1.3] sm:scale-y-100 origin-center md:origin-left my-2 sm:my-0" style={{ opacity: 0 }}>
            E-SUMMIT<span className="text-[#C0202A]">'27</span>
          </h1>
          <h2 ref={taglineRef} className="SixCaps w-full flex justify-between items-center text-[1.8rem] sm:text-[2.3rem] md:text-[2.8rem] font-bold sm:font-normal leading-none text-[#0E2044] mt-2 sm:mt-3 tracking-widest md:tracking-[0.25em] lg:tracking-[0.3em]" style={{ opacity: 0 }}>
            <span className="shrink-0">IDEAS</span>
            <span className="h-[2px] grow mx-2.5 sm:mx-4 bg-[#0E2044]/40 rounded-full"></span>
            <span className="shrink-0">PEOPLE</span>
            <span className="h-[2px] grow mx-2.5 sm:mx-4 bg-[#0E2044]/40 rounded-full"></span>
            <span className="shrink-0">IMPACT</span>
          </h2>
        </div>

        <div ref={metaRef} className="mt-4 sm:mt-6 md:mt-8 flex flex-col items-center md:items-start gap-2.5 sm:gap-3" style={{ opacity: 0 }}>
          <div className="flex items-center justify-center md:justify-start gap-3 text-gray-700 font-medium text-xs sm:text-base">
            <img src={Calender} className='w-4 h-4 sm:w-5 sm:h-5 opacity-70' alt="Calendar" />
            <span>21st &amp; 22nd January 2027</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 text-gray-700 font-medium text-xs sm:text-base">
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex justify-center items-center border border-gray-400 rounded-full opacity-70 shrink-0">
              <span className="text-[10px] sm:text-xs">📍</span>
            </div>
            <span>TCET, Mumbai</span>
          </div>
        </div>

        <p ref={descRef} className="mt-4 sm:mt-6 text-gray-600 max-w-xs sm:max-w-md text-xs sm:text-base leading-relaxed text-center md:text-left mx-auto md:mx-0" style={{ opacity: 0 }}>
          A platform where ideas spark, people connect and impact drives the future.
        </p>

        <div ref={buttonsRef} className="mt-5 sm:mt-6 md:mt-8 flex flex-col min-[450px]:flex-row justify-center md:justify-start items-center md:items-start gap-3 sm:gap-4 w-full min-[450px]:w-auto" style={{ opacity: 0 }}>
          <button
            className="navyBg text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity w-full min-[450px]:w-auto text-center"
            onClick={onRegisterClick}
          >
            EXPLORE &amp; REGISTER -&gt;
          </button>
          <button
            className="bg-transparent border border-gray-400 text-[#0E2044] px-5 sm:px-8 py-2.5 sm:py-3 rounded text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors w-full min-[450px]:w-auto text-center"
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

import React from 'react';

const ScheduleAndPartners = () => {
  const schedule = [
    { time: '10:00 AM', event: 'OPENING CEREMONY' },
    { time: '11:30 AM', event: 'FOUNDER TALK' },
    { time: '12:30 PM', event: 'WORKSHOPS' },
    { time: '02:00 PM', event: 'STARTUP EXPO' },
    { time: '03:30 PM', event: 'FOUNDER TALK' },
    { time: '05:00 PM', event: 'NETWORKING NIGHT' },
  ];

  return (
    <section id="schedule" className="w-full h-screen bg-[#E8DDDC] flex flex-col justify-center px-6 sm:px-10 md:px-16 pt-[10vh] border-t border-gray-200 overflow-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

        {/* Left Side - Schedule & Partners */}
        <div className="space-y-12 md:space-y-16">
          {/* Schedule */}
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-400 mb-2">04 / SCHEDULE</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0E2044] mb-6 md:mb-8">EVENT SCHEDULE</h2>

            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              {schedule.map((item, index) => (
                <div key={index} className="flex gap-4 md:gap-8 items-center border-b border-gray-300/50 pb-3 md:pb-4">
                  <div className="text-red-600 font-bold w-20 md:w-24 text-sm md:text-base shrink-0">{item.time}</div>
                  <div className="text-[#0E2044] font-bold tracking-wide text-sm md:text-base">{item.event}</div>
                </div>
              ))}
            </div>

            <button className="w-full border border-gray-400 text-[#0E2044] font-bold py-3 md:py-4 rounded text-sm md:text-base hover:bg-white/50 transition-colors">
              VIEW FULL SCHEDULE -&gt;
            </button>
          </div>

          {/* Partners */}
          <div id="partners">
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-400 mb-2">05 / PARTNERS</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0E2044] mb-6 md:mb-8">OUR PARTNERS</h2>

            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 items-center">
              <div className="flex justify-center"><span className="text-lg md:text-2xl font-bold text-[#0E2044] opacity-60">EDIC</span></div>
              <div className="flex justify-center"><span className="text-lg md:text-2xl font-bold text-[#0E2044] opacity-60">unstop</span></div>
              <div className="flex justify-center"><span className="text-lg md:text-2xl font-bold text-[#0E2044] opacity-60">N</span></div>
              <div className="flex justify-center"><span className="text-sm md:text-xl font-bold text-[#0E2044] opacity-60">LinkedIn</span></div>
              <div className="flex justify-center"><span className="text-lg md:text-2xl font-bold text-[#0E2044] opacity-60">📷</span></div>
              <div className="flex justify-center"><span className="text-sm md:text-xl font-bold text-[#0E2044] opacity-60">✉ Email</span></div>
            </div>

            <button className="w-full border border-gray-400 text-[#0E2044] font-bold py-3 md:py-4 rounded text-sm md:text-base hover:bg-white/50 transition-colors">
              BECOME A PARTNER -&gt;
            </button>
          </div>
        </div>

        {/* Right Side - CTA & Footer Info */}
        <div className="flex flex-col justify-between gap-12 md:gap-0">
          <div className="bg-gradient-to-br from-[#d6c4c3] to-[#E0B09D] p-8 sm:p-10 md:p-12 rounded-xl shadow-inner relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-9xl">🌊</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0E2044] mb-4 relative z-10 leading-tight">
              READY TO BUILD<br/>WHAT'S NEXT?
            </h2>
            <button className="mt-4 md:mt-6 bg-red-600 text-white px-6 md:px-8 py-3 rounded text-sm font-semibold hover:bg-red-700 transition-colors relative z-10 shadow-lg">
              REGISTER NOW -&gt;
            </button>
          </div>

          <div className="text-sm text-gray-500 space-y-3 md:space-y-4 mt-8 md:mt-0">
            <p className="font-bold text-[#0E2044] text-base">E-SUMMIT 2027</p>
            <p>EDIC - TCET Entrepreneurship Cell</p>
            <div className="flex gap-4 text-lg">
              <a href="#" className="hover:text-[#0E2044] transition-colors">in</a>
              <a href="#" className="hover:text-[#0E2044] transition-colors">📷</a>
              <a href="#" className="hover:text-[#0E2044] transition-colors">✉</a>
            </div>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-300/60 text-xs">
              <a href="#" className="hover:text-[#0E2044] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#0E2044] transition-colors">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ScheduleAndPartners;

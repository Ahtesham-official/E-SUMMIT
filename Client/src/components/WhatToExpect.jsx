import React from 'react';

const WhatToExpect = () => {
  const items = [
    { id: '01', icon: '🎤', title: 'FOUNDER TALKS', desc: 'Inspiring stories from founders who built game-changing ventures.' },
    { id: '02', icon: '👥', title: 'WORKSHOPS', desc: 'Hands-on sessions to learn, build and grow with industry experts.' },
    { id: '03', icon: '🚀', title: 'STARTUP EXPO', desc: 'Discover innovative startups and emerging solutions shaping tomorrow.' },
    { id: '04', icon: '🤝', title: 'NETWORKING', desc: 'Connect with investors, mentors and like-minded changemakers.' }
  ];

  return (
    <section id="what-to-expect" className="w-full h-screen bg-[#E8DDDC] flex flex-col justify-center px-6 sm:px-10 md:px-16 pt-[10vh] border-t border-gray-200 overflow-auto">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8 md:mb-10">
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-400 mb-2">02 / WHAT TO EXPECT</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0E2044]">WHAT TO EXPECT</h2>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-6 sm:gap-10 md:gap-14 bg-white/60 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/40 shadow-sm w-max max-w-full mb-10 md:mb-12">
          {[
            { icon: '👥', stat: '1500+', label: 'ATTENDEES' },
            { icon: '🎤', stat: '30+', label: 'SPEAKERS' },
            { icon: '⭐', stat: '10+', label: 'EVENTS' },
          ].map(({ icon, stat, label }) => (
            <div key={label} className="flex items-center gap-3 md:gap-4">
              <div className="text-red-600 text-2xl md:text-3xl">{icon}</div>
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0E2044]">{stat}</h3>
                <p className="text-xs font-semibold tracking-wider text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, index) => (
            <div key={index} className="bg-white/80 border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-gray-400 text-sm font-semibold mb-4">{item.id}</div>
              <div className="text-3xl md:text-4xl mb-4 md:mb-6 text-red-600">{item.icon}</div>
              <h3 className="text-base md:text-xl font-bold text-[#0E2044] mb-3">{item.title}</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatToExpect;

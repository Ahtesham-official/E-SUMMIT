import React from 'react';
import { Link } from 'react-router-dom';

const Speakers = () => {
  // Show a featured subset (e.g. 4 prominent speakers) on the home page UI
  const featuredSpeakers = [
    { name: 'DR. ANANYA SHARMA', title: 'Founder & CEO', company: 'TechVenture Labs' },
    { name: 'VIKRAM RATHORE', title: 'Managing Partner', company: 'Apex Capital VC' },
    { name: 'MEERA ADANI', title: 'Chief Innovation Officer', company: 'FutureGrid Systems' },
    { name: 'ROHAN MEHTA', title: 'Co-Founder', company: 'HyperGrowth Media' },
  ];

  return (
    <section id="speakers" className="w-full bg-[#E8DDDC] flex flex-col justify-center px-6 sm:px-10 md:px-16 py-16 md:py-24">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-400 mb-2">03 / SPEAKERS</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0E2044]">OUR SPEAKERS</h2>
          </div>
          <Link to="/speakers" className="text-red-600 font-bold text-xs sm:text-sm hover:underline whitespace-nowrap flex items-center gap-1">
            VIEW ALL -&gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredSpeakers.map((speaker, index) => (
            <div key={index} className="bg-white/80 border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-full h-48 sm:h-56 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl md:text-3xl">
                  👤
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="font-bold text-[#0E2044] text-sm md:text-base uppercase">{speaker.name}</h3>
                <p className="text-gray-500 text-xs md:text-sm mt-1">{speaker.title}</p>
                <p className="text-red-600 text-xs md:text-sm font-semibold">{speaker.company}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8 md:mt-10">
          <p className="text-xs text-gray-500 font-medium">Displaying featured speakers for E-Summit '27</p>
          <Link to="/speakers" className="inline-flex items-center gap-2 bg-[#0E2044] text-white px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-red-600 transition-colors">
            Explore All Speakers -&gt;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Speakers;


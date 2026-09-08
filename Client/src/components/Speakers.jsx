import React from 'react';

const Speakers = () => {
  const speakers = Array(8).fill({
    name: 'NAME HERE',
    title: 'Founder,',
    company: 'Company Name'
  });

  return (
    <section id="speakers" className="w-full h-screen bg-[#E8DDDC] flex flex-col justify-center px-6 sm:px-10 md:px-16 pt-[10vh] overflow-auto">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10 md:mb-12">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-400 mb-2">03 / SPEAKERS</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0E2044]">OUR SPEAKERS</h2>
          </div>
          <a href="#" className="text-red-600 font-bold text-xs sm:text-sm hover:underline whitespace-nowrap">VIEW ALL -&gt;</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {speakers.map((speaker, index) => (
            <div key={index} className="bg-white/80 border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-full h-40 sm:h-52 md:h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl md:text-3xl">
                  👤
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="font-bold text-[#0E2044] text-sm md:text-lg uppercase">{speaker.name}</h3>
                <p className="text-gray-500 text-xs md:text-sm mt-1">{speaker.title}</p>
                <p className="text-red-600 text-xs md:text-sm font-semibold">{speaker.company}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 md:mt-10 gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

export default Speakers;

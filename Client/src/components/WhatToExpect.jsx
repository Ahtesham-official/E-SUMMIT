import React, { useState } from 'react';
import {
  Coins,
  Users,
  Presentation,
  Store,
  Briefcase,
  Mic,
  MessagesSquare,
  Compass,
  Handshake,
  Gavel,
  Scale,
  Trophy,
  Network,
  Award,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WhatToExpect = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const events = [
    {
      id: '01',
      title: 'THE TEN MINUTE DEAL (TTMD)',
      desc: 'Pitch to venture capitalists and get a chance to raise funds for your startup.',
      date: '21ST & 22ND JAN 2027',
      icon: Coins,
      categories: ['pitching'],
      categoryLabel: 'Pitching Event',
    },
    {
      id: '02',
      title: 'THE INCUBATOR SUMMIT',
      desc: 'Get evaluated by incubation centre experts and unlock support for your venture.',
      date: '21ST & 22ND JAN 2027',
      icon: Users,
      categories: ['pitching'],
      categoryLabel: 'Pitching Event',
    },
    {
      id: '03',
      title: 'DEMO DAY',
      desc: 'Present your idea to industry mentors and receive feedback and guidance.',
      date: '21ST & 22ND JAN 2027',
      icon: Presentation,
      categories: ['pitching'],
      categoryLabel: 'Pitching Event',
    },
    {
      id: '04',
      title: 'STARTUP EXPO',
      desc: 'Showcase early ideas and prototypes in the college lobby.',
      date: '21ST & 22ND JAN 2027',
      icon: Store,
      categories: ['networking'],
      categoryLabel: 'Networking Event',
    },
    {
      id: '05',
      title: 'INTERNSHIPS FAIR',
      desc: 'Explore opportunities and connect with startups looking for team members.',
      date: '21ST & 22ND JAN 2027',
      icon: Briefcase,
      categories: ['networking'],
      categoryLabel: 'Networking Event',
    },
    {
      id: '06',
      title: 'GUEST SPEAKER SESSION',
      desc: 'Insights and experiences from industry leaders and visionaries.',
      date: '21ST JAN 2027',
      icon: Mic,
      categories: ['speaker'],
      categoryLabel: 'Speaker Session',
    },
    {
      id: '07',
      title: 'PANEL DISCUSSION',
      desc: 'Industry experts discuss key trends, challenges and opportunities.',
      date: '21ST & 22ND JAN 2027',
      icon: MessagesSquare,
      categories: ['speaker'],
      categoryLabel: 'Speaker Session',
    },
    {
      id: '08',
      title: 'STARTUP YOUTH CONCLAVE',
      desc: "E-summit's flagship conclave for young dreamers, builders and changemakers.",
      date: '22ND JAN 2027',
      icon: Compass,
      categories: ['speaker'],
      categoryLabel: 'Speaker Session',
    },
    {
      id: '09',
      title: 'FOUNDERS MEET',
      desc: 'Connect, interact and collaborate with successful founders and entrepreneurs.',
      date: '21ST JAN 2027',
      icon: Handshake,
      categories: ['networking'],
      categoryLabel: 'Networking Event',
    },
    {
      id: '10',
      title: 'IPL AUCTION',
      desc: 'A fun, strategic bidding challenge that brings out your business decision-making and team strategy.',
      date: '21ST JAN 2027',
      icon: Gavel,
      categories: ['competitions'],
      categoryLabel: 'Competition',
    },
    {
      id: '11',
      title: 'THE BOARDROOM – STRATEGIC DEBATE COMPETITION',
      desc: 'A high-stakes debate competition to test your leadership, strategy and problem-solving skills.',
      date: '21ST & 22ND JAN 2027',
      icon: Scale,
      categories: ['competitions'],
      categoryLabel: 'Competition',
    },
    {
      id: '12',
      title: 'PITCHING COMPETITIONS',
      desc: 'Present your startup idea, validate it with experts and compete for recognition and opportunities.',
      date: '21ST & 22ND JAN 2027',
      icon: Trophy,
      categories: ['competitions', 'pitching'],
      categoryLabel: 'Competition & Pitching',
    },
    {
      id: '13',
      title: 'NETWORKING SESSIONS',
      desc: 'Build meaningful connections with peers, mentors, investors and industry professionals.',
      date: '21ST & 22ND JAN 2027',
      icon: Network,
      categories: ['networking'],
      categoryLabel: 'Networking Event',
    },
    {
      id: '14',
      title: 'VALEDICTORY',
      desc: "A grand closing ceremony celebrating innovation, participation and the best contributions of E-Summit '27.",
      date: '22ND JAN 2027',
      icon: Award,
      categories: ['networking'],
      categoryLabel: 'Closing Ceremony',
    },
  ];

  const categoryTabs = [
    { id: 'all', label: 'All Events', count: events.length },
    {
      id: 'competitions',
      label: 'Competitions',
      count: events.filter((e) => e.categories.includes('competitions')).length,
    },
    {
      id: 'pitching',
      label: 'Pitching Events',
      count: events.filter((e) => e.categories.includes('pitching')).length,
    },
    {
      id: 'speaker',
      label: 'Speaker Sessions',
      count: events.filter((e) => e.categories.includes('speaker')).length,
    },
    {
      id: 'networking',
      label: 'Networking Events',
      count: events.filter((e) => e.categories.includes('networking')).length,
    },
  ];

  const filteredEvents = events.filter((event) => {
    if (selectedCategory === 'all') return true;
    return event.categories.includes(selectedCategory);
  });

  return (
    <section
      id="what-to-expect"
      className="relative z-20 w-full bg-[#E8DDDC] flex flex-col justify-center px-4 sm:px-8 md:px-16 py-16 md:py-24"
      style={{
        borderRadius: '2.5rem 2.5rem 2.5rem 2.5rem',
        boxShadow: '0 -16px 40px rgba(14,32,68,0.16), 0 -3px 10px rgba(14,32,68,0.09), 0 16px 40px rgba(14,32,68,0.16), 0 3px 10px rgba(14,32,68,0.09)',
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-500 mb-2">
              02 / WHAT TO EXPECT
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#0E2044] tracking-tight">
              WHAT TO EXPECT
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl">
              14 flagship experiences spanning high-stakes pitch sessions, strategic competitions, expert keynotes, and founder networks.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/60 shadow-sm w-fit">
            <div className="flex items-center gap-2.5">
              <span className="text-red-600 font-bold text-lg sm:text-xl">1500+</span>
              <span className="text-[11px] font-semibold tracking-wider text-gray-600 uppercase">Attendees</span>
            </div>
            <div className="w-px h-5 bg-gray-300" />
            <div className="flex items-center gap-2.5">
              <span className="text-red-600 font-bold text-lg sm:text-xl">30+</span>
              <span className="text-[11px] font-semibold tracking-wider text-gray-600 uppercase">Speakers</span>
            </div>
            <div className="w-px h-5 bg-gray-300" />
            <div className="flex items-center gap-2.5">
              <span className="text-red-600 font-bold text-lg sm:text-xl">14</span>
              <span className="text-[11px] font-semibold tracking-wider text-gray-600 uppercase">Events</span>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-start md:justify-center mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex p-1.5 bg-white/75 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm gap-1.5 max-w-full">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${isActive
                    ? 'bg-[#0E2044] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#0E2044] hover:bg-white/60'
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-700'
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event List Items */}
        <div className="space-y-3.5 sm:space-y-4">
          {filteredEvents.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-white/85 hover:bg-white border border-gray-200/90 hover:border-red-300 rounded-2xl p-4 sm:p-5 md:px-7 md:py-5 shadow-[0_2px_8px_rgba(14,32,68,0.03)] hover:shadow-[0_8px_20px_rgba(14,32,68,0.08)] transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left Section: Number + Accent + Icon + Title */}
                <div className="flex items-center gap-3.5 sm:gap-4 lg:w-[420px] xl:w-[460px] shrink-0">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-red-600 tracking-tight font-sans w-9 sm:w-12 shrink-0">
                    {item.id}
                  </span>

                  <div className="w-[2px] h-9 sm:h-11 bg-red-600 shrink-0" />

                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#0E2044] flex items-center justify-center shrink-0 bg-white group-hover:border-red-600 group-hover:bg-red-50/50 transition-all duration-300">
                    <IconComponent
                      className="w-5 h-5 sm:w-6 sm:h-6 text-[#0E2044] group-hover:text-red-600 transition-colors"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-[#0E2044] tracking-tight leading-snug uppercase group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="w-6 h-[3px] bg-red-600 mt-1 rounded-full group-hover:w-10 transition-all duration-300" />
                    <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {item.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Middle Section: Divider + Description */}
                <div className="flex-1 flex items-center gap-4 lg:px-4">
                  <div className="hidden lg:block w-px h-11 bg-gray-300/80 shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Right Section: Date Pill */}
                <div className="bg-[#FCECE7] border border-[#F5D2C8] rounded-xl px-4 py-2 sm:py-2.5 flex items-center gap-2.5 shrink-0 self-start lg:self-center shadow-2xs">
                  <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[#0E2044] tracking-wide whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Explorer Footer */}
        <div className="mt-10 pt-6 border-t border-gray-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-500 font-medium text-center sm:text-left">
            Showing all confirmed track events for E-Summit '27 at TCET Mumbai.
          </p>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-2 bg-[#0E2044] text-white hover:bg-red-600 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm"
          >
            <span>Book Your Summit Pass</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatToExpect;

import React from 'react';
import { ArrowLeft, User, Globe, Share2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AllSpeakersPage = () => {
  const navigate = useNavigate();

  // Full list of speakers with realistic details and fallback icons
  const speakers = [
    {
      id: 1,
      name: 'DR. ANANYA SHARMA',
      title: 'Founder & CEO',
      company: 'TechVenture Labs',
      bio: 'Pioneer in AI-driven health tech and serial entrepreneur with 3 successful exits.',
      category: 'Keynote Speaker',
      image: null
    },
    {
      id: 2,
      name: 'VIKRAM RATHORE',
      title: 'Managing Partner',
      company: 'Apex Capital VC',
      bio: 'Investing in early-stage fintech & SaaS startups across Asia-Pacific.',
      category: 'Venture Capitalist',
      image: null
    },
    {
      id: 3,
      name: 'MEERA ADANI',
      title: 'Chief Innovation Officer',
      company: 'FutureGrid Systems',
      bio: 'Leading clean-tech solutions and sustainable energy transition.',
      category: 'Industry Leader',
      image: null
    },
    {
      id: 4,
      name: 'ROHAN MEHTA',
      title: 'Co-Founder',
      company: 'HyperGrowth Media',
      bio: 'Scaled consumer products to $50M ARR with community-driven marketing.',
      category: 'Entrepreneur',
      image: null
    },
    {
      id: 5,
      name: 'PRIYA NAIR',
      title: 'VP of Product',
      company: 'ScaleX AI',
      bio: 'Ex-Google Product Lead specializing in generative LLM enterprise applications.',
      category: 'Tech Innovator',
      image: null
    },
    {
      id: 6,
      name: 'ARJUN KAPOOR',
      title: 'Founding Partner',
      company: 'SeedSpark Angels',
      bio: 'Backed over 40+ pre-seed founders and active mentor at incubators.',
      category: 'Angel Investor',
      image: null
    },
    {
      id: 7,
      name: 'SNEHA VERMA',
      title: 'Head of Growth',
      company: 'NextGen Fintech',
      bio: 'Driving financial inclusion through decentralized micro-lending platforms.',
      category: 'Growth Expert',
      image: null
    },
    {
      id: 8,
      name: 'KABIR ROY',
      title: 'Chief Tech Architect',
      company: 'CloudMatrix',
      bio: 'Building scalable distributed systems and cloud native infrastructure.',
      category: 'Keynote Speaker',
      image: null
    },
    {
      id: 9,
      name: 'TANVI J Joshi',
      title: 'Executive Director',
      company: 'Women in Tech Network',
      bio: 'Advocating for diversity in technology leadership and venture funding.',
      category: 'Industry Leader',
      image: null
    },
    {
      id: 10,
      name: 'DEVRAJ SINGH',
      title: 'Founder',
      company: 'RoboDynamics India',
      bio: 'Pioneering autonomous industrial robotics and smart manufacturing solutions.',
      category: 'Entrepreneur',
      image: null
    },
    {
      id: 11,
      name: 'ISHITA GUPTA',
      title: 'Principal Designer',
      company: 'DesignCraft Studio',
      bio: 'Crafting user experience strategies for global Fortune 500 brands.',
      category: 'Design Strategist',
      image: null
    },
    {
      id: 12,
      name: 'SANJAY MALHOTRA',
      title: 'Strategic Advisor',
      company: 'Global EdTech Ventures',
      bio: 'Transforming higher education and skill development ecosystems.',
      category: 'Mentor & Advisor',
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#E8DDDC] text-[#0E2044] pt-24 pb-16 px-6 sm:px-10 md:px-16 relative overflow-hidden">
      {/* Background Decorative Graphic Element */}
      <div className="absolute top-10 right-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#0E2044]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Navigation / Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#0E2044]/15">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0E2044] hover:text-red-600 transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            BACK TO HOME
          </button>
          
          <Link to="/" className="text-xs font-semibold tracking-widest text-gray-500 hover:text-red-600 uppercase transition-colors">
            E-SUMMIT '27 / SPEAKERS DIRECTORY
          </Link>
        </div>

        {/* Title Section */}
        <div className="mb-12">
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-red-600 mb-2 uppercase">
            03 / DISTINGUISHED LUMINARIES & VISIONARIES
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0E2044] tracking-tight">
            MEET OUR <span className="text-red-600">SPEAKERS</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mt-3 text-sm sm:text-base leading-relaxed">
            Gain insights from industry trailblazers, visionary founders, and leading investors shaping the future of entrepreneurship and innovation at E-Summit '27.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              {/* Image Container */}
              <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-[#0E2044] text-3xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <User className="w-10 h-10 text-[#0E2044]/70" />
                </div>

                {/* Speaker Category Badge */}
                <div className="absolute top-3 right-3 bg-[#0E2044] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm">
                  {speaker.category}
                </div>

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors duration-300" />
              </div>

              {/* Speaker Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-[#0E2044] text-base sm:text-lg uppercase tracking-wide group-hover:text-red-600 transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mt-1">
                    {speaker.title}
                  </p>
                  <p className="text-red-600 text-xs sm:text-sm font-semibold">
                    {speaker.company}
                  </p>
                  <p className="text-gray-500 text-xs mt-3 line-clamp-2 leading-relaxed">
                    {speaker.bio}
                  </p>
                </div>

                {/* Social Links Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-gray-400 text-xs">
                  <span className="font-semibold text-[11px] text-gray-400">E-SUMMIT '27</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:text-[#0E2044] transition-colors" title="Website">
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 hover:text-[#0E2044] transition-colors" title="Share">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation Back Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 bg-[#0E2044] text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-[#0E2044]/10"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO MAIN E-SUMMIT PAGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllSpeakersPage;

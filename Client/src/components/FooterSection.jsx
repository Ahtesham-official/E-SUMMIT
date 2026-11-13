import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  MapPin,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';

const FooterSection = () => {
  const [selectedLink, setSelectedLink] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Events', path: '/#what-to-expect' },
    { name: 'Workshops', path: '/#what-to-expect' },
    { name: 'Speakers', path: '/speakers' },
    { name: 'Schedule', path: '/#schedule' },
    { name: 'Sponsors', path: '/#partners' },
    { name: 'Team', path: '/#about' },
    { name: 'Gallery', path: '/#what-to-expect' },
  ];

  const participateLinks = [
    { name: 'Register', path: '/tickets' },
    { name: 'Login / Sign In', path: '/' },
    { name: 'Passes & Pricing', path: '/tickets' },
    { name: 'Startup Pitch', path: '/tickets' },
    { name: 'Competitions', path: '/#what-to-expect' },
    { name: 'Campus Ambassador', path: '/tickets' },
    { name: 'FAQs', path: '/#schedule' },
  ];

  const handleLinkClick = (e, linkName, path) => {
    e.preventDefault();
    setSelectedLink(linkName);

    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (location.pathname !== (route || '/')) {
        navigate(route || '/');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRegisterClick = () => {
    navigate('/tickets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer-section"
      className="relative z-10 w-full bg-[#f6eae2]/95 border-t border-[#ebdcd5] text-[#0c1938] overflow-hidden mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        {/* 1. COMPACT CONTACT BLOCK */}
        <div className="w-full">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0c1938] tracking-tight">
              Get in Touch
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#0c1938]/70">
              Have questions about E-Summit 2027? Reach out to us.
            </p>
            <div className="w-10 h-0.5 bg-[#e11d48] mx-auto mt-2.5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Email Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-[#ebdcd5] rounded-xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(12,25,56,0.03)] hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#e11d48] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0c1938]">
                    Email Us
                  </h3>
                </div>
                <p className="text-xs text-[#0c1938]/70 leading-relaxed mb-3.5">
                  For speaker slots, student passes, sponsorships &amp; startup registrations.
                </p>
              </div>

              <div className="pt-3 border-t border-[#ebdcd5]/70 flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#0c1938]/50 uppercase tracking-wider block">
                    Official Email
                  </span>
                  <a
                    href="mailto:tcetedic@tcetmumbai.in"
                    className="font-semibold text-[#0c1938] hover:text-[#e11d48] transition-colors break-all"
                  >
                    tcetedic@tcetmumbai.in
                  </a>
                </div>
              </div>
            </div>

            {/* Venue Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-[#ebdcd5] rounded-xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(12,25,56,0.03)] hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#e11d48] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0c1938]">
                    Summit Venue
                  </h3>
                </div>
                <p className="text-xs text-[#0c1938]/75 leading-relaxed mb-3">
                  <strong className="font-semibold text-[#0c1938]">
                    Thakur College of Engineering &amp; Technology (Autonomous)
                  </strong>
                  <br />
                  A-Block, Thakur Educational Campus, Shyamnarayan Thakur Marg, Thakur Village, Kandivali East, Mumbai 400101.
                </p>
              </div>

              <div className="pt-3 border-t border-[#ebdcd5]/70 flex items-center justify-between">
                <span className="text-[11px] text-[#0c1938]/60">Mumbai, Maharashtra</span>
                <a
                  href="https://maps.google.com/?q=Thakur+College+of+Engineering+and+Technology+Kandivali+East+Mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e11d48] hover:text-[#be123c] transition-colors"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PRE-FOOTER CTA BANNER */}
        <div className="w-full my-6 sm:my-8 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-[#ebdcd5] bg-gradient-to-r from-[#ebd3c7] via-[#f5e3d9] to-[#faeee7] px-5 sm:px-8 py-5 sm:py-6 shadow-[0_4px_20px_rgba(12,25,56,0.04)]">
            <div
              className="absolute right-0 -bottom-2 top-0 w-1/3 opacity-15 pointer-events-none select-none flex items-center justify-end overflow-hidden"
              aria-hidden="true"
            >
              <img
                src="/esummit27-logo.svg"
                alt=""
                className="w-72 h-auto max-w-none translate-x-10 translate-y-3 object-contain"
              />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e11d48] mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>TCET E-Summit 2027</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0c1938] leading-tight tracking-tight">
                  READY TO BUILD WHAT&apos;S NEXT?
                </h3>
                <p className="mt-0.5 text-xs text-[#0c1938]/75 leading-relaxed">
                  Join 1500+ attendees, 30+ speakers, and 50+ startups at TCET E-Summit 2027.
                </p>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleRegisterClick}
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-[0_4px_14px_rgba(225,29,72,0.25)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.35)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <span>REGISTER NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 4-COLUMN FOOTER LINKS & EVENT TIMINGS */}
        <div className="w-full pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-8 pt-4 border-t border-[#ebdcd5]">
            {/* Column 1: Brand & Socials */}
            <div className="space-y-3.5">
              <div>
                <a
                  href="#footer-section"
                  onClick={(e) => handleLinkClick(e, 'Home', '/')}
                  className="inline-block group"
                >
                  <img
                    src="/esummit27-logo.svg"
                    alt="TCET'S E-SUMMIT'27 - THINK BEYOND THE OBVIOUS"
                    className="h-10 sm:h-11 w-auto max-w-[210px] object-contain group-hover:opacity-95 transition-opacity"
                  />
                </a>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#e11d48] tracking-wider uppercase mb-0.5">
                  EDIC · TCET Entrepreneurship Cell
                </p>
                <p className="text-xs text-[#0c1938]/70 leading-relaxed">
                  India&apos;s entrepreneurial summit bringing together students, startups and investors.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/tcet_axios_edic?mdxt=Mjczc2FuanF2b3Bm"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="EDIC TCET Instagram"
                  className="w-8 h-8 rounded-full bg-white/90 border border-[#ebdcd5] text-[#0c1938] hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-xs"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/axios-edic-tcet-mumbai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="EDIC TCET LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/90 border border-[#ebdcd5] text-[#0c1938] hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-xs"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TCET E-Summit Twitter"
                  className="w-8 h-8 rounded-full bg-white/90 border border-[#ebdcd5] text-[#0c1938] hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-xs"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TCET E-Summit YouTube"
                  className="w-8 h-8 rounded-full bg-white/90 border border-[#ebdcd5] text-[#0c1938] hover:text-white hover:bg-[#e11d48] hover:border-[#e11d48] transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-xs"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2 border-t border-[#ebdcd5]/60">
                <p className="text-[11px] text-[#0c1938]/60 leading-normal">
                  Thakur College of Engineering &amp; Technology
                  <br />
                  <span className="text-[10px] text-[#0c1938]/50">
                    (Autonomous Institute, Accredited by NAAC &amp; NBA)
                  </span>
                </p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <h4 className="font-serif text-base font-bold text-[#0c1938]">
                  Quick Links
                </h4>
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" aria-hidden="true" />
              </div>
              <ul className="space-y-1.5">
                {quickLinks.map((link) => {
                  const isSelected = selectedLink === link.name;
                  return (
                    <li key={link.name}>
                      <a
                        href={link.path}
                        onClick={(e) => handleLinkClick(e, link.name, link.path)}
                        className={`text-xs inline-flex items-center gap-1 transition-all duration-300 ${
                          isSelected
                            ? 'text-[#e11d48] font-semibold translate-x-1'
                            : 'text-[#0c1938]/75 hover:text-[#e11d48] hover:translate-x-0.5'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1 h-1 rounded-full bg-[#e11d48] mr-0.5 inline-block" />
                        )}
                        <span>{link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3: Participate */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <h4 className="font-serif text-base font-bold text-[#0c1938]">
                  Participate
                </h4>
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" aria-hidden="true" />
              </div>
              <ul className="space-y-1.5">
                {participateLinks.map((link) => {
                  const isSelected = selectedLink === link.name;
                  return (
                    <li key={link.name}>
                      <a
                        href={link.path}
                        onClick={(e) => handleLinkClick(e, link.name, link.path)}
                        className={`text-xs inline-flex items-center gap-1 transition-all duration-300 ${
                          isSelected
                            ? 'text-[#e11d48] font-semibold translate-x-1'
                            : 'text-[#0c1938]/75 hover:text-[#e11d48] hover:translate-x-0.5'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1 h-1 rounded-full bg-[#e11d48] mr-0.5 inline-block" />
                        )}
                        <span>{link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 4: Contact & Event Timings */}
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <h4 className="font-serif text-base font-bold text-[#0c1938]">
                    Contact
                  </h4>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" aria-hidden="true" />
                </div>

                <ul className="space-y-2 text-xs text-[#0c1938]/75">
                  <li className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#e11d48] shrink-0 mt-0.5" />
                    <a
                      href="mailto:tcetedic@tcetmumbai.in"
                      className="hover:text-[#e11d48] transition-colors break-all"
                    >
                      tcetedic@tcetmumbai.in
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#e11d48] shrink-0 mt-0.5" />
                    <span>TCET Campus, Kandivali East, Mumbai</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-[#ebdcd5] rounded-xl p-3 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 pb-1.5 border-b border-[#ebdcd5]/60 text-[11px] font-bold uppercase tracking-wider text-[#0c1938]">
                  <Calendar className="w-3.5 h-3.5 text-[#e11d48]" />
                  <span>Event Timings</span>
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#e11d48]">
                    21st &amp; 22nd Jan 2027
                  </div>
                  <div className="text-[11px] text-[#0c1938]/75 font-medium tabular-nums">
                    09:00 AM – 06:00 PM IST
                  </div>
                  <div className="text-[11px] text-[#0c1938]/60">
                    Venue: TCET, Mumbai
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-[#e11d48] rounded text-[10px] font-semibold border border-rose-100/80">
                  <Clock className="w-2.5 h-2.5" />
                  <span>2 Days of Impact · On-ground</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. BOTTOM COPYRIGHT BAR */}
          <div className="pt-4 border-t border-[#ebdcd5] flex flex-col md:flex-row items-center justify-between gap-2.5 text-[11px] text-[#0c1938]/70">
            <p className="text-center md:text-left leading-normal">
              &copy; 2027 TCET E-Summit | EDIC, Thakur College of Engineering and Technology. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <a
                href="#privacy-policy"
                onClick={(e) => handleLinkClick(e, 'Privacy Policy', '/')}
                className={`transition-colors duration-300 ${
                  selectedLink === 'Privacy Policy'
                    ? 'text-[#e11d48] font-semibold'
                    : 'hover:text-[#e11d48]'
                }`}
              >
                Privacy Policy
              </a>
              <span className="text-[#0c1938]/30" aria-hidden="true">&bull;</span>
              <a
                href="#terms-and-conditions"
                onClick={(e) => handleLinkClick(e, 'Terms & Conditions', '/')}
                className={`transition-colors duration-300 ${
                  selectedLink === 'Terms & Conditions'
                    ? 'text-[#e11d48] font-semibold'
                    : 'hover:text-[#e11d48]'
                }`}
              >
                Terms &amp; Conditions
              </a>
              <span className="text-[#0c1938]/30" aria-hidden="true">&bull;</span>
              <a
                href="#refund-policy"
                onClick={(e) => handleLinkClick(e, 'Refund Policy', '/')}
                className={`transition-colors duration-300 ${
                  selectedLink === 'Refund Policy'
                    ? 'text-[#e11d48] font-semibold'
                    : 'hover:text-[#e11d48]'
                }`}
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

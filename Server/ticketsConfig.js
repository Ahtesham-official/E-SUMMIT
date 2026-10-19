const tickets = [
  {
    slug: "tcet-student-pass",
    name: "TCET Student Pass",
    price: 0,
    currency: "INR",
    konfhubTicketId: process.env.KONFHUB_TCET_TICKET_ID || "122834|1;",
    requiresStudentVerification: false,
    tag: "Exclusive",
    shortDescription: "Complimentary all-access pass for verified TCET Mumbai students.",
    description: "Exclusive complimentary pass reserved strictly for active students of Thakur College of Engineering and Technology (TCET). Grants seamless entry to keynote auditoriums, startup exhibitions, and technical tracks across both event days.",
    inclusions: [
      "Access to Day 1 & Day 2 Keynotes & Founder Talks",
      "Entry to Startup Expo & Innovation Booths",
      "Interactive Q&A access with industry leaders",
      "Official E-Summit '27 Digital Certificate of Participation",
      "Complimentary Delegate Kit & Badge at TCET desk"
    ],
    eligibility: {
      tcetOnly: true,
      studentVerification: false,
      note: "Requires authenticated @tcetmumbai.in student account."
    },
  },
  {
    slug: "silicon-pass",
    name: "Silicon Pass",
    price: 299,
    currency: "INR",
    konfhubTicketId: "124535%7C1%3B",
    requiresStudentVerification: true,
    tag: "Student Discounted",
    shortDescription: "Budget-friendly student pass for tech sessions & networking.",
    description: "Designed for aspiring technologists and student entrepreneurs from recognized institutions. Experience high-impact keynotes, network with peer builders, and explore the startup expo at a subsidized rate.",
    inclusions: [
      "Access to all general keynote tracks",
      "Entry to the Startup Expo showcase arena",
      "Networking lounge access with fellow student innovators",
      "Verified Student Delegate badge",
      "E-Summit '27 digital participation certificate"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: true,
      note: "Requires active student verification (college email or ID card)."
    },
  },
  {
    slug: "explorer-pass",
    name: "Explorer Pass",
    price: 199,
    currency: "INR",
    konfhubTicketId: "122830%7C1%3B",
    requiresStudentVerification: false,
    tag: "Standard",
    shortDescription: "Essential general pass for talks and startup exhibitions.",
    description: "The quickest way to immerse yourself in E-Summit '27. Walk through the buzzing exhibition floor, attend inspiring panel discussions, and explore emerging technologies shaping the future.",
    inclusions: [
      "General access to keynote auditorium",
      "Full access to Startup Exhibition halls",
      "Observer access to open pitch arenas",
      "Standard digital delegate credential"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: false,
      note: "Open to all attendees and enthusiasts."
    },
  },
  {
    slug: "quantum-pass",
    name: "Quantum Pass",
    price: 699,
    currency: "INR",
    konfhubTicketId: "124536%7C1%3B",
    requiresStudentVerification: true,
    tag: "Popular • Student",
    shortDescription: "Hands-on workshop slots, masterclasses & keynote entry.",
    description: "Accelerate your technical and entrepreneurial journey. In addition to full exhibition and keynote access, Quantum Pass holders get reserved seating at hands-on deep-dive workshops conducted by industry veterans.",
    inclusions: [
      "Priority entry to all keynote & panel sessions",
      "Guaranteed seat in 2 Hands-on Masterclasses & Workshops",
      "Access to Startup Expo & Product Demo arenas",
      "Interactive mentor office hours access",
      "Official E-Summit '27 Workshop Completion Certificate",
      "Student Innovator kit"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: true,
      note: "Requires active student verification (college email or ID card)."
    },
  },
  {
    slug: "delegate-pass",
    name: "Delegate Pass",
    price: 999,
    currency: "INR",
    konfhubTicketId: "124537%7C1%3B",
    requiresStudentVerification: false,
    tag: "Professional",
    shortDescription: "Comprehensive conference access for professionals & builders.",
    description: "For professionals, corporate delegates, and domain specialists looking to gain strategic market intelligence and build lasting connections across the entrepreneurial ecosystem.",
    inclusions: [
      "Full 2-day conference badge & delegate materials",
      "Access to all Keynotes, Panel Debates & Ecosystem Tracks",
      "Exclusive networking arena with corporate partners & investors",
      "Priority seating in keynote halls",
      "Delegate lounge access with refreshments"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: false,
      note: "Open to all professionals and industry delegates."
    },
  },
  {
    slug: "founders-pass",
    name: "Founders Pass",
    price: 1299,
    currency: "INR",
    konfhubTicketId: "122833%7C1%3B",
    requiresStudentVerification: false,
    tag: "Founder Special",
    shortDescription: "Curated networking with top founders, angels & operators.",
    description: "Tailored specifically for startup founders, co-founders, and early-stage operators. Unlock curated founder-only roundtables, closed-door breakout sessions, and direct access to active seed and angel investors.",
    inclusions: [
      "Exclusive Founder Roundtable & Closed-door sessions",
      "Speed-networking mixer with Angel Investors & VCs",
      "E-Summit '27 Founder Directory listing",
      "Access to VIP Networking Luncheon on Day 2",
      "Premium Founder Delegate welcome kit"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: false,
      note: "Designed for startup founders and early operators."
    },
  },
  {
    slug: "inner-circle-pass",
    name: "Inner Circle Pass",
    price: 1999,
    currency: "INR",
    konfhubTicketId: "124538%7C1%3B",
    requiresStudentVerification: false,
    tag: "All-Access",
    shortDescription: "All-access pass with speaker lounge & curated dinners.",
    description: "Experience E-Summit '27 with complete unfettered access. Join top speakers, thought leaders, and event patrons in private lounges and high-level networking dinners.",
    inclusions: [
      "Unrestricted access to all event zones, workshops & panels",
      "Green room & Speaker Lounge access privileges",
      "Invitation to the private Executive Networking Mixer",
      "Dedicated concierge check-in at registration",
      "Exclusive E-Summit '27 Executive Merch Hamper"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: false,
      note: "Full access badge open to all attendees."
    },
  },
  {
    slug: "showcase-pass",
    name: "Showcase Pass",
    price: 2500,
    currency: "INR",
    konfhubTicketId: "124539%7C1%3B",
    requiresStudentVerification: false,
    tag: "Exhibition",
    shortDescription: "Showcase area access, demo pitch slots & priority seating.",
    description: "Perfect for startups and teams ready to demonstrate their product or MVP. Includes a designated spot in the Startup Showcase gallery, demo pitch opportunity, and high visibility before delegates and media.",
    inclusions: [
      "Showcase booth/kiosk allocation in Startup Gallery",
      "3-minute live product demo pitch slot on showcase stage",
      "2 Delegate passes for founding team members",
      "Feature in official E-Summit Startup Catalogue",
      "Direct investor matchmaking assistance"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: false,
      note: "Open to startups and innovative project teams."
    },
  },
  {
    slug: "open-stage-pass-student",
    name: "Open Stage Pass - Student",
    price: 3000,
    currency: "INR",
    konfhubTicketId: "124540%7C1%3B",
    requiresStudentVerification: true,
    tag: "Stage Pitch • Student",
    shortDescription: "Live stage pitching slot for verified student ventures.",
    description: "Step onto the spotlight of E-Summit '27! Present your student startup or breakthrough idea before a grand jury of venture capitalists, angel syndicates, and thousands of attendees.",
    inclusions: [
      "Guaranteed 5-minute Open Stage Pitch slot with Q&A",
      "Jury feedback and direct investment evaluation",
      "3 Team delegate passes included",
      "Backstage speaker lounge access on pitch day",
      "E-Summit '27 Student Pitch Finalist Accolade"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: true,
      note: "Pitch lead must provide valid student verification."
    },
  },
  {
    slug: "open-stage-pass-non-student",
    name: "Open Stage Pass - Non-Student",
    price: 5000,
    currency: "INR",
    konfhubTicketId: "124541%7C1%3B",
    requiresStudentVerification: false,
    tag: "Stage Pitch • Pro",
    shortDescription: "Live stage pitching slot for established startups & ventures.",
    description: "The flagship pitching opportunity for established startups, growth-stage ventures, and professional entrepreneurs. Take the main stage, showcase market traction, and pitch for strategic capital.",
    inclusions: [
      "Guaranteed 7-minute Main Stage Pitch slot with Live Q&A",
      "One-on-one VC speed meeting sessions post-pitch",
      "4 Full Delegate passes for core company members",
      "Extensive press & social media coverage feature",
      "Full VIP Lounge & Networking Dinner access"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: false,
      note: "Open to all ventures and professional founders."
    },
  },
  {
    slug: "vip-pass",
    name: "VIP Pass",
    price: 5000,
    currency: "INR",
    konfhubTicketId: "124542%7C1%3B",
    requiresStudentVerification: false,
    tag: "VIP Executive",
    shortDescription: "VIP seating, exclusive lounge, valet & private banquet.",
    description: "The ultimate premium summit experience. Enjoy front-row keynote seating, access to VIP private suites, complimentary gourmet hospitality, and personal networking with keynote headliners.",
    inclusions: [
      "Front-row reserved seating across all auditoriums",
      "Unlimited VIP Lounge & Executive Suite access",
      "Complimentary invitation to the E-Summit Gala Banquet",
      "Priority VIP fast-track entry & reserved valet parking",
      "Commemorative VIP Memento & Luxury Hamper"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: false,
      note: "VIP Pass open to all distinguished patrons."
    },
  },
  {
    slug: "exhibitors-pass",
    name: "Exhibitors Pass",
    price: 5000,
    currency: "INR",
    konfhubTicketId: "122832%7C1%3B",
    requiresStudentVerification: false,
    tag: "Exhibitor Booth",
    shortDescription: "Prime exhibitor booth space, power & branding across 2 days.",
    description: "Showcase your brand, hire top talent, and acquire high-intent users with a dedicated physical exhibition pavilion in the main convention concourse.",
    inclusions: [
      "Dedicated 6x6 ft branded exhibition booth with table & power",
      "Banner placements across the exhibition arena",
      "4 Exhibitor passes with full conference access",
      "Listing in official event map & digital app directory",
      "Opportunity to distribute promotional collateral in delegate kits"
    ],
    eligibility: {
      tcetOnly: false,
      studentVerification: false,
      note: "Open to companies, brands, and service providers."
    },
  },
];

export { tickets };
export default tickets;

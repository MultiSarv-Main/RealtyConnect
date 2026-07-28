/**
 * RealtyConnect™ Sprint 05 - Business Profile Engine Data Models & Seed Data
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  photoUrl: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  type: string;
  status: 'Completed' | 'Ongoing' | 'Upcoming';
  value: string;
  area: string;
  location: string;
  description: string;
  completionYear: string;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorCompany: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'pdf';
  url: string;
  category: 'Photos' | 'Videos' | 'Certificates' | 'Brochures';
  size?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  tagline: string;
  logoBg: string;
  coverBanner: string;
  verified: boolean;
  membership: 'Basic' | 'Premium Gold' | 'Enterprise Platinum';
  description: string;
  yearEstablished: string;
  companyType: string;
  registrationNumber: string;
  gstin: string;
  pan: string;
  reraNumber?: string;
  website: string;
  email: string;
  phone: string;
  whatsapp: string;
  addressCorporate: string;
  addressBranches: string[];
  workingStates: string[];
  workingCities: string[];
  businessHours: string;
  languages: string[];
  googleMapQuery: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  
  // Overview Tab
  introduction: string;
  vision: string;
  mission: string;
  coreStrengths: string[];
  industriesServed: string[];
  businessObjectives: string;

  // Products / Services
  products: string[];
  services: string[];
  brands: string[];
  dealerships: string[];
  specializations: string[];

  // Dynamic modules
  team: TeamMember[];
  portfolio: ProjectItem[];
  reviews: ReviewItem[];
  gallery: GalleryItem[];

  // Owner settings
  profileVisibility: 'Public' | 'Connections Only' | 'Private';
  contactVisibility: 'Public' | 'Verified Only' | 'None';
  leadPreferences: {
    autoReply: boolean;
    notifyEmail: boolean;
    notifyWhatsApp: boolean;
    preferredLeadValue: string;
  };
}

// Generate a rich, role-specific seed profile based on standard registry details
export function getSeededProfile(id: string, name: string, category: string, location: string, customDesc?: string): BusinessProfile {
  const isReraApplicable = ['Developers', 'Builders', 'Consultants', 'Broker'].includes(category);
  const city = location.split(',')[0].trim();
  const stateCode = location.includes('MH') ? '27' : location.includes('KA') ? '29' : location.includes('TS') ? '36' : '19';

  return {
    id,
    name,
    category,
    tagline: `Leading B2B ${category.slice(0, -1)} driving innovation in Indian real estate infrastructure.`,
    logoBg: id === 'ent-1' ? 'bg-indigo-600' : id === 'ent-2' ? 'bg-emerald-600' : id === 'ent-3' ? 'bg-amber-600' : 'bg-slate-700',
    coverBanner: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop`,
    verified: true,
    membership: id === 'ent-1' || id === 'ent-2' ? 'Enterprise Platinum' : 'Premium Gold',
    description: customDesc || `Established B2B enterprise in the ${category} segment, servicing high-value engineering contracts across ${city} and neighboring markets under strict quality benchmarks.`,
    yearEstablished: id === 'ent-2' ? '1995' : '2008',
    companyType: 'Private Limited Company',
    registrationNumber: `U45200MH${2008 + parseInt(id.replace(/\D/g, '') || '0')}PTC184120`,
    gstin: `${stateCode}AAFCA9021M1Z5`,
    pan: 'AAFCA9021M',
    reraNumber: isReraApplicable ? `PRM/KA/RERA/1251/310/PR/201211/${100000 + parseInt(id.replace(/\D/g, '') || '1')}` : undefined,
    website: `www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
    email: `info@${name.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+91 98200 ${50000 + parseInt(id.replace(/\D/g, '') || '1')}`,
    whatsapp: `+91 98200 ${50000 + parseInt(id.replace(/\D/g, '') || '1')}`,
    addressCorporate: `Suite 405, Tech Horizon Tower, Bandra Kurla Complex, ${city}, India`,
    addressBranches: [`Sector 5, Noida, NCR`, `Gachibowli High Street, Hyderabad`],
    workingStates: [location.split(',')[1]?.trim() || 'Maharashtra', 'Karnataka', 'Telangana'],
    workingCities: [city, 'Bangalore', 'Hyderabad', 'Mumbai'],
    businessHours: '09:30 AM - 06:30 PM (Mon-Sat)',
    languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
    googleMapQuery: `${city}, India`,
    socials: {
      linkedin: `https://linkedin.com/company/${name.toLowerCase().replace(/\s+/g, '-')}`,
      twitter: `https://twitter.com/${name.toLowerCase().replace(/\s+/g, '')}`,
      facebook: `https://facebook.com/${name.toLowerCase().replace(/\s+/g, '')}`
    },
    
    introduction: `${name} is an ISO-certified market leader in the ${category} sector. We cater exclusively to tier-1 developers, government tenders, and institutional builders by engineering world-class products and end-to-end liaison services.`,
    vision: `To set the absolute benchmark of structural integrity, operational efficiency, and commercial transparency in the national real estate ecosystem.`,
    mission: `To deploy advanced digital scheduling models, supply sustainable materials, and build long-term trust-backed corporate pipelines across India.`,
    coreStrengths: ['Regulatory compliance (100% RERA/RBI audits)', 'Zero-defect structural engineering', 'Bulk distribution network', 'Prompt 48-hour commercial inquiry response'],
    industriesServed: ['Premium Residential Skyscrapers', 'Commercial Tech Parks', 'Public Transportation & Metros', 'Heavy Industrial Warehousing'],
    businessObjectives: 'To establish direct integration pipelines with 50+ active premium developers on RealtyConnect, reducing raw material procurement cycles by 30%.',

    products: id === 'ent-3' 
      ? ['Fe550D reinforcement TMT steel bars', 'M40 grade ready-mix concrete', 'Fly ash high-strength concrete blocks', 'Eco-friendly autoclaved aerated concrete (AAC) blocks']
      : id === 'ent-7'
      ? ['Tower cranes (12T - 24T lift capacity)', 'Concrete batching plants (60 m³/hr)', 'Heavy-duty hydraulic excavators', 'Passenger and material hoists']
      : ['Custom fabricated building materials', 'Energy-efficient facade systems'],
    services: id === 'ent-1'
      ? ['Integrated smart township layouts', 'Sustainable architectural planning', 'Commercial property syndication']
      : id === 'ent-2'
      ? ['Piling & deep foundation engineering', 'Superstructure RCC framing', 'Precast structural design & erection']
      : id === 'ent-4'
      ? ['RERA Registration & quarterly updates filing', 'Title deeds search & due diligence', 'Feasibility advisory & project audits']
      : ['Specialized B2B real estate commercial representation', 'Facility operations management'],
    brands: ['Tata Tiscon Authorized', 'Ultratech cement', 'JSW NeoSteel', 'Lafarge Holcim'],
    dealerships: ['Distributor ID: RC-DIST-8802', 'Authorized OEM Equipment Partner', 'A-Class Registered Vendor Circle'],
    specializations: ['Heavy Civil Engineering', 'Sustainable Urban Architecture', 'RERA Regulatory Liaison', 'Escrow Account Structuring'],

    team: [
      {
        id: 't-1',
        name: 'Mr. Arvind Shrikant',
        role: 'Managing Director & Co-Founder',
        department: 'Executive Leadership',
        email: `arvind@${name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+91 98200 11022',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop'
      },
      {
        id: 't-2',
        name: 'Mrs. Priya Nair',
        role: 'Chief Technical Officer',
        department: 'Engineering & Delivery',
        email: `priya.n@${name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+91 98200 11033',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
      },
      {
        id: 't-3',
        name: 'Mr. Rajat Sen',
        role: 'Head of Business Development',
        department: 'Sales & B2B Partnerships',
        email: `rajat@${name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+91 98200 11044',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      }
    ],
    portfolio: [
      {
        id: 'p-1',
        title: 'Tech Horizon Park Phase 1',
        type: 'Commercial Hub',
        status: 'Completed',
        value: '₹145 Crores',
        area: '4,50,000 Sq. Ft.',
        location: `${city}, State Bypass Road`,
        description: 'Execution of complete concrete substructures, precast framing, and structural facade liaison within an expedited 14-month schedule.',
        completionYear: '2024'
      },
      {
        id: 'p-2',
        title: 'The Infinite Heights Residency',
        type: 'Residential Highrise',
        status: 'Ongoing',
        value: '₹310 Crores',
        area: '12,00,000 Sq. Ft.',
        location: `${city}, Waterfront Drive`,
        description: 'Engineering the tallest luxury tower in the region featuring a zero-carbon green roof design and 100% solar capture integration.',
        completionYear: '2027'
      },
      {
        id: 'p-3',
        title: 'Noida Logistics & Express Center',
        type: 'Industrial Warehouse',
        status: 'Upcoming',
        value: '₹68 Crores',
        area: '3,00,000 Sq. Ft.',
        location: 'Sector 65, Noida NCR',
        description: 'Developing high-strength wear-resistant dry-shake industrial flooring and heavy structural gantry girder support systems.',
        completionYear: '2026'
      }
    ],
    reviews: [
      {
        id: 'r-1',
        authorName: 'Rohan Deshmukh',
        authorCompany: 'Shree Balaji Constructions',
        rating: 5,
        date: '2026-06-12',
        comment: `Absolute stellar performance on the BKC foundation contract. Their dispatch response rate was exemplary and they provided verified ISO compliance logs instantly. We plan to extend their lease to Phase 2.`,
        verified: true
      },
      {
        id: 'r-2',
        authorName: 'Arch. Sneha Iyer',
        authorCompany: 'Loom Studio Architects',
        rating: 4,
        date: '2026-05-30',
        comment: `Excellent technical synchronization during the facade planning. Their design team quickly resolved structural conflicts with the MEP grid. Highly recommended for commercial tower engineering!`,
        verified: true
      }
    ],
    gallery: [
      { id: 'g-1', title: 'Corporate Headquarters Office', type: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop', category: 'Photos' },
      { id: 'g-2', title: 'Live Construction Site RCC Pouring', type: 'image', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop', category: 'Photos' },
      { id: 'g-3', title: 'Active Concrete Batching Operations', type: 'image', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop', category: 'Photos' },
      { id: 'g-4', title: 'ISO 9001:2015 Quality Certificate', type: 'image', url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=600&auto=format&fit=crop', category: 'Certificates' },
      { id: 'g-5', title: 'RealtyConnect Standard Pitch Deck.pdf', type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', category: 'Brochures', size: '2.4 MB' },
      { id: 'g-6', title: 'Complete Product Catalogue 2026.pdf', type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', category: 'Brochures', size: '4.8 MB' }
    ],

    profileVisibility: 'Public',
    contactVisibility: 'Public',
    leadPreferences: {
      autoReply: true,
      notifyEmail: true,
      notifyWhatsApp: true,
      preferredLeadValue: '₹5,00,000+'
    }
  };
}

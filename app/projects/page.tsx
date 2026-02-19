'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ArrowRight, 
  Building2, 
  Home, 
  Warehouse, 
  HeartPulse,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Ruler,
  HardHat,
  FileText
} from 'lucide-react';

// --- REAL PROJECT DATA FROM COMPANY PROFILE WITH SLUGS ---
const ALL_PROJECTS = [
  // Residential Projects
  {
    id: 1,
    slug: 'moureen-residence',
    title: 'Moureen Residence',
    category: 'Residential',
    location: 'Nairobi, Kenya',
    image: '/assets/images/projects/moureen-residence.jpg',
    description: 'A striking two-storey residence featuring natural stone blockwork with vibrant red and yellow trims. The design maximizes daylighting through large window openings, reducing energy consumption while enhancing indoor comfort.',
    features: ['Natural stone cladding', 'Colorful architectural trims', 'Large daylight windows', 'Gable roof with shed projections'],
    client: 'Moureen',
    year: '2019',
    status: 'Completed'
  },
  {
    id: 2,
    slug: 'tonny-muyale-bungalow',
    title: 'Tonny Muyale Bungalow',
    category: 'Residential',
    location: 'Lurambi, Kakamega',
    image: '/assets/images/projects/tonny-bungalow.png',
    description: 'An elegant two-bedroom bungalow with pitched terracotta roof and natural stone cladding. Features a welcoming front porch, integrated single-car garage, and mature landscaped surroundings with blooming hydrangeas.',
    features: ['Terracotta pitched roof', 'Stone cladding facade', 'Front porch with red columns', 'Integrated garage', 'Mature landscaping'],
    client: 'Mr. Tonny Muyale',
    year: '2025',
    status: 'In Progress'
  },
  {
    id: 3,
    slug: 'flat-roof-residence',
    title: 'Modern Flat-Roof Residence',
    category: 'Residential',
    location: 'Nairobi',
    image: '/assets/images/projects/flat-roof-residence.jpg',
    description: 'A sleek two-bedroom flat-roofed home combining minimalist elegance with smart functionality. The open-plan layout connects living, dining, and kitchen areas, with potential for rooftop terrace or solar integration.',
    features: ['Minimalist flat roof design', 'Open-plan living', 'Large windows', 'Rooftop terrace potential', 'Compact efficient layout'],
    client: 'Private Client',
    year: '2024',
    status: 'Completed'
  },
  {
    id: 4,
    slug: 'nakuru-residential-apartments',
    title: 'Nakuru Residential Apartments',
    category: 'Residential',
    location: 'Nakuru, Kenya',
    image: '/assets/images/projects/nakuru-apartments.jpg',
    description: 'A stunning residential apartment block with bold geometric volumes, full-height windows, and spacious balconies with glass balustrades. The minimalist palette of neutral tones is complemented by integrated landscaping.',
    features: ['Full-height windows', 'Glass balustrade balconies', 'Geometric volumes', 'Integrated landscaping', 'Contemporary facade'],
    client: 'Private Developer',
    year: '2025',
    status: 'Preliminary Design'
  },
  {
    id: 5,
    slug: 'modern-apartment-block',
    title: 'Modern Residential Apartment Block',
    category: 'Residential',
    location: 'Nairobi',
    image: '/assets/images/projects/apartment-block.jpg',
    description: 'A three-storey residential building with a clean contemporary façade and bold maroon structural accents. Features a striking central glass panel highlighting the entrance and common areas, with pitched roof providing weather protection.',
    features: ['3-storey design', 'Maroon structural accents', 'Central glass atrium', 'Pitched roof with eaves', 'Covered entrance columns'],
    client: 'Private Client',
    year: '2024',
    status: 'In Progress'
  },
  {
    id: 6,
    slug: 'five-bedroom-residence',
    title: 'Five-Bedroom Residence',
    category: 'Residential',
    location: 'Nairobi',
    image: '/assets/images/projects/five-bedroom.png',
    description: 'A contemporary two-storey residence with clean architectural lines and expansive glass openings. Features a rooftop leisure space with swimming pool offering panoramic views, master suite with walk-in closet and balcony.',
    features: ['Rooftop swimming pool', 'Master suite with balcony', 'Open-plan living', 'Expansive glass', 'Walk-in closet'],
    client: 'Private Client',
    year: '2024',
    status: 'In Progress'
  },
  // SAMUEL WASWA MAISONETTE - NEW PROJECT
  {
    id: 10,
    slug: 'samuel-waswa-maisonette',
    title: 'Samuel Waswa Maisonette',
    category: 'Residential',
    location: 'Mlolongo, Nairobi',
    image: '/assets/images/projects/samuel-waswa.png',
    description: 'A meticulously designed two-storey maisonette featuring comprehensive architectural documentation including floor plans, elevations, sections, and detailed landscape design. The project showcases integrated sustainable features with permanent ventilation, bituminous DPC, and hoop iron reinforcement.',
    features: [
      'Complete architectural drawing set (10+ sheets)',
      'Isometric and ground floor renders',
      'North and East elevations',
      'Septic tank schematics',
      'Permanent ventilation (PV) above doors',
      'Bituminous felt DPC',
      'Hoop iron wall reinforcement',
      'Integrated kitchen garden',
      'Polyalthia longifolia screening',
      'Stone paver hardscape',
      'Forecourt planters',
      'Pergola with shaded seating'
    ],
    client: 'Mr. Samuel Waswa',
    year: '2026',
    status: 'Preliminary Design',
    plotReference: 'S.F./2025/086',
    drawingSet: '10+ Sheets',
    wallArea: '381m length',
    plasterArea: '569m²'
  },
  
  // Commercial Projects
  {
    id: 7,
    slug: 'malava-teachers-plaza',
    title: 'Malava Teachers Plaza',
    category: 'Commercial',
    location: 'Malava, Kakamega',
    image: '/assets/images/projects/malava-plaza.jpg',
    description: 'A contemporary mixed-use development with ground floor banking hall, first floor flexible office spaces, and second floor two-bedroom apartments. Organized parking and secure access enhance user experience.',
    features: ['Mixed-use development', 'Banking hall', 'Flexible office space', 'Residential apartments', 'Organized parking'],
    client: 'Malava Teachers SACCO',
    year: '2025',
    status: 'In Progress'
  },
  
  // Healthcare Projects
  {
    id: 8,
    slug: 'siaya-maisonette',
    title: 'Siaya Maisonette',
    category: 'Residential',
    location: 'Siaya, Kenya',
    image: '/assets/images/projects/siaya-maisonette.jpg',
    description: 'A modern two-bedroom maisonette with clean architectural lines and expansive glass openings. Features a rooftop leisure space with swimming pool offering panoramic views, master suite with walk-in closet and balcony.',
    features: ['Rooftop swimming pool', 'Master suite with balcony', 'Open-plan living', 'Expansive glass', 'Walk-in closet'],
    client: 'Mr. John Ochieng',
    year: '2025',
    status: 'In Progress'
  },
  
  // Retail Projects
  {
    id: 9,
    slug: 'shipping-container-centre',
    title: 'Shipping Container Shopping Centre',
    category: 'Retail',
    location: 'Nairobi',
    image: '/assets/images/projects/container-centre.jpg',
    description: 'An innovative eco-conscious retail hub constructed from repurposed shipping containers. Two-storey design features boutiques, eateries, and open-air terraces with landscaped courtyards and shaded walkways.',
    features: ['Repurposed containers', 'Sustainable design', 'Open-air terraces', 'Landscaped courtyards', 'Modular retail units'],
    client: 'Private Developer',
    year: '2024',
    status: 'Completed'
  }
];

const CATEGORIES = [
  { name: 'All', icon: Sparkles },
  { name: 'Residential', icon: Home },
  { name: 'Commercial', icon: Building2 },
  { name: 'Healthcare', icon: HeartPulse },
  { name: 'Retail', icon: Warehouse }
];

// Category filter button component
const CategoryButton = ({ cat, active, onClick }: any) => {
  const Icon = cat.icon;
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-full font-black uppercase tracking-wider text-xs
        transition-all duration-300
        ${active 
          ? 'bg-[#C75B39] text-white shadow-lg shadow-[#C75B39]/30' 
          : 'bg-white text-[#06392F] hover:bg-gray-50 border border-gray-200'}
      `}
    >
      <Icon size={14} />
      {cat.name}
    </motion.button>
  );
};

// Project card component
const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-amber-500';
      case 'Preliminary Design': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="relative overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-lg group rounded-3xl hover:shadow-2xl"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-72">
        <div className="absolute inset-0 bg-gradient-to-t from-[#06392F]/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute z-20 top-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm text-[#06392F] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {project.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute z-20 top-4 right-4">
          <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${getStatusColor(project.status)} text-white`}>
            {project.status}
          </span>
        </div>

        {/* Hover Overlay Content */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 transition-transform duration-500 translate-y-full group-hover:translate-y-0">
          <div className="flex flex-wrap gap-2">
            {project.features.slice(0, 3).map((feature: string, i: number) => (
              <span key={i} className="text-[8px] font-black uppercase tracking-widest text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                {feature}
              </span>
            ))}
            {project.features.length > 3 && (
              <span className="text-[8px] font-black uppercase tracking-widest text-white/70">
                +{project.features.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-black text-[#06392F] uppercase tracking-tight group-hover:text-[#C75B39] transition-colors">
            {project.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <MapPin size={14} className="text-[#C75B39]" />
          <span className="text-xs font-medium">{project.location}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {project.year}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} /> {project.client}
          </span>
          {project.plotReference && (
            <>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1">
                <FileText size={12} /> {project.plotReference}
              </span>
            </>
          )}
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-600 line-clamp-3">
          {project.description}
        </p>

        {/* Project Stats for Samuel Waswa */}
        {project.slug === 'samuel-waswa-maisonette' && (
          <div className="flex gap-4 mb-4 p-3 bg-[#06392F]/5 rounded-xl">
            {project.wallArea && (
              <div className="flex items-center gap-1">
                <Ruler size={14} className="text-[#C75B39]" />
                <span className="text-[10px] font-bold text-[#06392F]">{project.wallArea}</span>
              </div>
            )}
            {project.plasterArea && (
              <div className="flex items-center gap-1">
                <HardHat size={14} className="text-[#C75B39]" />
                <span className="text-[10px] font-bold text-[#06392F]">{project.plasterArea}</span>
              </div>
            )}
            {project.drawingSet && (
              <div className="flex items-center gap-1">
                <FileText size={14} className="text-[#C75B39]" />
                <span className="text-[10px] font-bold text-[#06392F]">{project.drawingSet}</span>
              </div>
            )}
          </div>
        )}

        {/* Features Preview */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.features.slice(0, 2).map((feature: string, i: number) => (
            <span key={i} className="text-[8px] font-bold uppercase tracking-widest text-[#06392F] bg-[#06392F]/5 px-3 py-1.5 rounded-full">
              {feature}
            </span>
          ))}
        </div>

        {/* View Details Link - UPDATED to use slug */}
        <Link 
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 text-[#C75B39] font-black uppercase tracking-widest text-xs group/link"
        >
          View Full Case Study
          <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-2" />
        </Link>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C75B39] via-[#06392F] to-[#C75B39] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.div>
  );
};

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FDF8F5]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#06392F] text-white pt-32 pb-24 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute border rounded-full -top-48 -right-48 w-96 h-96 border-white/10"
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-[#C75B39] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
              Since 1995
            </span>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              Our <span className="text-[#C75B39]">Portfolio</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl font-medium leading-relaxed text-white/70">
              From luxury residences to commercial landmarks, explore the projects that define our commitment to structural excellence.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-12 mt-12">
              <div>
                <div className="text-3xl font-black text-[#C75B39]">50+</div>
                <div className="mt-2 text-xs font-bold tracking-widest uppercase text-white/60">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#C75B39]">15+</div>
                <div className="mt-2 text-xs font-bold tracking-widest uppercase text-white/60">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#C75B39]">8</div>
                <div className="mt-2 text-xs font-bold tracking-widest uppercase text-white/60">Counties Served</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute transform -translate-x-1/2 bottom-8 left-1/2"
        >
          <ChevronDown size={24} className="text-white/40" />
        </motion.div>
      </section>

      {/* --- FILTER TABS --- */}
      <div className="sticky z-30 py-6 border-b border-gray-100 top-20 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryButton
                key={cat.name}
                cat={cat}
                active={activeCategory === cat.name}
                onClick={() => setActiveCategory(cat.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- PROJECTS GRID --- */}
      <div className="px-4 py-16 mx-auto max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-black tracking-widest text-gray-400 uppercase">No projects found in this category</p>
          </div>
        )}

        {/* --- CERTIFICATIONS & ACCREDITATIONS --- */}
        <div className="p-10 mt-20 bg-white border border-gray-100 rounded-3xl">
          <div className="mb-10 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C75B39] block mb-4">
              Our Credentials
            </span>
            <h3 className="text-2xl font-black text-[#06392F] uppercase tracking-tighter">
              Licensed & Certified
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: 'NCA 6', desc: 'Building Works Contractor' },
              { label: 'MAAK Reg. 4305', desc: 'Landscape Architects Chapter' },
              { label: 'NEMA Lead Expert', desc: 'Environmental Impact Assessment' },
              { label: 'Certificate of Inc.', desc: 'Registration No. PVT-MKUBPAP' }
            ].map((item, i) => (
              <div key={i} className="p-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C75B39]/10 text-[#C75B39] mb-3">
                  <Award size={20} />
                </div>
                <div className="text-sm font-black text-[#06392F]">{item.label}</div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CALL TO ACTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-[#06392F] to-[#1a4a3e] rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C75B39]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#C75B39]/20 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              Ready to Build <br />
              <span className="text-[#C75B39]">Your Vision?</span>
            </h2>
            
            <p className="max-w-xl mx-auto mb-10 text-lg text-white/70">
              From concept to completion, we bring the same precision and care to every project — regardless of scale.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link 
                href="/contact" 
                className="group inline-flex items-center justify-center gap-3 bg-[#C75B39] text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-[#06392F] transition-all duration-300 shadow-2xl"
              >
                Start Your Project
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
                href="/services" 
                className="inline-flex items-center justify-center gap-3 px-10 py-5 text-sm font-black tracking-widest text-white uppercase transition-all border-2 group border-white/30 rounded-xl hover:bg-white/10"
              >
                Explore Services
              </Link>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span>+254 712 575 077</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>info@ashamconstruction.co.ke</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Nairobi • Kakamega</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
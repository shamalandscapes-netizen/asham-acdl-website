// components/FeaturedProjects.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  HardHat, 
  Ruler, 
  ClipboardCheck,
  Truck,
  Wrench,
  Building2,
  FileText,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
  slug: string;
  status: string;
  client: string;
  scope?: string[];
  value?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Samuel Waswa Maisonette',
    category: 'Residential',
    location: 'Mlolongo, Nairobi',
    year: '2026',
    description: 'A meticulously designed two-storey maisonette featuring comprehensive architectural documentation including floor plans, elevations, sections, and detailed landscape design.',
    image: '/assets/images/projects/samuel-waswa.png',
    slug: 'samuel-waswa-maisonette',
    status: 'Preliminary Design',
    client: 'Mr. Samuel Waswa',
    scope: ['Architecture', 'Structural', 'Landscape'],
    value: 'KES 14.5M'
  },
  {
    id: 2,
    title: 'Moureen Residence',
    category: 'Residential',
    location: 'Nairobi, Kenya',
    year: '2024',
    description: 'A striking two-storey residence featuring natural stone blockwork with vibrant red and yellow trims. Maximizes daylighting through large window openings.',
    image: '/assets/images/projects/moureen-residence.jpg',
    slug: 'moureen-residence',
    status: 'Completed',
    client: 'Moureen',
    scope: ['Design', 'Construction', 'Finishing'],
    value: 'KES 10M'
  },
  {
    id: 3,
    title: 'Tonny Muyale Bungalow',
    category: 'Residential',
    location: 'Malava, Kakamega',
    year: '2024',
    description: 'An elegant two-bedroom bungalow with pitched terracotta roof and natural stone cladding. Features a welcoming front porch and integrated single-car garage.',
    image: '/assets/images/projects/tonny-bungalow.jpg',
    slug: 'tonny-muyale-bungalow',
    status: 'In Progress',
    client: 'Mr. Tonny Muyale',
    scope: ['Architecture', 'Construction'],
    value: 'KES 6.2M'
  }
];

const statusConfig = {
  'Completed': { 
    color: 'bg-[#06392F]', 
    text: 'text-white',
    icon: ClipboardCheck,
    label: 'Handed Over'
  },
  'In Progress': { 
    color: 'bg-[#C75B39]', 
    text: 'text-white',
    icon: Truck,
    label: 'On Site'
  },
  'Preliminary Design': { 
    color: 'bg-amber-500', 
    text: 'text-white',
    icon: FileText,
    label: 'Design Phase'
  }
};

export default function FeaturedProjects() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#F5F5F0]">
      {/* Construction Site Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Diagonal Hatching Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #06392F,
            #06392F 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
        
        {/* Blueprint Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(to right, #06392F 1px, transparent 1px),
            linear-gradient(to bottom, #06392F 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />

        {/* Safety Tape Accents */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#C75B39] opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#C75B39]" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 40px)'
        }} />
      </div>

      <div className="container relative z-10 px-6 mx-auto max-w-7xl">
        
        {/* Site Header - Contractor Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          {/* Job Site Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#06392F] rounded-lg shadow-lg"
          >
            <HardHat className="w-4 h-4 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Active Sites
            </span>
          </motion.div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#06392F] leading-[1.05] tracking-tight mb-4">
                Featured
                <span className="block text-[#C75B39]">Projects</span>
              </h2>
              <div className="flex items-center gap-3">
                <div className="h-1 w-16 bg-[#C75B39] rounded-full" />
                <span className="text-sm text-[#06392F]/60">Portfolio Selection</span>
              </div>
            </div>

            <div className="lg:max-w-md">
              <p className="text-base leading-relaxed text-[#06392F]/60 mb-4">
                From foundation to finish, we deliver construction excellence across residential and commercial developments.
              </p>
              
              {/* Quick Stats - Contractor Board Style */}
              <div className="flex gap-6 p-4 bg-white rounded-xl border border-[#06392F]/10 shadow-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C75B39]" />
                  <div>
                    <div className="text-lg font-bold text-[#06392F]">50+</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#06392F]/40">Projects</div>
                  </div>
                </div>
                <div className="w-px bg-[#06392F]/10" />
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-[#C75B39]" />
                  <div>
                    <div className="text-lg font-bold text-[#06392F]">15+</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#06392F]/40">Years</div>
                  </div>
                </div>
                <div className="w-px bg-[#06392F]/10" />
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C75B39]" />
                  <div>
                    <div className="text-lg font-bold text-[#06392F]">8</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#06392F]/40">Counties</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid - Job Site Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {projects.map((project, index) => {
            const StatusIcon = statusConfig[project.status as keyof typeof statusConfig]?.icon || HardHat;
            const statusStyle = statusConfig[project.status as keyof typeof statusConfig] || statusConfig['In Progress'];
            
            return (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8 }}
                  className="group relative h-full bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#06392F]/5"
                >
                  {/* Project Photo - Job Site Style */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Site Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06392F] via-[#06392F]/20 to-transparent opacity-60" />
                    
                    {/* Status Badge - Construction Sign Style */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-2 px-4 py-2 ${statusStyle.color} rounded-lg shadow-lg`}>
                        <StatusIcon className="w-4 h-4 text-white" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                          {statusStyle.label}
                        </span>
                      </div>
                    </div>

                    {/* Project Value Tag */}
                    {project.value && (
                      <div className="absolute bottom-4 left-4">
                        <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-[#C75B39]/20">
                          <span className="text-xs font-bold text-[#C75B39]">{project.value}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Project Details - Blueprint Style */}
                  <div className="p-6">
                    {/* Category & Location */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#06392F] bg-[#F5F5F0] rounded-full border border-[#06392F]/10">
                        {project.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#06392F]/50">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#06392F] mb-2 group-hover:text-[#C75B39] transition-colors leading-tight">
                      {project.title}
                    </h3>

                    {/* Client */}
                    <p className="text-xs text-[#06392F]/40 mb-4 font-medium">
                      Client: {project.client}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-[#06392F]/60 leading-relaxed mb-6 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Scope Tags - Tool Belt Style */}
                    {project.scope && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.scope.map((item, i) => (
                          <span 
                            key={i}
                            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold text-[#06392F]/70 bg-[#F5F5F0] rounded-lg border border-[#06392F]/5"
                          >
                            <Wrench className="w-3 h-3 text-[#C75B39]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* View Details - Site Access Style */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#06392F]/5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#C75B39] uppercase tracking-widest group-hover:text-[#06392F] transition-colors">
                        <span>Site Details</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F5F5F0] flex items-center justify-center group-hover:bg-[#C75B39] transition-colors">
                        <ArrowRight className="w-4 h-4 text-[#06392F]/40 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Safety Stripe */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#C75B39]" />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Site Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 mt-16 sm:flex-row"
        >
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-8 py-4 bg-[#06392F] text-white rounded-full font-semibold text-sm tracking-wide shadow-xl hover:bg-[#C75B39] transition-colors duration-300"
            >
              <HardHat className="w-5 h-5" />
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-8 py-4 bg-white text-[#06392F] border-2 border-[#06392F]/10 rounded-full font-semibold text-sm tracking-wide hover:border-[#C75B39] hover:text-[#C75B39] transition-all duration-300"
            >
              <span>Start Your Project</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Safety Certifications */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-[#06392F]/30"
        >
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            NEMA Licensed
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C75B39]" />
            BORAQS Registered
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#06392F]" />
            ISO Certified
          </span>
        </motion.div>
      </div>
    </section>
  );
}
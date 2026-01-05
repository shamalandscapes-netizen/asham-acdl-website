'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string; // Added for linking
}

// Placeholder Data - You can eventually fetch this from Supabase
const projects: Project[] = [
  {
    id: 1,
    title: 'Riverwalk Commercial Center',
    category: 'Commercial',
    description: 'Mixed-use development with sustainable design features.',
    image: '/images/project-1.jpg', // Ensure you have images in public/images/ or use placeholders
    slug: 'riverwalk-commercial'
  },
  {
    id: 2,
    title: 'Highland Water Treatment Plant',
    category: 'Infrastructure',
    description: 'State-of-the-art water purification facility serving 50,000+ residents.',
    image: '/images/project-2.jpg',
    slug: 'highland-water'
  },
  {
    id: 3,
    title: 'Timberframe Luxury Residences',
    category: 'Residential',
    description: 'Modern timberframe homes constructed with eco-friendly materials.',
    image: '/images/project-3.jpg',
    slug: 'timberframe-residences'
  },
  {
    id: 4,
    title: 'Industrial Park Expansion',
    category: 'Engineering',
    description: '50-acre industrial complex with advanced logistics infrastructure.',
    image: '/images/project-4.jpg',
    slug: 'industrial-park'
  },
  {
    id: 5,
    title: 'Historic Bank Renovation',
    category: 'Renovations',
    description: 'Heritage restoration ensuring structural integrity while preserving history.',
    image: '/images/project-5.jpg',
    slug: 'historic-bank'
  },
  {
    id: 6,
    title: 'Solar Farm Installation',
    category: 'Energy',
    description: '100MW renewable energy facility with smart grid integration.',
    image: '/images/project-6.jpg',
    slug: 'solar-farm'
  }
];

export default function FeaturedProjects() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#06392F]">Featured Projects</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Showcasing our commitment to excellence across diverse construction sectors.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="flex flex-col h-full overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl group"
              >
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  {/* Fallback pattern if image is missing, otherwise img tag */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                    <Building2 size={48} />
                  </div>
                  
                  {/* Actual Image (Comment out if you don't have images yet) */}
                  {/* <img 
                    src={project.image} 
                    alt={project.title}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  /> 
                  */}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full bg-[#C75B39] shadow-md">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="flex flex-col flex-grow p-6">
                  <h3 className="mb-3 text-xl font-bold text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                    {project.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-gray-600 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                    <span className="text-sm font-semibold text-[#C75B39] group-hover:text-[#06392F] transition-colors flex items-center gap-2">
                      View Details 
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link 
            href="/projects"
            className="inline-flex items-center px-8 py-3 font-bold text-white transition-all rounded-lg bg-[#06392F] hover:bg-[#0A4D40] hover:shadow-lg gap-2"
          >
            View All Projects <ArrowRight size={18} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
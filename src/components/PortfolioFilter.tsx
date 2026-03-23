'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  description: string;
  slug: string;
  image?: string;
}

const projects: ProjectItem[] = [
  { id: 1, title: 'Modern Subdivision', category: 'Residential', description: '200-unit residential community with shared amenities.', slug: 'modern-subdivision' },
  { id: 2, title: 'Corporate Tower', category: 'Commercial', description: '30-story commercial complex in Nairobi CBD.', slug: 'corporate-tower' },
  { id: 3, title: 'Bridge Rehabilitation', category: 'Engineering', description: 'Structural reinforcement of the Athi River bridge.', slug: 'bridge-rehab' },
  { id: 4, title: 'Hospital Renovation', category: 'Renovations', description: 'Complete wing upgrade for Aga Khan Hospital.', slug: 'hospital-renovation' },
  { id: 5, title: 'Solar Farm', category: 'Infrastructure', description: '50MW Renewable energy installation in Nakuru.', slug: 'solar-farm' },
  { id: 6, title: 'Townhouse Development', category: 'Residential', description: 'Luxury townhouse community in Karen.', slug: 'townhouse-karen' },
  { id: 7, title: 'Shopping Mall', category: 'Commercial', description: 'Regional retail destination with 50+ stores.', slug: 'shopping-mall' },
  { id: 8, title: 'Water Pipeline', category: 'Infrastructure', description: 'Municipal water system upgrade serving 10k homes.', slug: 'water-pipeline' },
  { id: 9, title: 'Factory Retrofit', category: 'Renovations', description: 'Modernizing an industrial processing plant.', slug: 'factory-retrofit' },
  { id: 10, title: 'Highway Expansion', category: 'Engineering', description: 'Dual-carriage highway construction.', slug: 'highway-expansion' },
];

const categories = ['All', 'Residential', 'Commercial', 'Engineering', 'Renovations', 'Infrastructure'];

export default function PortfolioFilter() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#06392F]">Portfolio Gallery</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Explore our diverse project portfolio across multiple sectors.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all shadow-sm ${
                selectedCategory === category
                  ? 'bg-[#C75B39] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="overflow-hidden transition-shadow bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl group"
              >
                {/* Image Placeholder Area */}
                <div className="relative flex items-center justify-center h-48 overflow-hidden bg-gray-200">
                   {/* In a real app, use <img src={project.image} /> here */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#06392F]/20 to-[#C75B39]/10" />
                   <ImageIcon className="text-gray-400 transition-transform duration-500 group-hover:scale-110" size={48} />
                   
                   {/* Category Badge Overlay */}
                   <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-[#C75B39] rounded-full shadow-sm">
                       {project.category}
                     </span>
                   </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                    {project.title}
                  </h3>
                  <p className="mb-6 text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <Link href={`/projects/${project.slug}`}>
                    <button className="flex items-center gap-2 font-bold text-sm text-[#06392F] hover:text-[#C75B39] transition-colors group/btn">
                      View Project 
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="text-lg text-gray-500">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
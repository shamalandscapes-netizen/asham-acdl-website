'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Building2, Home, Warehouse } from 'lucide-react';

// --- STATIC PROJECT DATA ---
const ALL_PROJECTS = [
  {
    id: 1,
    title: 'The Riverfront Apartments',
    category: 'Residential',
    location: 'Westlands, Nairobi',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
    description: 'A 15-story luxury residential complex featuring 60 apartments, a rooftop pool, and underground parking.'
  },
  {
    id: 2,
    title: 'Asham Corporate HQ',
    category: 'Commercial',
    location: 'Upper Hill, Nairobi',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
    description: 'Modern glass-facade office tower designed for energy efficiency and collaborative workspaces.'
  },
  {
    id: 3,
    title: 'Thika Industrial Warehouse',
    category: 'Industrial',
    location: 'Thika Road',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
    description: 'Large-scale steel structure warehouse with automated loading bays and logistics offices.'
  },
  {
    id: 4,
    title: 'Serene Valley Villas',
    category: 'Residential',
    location: 'Karen',
    image: 'https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&q=80',
    description: 'Gated community of 20 high-end villas surrounded by lush gardens and eco-friendly amenities.'
  },
  {
    id: 5,
    title: 'Skyline Mall Extension',
    category: 'Commercial',
    location: 'Mombasa Road',
    image: 'https://images.unsplash.com/photo-1519420573924-65fcd45185d8?auto=format&fit=crop&q=80',
    description: 'Structural reinforcement and extension of an existing shopping mall to accommodate a new cinema hall.'
  },
  {
    id: 6,
    title: 'Bio-Processing Plant',
    category: 'Industrial',
    location: 'Naivasha',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80',
    description: 'State-of-the-art processing facility with specialized drainage and ventilation systems.'
  }
];

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Industrial'];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-[#06392F] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Our Portfolio</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200">
            From luxury homes to industrial complexes, explore the landmarks we've built across Kenya.
          </p>
        </div>
      </div>

      {/* --- FILTER TABS --- */}
      <div className="max-w-6xl px-4 py-12 mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-6 py-2 rounded-full font-bold transition-all
                ${activeCategory === cat 
                  ? 'bg-[#C75B39] text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- PROJECTS GRID --- */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="flex flex-col overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded-xl hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 z-10 transition-colors bg-black/20 group-hover:bg-black/0" />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#06392F]">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#C75B39] transition-colors">
                  {project.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <MapPin size={16} /> {project.location}
                </div>

                <p className="mb-6 text-sm leading-relaxed text-gray-600">
                  {project.description}
                </p>

                {/* This button is cosmetic for now, could link to a detailed case study page later */}
                <div className="pt-4 mt-auto border-t border-gray-100">
                  <span className="inline-flex items-center gap-2 text-[#06392F] font-bold text-sm group-hover:gap-3 transition-all cursor-pointer">
                    View Project <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- CALL TO ACTION --- */}
        <div className="mt-20 bg-[#06392F] rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold">Have a project in mind?</h2>
            <p className="mb-8 text-lg text-gray-300">
              We bring the same level of precision and quality to every project, big or small. Let's discuss your vision.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-[#C75B39] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#b04b2c] transition-colors shadow-lg hover:shadow-xl"
            >
              Get a Quote <ArrowRight size={20} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
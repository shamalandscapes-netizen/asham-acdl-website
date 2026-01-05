'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Building2, 
  Ruler, 
  Users, 
  Calendar,
  CheckCircle2,
  MapPin,
  Maximize2
} from 'lucide-react';

export default function RiverwalkProject() {
  const specs = [
    { label: 'Location', value: 'Kakamega, Western Kenya', icon: MapPin },
    { label: 'Category', value: 'Commercial Complex', icon: Building2 },
    { label: 'Status', value: 'Completed 2024', icon: Calendar },
    { label: 'Area', value: '12,500 SQFT', icon: Maximize2 },
  ];

  return (
    <main className="min-h-screen bg-white font-montserrat">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] bg-[#06392F] overflow-hidden flex items-end pb-20">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src="/assets/images/projects/riverwalk-hero.jpg" // Placeholder for your project image
            alt="Riverwalk Commercial"
            fill
            className="object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#06392F] to-transparent" />
        
        <div className="container relative z-10 px-6 mx-auto max-w-7xl">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#C75B39] mb-8 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black leading-none tracking-tighter text-white uppercase md:text-8xl">
              Riverwalk <br /> <span className="text-[#C75B39]">Commercial</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* --- PROJECT DATA STRIP --- */}
      <section className="border-b border-zinc-100 bg-zinc-50/50">
        <div className="grid grid-cols-2 gap-8 px-6 py-12 mx-auto max-w-7xl lg:grid-cols-4">
          {specs.map((spec, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm text-[#C75B39]">
                <spec.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{spec.label}</p>
                <p className="text-sm font-bold text-[#06392F]">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="grid grid-cols-1 gap-20 px-6 py-24 mx-auto max-w-7xl lg:grid-cols-12">
        {/* Project Narrative */}
        <div className="space-y-12 lg:col-span-7">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] block mb-6">Structural Narrative</span>
            <h2 className="text-4xl font-black text-[#06392F] uppercase tracking-tighter mb-8 leading-tight">
              An Exercise in <br /> Modern Urbanity.
            </h2>
            <div className="space-y-6 text-lg font-medium leading-relaxed text-zinc-600">
              <p>
                Riverwalk Commercial stands as a landmark of modern architectural engineering in Kakamega. The project required a meticulous balance of high-density retail space and efficient professional office layouts.
              </p>
              <p>
                Utilizing a reinforced concrete frame with an emphasis on sustainable thermal regulation, the structure features floor-to-ceiling glass facades that minimize the need for artificial lighting during peak hours.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="p-8 bg-white border-2 shadow-sm border-zinc-50 rounded-3xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#06392F] mb-4">Engineering Specs</h3>
              <ul className="space-y-3">
                {['Pad Foundations', 'Reinforced Concrete Frame', 'Cantilevered Terraces', 'BIM Optimized'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                    <CheckCircle2 size={16} className="text-[#C75B39]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-white border-2 shadow-sm border-zinc-50 rounded-3xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#06392F] mb-4">Core Systems</h3>
              <ul className="space-y-3">
                {['Rainwater Harvesting', 'Solar Grid Integration', 'Passive Cooling', 'High-Speed Fiber'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                    <CheckCircle2 size={16} className="text-[#C75B39]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar / Stats Card */}
        <div className="lg:col-span-5">
          <div className=".sticky top-32 p-10 bg-[#06392F] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Building2 size={120} />
             </div>
             
             <h3 className="mb-8 text-2xl italic font-black tracking-tighter uppercase">Technical Trust</h3>
             <div className="space-y-8">
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-white/10 rounded-xl text-[#C75B39]">
                   <Ruler size={24} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 text-white">Compliance</p>
                   <p className="text-sm font-bold">NCA 6 Registered Standard</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-white/10 rounded-xl text-[#C75B39]">
                   <Users size={24} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 text-white">Collaboration</p>
                   <p className="text-sm font-bold">NEMA Certified Assessment</p>
                 </div>
               </div>
             </div>

             <Link href="/contact" className="mt-12 block text-center py-5 bg-[#C75B39] hover:bg-[#A64828] transition-colors rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">
                Inquire for similar builds
             </Link>
          </div>
        </div>
      </section>

      {/* --- IMAGE GALLERY --- */}
      <section className="py-24 border-t bg-zinc-50 border-zinc-100">
        <div className="px-6 mx-auto max-w-7xl">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#C75B39] mb-12 text-center">Visual Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px]">
            <div className="relative overflow-hidden md:col-span-8 rounded-3xl group">
              <Image src="/assets/images/projects/riverwalk-1.jpg" alt="Exterior" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="grid grid-rows-2 gap-6 md:col-span-4">
               <div className="relative overflow-hidden rounded-3xl group">
                <Image src="/assets/images/projects/riverwalk-2.jpg" alt="Interior" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
               </div>
               <div className="relative overflow-hidden rounded-3xl group">
                <Image src="/assets/images/projects/riverwalk-3.jpg" alt="Detail" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
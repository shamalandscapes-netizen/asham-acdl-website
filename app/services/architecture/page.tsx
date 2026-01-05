'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  PenTool, Compass, Layers, Map, 
  ShieldCheck, ArrowLeft, Lightbulb, Building2 
} from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-white font-montserrat">
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 bg-[#06392F] text-white overflow-hidden">
        <div className="container relative z-10 px-4 mx-auto max-w-7xl">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#C75B39] mb-8 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="mb-6 text-5xl font-black uppercase tracking-tighter md:text-7xl">
              Architectural <br /> Intelligence
            </h1>
            <p className="text-xl font-medium leading-relaxed text-gray-300 border-l-4 border-[#C75B39] pl-6 max-w-2xl">
              Merging aesthetic vision with technical rigor. We design spaces that don't just exist—they inspire, function, and endure through the lens of modern spatial logic.
            </p>
          </motion.div>
        </div>
        {/* Background Graphic consistent with Construction page */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-white opacity-5 translate-x-1/4 translate-y-1/4 rounded-full" />
      </section>

      {/* --- CORE CAPABILITIES --- */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            
            {/* Left: Content */}
            <div className="lg:col-span-7">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C75B39] mb-4 block">
                Design Philosophy
              </span>
              <h2 className="mb-8 text-4xl font-black text-[#06392F] uppercase tracking-tighter">
                Conceptual Vision & <br /> Technical Execution
              </h2>
              <p className="mb-10 text-lg font-medium leading-relaxed text-gray-600">
                Our architectural approach is rooted in the "Golden Ratio" of utility, durability, and beauty. We utilize advanced BIM modeling and computational design to ensure every line drawn is a line that can be built.
              </p>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  { 
                    icon: PenTool, 
                    title: "Concept Design", 
                    desc: "Translating abstract vision into viable spatial schematic studies." 
                  },
                  { 
                    icon: Layers, 
                    title: "BIM Modeling", 
                    desc: "Full 3D digital twins for clash detection and precise planning." 
                  },
                  { 
                    icon: Lightbulb, 
                    title: "Interior Bio-Design", 
                    desc: "Optimizing light, air, and flow for human-centric environments." 
                  },
                  { 
                    icon: Map, 
                    title: "Urban Planning", 
                    desc: "Integrating structures into the broader city-wide ecosystem." 
                  }
                ].map((item, i) => (
                  <div key={i} className="p-8 border border-gray-100 bg-gray-50 rounded-2xl group hover:border-[#C75B39] transition-all">
                    <item.icon className="text-[#C75B39] mb-4 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="mb-2 text-lg font-black uppercase tracking-tight text-[#06392F]">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Technical Stats Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-6">
                <div className="p-10 bg-gray-50 border border-gray-100 rounded-3xl">
                  <h3 className="mb-8 text-xl font-black uppercase tracking-widest text-[#06392F] border-b pb-4">
                    The Design Standard
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="p-1 bg-[#C75B39] rounded mt-1"><ShieldCheck size={16} className="text-white" /></div>
                      <div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-[#06392F]">Aesthetic Rigor</p>
                        <p className="text-sm font-medium text-gray-500">Every detail serves a structural or visual purpose.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="p-1 bg-[#C75B39] rounded mt-1"><Compass size={16} className="text-white" /></div>
                      <div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-[#06392F]">Sustainability</p>
                        <p className="text-sm font-medium text-gray-500">Net-zero ready designs and passive solar strategies.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-10 bg-[#C75B39] rounded-3xl text-white shadow-2xl">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Next Step</p>
                  <h3 className="mb-6 text-2xl font-black uppercase tracking-tighter">
                    Blueprint <br /> Your Next Vision
                  </h3>
                  <Link href="/contact">
                    <button className="w-full py-4 font-black uppercase text-[10px] tracking-[0.3em] bg-white text-[#06392F] rounded-xl hover:bg-[#06392F] hover:text-white transition-all shadow-xl">
                      Design Consultation
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PROJECT SCOPE FOOTER --- */}
      <section className="py-20 border-t border-gray-100 bg-gray-50/50">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between items-center gap-8">
            {['Residential', 'Commercial', 'Public Space', 'Master Planning'].map((scope, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="h-px w-12 bg-[#C75B39]" />
                <span className="text-lg font-black uppercase tracking-tighter text-[#06392F] opacity-40">{scope}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
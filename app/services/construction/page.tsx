'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Wrench, HardHat, DraftingCompass, Truck, 
  ShieldCheck, ArrowLeft, Ruler, Building 
} from 'lucide-react';

export default function ConstructionPage() {
  return (
    <main className="min-h-screen bg-white">
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
              Precision <br /> Construction
            </h1>
            <p className="text-xl font-medium leading-relaxed text-gray-300 border-l-4 border-[#C75B39] pl-6 max-w-2xl">
              Engineering the skyline with structural integrity and relentless precision. From industrial complexes to residential masterpieces, we build for legacy.
            </p>
          </motion.div>
        </div>
        {/* Background Graphic */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-white opacity-5 translate-x-1/4 translate-y-1/4 rounded-full" />
      </section>

      {/* --- CORE CAPABILITIES --- */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            
            {/* Left: Content */}
            <div className="lg:col-span-7">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C75B39] mb-4 block">
                Technical Expertise
              </span>
              <h2 className="mb-8 text-4xl font-black text-[#06392F] uppercase tracking-tighter">
                Structural Engineering & <br /> Project Management
              </h2>
              <p className="mb-10 text-lg font-medium leading-relaxed text-gray-600">
                Our construction division operates as a synchronized machine. We manage every variable—from ground-breaking to the final interior finish—ensuring timelines are met and quality is never compromised.
              </p>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  { 
                    icon: DraftingCompass, 
                    title: "Structural Design", 
                    desc: "Advanced engineering calculations for maximum stability." 
                  },
                  { 
                    icon: HardHat, 
                    title: "Site Supervision", 
                    desc: "On-site management to ensure 100% plan adherence." 
                  },
                  { 
                    icon: Ruler, 
                    title: "Quality Control", 
                    desc: "Rigorous testing of materials and structural joints." 
                  },
                  { 
                    icon: Truck, 
                    title: "Logistics", 
                    desc: "Efficient deployment of heavy machinery and materials." 
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
                    The Asham Standard
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="p-1 bg-[#C75B39] rounded mt-1"><ShieldCheck size={16} className="text-white" /></div>
                      <div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-[#06392F]">Safety Protocols</p>
                        <p className="text-sm font-medium text-gray-500">Zero-accident goal on every site.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="p-1 bg-[#C75B39] rounded mt-1"><Building size={16} className="text-white" /></div>
                      <div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-[#06392F]">Durability</p>
                        <p className="text-sm font-medium text-gray-500">Structures built to last 100+ years.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-10 bg-[#C75B39] rounded-3xl text-white shadow-2xl">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Next Step</p>
                  <h3 className="mb-6 text-2xl font-black uppercase tracking-tighter">
                    Request a <br /> Site Feasibility Study
                  </h3>
                  <Link href="/contact">
                    <button className="w-full py-4 font-black uppercase text-[10px] tracking-[0.3em] bg-white text-[#06392F] rounded-xl hover:bg-[#06392F] hover:text-white transition-all shadow-xl">
                      Consultation
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
            {['Residential', 'Commercial', 'Industrial', 'Civil Works'].map((scope, i) => (
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
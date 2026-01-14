'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HardHat, PenTool, Hammer, ShieldCheck, Leaf, 
  Users, Award, ChevronDown, ArrowRight, CheckCircle2,
  MapPin, Microscope, Scale, DraftingCompass 
} from 'lucide-react';
import { useState } from 'react';

// --- Improved TeamCard Component ---
const TeamCard = ({ 
  name, role, bio, icon: Icon, license 
}: { 
  name: string, role: string, bio: string, icon: any, license: string 
}) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="relative p-10 bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-[#06392F]/5"
  >
    {/* Technical Marking Decor */}
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
      <DraftingCompass size={120} />
    </div>

    <div className="relative z-10">
      <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center mb-8 text-[#06392F] group-hover:bg-[#C75B39] group-hover:text-white transition-all duration-500">
        <Icon size={24} />
      </div>

      <div className="mb-6 space-y-1">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-[#06392F] leading-none">
          {name}
        </h3>
        <p className="text-[#C75B39] font-black text-[9px] uppercase tracking-[0.25em] italic">
          {role}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-zinc-500 font-medium mb-8 min-h-[80px]">
        {bio}
      </p>

      <div className="pt-6 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Registry Credential</span>
            <span className="text-[10px] font-black text-[#06392F] uppercase tracking-wider group-hover:text-[#C75B39] transition-colors">
              {license}
            </span>
          </div>
          <CheckCircle2 size={16} className="text-[#C75B39] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Process Step Component ---
const ProcessStep = ({ number, title, desc, icon: Icon }: { number: string, title: string, desc: string, icon: any }) => (
  <div className="relative py-4 pl-10 border-l-2 border-zinc-100 group">
    <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-white border-4 border-zinc-200 group-hover:border-[#C75B39] transition-all duration-500" />
    <div className="mb-6 w-12 h-12 flex items-center justify-center bg-[#06392F] text-white rounded-xl group-hover:bg-[#C75B39] transition-colors shadow-lg">
      <Icon size={20} />
    </div>
    <h4 className="text-sm font-black text-[#06392F] uppercase tracking-widest mb-3">
       <span className="text-[#C75B39] mr-2">{number}.</span> {title}
    </h4>
    <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-500">{desc}</p>
  </div>
);

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white selection:bg-[#C75B39] selection:text-white">
      
      {/* 1. HERO WITH BLUEPRINT GRID */}
      <section className="relative py-32 bg-[#06392F] text-white overflow-hidden bg-blueprint-white">
        <div className="container relative z-10 px-6 mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <span className="inline-block py-1.5 px-4 rounded-sm bg-[#C75B39] text-white font-black text-[10px] uppercase tracking-[0.4em] mb-10">
              Structural Excellence // NCA 6
            </span>
            <h1 className="mb-8 text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
              Heavy <br /> <span className="text-zinc-500/50">Geometry.</span>
            </h1>
            <p className="max-w-xl text-lg text-zinc-300 font-medium leading-relaxed border-l-2 border-[#C75B39] pl-8">
              Asham Design Construction Ltd: Orchestrating Kenya&apos;s infrastructure through site-specific rigor and computational integrity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <div className="relative z-20 mx-6 -mt-10 bg-white border-b shadow-xl border-zinc-100 rounded-3xl max-w-7xl lg:mx-auto">
        <div className="grid grid-cols-2 gap-8 px-10 py-10 md:grid-cols-4">
          {[
            { label: 'Accreditation', value: 'NCA 6' },
            { label: 'Completed', value: '50+' },
            { label: 'Principals', value: '12' },
            { label: 'Active Sites', value: '08' }
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-[#06392F] tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WHO WE ARE */}
      <section className="px-6 py-32 mx-auto max-w-7xl bg-blueprint">
        <div className="grid items-center gap-20 md:grid-cols-12">
          <div className="space-y-10 md:col-span-7">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39]">Corporate Intelligence</span>
              <h2 className="text-5xl md:text-6xl font-black text-[#06392F] uppercase tracking-tighter leading-[0.9]">
                Engineering <br /><span className="text-zinc-300">Resilient Futures.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-xl font-medium leading-relaxed text-zinc-600">
               Operating at the intersection of architecture and heavy engineering, we deploy <span className="text-[#06392F] font-black underline decoration-[#C75B39] decoration-4 underline-offset-4">computational logic</span> to solve human housing challenges.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              {['BIM Integrated', 'Sustainable Logic', 'NEMA Compliant', 'NCA 6 Certified'].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-[#C75B39] rotate-45" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-[#06392F]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative md:col-span-5">
            <div className="aspect-[4/5] bg-zinc-100 rounded-[3rem] overflow-hidden relative shadow-2xl group border-8 border-white">
               <Image 
                 src="/assets/images/about/site-inspection.jpg" 
                 alt="Inspection" fill className="object-cover transition-all duration-1000 grayscale group-hover:grayscale-0"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#06392F]/80 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROCESS - BLUEPRINT STYLE */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-200">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-end justify-between gap-8 mb-24 md:flex-row">
            <h2 className="text-5xl font-black text-[#06392F] uppercase tracking-tighter leading-none">The Tectonic <br /> Lifecycle</h2>
            <p className="max-w-sm text-sm font-bold leading-relaxed tracking-widest uppercase text-zinc-400">
              Standardized Operation // Ref: NCA-Compliance-2024
            </p>
          </div>
          <div className="grid gap-16 md:grid-cols-3">
             <ProcessStep number="01" title="Seismic Analysis" icon={Microscope} desc="Comprehensive soil mechanics and ecological impact studies." />
             <ProcessStep number="02" title="BIM Schematic" icon={DraftingCompass} desc="Integrating mechanical and electrical blueprints via 3D modeling." />
             <ProcessStep number="03" title="Force Execution" icon={Hammer} desc="Deploying heavy assets under strict safety protocols." />
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP SECTION */}
      <section className="px-6 py-32 mx-auto max-w-7xl">
        <div className="flex flex-col items-end justify-between gap-6 mb-20 md:flex-row">
          <div className="max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] block mb-4">Principal Intelligence</span>
            <h2 className="text-5xl font-black text-[#06392F] uppercase tracking-tighter">Authorized <br /> Stakeholders</h2>
          </div>
          <p className="hidden font-mono text-xs tracking-widest uppercase text-zinc-400 md:block">Registry Ver: 2024.v1</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <TeamCard name="John M. Shamala" role="Principal Architect" icon={Users} license="MAAK Reg. 4305 // NEMA 9700" bio="Architecture (JKUAT). Directs the firm's strategic environmental and landscape orchestration." />
          <TeamCard name="Noel Syambi" role="Design Visualizer" icon={PenTool} license="BIM Lead // Spatial Computation" bio="Expert in high-fidelity 3D concept development and algorithmic urban modeling." />
          <TeamCard name="Gabriel Wanjala" role="Site Supervisor" icon={HardHat} license="NCA Certified // Force Manager" bio="Managing technical execution with zero-tolerance for structural deviance." />
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="bg-[#06392F] py-32 px-6 text-center text-white relative overflow-hidden bg-blueprint-white">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.8]">
            Commit to <br /> <span className="text-[#C75B39]">Structural Rigor.</span>
          </h2>
          <Link href="/contact" className="group inline-flex items-center gap-8 bg-[#C75B39] text-white font-black uppercase tracking-[0.3em] text-[10px] py-6 px-12 rounded-full hover:bg-white hover:text-[#06392F] transition-all duration-500 shadow-2xl">
            Begin Consultation <ArrowRight size={18} className="transition-transform group-hover:translate-x-3" />
          </Link>
        </div>
      </section>

    </main>
  );
}

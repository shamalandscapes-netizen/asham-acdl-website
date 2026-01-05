'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HardHat, PenTool, Hammer, ShieldCheck, Leaf, 
  Users, Award, ChevronDown, ArrowRight, CheckCircle2,
  MapPin, Microscope, Scale, DraftingCompass // Added missing import
} from 'lucide-react';
import { useState } from 'react';

// --- Improved Components ---

const TeamCard = ({ name, role, bio, icon: Icon }: { name: string, role: string, bio: string, icon: any }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 bg-white border border-zinc-100 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 group"
  >
    <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 text-[#06392F] group-hover:bg-[#C75B39] group-hover:text-white transition-colors duration-500">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-black uppercase tracking-tighter text-[#06392F]">{name}</h3>
    <p className="text-[#C75B39] font-bold text-[10px] mb-4 uppercase tracking-[0.2em] italic">{role}</p>
    <p className="text-sm leading-relaxed text-zinc-500 font-medium">{bio}</p>
    <div className="mt-6 pt-6 border-t border-zinc-50 flex gap-4">
       <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">Professional Profile // 01</span>
    </div>
  </motion.div>
);

const ProcessStep = ({ number, title, desc, icon: Icon }: { number: string, title: string, desc: string, icon: any }) => (
  <div className="relative group">
    <div className="mb-8 flex items-center gap-4">
      <div className="relative z-10 w-14 h-14 flex items-center justify-center bg-[#06392F] text-white rounded-2xl group-hover:bg-[#C75B39] transition-colors duration-500">
        <Icon size={24} />
        <span className="absolute -top-2 -right-2 bg-white text-[#06392F] text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border border-zinc-100 shadow-sm">
          {number}
        </span>
      </div>
      <div className="h-[1px] flex-grow bg-zinc-200 hidden md:block"></div>
    </div>
    <h4 className="text-sm font-black text-[#06392F] uppercase tracking-widest mb-3">{title}</h4>
    <p className="text-sm leading-relaxed text-zinc-500 font-medium">{desc}</p>
  </div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 last:border-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-6 text-left group"
      >
        <span className={`text-sm font-black uppercase tracking-wider transition-colors ${isOpen ? 'text-[#C75B39]' : 'text-[#06392F] group-hover:text-[#C75B39]'}`}>
          {question}
        </span>
        <ChevronDown className={`text-[#C75B39] transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-sm leading-relaxed text-zinc-500 font-medium max-w-2xl">{answer}</p>
      </motion.div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-montserrat">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-32 bg-[#06392F] text-white overflow-hidden">
        {/* Architectural Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="container relative z-10 px-6 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <span className="inline-block py-1 px-4 rounded-sm bg-[#C75B39] text-white font-black text-[10px] uppercase tracking-[0.3em] mb-8">
              Structural Excellence // Est. Kenya
            </span>
            <h1 className="mb-8 text-6xl font-black uppercase tracking-tighter md:text-8xl leading-[0.9]">
              Legacy <br /> <span className="text-zinc-400">Engineering.</span>
            </h1>
            <p className="max-w-xl text-lg text-zinc-300 font-medium leading-relaxed border-l-2 border-[#C75B39] pl-8">
              Asham Design Construction Ltd: An NCA 6 registered force delivering the future of Western Kenya through geometric rigor and sustainable integrity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 py-12 gap-8">
          {[
            { label: 'NCA Category', value: '06' },
            { label: 'Projects Completed', value: '50+' },
            { label: 'Specialists', value: '12' },
            { label: 'Active Sites', value: '08' }
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-[#06392F]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- WHO WE ARE --- */}
      <section className="max-w-7xl px-6 py-24 mx-auto md:py-32">
        <div className="grid items-center gap-20 md:grid-cols-12">
          <div className="md:col-span-7 space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39]">Corporate Profile</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#06392F] uppercase tracking-tighter leading-tight">
              Pioneering Infrastructure <br /> with <span className="text-zinc-300">Technical Precision.</span>
            </h2>
            <div className="space-y-6 text-zinc-600 font-medium text-lg leading-relaxed">
              <p>
                Operating at the intersection of architecture and heavy engineering, we specialize in high-stakes construction, water works, and strategic refurbishment across Kenya&apos;s public and private sectors.
              </p>
              <p className="text-base text-zinc-500">
                Our <strong className="text-[#06392F] font-black italic underline decoration-[#C75B39]">NCA 6</strong> accreditation isn&apos;t just a license; it&apos;s a commitment to the rigorous dynamic between site-specific analysis and structural execution.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 pt-6">
              {['NCA 6 Registered', 'BIM Integrated', 'Sustainable Logic', 'NEMA Compliant'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#C75B39]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#06392F]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-5 relative">
            <div className="aspect-[3/4] bg-zinc-100 rounded-3xl overflow-hidden relative shadow-2xl border-4 border-white">
               <Image 
                 src="/assets/images/about/site-inspection.jpg" 
                 alt="Technical Site Inspection"
                 fill
                 className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#06392F]/60 to-transparent" />
            </div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="absolute -bottom-10 -left-10 p-8 bg-white shadow-2xl rounded-2xl border border-zinc-100 hidden lg:block"
            >
              <div className="flex items-center gap-5">
                <div className="bg-[#FDF2F0] p-4 rounded-xl text-[#C75B39]">
                  <Award size={32} />
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-[#06392F]">Accreditation</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Certified Building Works</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- OUR PROCESS --- */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] block mb-4">Workflow Logic</span>
              <h2 className="text-4xl font-black text-[#06392F] uppercase tracking-tighter">The Design-Build <br /> Lifecycle</h2>
            </div>
            <p className="max-w-sm text-sm font-medium text-zinc-500 border-l border-zinc-200 pl-6 italic">
              A synchronized operation from initial zoning analysis to the final interior tectonic finish.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <ProcessStep 
              number="01" 
              title="Site Analysis" 
              icon={Microscope}
              desc="Comprehensive zoning, soil mechanics, and ecological impact studies to define buildability."
            />
            <ProcessStep 
              number="02" 
              title="Tectonic Schematic" 
              icon={DraftingCompass}
              desc="Integrating structural, mechanical, and electrical blueprints with high-fidelity 3D modeling."
            />
            <ProcessStep 
              number="03" 
              title="Execution" 
              icon={Hammer}
              desc="Deploying heavy assets and skilled labor under strict NCA safety protocols and timelines."
            />
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP TEAM --- */}
      <section className="max-w-7xl px-6 py-24 mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] block mb-4">The Intellect</span>
          <h2 className="text-4xl font-black text-[#06392F] uppercase tracking-tighter">Principal Stakeholders</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <TeamCard 
            name="John M. Shamala"
            role="Principal Landscape Architect"
            icon={Users}
            bio="Architecture (JKUAT). MAAK Reg. 4305. NEMA Accredited Specialist (No. 9700). Orchestrating the firm's strategic environmental vision."
          />
          <TeamCard 
            name="Noel Syambi"
            role="Design Visualizer"
            icon={PenTool}
            bio="Specialist in 3D spatial computation and high-fidelity concept development for complex urban projects."
          />
          <TeamCard 
            name="Gabriel Wanjala"
            role="Site Supervisor"
            icon={HardHat}
            bio="Leading project execution with a focus on load-bearing logic, on-site safety, and rigorous quality adherence."
          />
        </div>
      </section>

      {/* --- VISION & MISSION --- */}
      <section className="bg-[#06392F] py-32 text-white relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[20rem] font-black text-white/[0.02] select-none leading-none">
           CORE
         </div>

        <div className="grid max-w-7xl gap-20 px-6 mx-auto md:grid-cols-2 relative z-10">
          <div className="space-y-8">
            <div className="w-14 h-14 bg-[#C75B39] rounded-2xl flex items-center justify-center shadow-xl">
              <Award size={28} />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter italic">The Vision</h3>
            <p className="text-xl font-light leading-relaxed text-zinc-400">
              To be the definitive choice in East African infrastructure, where innovation meets <span className="text-white font-bold tracking-tight">Cost-Effective Resilience.</span>
            </p>
          </div>

          <div className="space-y-8">
            <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
              <Scale size={28} className="text-[#C75B39]" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter italic">The Mission</h3>
            <p className="text-xl font-light leading-relaxed text-zinc-400">
              Upholding unequivocal ethical standards while deploying <span className="text-white font-bold tracking-tight">Computational Technology</span> to solve human housing challenges.
            </p>
          </div>
        </div>
      </section>

      {/* --- SUSTAINABILITY & FAQ --- */}
      <section className="max-w-4xl px-6 py-24 mx-auto">
        <motion.div 
          whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
          className="p-10 mb-20 border-2 border-zinc-100 bg-white rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-10 items-center"
        >
          <div className="p-6 text-white bg-[#06392F] rounded-3xl shadow-xl shadow-green-900/20">
            <Leaf size={40} />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#06392F] uppercase tracking-tight mb-3 italic">Tectonic Sustainability</h3>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed mb-4">
              We insist on ecological responsibility. Our projects in Western Kenya are designed to minimize footprint while maximizing thermal efficiency.
            </p>
            <div className="flex gap-4 text-[9px] font-black tracking-[0.2em] text-[#C75B39] uppercase">
              <span>Safety First</span> <span>•</span> <span>Inclusive Design</span> <span>•</span> <span>Future-Ready</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C75B39]">Inquiries</span>
            <h2 className="text-3xl font-black text-[#06392F] uppercase tracking-tighter">Technical FAQ</h2>
          </div>
          <div className="bg-white border border-zinc-100 rounded-3xl px-8 shadow-sm">
            <FaqItem 
              question="What is the significance of your NCA 6 status?" 
              answer="NCA 6 registration permits us to undertake building works of specific contract values, ensuring that our technical team and inventory meet the rigorous standards of the National Construction Authority."
            />
            <FaqItem 
              question="Does Asham handle NEMA compliance in-house?" 
              answer="Yes. Under the leadership of John Shamala, a NEMA Accredited Specialist, we integrate Environmental Impact Assessments (EIA) directly into the pre-design phase."
            />
            <FaqItem 
              question="Are you involved in large-scale residential complexes?" 
              answer="Absolutely. We specialize in mixed-use developments that combine functional density with modern landscape architecture."
            />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="bg-[#06392F] py-24 px-6 text-center text-white overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            Breaking Ground <br /> <span className="text-[#C75B39]">Starts Here.</span>
          </h2>
          <p className="mb-10 text-zinc-400 font-medium">
            From commercial industrial complexes to high-end residential masterpieces, our engineering team is ready to synchronize your vision.
          </p>
          <Link 
            href="/contact" 
            className="group inline-flex items-center gap-6 bg-white text-[#06392F] font-black uppercase tracking-[0.3em] text-[10px] py-5 px-10 rounded-full hover:bg-[#C75B39] hover:text-white transition-all duration-500 shadow-2xl shadow-black/20"
          >
            Request Consultation <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
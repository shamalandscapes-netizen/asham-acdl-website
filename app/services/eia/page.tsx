'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Leaf, ShieldCheck, FileSearch, Trash2, 
  ClipboardCheck, ArrowLeft, AlertTriangle 
} from 'lucide-react';

export default function EIAPage() {
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
              Environmental <br /> Impact Assessment
            </h1>
            <p className="text-xl font-medium leading-relaxed text-gray-300 border-l-4 border-[#C75B39] pl-6 max-w-2xl">
              We do not view environmental compliance as a suggestion. At Asham Design, we insist on rigorous ecological responsibility for every project we undertake.
            </p>
          </motion.div>
        </div>
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C75B39] opacity-10 skew-x-12 translate-x-20" />
      </section>

      {/* --- CORE CONTENT --- */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            
            {/* Left Column: The Mandate */}
            <div className="lg:col-span-7">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C75B39] mb-4 block">
                The Regulatory Mandate
              </span>
              <h2 className="mb-8 text-4xl font-black text-[#06392F] uppercase tracking-tighter">
                NEMA Compliance & <br /> Ecological Audits
              </h2>
              <p className="mb-6 text-lg font-medium leading-relaxed text-gray-600">
                In accordance with the Environmental Management and Coordination Act, we provide comprehensive Environmental Impact Assessments (EIA) to ensure your project meets all NEMA standards before the first stone is laid.
              </p>
              
              <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2">
                {[
                  { 
                    icon: ShieldCheck, 
                    title: "Project Approval", 
                    desc: "Securing necessary licenses and permits for construction commencement." 
                  },
                  { 
                    icon: FileSearch, 
                    title: "Site Audits", 
                    desc: "Periodic environmental monitoring throughout the construction lifecycle." 
                  },
                  { 
                    icon: Trash2, 
                    title: "Waste Management", 
                    desc: "Strategic planning for sustainable disposal and resource efficiency." 
                  },
                  { 
                    icon: ClipboardCheck, 
                    title: "Compliance Reports", 
                    desc: "Regular documentation submission to regulatory authorities." 
                  }
                ].map((item, i) => (
                  <div key={i} className="p-8 border border-gray-100 bg-gray-50 rounded-2xl">
                    <item.icon className="text-[#C75B39] mb-4" size={32} />
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

            {/* Right Column: The "Why" */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 p-10 bg-[#06392F] rounded-3xl text-white shadow-2xl">
                <div className="flex items-center justify-center w-16 h-16 mb-8 bg-[#C75B39] rounded-2xl">
                  <Leaf size={32} />
                </div>
                <h3 className="mb-6 text-3xl font-black uppercase tracking-tighter">
                  Sustainability is <br /> Not Optional
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="mt-1 shrink-0"><AlertTriangle className="text-[#C75B39]" size={20} /></div>
                    <p className="text-sm font-medium text-gray-300">
                      Failure to perform a valid EIA can lead to immediate project suspension and legal penalties.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1 shrink-0"><AlertTriangle className="text-[#C75B39]" size={20} /></div>
                    <p className="text-sm font-medium text-gray-300">
                      Our assessments protect both the local ecosystem and the long-term asset value of your build.
                    </p>
                  </li>
                </ul>
                <div className="pt-8 mt-10 border-t border-white/10">
                  <p className="mb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Ready to initiate compliance?
                  </p>
                  <Link href="/contact">
                    <button className="w-full py-4 font-black uppercase text-[10px] tracking-[0.3em] bg-[#C75B39] text-white rounded-xl hover:bg-white hover:text-[#06392F] transition-all shadow-xl">
                      Consult Our Experts
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PROCESS FOOTER --- */}
      <section className="py-20 border-t border-gray-100">
        <div className="container px-4 mx-auto max-w-7xl text-center">
          <h4 className="mb-12 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
            Our Assessment Workflow
          </h4>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {['Screening', 'Scoping', 'Impact Analysis', 'Mitigation', 'Reporting'].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl font-black text-gray-200 mb-2">0{i + 1}</span>
                <span className="text-xs font-black uppercase tracking-widest text-[#06392F]">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
// components/ProcessFlow.tsx
'use client';

import { motion } from 'framer-motion';
import { ClipboardList, PenTool, HardHat, CheckCircle2, ArrowRight } from 'lucide-react';

const processSteps = [
  {
    icon: ClipboardList,
    title: 'Consultation',
    description: 'We begin by understanding your vision, requirements, and site conditions.',
    details: ['Site analysis', 'Budget planning', 'Timeline discussion']
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'Our architects translate your ideas into detailed plans and 3D visualizations.',
    details: ['Conceptual design', 'Technical drawings', 'Material selection']
  },
  {
    icon: HardHat,
    title: 'Construction',
    description: 'Skilled craftsmen bring the design to life with precision and care.',
    details: ['Project management', 'Quality control', 'Timely execution']
  },
  {
    icon: CheckCircle2,
    title: 'Handover',
    description: 'We deliver your completed project with thorough inspection and documentation.',
    details: ['Final inspection', 'Client walkthrough', 'Aftercare support']
  }
];

export default function ProcessFlow() {
  return (
    <div className="relative py-12">
      {/* Soft Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#C75B39]/5 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#06392F]/5 rounded-full blur-3xl transform -translate-y-1/2" />
      </div>

      {/* Desktop Curved Connector */}
      <svg 
        className="absolute left-0 right-0 hidden w-full h-4 pointer-events-none top-24 lg:block"
        preserveAspectRatio="none"
        viewBox="0 0 1200 20"
      >
        <motion.path
          d="M 0 10 Q 150 10 300 10 T 600 10 T 900 10 T 1200 10"
          stroke="#C75B39"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 8"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
      </svg>

      <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => {
          const Icon = step.icon;
          
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Floating Number Pill */}
              <motion.div 
                className="absolute z-20 -top-4 left-6"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="px-4 py-2 bg-[#06392F] rounded-full shadow-lg shadow-[#06392F]/20 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#C75B39]">STEP</span>
                  <span className="text-sm font-black text-white">{index + 1}</span>
                </div>
              </motion.div>

              {/* Main Card - Ultra Rounded */}
              <div className="relative h-full pt-10 pb-8 px-6 bg-white rounded-[2rem] border-2 border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#C75B39]/10 hover:border-[#C75B39]/30 transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                
                {/* Soft Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C75B39]/5 via-transparent to-[#06392F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem]" />
                
                {/* Decorative Top Arc */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C75B39]/10 rounded-full blur-2xl group-hover:bg-[#C75B39]/20 transition-colors duration-500" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container - Softened */}
                  <motion.div 
                    className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-[#06392F] to-[#0a4d3f] flex items-center justify-center shadow-lg shadow-[#06392F]/30 group-hover:shadow-xl group-hover:shadow-[#C75B39]/20 group-hover:from-[#C75B39] group-hover:to-[#a84a2f] transition-all duration-500"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="text-white w-7 h-7" />
                  </motion.div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-[#06392F] group-hover:text-[#C75B39] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>

                  {/* Details - Pill Tags */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {step.details.map((detail, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        viewport={{ once: true }}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 group-hover:bg-[#C75B39]/10 group-hover:text-[#C75B39] group-hover:border-[#C75B39]/30 transition-all duration-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C75B39] mr-2 group-hover:scale-125 transition-transform" />
                        {detail}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#C75B39]/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Connector Arrow (Desktop) */}
              {index < processSteps.length - 1 && (
                <div className="absolute z-10 hidden transform translate-x-1/2 lg:block top-24 -right-6">
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-white border-2 border-[#C75B39]/20 flex items-center justify-center shadow-lg hover:border-[#C75B39]/50 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-[#C75B39]" />
                  </motion.div>
                </div>
              )}

              {/* Mobile Connector */}
              {index < processSteps.length - 1 && (
                <div className="flex justify-center mt-8 lg:hidden">
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-white border-2 border-[#C75B39]/20 flex items-center justify-center shadow-lg"
                  >
                    <ArrowRight className="w-5 h-5 text-[#C75B39] rotate-90" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
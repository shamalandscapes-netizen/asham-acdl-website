'use client';

import { motion } from 'framer-motion';
import { Award, Building2, Shield, Users, Zap, DollarSign } from 'lucide-react';

const values = [
  {
    icon: Award,
    title: 'NCA Accredited',
    description: 'Certified industry standards'
  },
  {
    icon: Building2,
    title: 'Full-Service',
    description: 'Design to Construction'
  },
  {
    icon: Shield,
    title: 'Safety-First',
    description: 'Zero compromise on safety'
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Technically trained pros'
  },
  {
    icon: Zap,
    title: 'Quality Solutions',
    description: 'Premium craftsmanship'
  },
  {
    icon: DollarSign,
    title: 'Cost-Efficient',
    description: 'Optimized budget plans'
  }
];

export default function ValuesStrip() {
  return (
    <div className="py-16 overflow-hidden bg-[#06392F] border-y border-white/5">
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* Header Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
            High-quality, cost-efficient construction solutions
          </h2>
          <p className="text-lg text-gray-300">Built on a foundation of excellence and integrity</p>
        </motion.div>
        
        {/* Values Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-4 py-6 text-center transition-all bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 border border-white/5 hover:border-[#C75B39]/50 group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-[#C75B39]/20 group-hover:bg-[#C75B39] transition-colors">
                <value.icon className="w-6 h-6 text-[#C75B39] group-hover:text-white transition-colors" />
              </div>
              <h3 className="mb-2 text-base font-bold text-white">{value.title}</h3>
              <p className="text-xs text-gray-400 transition-colors md:text-sm group-hover:text-gray-200">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
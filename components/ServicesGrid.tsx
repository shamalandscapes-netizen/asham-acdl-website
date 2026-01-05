'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ShoppingCart, Building2, Wrench, Home, 
  Users, FileText, ShieldCheck, Clock, ArrowRight, Leaf 
} from 'lucide-react';

interface Service {
  icon: any;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  link: string;
}

const services: Service[] = [
  {
    icon: Leaf,
    title: 'Environmental Impact Assessment',
    description: 'Mandatory NEMA-compliant assessments. We insist on ecological responsibility for every project to ensure long-term sustainability.',
    features: ['NEMA Compliance', 'Ecological Audits', 'Sustainability Planning', 'Waste Management'],
    gradient: 'from-[#06392F] via-[#1a4a3e] to-[#06392F]',
    link: '/services/eia'
  },
  {
    icon: Wrench,
    title: 'Construction Services',
    description: 'End-to-end construction project management and site supervision with a focus on structural integrity.',
    features: ['Structural Engineering', 'Project Management', 'Quality Control', 'Site Supervision'],
    gradient: 'from-[#C75B39] to-[#a04022]',
    link: '/services/construction'
  },
  {
    icon: ShoppingCart,
    title: 'Building Materials Supply',
    description: 'Premium construction materials sourced directly from trusted manufacturers for guaranteed quality.',
    features: ['Cement & Concrete', 'Steel & Metal Products', 'Timber Products', 'Finishing Materials'],
    gradient: 'from-[#06392F] to-[#0A4D40]',
    link: '/products'
  },
  {
    icon: Building2,
    title: 'Architectural Services',
    description: 'Complete architectural design, 3D visualization, and planning solutions for modern spaces.',
    features: ['Building Design', '3D Visualization', 'Planning Permission', 'Interior Design'],
    gradient: 'from-[#06392F] via-[#2D5C52] to-[#06392F]',
    link: '/services/architecture'
  }
];

const additionalServices = [
  { icon: Users, title: 'Consultation', description: 'Expert construction advice and feasibility studies.' },
  { icon: FileText, title: 'Documentation', description: 'Complete project documentation and legal approvals.' },
  { icon: ShieldCheck, title: 'Safety Audits', description: 'Comprehensive site safety and compliance inspections.' },
  { icon: Clock, title: 'Maintenance', description: 'Ongoing property maintenance and structural health checks.' },
];

export default function ServicesGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C75B39] mb-4 block">
            Our Capabilities
          </span>
          <h2 className="mb-6 text-4xl font-black text-[#06392F] uppercase tracking-tighter md:text-5xl">
            Core Solutions
          </h2>
          <p className="max-w-2xl mx-auto text-lg font-medium text-gray-500">
            From regulatory environmental approvals to final structural completion, we deliver integrated construction excellence.
          </p>
        </motion.div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 gap-8 mb-24 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${service.gradient} text-white rounded-3xl shadow-2xl overflow-hidden group`}
            >
              <div className="flex flex-col h-full p-10">
                <div className="flex items-start gap-6 mb-10">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md shrink-0 border border-white/10 group-hover:bg-[#C75B39] transition-colors duration-500">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-2xl font-black uppercase tracking-tight">{service.title}</h3>
                    <p className="leading-relaxed text-gray-200 font-medium opacity-90">{service.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 mb-10 sm:grid-cols-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-1.5 h-1.5 bg-[#C75B39] rounded-full shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-widest">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <Link href={service.link}>
                    <button className="px-8 py-4 font-black uppercase text-[10px] tracking-[0.2em] transition-all bg-white rounded-xl text-[#06392F] hover:bg-[#C75B39] hover:text-white flex items-center gap-3 shadow-xl">
                      View Details <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Services Section */}
        <div className="pt-20 border-t border-gray-100">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 transition-all bg-gray-50 rounded-2xl hover:bg-white hover:shadow-2xl border border-transparent hover:border-gray-100 group"
              >
                <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[#06392F] text-white group-hover:bg-[#C75B39] transition-colors duration-500 shadow-lg">
                  <service.icon size={28} />
                </div>
                <h4 className="mb-3 text-lg font-black uppercase tracking-tight text-[#06392F]">{service.title}</h4>
                <p className="text-sm font-medium leading-relaxed text-gray-500">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Link href="/services">
            <button className="px-10 py-5 font-black uppercase text-[10px] tracking-[0.3em] text-white transition-all rounded-2xl bg-[#C75B39] hover:bg-[#06392F] hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-xl">
              Full Service Catalog
            </button>
          </Link>
        </div>
        
      </div>
    </section>
  );
}
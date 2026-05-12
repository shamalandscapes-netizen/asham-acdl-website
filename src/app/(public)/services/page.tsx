// app/services/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Hammer,
  PencilRuler,
  HardHat,
  Truck,
  ArrowRight,
  Building,
  ClipboardList,
  LayoutTemplate,
  Leaf,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Award,
  Users,
  TrendingUp,
  Shield,
  Star,
  ChevronRight,
  ArrowUpRight,
  Quote,
  PlayCircle,
  Calculator,
  FileCheck,
  Wrench,
  Ruler
} from 'lucide-react';

/* -------------------- ENHANCED SERVICES DATA -------------------- */
const SERVICES = [
  {
    slug: 'general-construction',
    icon: Hammer,
    title: 'General Construction',
    shortTitle: 'Construction',
    description: 'From residential homes to commercial high-rises, we deliver robust construction services with a focus on structural integrity and timely delivery.',
    benefits: ['15+ years experience', 'ISO certified processes', 'On-time delivery guarantee'],
    stats: { value: '250+', label: 'Projects Completed' },
    color: 'from-[#06392F] to-[#0a4d3f]'
  },
  {
    slug: 'architectural-design',
    icon: PencilRuler,
    title: 'Architectural Design',
    shortTitle: 'Architecture',
    description: 'Our in-house architects create functional, aesthetically pleasing blueprints and 3D renders tailored to your specific vision and plot requirements.',
    benefits: ['BORAQS registered', '3D visualization included', 'NEMA compliant designs'],
    stats: { value: '15+', label: 'Design Awards Won' },
    color: 'from-[#C75B39] to-[#a84a2f]'
  },
  {
    slug: 'environmental-impact-assessment',
    icon: Leaf,
    title: 'Environmental Impact Assessment',
    shortTitle: 'EIA',
    description: 'Comprehensive environmental impact assessments to ensure compliance with regulatory standards and sustainable development practices.',
    benefits: ['Regulatory compliance', 'Sustainability insights', 'Risk mitigation'],

    stats: { value: '15+', label: 'Design Awards Won' },
    color: 'from-[#C75B39] to-[#a84a2f]'
  },
  {
    slug: 'project-management',
    icon: ClipboardList,
    title: 'Project Management',
    shortTitle: 'Management',
    description: 'We handle logistics, budgeting, compliance, and site supervision, ensuring your project runs smoothly from ground-breaking to handover.',
    benefits: ['Real-time progress tracking', 'Budget optimization', 'Risk mitigation'],
    stats: { value: '98%', label: 'On-Budget Delivery' },
    color: 'from-[#06392F] to-[#1a5f50]'
  },
  {
    slug: 'interior-design',
    icon: LayoutTemplate,
    title: 'Interior Design & Fit-outs',
    shortTitle: 'Interiors',
    description: 'Transform your space with modern interior finishing services including tiling, ceilings, cabinetry, lighting, and painting.',
    benefits: ['Custom cabinetry', 'Premium finishes', 'Lighting design'],
    stats: { value: '100%', label: 'Client Satisfaction' },
    color: 'from-[#C75B39] to-[#d96c4a]'
  },
  {
    slug: 'material-supply',
    icon: Truck,
    title: 'Material Supply',
    shortTitle: 'Materials',
    description: 'We source and supply high-quality construction materials—steel, cement, roofing—directly to your site at competitive market rates.',
    benefits: ['Direct from manufacturers', 'Quality guaranteed', 'Bulk discounts'],
    stats: { value: '500+', label: 'Products Available' },
    color: 'from-[#06392F] to-[#2d6a5f]'
  },
  {
    slug: 'civil-engineering',
    icon: HardHat,
    title: 'Civil Engineering',
    shortTitle: 'Engineering',
    description: 'Expertise in infrastructure development including drainage systems, driveways, retaining walls, and structural reinforcement.',
    benefits: ['Structural analysis', 'Soil testing', 'Permit handling'],
    stats: { value: '50+', label: 'Infrastructure Projects' },
    color: 'from-[#C75B39] to-[#e07d5f]'
  },
  {
    slug: 'landscaping-design-installation',
    icon: Leaf,
    title: 'Landscaping Design & Installation',
    shortTitle: 'Landscaping',
    description: 'Professional landscape design and installation services inspired by nature, functionality, and sustainable outdoor living.',
    benefits: ['Native plants', 'Irrigation systems', 'Maintenance plans'],
    stats: { value: '30+', label: 'Gardens Created' },
    color: 'from-[#06392F] to-[#3d7a6f]'
  }
];

const PROCESS_STEPS = [
  { 
    number: '01', 
    title: 'Discovery', 
    desc: 'We listen. Your vision, budget, and timeline become our blueprint for success.',
    icon: Users,
    color: 'bg-[#C75B39]'
  },
  { 
    number: '02', 
    title: 'Design & Planning', 
    desc: 'Detailed plans, 3D renders, and regulatory approvals—handled entirely by our team.',
    icon: PencilRuler,
    color: 'bg-[#06392F]'
  },
  { 
    number: '03', 
    title: 'Execution', 
    desc: 'Skilled craftsmen, daily updates, and rigorous quality control at every stage.',
    icon: Hammer,
    color: 'bg-[#C75B39]'
  },
  { 
    number: '04', 
    title: 'Delivery', 
    desc: 'Final inspection, documentation, and handover of keys to your completed project.',
    icon: CheckCircle2,
    color: 'bg-[#06392F]'
  }
];

const TRUST_INDICATORS = [
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Building, value: '250+', label: 'Projects Delivered' },
  { icon: Users, value: '200+', label: 'Happy Clients' },
  { icon: Shield, value: '100%', label: 'Quality Guarantee' }
];

const TESTIMONIALS = [
  {
    quote: "Asham transformed our vision into reality. The attention to detail and professionalism exceeded our expectations.",
    author: "Samuel Waswa",
    role: "Homeowner, Mlolongo",
    project: "Maisonette Project"
  },
  {
    quote: "From design to handover, the process was seamless. Our commercial space was delivered on time and under budget.",
    author: "Malava Teachers SACCO",
    role: "Commercial Client",
    project: "Teachers Plaza"
  }
];

export default function ServicesPage() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">

      {/* HERO - Impact Statement */}
      <section className="relative bg-[#06392F] text-white py-32 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(199,91,57,0.1) 40%, rgba(199,91,57,0.1) 60%, transparent 60%)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full bg-white/10 backdrop-blur-sm border-white/20"
          >
            <Star className="w-4 h-4 text-[#C75B39]" />
            <span className="text-xs font-bold tracking-widest uppercase">Kenya&apos;s Trusted Construction Partner</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-5xl font-black leading-tight md:text-6xl lg:text-7xl"
          >
            We Build What Others
            <span className="block text-[#C75B39]">Only Imagine</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-300"
          >
            From concept to completion, we deliver award-winning architecture, precision engineering, 
            and construction excellence that stands the test of time.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-[#C75B39] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-[#d96c4a] transition-all shadow-lg shadow-[#C75B39]/30 hover:shadow-xl"
            >
              <Phone className="w-5 h-5" />
              Start Your Project Today
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-wide text-white transition-all border rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30"
            >
              <PlayCircle className="w-5 h-5" />
              Explore Services
            </Link>
          </motion.div>

          {/* Trust Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8 mt-16 border-t border-white/10"
          >
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {TRUST_INDICATORS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                      <Icon className="w-5 h-5 text-[#C75B39]" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black">{item.value}</div>
                      <div className="text-xs tracking-wider text-gray-400 uppercase">{item.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US - Value Proposition */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[#C75B39] font-bold uppercase tracking-widest text-xs">Why Industry Leaders Choose Us</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-black text-[#06392F]">
              The Asham Advantage
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                icon: Shield, 
                title: 'Licensed & Certified', 
                desc: 'NEMA licensed, BORAQS registered, and ISO certified. Your project is in qualified hands.',
                stat: '100% Compliant'
              },
              { 
                icon: Clock, 
                title: 'On-Time Delivery', 
                desc: 'We respect deadlines. Our track record shows 95% of projects delivered on or before schedule.',
                stat: '95% On-Time'
              },
              { 
                icon: TrendingUp, 
                title: 'Transparent Pricing', 
                desc: 'No hidden costs. Detailed quotations with clear breakdowns and competitive market rates.',
                stat: 'Zero Hidden Fees'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-8 bg-[#F5F5F0] rounded-2xl group hover:bg-[#06392F] transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#06392F] text-white flex items-center justify-center mb-6 group-hover:bg-[#C75B39] transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#06392F] mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#06392F]/60 mb-4 group-hover:text-white/80 transition-colors">
                    {item.desc}
                  </p>
                  <div className="inline-block px-3 py-1 bg-[#C75B39]/10 rounded-full text-xs font-bold text-[#C75B39] group-hover:bg-white/20 group-hover:text-white transition-colors">
                    {item.stat}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES GRID - The Main Event */}
      <section id="services" className="px-4 py-24 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#C75B39]/10 rounded-full text-[#C75B39] font-bold uppercase tracking-widest text-xs mb-6">
            <Wrench className="w-4 h-4" />
            Comprehensive Solutions
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#06392F] mb-6">
            Every Service You Need,
            <span className="block text-[#C75B39]">Under One Roof</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#06392F]/60">
            From the first sketch to the final brick, we handle every phase of your construction journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredService === service.slug;

            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredService(service.slug)}
                onMouseLeave={() => setHoveredService(null)}
                className="relative group"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="block h-full p-8 bg-white rounded-3xl border-2 border-[#06392F]/5 hover:border-[#C75B39]/30 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Stats Badge */}
                  <div className="absolute top-6 right-6 px-3 py-1 bg-[#F5F5F0] rounded-full">
                    <span className="text-xs font-bold text-[#06392F]">{service.stats.value}</span>
                    <span className="text-[10px] text-[#06392F]/50 ml-1">{service.stats.label}</span>
                  </div>

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-[#06392F] to-[#0a4d3f] flex items-center justify-center text-white shadow-lg group-hover:from-[#C75B39] group-hover:to-[#a84a2f] transition-all duration-500">
                      <Icon size={32} />
                    </div>

                    <h3 className="text-2xl font-black text-[#06392F] mb-3 group-hover:text-[#C75B39] transition-colors">
                      {service.title}
                    </h3>

                    <p className="mb-6 leading-relaxed text-[#06392F]/60">
                      {service.description}
                    </p>

                    {/* Benefits List */}
                    <ul className="mb-8 space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#06392F]/70">
                          <CheckCircle2 className="w-4 h-4 text-[#C75B39]" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-6 border-t border-[#06392F]/10">
                      <span className="text-sm font-bold text-[#C75B39] group-hover:text-[#06392F] transition-colors">
                        Explore Service
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#F5F5F0] flex items-center justify-center group-hover:bg-[#C75B39] transition-colors">
                        <ArrowUpRight className="w-5 h-5 text-[#06392F] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Quote CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 bg-white rounded-full shadow-lg border border-[#06392F]/5">
            <span className="px-6 text-sm text-[#06392F]/60">Need a custom solution?</span>
            <Link
              href="/contact"
              className="px-8 py-3 bg-[#06392F] text-white rounded-full font-bold text-sm hover:bg-[#C75B39] transition-colors flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Get Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS - How We Work */}
      <section className="relative py-24 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #06392F 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-6xl px-4 mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[#C75B39] font-bold uppercase tracking-widest text-xs">Our Process</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-black text-[#06392F]">
              Four Steps to Your Dream Project
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-[#06392F]/10 -z-10" />
                  )}
                  
                  <div className="p-6 bg-[#F5F5F0] rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#06392F]/10">
                    <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-5xl font-black text-[#06392F]/10 mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold text-[#06392F] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#06392F]/60 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Social Proof */}
      <section className="py-24 bg-[#06392F] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C75B39]/20 rounded-full blur-[100px]" />
        
        <div className="relative max-w-6xl px-4 mx-auto">
          <div className="mb-16 text-center">
            <Quote className="w-16 h-16 text-[#C75B39] mx-auto mb-6" />
            <h2 className="text-3xl font-black md:text-4xl">Trusted by Homeowners & Businesses</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 border bg-white/5 backdrop-blur-sm rounded-2xl border-white/10"
              >
                <p className="mb-6 text-lg leading-relaxed text-gray-200">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#C75B39] flex items-center justify-center font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-[#C75B39] mt-1">{testimonial.project}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - Urgency & Action */}
      <section className="py-24 px-4 bg-[#F5F5F0]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 bg-white rounded-[2.5rem] shadow-2xl shadow-[#06392F]/10 border border-[#06392F]/5"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C75B39]/10 flex items-center justify-center">
              <FileCheck className="w-10 h-10 text-[#C75B39]" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-[#06392F] mb-4">
              Your Project Deserves the Best
            </h2>
            <p className="text-lg text-[#06392F]/60 mb-8 max-w-2xl mx-auto">
              Join 200+ satisfied clients who trusted us with their homes, offices, and commercial spaces. 
              Let&apos;s discuss your vision today.
            </p>

            <div className="flex flex-col justify-center gap-4 mb-8 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-[#C75B39] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#d96c4a] transition-all shadow-lg shadow-[#C75B39]/30"
              >
                <Phone className="w-5 h-5" />
                Call Now: 0712 575 077
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-3 bg-[#06392F] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0a4d3f] transition-all"
              >
                <Building className="w-5 h-5" />
                See Our Work
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#06392F]/50">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Response within 24 hours
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Free initial consultation
              </span>
              <span className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                No obligation quotes
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  HardHat, PenTool, Hammer, ShieldCheck, Leaf, 
  Users, Award, ChevronDown, ArrowRight, CheckCircle2,
  MapPin, Microscope, Scale, DraftingCompass, 
  Compass, Ruler, Building2, Zap, Clock, Target,
  ChevronRight, FileText, Briefcase, PhoneCall,
  Camera, Instagram, Linkedin, Twitter
} from 'lucide-react';

// --- Image Gallery Section (NEW) ---
const ImageGallery = () => {
  const images = [
    {
      src: '/assets/images/about/studio-1.jpeg',
      alt: 'Asham Studio Nairobi',
      caption: 'Nairobi Studio • Headquarters'
    },
    {
      src: '/assets/images/about/site-2.jpeg',
      alt: 'Site Inspection',
      caption: 'Active Site • Naivasha'
    },
    {
      src: '/assets/images/about/team-1.jpeg',
      alt: 'Team Collaboration',
      caption: 'Design Review • Kakamega'
    },
    {
      src: '/assets/images/about/project-3.jpeg',
      alt: 'Completed Project',
      caption: 'Lakeside Residence • 2024'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-zinc-50">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] block mb-4">
            Studio Life
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#06392F] uppercase tracking-tighter">
            Behind the <span className="text-[#C75B39]">Blueprints</span>
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-gray-500">
            A glimpse into the spaces and moments that shape our work.
          </p>
        </div>

        {/* Circular Gallery */}
        <div className="relative">
          {/* Decorative Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[800px] border-2 border-[#C75B39]/10 rounded-full" />
          </div>

          {/* Main Circle Grid */}
          <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Circular Image Container */}
                <div className="relative overflow-hidden border-4 border-white rounded-full shadow-2xl aspect-square">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06392F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Caption on Hover */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 p-4 text-center text-white"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      {image.caption}
                    </p>
                  </motion.div>
                </div>

                {/* Decorative Ring */}
                <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#C75B39]/20 group-hover:border-[#C75B39] transition-colors duration-500" />
              </motion.div>
            ))}
          </div>

          {/* Center Accent */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#C75B39] rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
          >
            <Camera className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Instagram Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link 
            href="https://instagram.com/ashamdesign" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#06392F] hover:text-[#C75B39] transition-colors"
          >
            <Instagram size={14} />
            Follow our journey
            <ArrowRight size={12} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// --- TeamCard Component (Enhanced with Social Links) ---
const TeamCard = ({ 
  name, role, bio, icon: Icon, license, image, social 
}: { 
  name: string, role: string, bio: string, icon: any, license: string, image?: string,
  social?: { linkedin?: string, twitter?: string }
}) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="relative bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-[#06392F]/10"
  >
    {/* Card Header with subtle gradient */}
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#06392F]/5 to-transparent" />
    
    {/* Technical Pattern Overlay */}
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke='%2306392F' strokeWidth='0.5' opacity='0.2'/%3E%3C/svg%3E")`,
        backgroundSize: '30px 30px'
      }} />
    </div>

    <div className="relative z-10 p-10">
      {/* Avatar/Icon Section with Image Option */}
      <div className="flex items-start justify-between mb-8">
        {image ? (
          <div className="w-20 h-20 overflow-hidden border-4 border-white shadow-xl rounded-2xl">
            <Image src={image} alt={name} width={80} height={80} className="object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-[#06392F] to-[#1a4a3e] rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
            <Icon size={32} />
          </div>
        )}
        
        {/* Social Icons */}
        <div className="flex gap-2">
          {social?.linkedin && (
            <Link href={social.linkedin} className="p-2 bg-zinc-100 rounded-lg hover:bg-[#C75B39] hover:text-white transition-colors">
              <Linkedin size={14} />
            </Link>
          )}
          {social?.twitter && (
            <Link href={social.twitter} className="p-2 bg-zinc-100 rounded-lg hover:bg-[#C75B39] hover:text-white transition-colors">
              <Twitter size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Name & Role */}
      <div className="mb-4">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-[#06392F] leading-tight mb-2">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-6 h-[2px] bg-[#C75B39]" />
          <p className="text-[#C75B39] font-black text-[10px] uppercase tracking-[0.25em]">
            {role}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm leading-relaxed text-zinc-600 font-medium mb-6 min-h-[80px]">
        {bio}
      </p>

      {/* Credentials */}
      <div className="pt-6 border-t border-zinc-100">
        <div className="flex items-center justify-between group-hover:items-start">
          <div>
            <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest mb-1 block">
              Registry Credential
            </span>
            <span className="text-[10px] font-black text-[#06392F] uppercase tracking-wider group-hover:text-[#C75B39] transition-colors">
              {license}
            </span>
          </div>
          <motion.div 
            initial={{ x: -10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="hidden group-hover:block"
          >
            <CheckCircle2 size={16} className="text-[#C75B39]" />
          </motion.div>
        </div>
      </div>
    </div>

    {/* Bottom Accent */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C75B39] via-[#06392F] to-[#C75B39] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
  </motion.div>
);

// --- Process Step Component ---
const ProcessStep = ({ number, title, desc, icon: Icon }: { number: string, title: string, desc: string, icon: any }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="relative pl-12 group"
  >
    {/* Timeline Line */}
    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C75B39] via-[#06392F] to-transparent" />
    
    {/* Timeline Dot */}
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-[#C75B39] group-hover:scale-125 transition-transform duration-300" />
    
    <div className="pt-0">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#06392F] to-[#1a4a3e] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon size={20} />
        </div>
        <span className="text-4xl font-black text-[#06392F]/10">{number}</span>
      </div>
      
      <h4 className="text-xl font-black text-[#06392F] uppercase tracking-tight mb-3">
        {title}
      </h4>
      
      <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-500">
        {desc}
      </p>
    </div>
  </motion.div>
);

// --- FAQ Item Component ---
const FAQItem = ({ question, answer, isOpen, onClick }: any) => (
  <div className="border-b border-zinc-100 last:border-0">
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-6 text-left group"
    >
      <span className="text-sm font-black uppercase tracking-wider text-[#06392F] group-hover:text-[#C75B39] transition-colors">
        {question}
      </span>
      <ChevronDown 
        className={`w-5 h-5 text-[#C75B39] transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <p className="pb-6 text-sm leading-relaxed text-zinc-500">
        {answer}
      </p>
    </motion.div>
  </div>
);

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <main className="min-h-screen bg-white selection:bg-[#C75B39]/20 selection:text-[#06392F]">
      
      {/* 1. HERO WITH PARALLAX EFFECT */}
      <section 
        ref={heroRef}
        className="relative h-screen min-h-[800px] bg-[#06392F] text-white overflow-hidden"
      >
        {/* Background Pattern */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[url('/blueprint-pattern.jpg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#06392F]" />
          
          {/* Animated Grid Lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </motion.div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-64 h-64 border rounded-full top-20 right-20 border-white/10"
        />
        
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute border rounded-full bottom-20 left-20 w-96 h-96 border-white/5"
        />

        <div className="relative z-10 flex items-center h-full px-6 mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Accreditation Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-10"
            >
              <span className="px-4 py-2 bg-[#C75B39] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full">
                NCA 6 Certified
              </span>
              <span className="text-white/40 text-[10px] font-bold tracking-widest">
                Est. 2019
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8 text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8]"
            >
              Engineering <br /> 
              <span className="relative inline-block text-[#C75B39]">
                Precision.
                <motion.span 
                  className="absolute -bottom-4 left-0 w-full h-2 bg-[#C75B39]/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-xl text-lg text-white/70 font-medium leading-relaxed border-l-4 border-[#C75B39] pl-8"
            >
              Asham Design Construction Ltd: Orchestrating Kenya's infrastructure through site-specific rigor, 
              computational integrity, and three decades of technical excellence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-6 mt-12"
            >
              <Link href="/contact">
                <button className="group bg-[#C75B39] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-white hover:text-[#06392F] transition-all shadow-2xl">
                  Start Project <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/projects">
                <button className="flex items-center gap-3 px-8 py-4 text-xs font-black tracking-widest text-white uppercase transition-all border rounded-full group border-white/30 hover:bg-white/10">
                  View Portfolio
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute transform -translate-x-1/2 bottom-12 left-1/2"
        >
          <div className="flex justify-center w-6 h-10 border-2 rounded-full border-white/30">
            <div className="w-1 h-2 mt-2 rounded-full bg-white/60" />
          </div>
        </motion.div>
      </section>

      {/* 2. STATS BAR WITH COUNTER ANIMATION */}
      <div className="relative z-20 mx-6 -mt-16 bg-white border border-zinc-100 shadow-2xl rounded-[2rem] max-w-7xl lg:mx-auto">
        <div className="grid grid-cols-2 gap-8 px-10 py-12 md:grid-cols-4">
          {[
            { label: 'Years of Excellence', value: '7', suffix: '+' },
            { label: 'Projects Completed', value: '30', suffix: '+' },
            { label: 'Team Members', value: '10', suffix: '+' },
            { label: 'Active Sites', value: '6', suffix: '' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">{stat.label}</p>
              <p className="text-4xl md:text-5xl font-black text-[#06392F] tracking-tighter">
                {stat.value}<span className="text-[#C75B39]">{stat.suffix}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. WHO WE ARE - ENHANCED */}
      <section className="px-6 py-32 mx-auto max-w-7xl">
        <div className="grid items-center gap-20 lg:grid-cols-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10 lg:col-span-7"
          >
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#C75B39]" />
                Corporate Intelligence
              </span>
              
              <h2 className="text-5xl lg:text-6xl font-black text-[#06392F] uppercase tracking-tighter leading-[0.9]">
                Engineering <br />
                <span className="relative text-[#C75B39]">
                  Resilient Futures.
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-full h-2 bg-[#C75B39]/20"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  />
                </span>
              </h2>
            </div>

            <p className="max-w-2xl text-xl font-medium leading-relaxed text-zinc-600">
              Operating at the intersection of architecture and heavy engineering, we deploy 
              <span className="text-[#06392F] font-black px-2">computational logic</span> 
              to solve complex structural challenges across Kenya's evolving landscape.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6">
              {[
                { icon: Building2, label: 'BIM Integrated' },
                { icon: Leaf, label: 'Sustainable Logic' },
                { icon: Scale, label: 'NEMA Compliant' },
                { icon: Award, label: 'NCA 6 Certified' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-2 bg-[#06392F]/5 rounded-lg group-hover:bg-[#C75B39] transition-colors duration-300">
                      <Icon size={16} className="text-[#06392F] group-hover:text-white" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#06392F]">
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-black text-[#C75B39]">100%</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">On-Time Delivery</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#C75B39]">0</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Safety Incidents</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative lg:col-span-5"
          >
            <div className="aspect-[4/5] bg-zinc-100 rounded-[3rem] overflow-hidden relative shadow-2xl group">
              <Image 
                src="/assets/images/about/site-inspection.jpeg" 
                alt="Site Inspection" 
                fill 
                className="object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06392F]/80 via-transparent to-transparent opacity-60" />
              
              {/* Overlay Text */}
              <div className="absolute text-white bottom-8 left-8">
                <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Current Project</div>
                <div className="text-xl font-black">Lakeside Residence</div>
                <div className="text-sm opacity-80">Naivasha • 2024</div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#C75B39]/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* 4. PROCESS - ENHANCED TIMELINE */}
      <section className="relative py-32 overflow-hidden bg-zinc-50 border-y border-zinc-200">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6,57,47,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative z-10 px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-end justify-between gap-8 mb-24 md:flex-row">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] block mb-4">
                Methodology
              </span>
              <h2 className="text-5xl font-black text-[#06392F] uppercase tracking-tighter leading-none">
                The Tectonic <br />
                <span className="text-zinc-300">Lifecycle</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm font-bold leading-relaxed tracking-widest uppercase text-zinc-400">
              Standardized Operation // Ref: NCA-Compliance-2024
            </p>
          </div>

          <div className="relative grid gap-16 md:grid-cols-3">
            {/* Connecting Line */}
            <div className="absolute top-12 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C75B39] via-[#06392F] to-[#C75B39] opacity-20 hidden md:block" />
            
            <ProcessStep number="01" title="Seismic Analysis" icon={Microscope} desc="Comprehensive soil mechanics and ecological impact studies with advanced geotechnical modeling." />
            <ProcessStep number="02" title="BIM Schematic" icon={DraftingCompass} desc="Integrating mechanical and electrical blueprints via 3D modeling and clash detection." />
            <ProcessStep number="03" title="Force Execution" icon={Hammer} desc="Deploying heavy assets under strict safety protocols with real-time structural monitoring." />
          </div>

          {/* Process Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 mt-24 border-t border-zinc-200">
            {[
              { value: '12+', label: 'Years Average Experience' },
              { value: '100%', label: 'Safety Compliance' },
              { value: '0', label: 'Structural Failures' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-[#C75B39]">{stat.value}</div>
                <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. IMAGE GALLERY SECTION (NEW - ABOVE TEAM) */}
      <ImageGallery />

      {/* 6. LEADERSHIP SECTION - ENHANCED */}
      <section className="px-6 py-32 mx-auto max-w-7xl">
        <div className="flex flex-col items-end justify-between gap-6 mb-20 md:flex-row">
          <div className="max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] block mb-4">
              Principal Intelligence
            </span>
            <h2 className="text-5xl font-black text-[#06392F] uppercase tracking-tighter">
              Authorized <br /> 
              <span className="text-[#C75B39]">Stakeholders</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 bg-zinc-100 px-4 py-2 rounded-full">
              Registry Ver: 2025.v1
            </span>
            <div className="flex -space-x-2">
              {[1,2,3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#C75B39]/10 border-2 border-white" />
              ))}
              <div className="w-8 h-8 rounded-full bg-[#06392F] text-white flex items-center justify-center text-[10px] font-black border-2 border-white">
                +3
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <TeamCard 
            name="John M. Shamala" 
            role="Principal Architect" 
            icon={DraftingCompass} 
            license="MAAK Reg. 4305 // NEMA 9700" 
            bio="Founded Asham Design & Construction Ltd with a vision for integrated, site-responsive architecture. Holds degrees in Architecture and Landscape Design (JKUAT). Leads environmental impact assessments and NEMA compliance for all major projects. Over 20 years of experience orchestrating residential, commercial, and industrial developments across Kenya."
            social={{ linkedin: "#", twitter: "#" }}
          />
          <TeamCard 
            name="Noel Syambi" 
            role="Architectural Designer & Site Supervisor" 
            icon={PenTool} 
            license="BIM Lead // Interior Design Specialist" 
            bio="Produces detailed architectural drawings and high-fidelity 3D visualizations for residential and commercial projects. Translates client concepts into construction-ready plans while overseeing on-site execution to ensure design fidelity. Certified in advanced parametric design and interior space planning."
            social={{ linkedin: "#" }}
          />
          <TeamCard 
            name="Millicent Adhiambo" 
            role="Landscape Architect" 
            icon={Leaf} 
            license="Landscape Architect" 
            bio="A specialist in indigenous Kenyan flora and sustainable site planning. Millicent leads the firm's biophilic design initiatives, seamlessly integrating built structures with their natural surroundings. She is passionate about preserving Kenya's biodiversity through regenerative design practices."
            social={{ linkedin: "#" }}
          />
          <TeamCard 
            name="Gabriel Wanjala" 
            role="Architect, Site Supervisor" 
            icon={HardHat} 
            license="Architect // Site Management Lead" 
            bio="Oversees technical execution with over 3 years of experience in heavy construction. Ensures structural precision through rigorous quality control, daily site inspections, and strict adherence to engineering specifications. Known for identifying and resolving on-site challenges before they impact timelines."
            social={{ linkedin: "#", twitter: "#" }}
          />
          <TeamCard 
            name="Jephrice Machio" 
            role="Construction Manager" 
            icon={HardHat} 
            license="NCA 6 Registered // PMP Certified" 
            bio="Orchestrates on-site operations across residential and commercial projects with a decade of experience. Specializes in timeline adherence, resource optimization, and zero-incident safety protocols. Successfully delivered the Zara Towers and Greenfield Industrial Complex under budget and ahead of schedule."
            social={{ linkedin: "#" }}
          />
          
        </div>

        {/* Team Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6 p-8 mt-16 md:grid-cols-4 bg-zinc-50 rounded-3xl"
        >
          {[
            { icon: Award, label: 'Combined Experience', value: '75+ Years' },
            { icon: FileText, label: 'Projects Led', value: '300+' },
            { icon: Briefcase, label: 'Professional Affiliations', value: '8' },
            { icon: MapPin, label: 'Counties Served', value: '24' }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="p-3 bg-white shadow-sm rounded-xl">
                  <Icon size={20} className="text-[#C75B39]" />
                </div>
                <div>
                  <div className="text-lg font-black text-[#06392F]">{item.value}</div>
                  <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-4xl px-6 mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39] block mb-4">
              Technical Inquiries
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#06392F] uppercase tracking-tighter">
              Frequently Asked
            </h2>
          </div>

          <div className="p-8 bg-white shadow-xl rounded-3xl">
            {[
              {
                q: "What is your NCA accreditation status?",
                a: "Asham Design Construction Ltd is fully NCA 6 certified, authorized to handle projects of any scale including high-rise commercial developments and complex infrastructure."
              },
              {
                q: "How do you ensure project timeline adherence?",
                a: "We employ rigorous project management protocols with weekly progress tracking, resource optimization, and contingency planning to ensure timely delivery."
              },
              {
                q: "What areas do you serve in Kenya?",
                a: "We operate nationwide with active projects in Nairobi, Mombasa, Kisumu, Nakuru, and Kakamega. Our team is equipped for remote site management."
              },
              {
                q: "Do you handle both design and construction?",
                a: "Yes, we offer integrated services from initial architectural design through to final construction, ensuring seamless execution and quality control."
              }
            ].map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA - ENHANCED */}
      <section className="relative bg-[#06392F] py-32 px-6 text-center text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute border rounded-full -top-48 -right-48 w-96 h-96 border-white/10"
        />
        
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute border rounded-full -bottom-48 -left-48 w-96 h-96 border-white/10"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.8]"
          >
            Commit to <br /> 
            <span className="relative text-[#C75B39]">
              Structural Rigor.
              <motion.span 
                className="absolute -bottom-4 left-0 w-full h-2 bg-[#C75B39]/30"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto mb-12 text-lg text-white/60"
          >
            From concept to completion, partner with Kenya's most trusted construction firm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/contact" className="group inline-flex items-center gap-8 bg-[#C75B39] text-white font-black uppercase tracking-[0.3em] text-[10px] py-6 px-12 rounded-full hover:bg-white hover:text-[#06392F] transition-all duration-500 shadow-2xl">
              Begin Consultation 
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-3" />
            </Link>
          </motion.div>

          {/* Contact Info */}
          <div className="flex items-center justify-center gap-8 mt-16 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span className="flex items-center gap-2">
              <PhoneCall size={12} /> +254 712 575 077
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-2">
              <MapPin size={12} /> Nairobi • Kakamega
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
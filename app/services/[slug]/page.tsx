// app/services/[slug]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Hammer,
  PencilRuler,
  ClipboardList,
  LayoutTemplate,
  Truck,
  HardHat,
  Leaf,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Shield,
  Award,
  TrendingUp,
  Users,
  ChevronRight,
  Star,
  FileCheck,
  Calculator,
  Ruler,
  ArrowUpRight
} from 'lucide-react';
import { use } from 'react';

/* -------------------- ENHANCED SERVICE CONTENT -------------------- */
const SERVICES: Record<string, any> = {
  'general-construction': {
    title: 'General Construction',
    shortTitle: 'Construction',
    subtitle: 'Building Strong Foundations for Generations',
    icon: Hammer,
    hero: 'From concept to completion, we construct durable residential and commercial structures with precision, accountability, and uncompromising quality.',
    description: 'Our general construction services cover residential homes, apartments, commercial buildings, and mixed-use developments. With 15+ years of experience and 250+ completed projects, we manage every phase with a commitment to safety, quality workmanship, and timely delivery. Every structure we build is engineered to withstand Kenya\'s diverse climate while meeting the highest international standards.',
    highlights: [
      'Residential & commercial construction expertise',
      'Strict quality and safety compliance (ISO certified)',
      'Experienced site engineers & certified foremen',
      '95% on-time and on-budget delivery record',
      '15-year structural warranty on all projects'
    ],
    deliverables: [
      { title: 'Site Preparation', desc: 'Clearing, excavation, and foundation works' },
      { title: 'Structural Construction', desc: 'Framing, masonry, and concrete works' },
      { title: 'Roofing & Finishes', desc: 'Weatherproofing and aesthetic completion' },
      { title: 'Final Handover', desc: 'Inspection, documentation, and key transfer' }
    ],
    stats: { projects: '250+', experience: '15+ years', satisfaction: '98%' },
    relatedServices: ['architectural-design', 'project-management', 'material-supply'],
    testimonial: {
      quote: "Asham delivered our family home on time and within budget. The quality of workmanship exceeded our expectations.",
      author: "Samuel Waswa",
      project: "Mlolongo Maisonette"
    }
  },

  'architectural-design': {
    title: 'Architectural Design',
    shortTitle: 'Architecture',
    subtitle: 'Designs That Balance Beauty, Function & Budget',
    icon: PencilRuler,
    hero: 'We translate your vision into functional, aesthetic architectural solutions that maximize space, light, and value while respecting your budget and timeline.',
    description: 'Our BORAQS-registered architectural team develops detailed drawings, 3D visualizations, and construction documents that comply with all local regulations. From modern minimalist homes to complex commercial developments, we create designs that are both beautiful and buildable—saving you time and money during construction.',
    highlights: [
      'Custom residential & commercial designs',
      'Photorealistic 3D renders & virtual walkthroughs',
      'Fast-track county & authority approvals',
      'Sustainable, climate-responsive design',
      'Value engineering to optimize costs'
    ],
    deliverables: [
      { title: 'Concept Design', desc: 'Initial sketches and massing studies' },
      { title: 'Schematic Design', desc: 'Detailed layouts and spatial planning' },
      { title: 'Construction Drawings', desc: 'Technical docs for builders' },
      { title: '3D Visualization', desc: 'Renders and virtual reality tours' }
    ],
    stats: { projects: '180+', awards: '15', approval: '100%' },
    relatedServices: ['general-construction', 'interior-design', 'project-management'],
    testimonial: {
      quote: "The 3D renders helped us visualize our home before construction. The final result matched the design perfectly.",
      author: "Tonny Muyale",
      project: "Malava Bungalow"
    }
  },
    'environmental-impact-assessment': {
    title: 'Environmental Impact Assessment',
    shortTitle: 'EIA',
    subtitle: 'Environmental Compliance & Regulatory Approval',
    icon: Leaf,
    hero: 'We conduct comprehensive Environmental Impact Assessments (EIA) to evaluate potential environmental and social impacts of proposed projects and secure statutory approval before implementation.',
    description: 'Our EIA services provide a structured and legally compliant assessment of how your proposed development may affect the surrounding environment and communities. We handle the full process — from screening and scoping to stakeholder engagement, impact analysis, mitigation planning, and submission for regulatory approval — ensuring your project aligns with environmental laws and sustainable development principles.',
    
    highlights: [
      'Baseline environmental and social studies',
      'Impact identification, prediction & evaluation',
      'Stakeholder engagement & public participation',
      'Environmental Management Plan (EMP) preparation',
      'NEMA licensing & statutory submission support',
      'Environmental audits & post-approval monitoring'
    ],

    deliverables: [
      { 
        title: 'Project Screening & Scoping Report', 
        desc: 'Determination of assessment level and identification of key environmental concerns' 
      },
      { 
        title: 'Comprehensive EIA Study Report', 
        desc: 'Detailed analysis of environmental, social, and economic impacts with mitigation measures' 
      },
      { 
        title: 'Environmental Management Plan (EMP)', 
        desc: 'Structured plan outlining mitigation, monitoring, and compliance measures during project lifecycle' 
      },
      { 
        title: 'Regulatory Submission & Approval Documentation', 
        desc: 'Complete documentation package prepared for submission to relevant authorities for licensing' 
      }
    ],

    stats: { 
      projects: '120+', 
      complianceRate: '100%', 
      sectors: '8+' 
    },

    relatedServices: [
      'environmental-audit',
      'project-feasibility-study',
      'environmental-monitoring'
    ],

    testimonial: {
      quote: "Their professional handling of the EIA process ensured we obtained approval without delays. The documentation was thorough and met all regulatory requirements.",
      author: "Project Director",
      project: "Mixed-Use Development – Machakos County"
    }
  },


  'project-management': {
    title: 'Project Management',
    shortTitle: 'Management',
    subtitle: 'Control, Coordination & Complete Transparency',
    icon: ClipboardList,
    hero: 'We take control of timelines, budgets, and teams so your project runs smoothly from groundbreaking to ribbon-cutting—without the stress.',
    description: 'Our project management service ensures efficient coordination between architects, engineers, contractors, and suppliers. With real-time progress tracking, detailed cost reporting, and proactive risk management, we keep your project on track and your mind at ease. You receive weekly updates and full financial transparency throughout.',
    highlights: [
      'Detailed budget planning & real-time tracking',
      'Contractor selection & coordination',
      'Proactive risk & quality management',
      'Weekly progress reports with photos',
      'Change order control to prevent budget creep'
    ],
    deliverables: [
      { title: 'Project Schedule', desc: 'Gantt charts and milestone tracking' },
      { title: 'Cost Reports', desc: 'Weekly budget vs. actual analysis' },
      { title: 'Site Supervision', desc: 'Daily oversight and quality checks' },
      { title: 'Completion Docs', desc: 'As-built drawings and warranties' }
    ],
    stats: { onBudget: '98%', onTime: '95%', clients: '150+' },
    relatedServices: ['general-construction', 'architectural-design', 'civil-engineering'],
    testimonial: {
      quote: "Having Asham manage our commercial project saved us months of delays and significant cost overruns.",
      author: "Malava Teachers SACCO",
      project: "Teachers Plaza"
    }
  },

  'interior-design': {
    title: 'Interior Design & Fit-outs',
    shortTitle: 'Interiors',
    subtitle: 'Spaces That Feel As Good As They Look',
    icon: LayoutTemplate,
    hero: 'We create refined interior environments that reflect your personality while enhancing comfort, functionality, and property value.',
    description: 'From residential interiors to commercial fit-outs, we deliver cohesive design solutions using premium materials and modern techniques. Our team handles everything from space planning and material selection to custom cabinetry installation and final styling—creating spaces that are both Instagram-worthy and livable.',
    highlights: [
      'Residential & commercial interior expertise',
      'Custom cabinetry & built-in furniture',
      'Lighting design & smart home integration',
      'Premium material sourcing',
      'Project styling & art curation'
    ],
    deliverables: [
      { title: 'Space Planning', desc: 'Optimal layout and flow design' },
      { title: 'Material Boards', desc: 'Finishes, colors, and textures' },
      { title: 'Installation', desc: 'Professional fit-out execution' },
      { title: 'Final Styling', desc: 'Furniture, art, and accessories' }
    ],
    stats: { projects: '120+', satisfaction: '100%', repeat: '85%' },
    relatedServices: ['architectural-design', 'general-construction', 'landscaping-design-installation'],
    testimonial: {
      quote: "Our medical reception now reflects the professionalism of our brand. Patients constantly compliment the space.",
      author: "Equity Afya",
      project: "Medical Reception Design"
    }
  },

  'material-supply': {
    title: 'Material Supply',
    shortTitle: 'Materials',
    subtitle: 'Quality Materials, Delivered On Time, Every Time',
    icon: Truck,
    hero: 'We supply certified, high-quality construction materials directly from manufacturers to your site—saving you money and ensuring consistency.',
    description: 'Our material supply service eliminates middlemen, providing you with factory-direct pricing on cement, steel, roofing, tiles, and finishes. Every batch is quality-verified and delivered on schedule to keep your project moving. With 500+ products and 24-48 hour delivery, we ensure you never face costly construction delays.',
    highlights: [
      'Direct-from-manufacturer pricing',
      '500+ certified products in catalog',
      '24-48 hour delivery guarantee',
      'Bulk discounts for large projects',
      'Quality verification on every batch'
    ],
    deliverables: [
      { title: 'Product Sourcing', desc: 'Global and local supplier network' },
      { title: 'Quality Check', desc: 'Lab testing and certification' },
      { title: 'Logistics', desc: 'Crane-equipped delivery trucks' },
      { title: 'Documentation', desc: 'Warranties and compliance certs' }
    ],
    stats: { products: '500+', delivery: '24-48h', projects: '300+' },
    relatedServices: ['general-construction', 'civil-engineering', 'project-management'],
    testimonial: {
      quote: "Having materials delivered on time kept our project on schedule. The quality was consistently excellent.",
      author: "Private Developer",
      project: "Nairobi Commercial Complex"
    }
  },

  'civil-engineering': {
    title: 'Civil Engineering',
    shortTitle: 'Engineering',
    subtitle: 'Infrastructure That Lasts Generations',
    icon: HardHat,
    hero: 'We design and construct civil works that support durable, functional developments—from drainage systems to structural reinforcements.',
    description: 'Our civil engineering team brings technical expertise to infrastructure challenges. We handle earthworks, drainage, pavements, retaining walls, and structural assessments with precision engineering and regulatory compliance. Every solution is designed for Kenya\'s specific soil conditions and climate challenges.',
    highlights: [
      'Drainage & flood management systems',
      'Roads, pavements & parking areas',
      'Structural assessment & reinforcement',
      'Soil testing & foundation design',
      'NEMA environmental compliance'
    ],
    deliverables: [
      { title: 'Site Analysis', desc: 'Soil testing and topography' },
      { title: 'Engineering Design', desc: 'Calculations and drawings' },
      { title: 'Construction', desc: 'Execution with quality control' },
      { title: 'Compliance', desc: 'Approvals and certifications' }
    ],
    stats: { projects: '50+', engineers: '5', compliance: '100%' },
    relatedServices: ['general-construction', 'project-management', 'material-supply'],
    testimonial: {
      quote: "Their drainage solution solved our flooding issues permanently. Professional engineering at its best.",
      author: "School Administrator",
      project: "Kakamega Institution"
    }
  },

  'landscaping-design-installation': {
    title: 'Landscaping Design & Installation',
    shortTitle: 'Landscaping',
    subtitle: 'Nature, Design & Function in Perfect Harmony',
    icon: Leaf,
    hero: 'We design and install elegant, sustainable outdoor spaces that enhance property value, improve wellbeing, and create lasting first impressions.',
    description: 'Inspired by the quality showcased at shamalandscapes.co.ke, our landscaping services combine creative design with expert horticultural knowledge. We transform residential gardens, commercial grounds, and institutional spaces into functional green environments that are visually striking, easy to maintain, and ecologically responsible.',
    highlights: [
      'Award-winning landscape architects',
      'Native & drought-resistant plant specialists',
      'Smart irrigation & drainage systems',
      'Hardscape design (paving, walls, water features)',
      'Landscape lighting & outdoor living spaces'
    ],
    deliverables: [
      { title: 'Master Planning', desc: 'Comprehensive landscape design' },
      { title: 'Planting Design', desc: 'Species selection and sourcing' },
      { title: 'Hardscaping', desc: 'Paths, walls, and structures' },
      { title: 'Maintenance Plan', desc: 'Care schedules and guidance' }
    ],
    stats: { gardens: '30+', species: '200+', warranty: '1 year' },
    relatedServices: ['architectural-design', 'interior-design', 'civil-engineering'],
    testimonial: {
      quote: "Our garden has become the neighborhood showcase. The design perfectly complements our home's architecture.",
      author: "Moureen",
      project: "Nairobi Residence"
    }
  }
};

/* -------------------- PAGE -------------------- */
export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const service = SERVICES[slug];
  if (!service) return notFound();

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-[#F5F5F0]">

      {/* HERO - Impact Section */}
      <section className="relative bg-[#06392F] text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(199,91,57,0.2) 40%, rgba(199,91,57,0.2) 60%, transparent 60%)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-white/60">
            <Link href="/services" className="transition-colors hover:text-white">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{service.shortTitle}</span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full bg-white/10 backdrop-blur-sm border-white/20"
              >
                <Icon className="w-5 h-5 text-[#C75B39]" />
                <span className="text-xs font-bold tracking-widest uppercase">Premium Service</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 text-4xl font-black leading-tight md:text-5xl lg:text-6xl"
              >
                {service.title}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#C75B39] font-bold mb-4"
              >
                {service.subtitle}
              </motion.p>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-lg leading-relaxed text-gray-300"
              >
                {service.hero}
              </motion.p>

              {/* Quick Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6 mb-8"
              >
                {Object.entries(service.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-3xl font-black text-white">{value as string}</div>
                    <div className="text-xs tracking-wider uppercase text-white/50">{key}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 bg-[#C75B39] text-white px-8 py-4 rounded-full font-bold hover:bg-[#d96c4a] transition-all shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  Get Free Quote
                </Link>
                <Link
                  href="#details"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all border rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30"
                >
                  <Calculator className="w-5 h-5" />
                  Service Details
                </Link>
              </motion.div>
            </div>

            {/* Testimonial Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden p-8 border lg:block bg-white/5 backdrop-blur-sm rounded-2xl border-white/10"
            >
              <Star className="w-8 h-8 text-[#C75B39] mb-4" />
              <p className="mb-6 text-lg italic text-gray-200">&ldquo;{service.testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C75B39] flex items-center justify-center font-bold text-white">
                  {service.testimonial.author[0]}
                </div>
                <div>
                  <div className="font-bold">{service.testimonial.author}</div>
                  <div className="text-sm text-[#C75B39]">{service.testimonial.project}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OVERVIEW - Detailed Content */}
      <section id="details" className="max-w-6xl px-4 py-20 mx-auto">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="text-3xl font-black text-[#06392F] mb-6">
                Why This Service Matters
              </h2>
              <p className="text-lg text-[#06392F]/70 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-[#06392F]/5">
              <h3 className="text-xl font-bold text-[#06392F] mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-[#C75B39]" />
                What Sets Us Apart
              </h3>
              <ul className="space-y-4">
                {service.highlights.map((item: string, index: number) => (
                  <motion.li 
                    key={item} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#C75B39]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C75B39]" />
                    </div>
                    <span className="text-[#06392F]/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div>
              <h3 className="text-2xl font-black text-[#06392F] mb-6">
                Our Deliverables
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {service.deliverables.map((item: any, index: number) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white rounded-xl shadow-sm border border-[#06392F]/5 hover:border-[#C75B39]/20 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#06392F] text-white flex items-center justify-center mb-3">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-[#06392F] mb-1">{item.title}</h4>
                    <p className="text-sm text-[#06392F]/60">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="p-6 bg-[#06392F] text-white rounded-2xl">
              <h3 className="mb-4 text-lg font-bold">Start Your Project</h3>
              <p className="mb-6 text-sm text-white/70">
                Get a free consultation and detailed quotation within 24 hours.
              </p>
              <div className="space-y-3">
                <a href="tel:+254712575077" className="flex items-center gap-3 text-sm hover:text-[#C75B39] transition-colors">
                  <Phone className="w-4 h-4" />
                  +254 712 575 077
                </a>
                <a href="mailto:info@ashamconstruction.co.ke" className="flex items-center gap-3 text-sm hover:text-[#C75B39] transition-colors">
                  <Mail className="w-4 h-4" />
                  info@ashamconstruction.co.ke
                </a>
              </div>
              <Link
                href="/contact"
                className="mt-6 block w-full text-center bg-[#C75B39] text-white py-3 rounded-xl font-bold hover:bg-[#d96c4a] transition-colors"
              >
                Request Quote
              </Link>
            </div>

            {/* Related Services */}
            <div className="p-6 bg-white rounded-2xl border border-[#06392F]/5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#06392F]/50 mb-4">
                Complementary Services
              </h3>
              <div className="space-y-3">
                {service.relatedServices.map((slug: string) => {
                  const related = SERVICES[slug];
                  if (!related) return null;
                  const RelatedIcon = related.icon;
                  return (
                    <Link
                      key={slug}
                      href={`/services/${slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F0] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#F5F5F0] flex items-center justify-center group-hover:bg-[#06392F] transition-colors">
                        <RelatedIcon className="w-5 h-5 text-[#06392F] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#06392F] text-sm">{related.shortTitle}</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#06392F]/30 group-hover:text-[#C75B39] transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="p-6 bg-[#C75B39]/10 rounded-2xl border border-[#C75B39]/20">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-[#C75B39]" />
                <span className="font-bold text-[#06392F]">Quality Guarantee</span>
              </div>
              <p className="text-sm text-[#06392F]/70">
                Every project backed by our commitment to excellence and industry certifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED SERVICES PREVIEW */}
      <section className="py-20 bg-white border-t border-[#06392F]/5">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-[#06392F] mb-4">
              Complete Your Project
            </h2>
            <p className="text-[#06392F]/60 max-w-2xl mx-auto">
              Combine this service with our other offerings for a seamless, end-to-end construction experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {service.relatedServices.slice(0, 3).map((slug: string, index: number) => {
              const related = SERVICES[slug];
              if (!related) return null;
              const RelatedIcon = related.icon;
              return (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/services/${slug}`}
                    className="block p-6 bg-[#F5F5F0] rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-[#06392F]/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#06392F] text-white flex items-center justify-center mb-4">
                      <RelatedIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#06392F] mb-2">{related.title}</h3>
                    <p className="text-sm text-[#06392F]/60 mb-4 line-clamp-2">{related.hero}</p>
                    <span className="text-sm font-bold text-[#C75B39] flex items-center gap-2">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#06392F] py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C75B39]/20 rounded-full blur-[100px]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-3xl font-black text-white md:text-4xl">
            Ready to Start Your {service.shortTitle} Project?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-white/70">
            Join 200+ satisfied clients who trusted us with their vision. 
            Get your free consultation and detailed quote today.
          </p>
          
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-[#C75B39] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#d96c4a] transition-all shadow-lg shadow-[#C75B39]/30"
            >
              <Phone className="w-5 h-5" />
              Call Now: 0712 575 077
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white transition-all border rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30"
            >
              <Ruler className="w-5 h-5" />
              View Our Portfolio
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-8 mt-12 text-sm border-t border-white/10 text-white/50">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              24-hour response guarantee
            </span>
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Free initial consultation
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              No obligation quotes
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
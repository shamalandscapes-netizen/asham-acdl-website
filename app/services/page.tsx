'use client';

import Link from 'next/link';
import { 
  Hammer, 
  PencilRuler, 
  HardHat, 
  Truck, 
  ArrowRight, 
  Building, 
  CheckCircle2,
  ClipboardList,
  LayoutTemplate
} from 'lucide-react';

// --- STATIC SERVICE DATA ---
const SERVICES = [
  {
    icon: Hammer,
    title: 'General Construction',
    description: 'From residential homes to commercial high-rises, we deliver robust construction services with a focus on structural integrity and timely delivery.'
  },
  {
    icon: PencilRuler,
    title: 'Architectural Design',
    description: 'Our in-house architects create functional, aesthetically pleasing blueprints and 3D renders tailored to your specific vision and plot requirements.'
  },
  {
    icon: ClipboardList,
    title: 'Project Management',
    description: 'We handle the logistics, budgeting, compliance, and site supervision, ensuring your project runs smoothly from ground-breaking to handover.'
  },
  {
    icon: LayoutTemplate,
    title: 'Interior Design & Fit-outs',
    description: 'Transform your space with our modern interior finishing services, including tiling, ceiling installation, cabinetry, and painting.'
  },
  {
    icon: Truck,
    title: 'Material Supply',
    description: 'We source and supply high-quality construction materials—steel, cement, roofing—directly to your site at competitive market rates.'
  },
  {
    icon: HardHat,
    title: 'Civil Engineering',
    description: 'Expertise in infrastructure development, including drainage systems, driveways, retaining walls, and structural reinforcement.'
  }
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Consultation',
    desc: 'We meet to discuss your vision, budget, and timeline.'
  },
  {
    number: '02',
    title: 'Design & Planning',
    desc: 'Our architects draft the plans and we secure necessary permits.'
  },
  {
    number: '03',
    title: 'Construction',
    desc: 'Our skilled team builds your project with regular progress updates.'
  },
  {
    number: '04',
    title: 'Handover',
    desc: 'Final inspection and key handover of your completed project.'
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-[#06392F] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Our Expertise</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200">
            Comprehensive construction solutions tailored to build your legacy. 
            Quality, integrity, and innovation in every brick.
          </p>
        </div>
      </div>

      {/* --- SERVICES GRID --- */}
      <div className="max-w-6xl px-4 py-20 mx-auto">
        <div className="mb-16 text-center">
          <span className="text-[#C75B39] font-bold uppercase tracking-wider text-sm">What We Do</span>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">End-to-End Construction Services</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#06392F] transition-colors">
                  <Icon className="text-[#06392F] group-hover:text-white transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#C75B39] transition-colors">
                  {service.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- WORK PROCESS SECTION --- */}
      <div className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            
            {/* Left: Text */}
            <div className="md:w-1/3">
              <h2 className="mb-6 text-3xl font-bold text-gray-800">How We Work</h2>
              <p className="mb-8 leading-relaxed text-gray-600">
                We believe in a transparent, structured approach to construction. From the first handshake to the final coat of paint, you are kept in the loop.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-[#06392F] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0A4D40] transition-colors"
              >
                Start Your Project <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right: Timeline Steps */}
            <div className="grid grid-cols-1 gap-6 md:w-2/3 sm:grid-cols-2">
              {PROCESS_STEPS.map((step) => (
                <div key={step.number} className="flex gap-4 p-4 transition-colors rounded-xl hover:bg-gray-50">
                  <div className="text-4xl font-black text-gray-200 select-none">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-bold text-gray-800">{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* --- BOTTOM CTA --- */}
      <div className="bg-[#0A4D40] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Building className="mx-auto mb-6 text-[#C75B39]" size={48} />
          <h2 className="mb-4 text-3xl font-bold">Ready to bring your vision to life?</h2>
          <p className="mb-8 text-lg text-gray-300">
            Whether it's a simple renovation or a complex commercial build, our team is ready to deliver excellence.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link 
              href="/contact" 
              className="bg-[#C75B39] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#b04b2c] transition-colors shadow-lg"
            >
              Get a Free Quote
            </Link>
            <Link 
              href="/projects" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#06392F] transition-colors"
            >
              View Our Portfolio
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
'use client';

import Link from 'next/link';
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
} from 'lucide-react';

/* -------------------- SERVICES DATA -------------------- */
const SERVICES = [
  {
    slug: 'general-construction',
    icon: Hammer,
    title: 'General Construction',
    description:
      'From residential homes to commercial high-rises, we deliver robust construction services with a focus on structural integrity and timely delivery.',
  },
  {
    slug: 'architectural-design',
    icon: PencilRuler,
    title: 'Architectural Design',
    description:
      'Our in-house architects create functional, aesthetically pleasing blueprints and 3D renders tailored to your specific vision and plot requirements.',
  },
  {
    slug: 'project-management',
    icon: ClipboardList,
    title: 'Project Management',
    description:
      'We handle logistics, budgeting, compliance, and site supervision, ensuring your project runs smoothly from ground-breaking to handover.',
  },
  {
    slug: 'interior-design',
    icon: LayoutTemplate,
    title: 'Interior Design & Fit-outs',
    description:
      'Transform your space with modern interior finishing services including tiling, ceilings, cabinetry, lighting, and painting.',
  },
  {
    slug: 'material-supply',
    icon: Truck,
    title: 'Material Supply',
    description:
      'We source and supply high-quality construction materials—steel, cement, roofing—directly to your site at competitive market rates.',
  },
  {
    slug: 'civil-engineering',
    icon: HardHat,
    title: 'Civil Engineering',
    description:
      'Expertise in infrastructure development including drainage systems, driveways, retaining walls, and structural reinforcement.',
  },
  {
  slug: 'landscaping-design-installation',
  icon: Leaf,
  title: 'Landscaping Design & Installation',
  description:
    'Professional landscape design and installation services inspired by nature, functionality, and sustainable outdoor living.',
},
];

const PROCESS_STEPS = [
  { number: '01', title: 'Consultation', desc: 'We discuss your vision, budget, and timeline.' },
  { number: '02', title: 'Design & Planning', desc: 'Plans are drafted and approvals secured.' },
  { number: '03', title: 'Construction', desc: 'Execution with quality control and updates.' },
  { number: '04', title: 'Handover', desc: 'Inspection, approvals, and key handover.' },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-[#06392F] text-white py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="mb-6 text-4xl font-black md:text-5xl">Our Expertise</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-200">
            End-to-end construction, design, and engineering services built on quality, integrity, and precision.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-6xl px-4 py-24 mx-auto">
        <div className="mb-16 text-center">
          <span className="text-[#C75B39] font-bold uppercase tracking-wider text-sm">
            What We Do
          </span>
          <h2 className="mt-3 text-3xl font-black text-gray-800">
            Our Core Services
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="block p-8 transition-all duration-300 bg-white border border-gray-100 group rounded-2xl hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl
                bg-gray-50 group-hover:bg-[#06392F] transition-colors">
                  <Icon size={28} className="text-[#06392F] group-hover:text-white" />
                </div>

                <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-[#C75B39]">
                  {service.title}
                </h3>

                <p className="mb-6 leading-relaxed text-gray-600">
                  {service.description}
                </p>

                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#06392F] group-hover:text-[#C75B39]">
                  Learn More <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="flex flex-col max-w-6xl gap-16 px-4 mx-auto md:flex-row">
          <div className="md:w-1/3">
            <h2 className="mb-6 text-3xl font-black text-gray-800">
              How We Work
            </h2>
            <p className="mb-8 leading-relaxed text-gray-600">
              Our process is transparent, structured, and designed to deliver quality results on time and within budget.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#06392F] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0A4D40]"
            >
              Start Your Project <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-6 md:w-2/3 sm:grid-cols-2">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50">
                <span className="text-4xl font-black text-gray-200">
                  {step.number}
                </span>
                <div>
                  <h4 className="font-bold text-gray-800">{step.title}</h4>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A4D40] py-20 px-4 text-white text-center">
        <Building size={48} className="mx-auto mb-6 text-[#C75B39]" />
        <h2 className="mb-4 text-3xl font-black">
          Ready to Build with Confidence?
        </h2>
        <p className="max-w-2xl mx-auto mb-10 text-gray-300">
          Let’s turn your vision into a structure that stands the test of time.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="bg-[#C75B39] px-8 py-3 rounded-lg font-bold hover:bg-[#b04b2c]"
          >
            Get a Free Quote
          </Link>
          <Link
            href="/projects"
            className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#06392F]"
          >
            View Our Portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}

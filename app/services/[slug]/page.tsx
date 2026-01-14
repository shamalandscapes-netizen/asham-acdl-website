'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';

/* -------------------- SERVICE CONTENT -------------------- */
const SERVICES: Record<string, any> = {
  'general-construction': {
    title: 'General Construction',
    subtitle: 'Building Strong Foundations for Generations',
    icon: Hammer,
    hero:
      'From concept to completion, we construct durable residential and commercial structures with precision and accountability.',
    description:
      'Our general construction services cover residential homes, apartments, commercial buildings, and mixed-use developments. We manage every phase with a commitment to safety, quality workmanship, and timely delivery.',
    highlights: [
      'Residential & commercial construction',
      'Strict quality and safety compliance',
      'Experienced site engineers & foremen',
      'On-time and on-budget delivery',
    ],
    deliverables: [
      'Site preparation & foundation works',
      'Structural construction',
      'Roofing, masonry & finishes',
      'Final inspection & handover',
    ],
  },

  'architectural-design': {
    title: 'Architectural Design',
    subtitle: 'Designs That Balance Beauty & Function',
    icon: PencilRuler,
    hero:
      'We translate your ideas into functional, aesthetic architectural solutions tailored to your land, budget, and lifestyle.',
    description:
      'Our architectural team develops detailed drawings, layouts, and 3D visualizations that comply with local regulations while maximizing space, light, and usability.',
    highlights: [
      'Custom building designs',
      '3D renders & walkthroughs',
      'County & authority approvals',
      'Sustainable design principles',
    ],
    deliverables: [
      'Concept & schematic designs',
      'Construction drawings',
      '3D visualizations',
      'Approval documentation',
    ],
  },

  'project-management': {
    title: 'Project Management',
    subtitle: 'Control, Coordination & Confidence',
    icon: ClipboardList,
    hero:
      'We take control of timelines, budgets, and teams so your project runs smoothly from start to finish.',
    description:
      'Our project management service ensures efficient coordination between consultants, contractors, and suppliers while maintaining cost control and transparency.',
    highlights: [
      'Budget planning & tracking',
      'Contractor coordination',
      'Risk & quality management',
      'Regular progress reporting',
    ],
    deliverables: [
      'Project schedules',
      'Cost & budget reports',
      'Site supervision',
      'Completion documentation',
    ],
  },

  'interior-design': {
    title: 'Interior Design & Fit-outs',
    subtitle: 'Spaces That Feel As Good As They Look',
    icon: LayoutTemplate,
    hero:
      'We create refined interior spaces that reflect your taste while enhancing comfort, usability, and value.',
    description:
      'From residential interiors to commercial fit-outs, we deliver cohesive interior solutions using quality materials and modern finishing techniques.',
    highlights: [
      'Residential & commercial interiors',
      'Custom cabinetry & finishes',
      'Lighting & space optimization',
      'Modern material selection',
    ],
    deliverables: [
      'Interior layouts',
      'Material & color schemes',
      'Installation & finishing',
      'Final styling',
    ],
  },

  'material-supply': {
    title: 'Material Supply',
    subtitle: 'Reliable Materials, Delivered On Time',
    icon: Truck,
    hero:
      'We supply certified, high-quality construction materials directly to your site at competitive prices.',
    description:
      'Our material supply service ensures uninterrupted construction by providing reliable sourcing and timely delivery of essential building materials.',
    highlights: [
      'Cement, steel & aggregates',
      'Roofing & finishing materials',
      'Bulk & retail supply',
      'Reliable logistics',
    ],
    deliverables: [
      'Material sourcing',
      'Quality verification',
      'On-site delivery',
      'Supply documentation',
    ],
  },

  'civil-engineering': {
    title: 'Civil Engineering',
    subtitle: 'Engineering Infrastructure That Lasts',
    icon: HardHat,
    hero:
      'We design and construct civil works that support durable, functional developments.',
    description:
      'Our civil engineering services cover infrastructure works such as drainage, driveways, retaining walls, and structural reinforcements.',
    highlights: [
      'Drainage & sewer systems',
      'Roads & pavements',
      'Structural reinforcement',
      'Site infrastructure',
    ],
    deliverables: [
      'Engineering designs',
      'Earthworks & excavation',
      'Infrastructure installation',
      'Compliance approvals',
    ],
  },

  /* 🌿 NEW LANDSCAPING SERVICE */
  'landscaping-design-installation': {
    title: 'Landscaping Design & Installation',
    subtitle: 'Nature, Design & Function in Perfect Balance',
    icon: Leaf,
    hero:
      'We design and install elegant, sustainable outdoor spaces that enhance property value, usability, and natural beauty.',
    description:
      'Inspired by the quality and professionalism showcased at shamalandscapes.co.ke, our landscaping services combine creative design with expert installation. We transform residential, commercial, and institutional spaces into functional green environments that are visually striking and easy to maintain.',
    highlights: [
      'Landscape design & master planning',
      'Soft landscaping (lawns, plants & trees)',
      'Hard landscaping (walkways, paving & walls)',
      'Irrigation systems & drainage',
      'Outdoor lighting & water features',
    ],
    deliverables: [
      'Landscape concept & layouts',
      'Plant selection & sourcing',
      'Installation & finishing',
      'Maintenance guidance',
    ],
  },
};

/* -------------------- PAGE -------------------- */
export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES[params.slug];
  if (!service) return notFound();

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-[#06392F] text-white py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Icon size={48} className="text-[#C75B39] mb-6" />
          <h1 className="mb-4 text-4xl font-black md:text-5xl">
            {service.title}
          </h1>
          <p className="max-w-2xl mb-6 text-xl text-gray-200">
            {service.subtitle}
          </p>
          <p className="max-w-3xl leading-relaxed text-gray-300">
            {service.hero}
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="grid max-w-6xl gap-16 px-4 py-20 mx-auto md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-3xl font-black text-gray-800">
            Service Overview
          </h2>
          <p className="leading-relaxed text-gray-600">
            {service.description}
          </p>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-bold text-gray-800">
            Why Clients Choose This Service
          </h3>
          <ul className="space-y-4">
            {service.highlights.map((item: string) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="text-[#C75B39]" size={20} />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-black text-center text-gray-800">
            What We Deliver
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {service.deliverables.map((item: string) => (
              <div
                key={item}
                className="p-6 font-bold text-center text-gray-700 bg-gray-50 rounded-xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A4D40] py-20 text-white text-center px-4">
        <h2 className="mb-4 text-3xl font-black">
          Let’s Design & Build Your Project
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-300">
          From construction to landscaping, our team delivers complete solutions
          with quality you can trust.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#C75B39] px-8 py-4 rounded-lg font-bold hover:bg-[#b04b2c]"
        >
          Request a Consultation <ArrowRight />
        </Link>
      </section>
    </div>
  );
}

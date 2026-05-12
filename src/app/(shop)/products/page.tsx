// app/products/page.tsx
import Link from 'next/link';
import {
  FileText,
  LayoutTemplate,
  TreePine,
  Layers,
  Hammer,
  Truck,
} from 'lucide-react';

const DIGITAL_PRODUCTS = [
  {
    icon: LayoutTemplate,
    title: 'Architectural Drawings',
    description:
      'Professionally designed house plans, floor layouts, elevations, and 3D visualizations — ready for approval and construction.',
    formats: ['PDF', 'AutoCAD (DWG)', '3D Renders'],
    href: '/contact',
  },
  {
    icon: FileText,
    title: 'Bills of Quantities (BOQs)',
    description:
      'Accurate cost breakdowns prepared by experienced quantity surveyors to help you budget, plan, and control project costs.',
    formats: ['Excel', 'PDF'],
    href: '/contact',
  },
  {
    icon: TreePine,
    title: 'Landscape Designs',
    description:
      'Complete landscape drawings and planting plans for residential and commercial properties, including irrigation layouts.',
    formats: ['PDF', 'CAD', 'Plant Schedules'],
    href: '/contact',
  },
];

const FUTURE_PRODUCTS = [
  {
    icon: Layers,
    title: 'Finishing Materials',
    items: ['Tiles', 'Paints', 'Ceilings', 'Flooring'],
  },
  {
    icon: Hammer,
    title: 'Building Materials',
    items: ['Cement', 'Steel', 'Blocks', 'Aggregates'],
  },
  {
    icon: Truck,
    title: 'Equipment & Tools',
    items: ['Mixers', 'Scaffolding', 'Power Tools'],
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-[#06392F] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="mb-6 text-4xl font-black md:text-5xl">
            Digital Construction Products
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-200">
            Instantly accessible professional documents — architectural drawings,
            BOQs, and landscape designs — prepared by industry experts.
          </p>
        </div>
      </section>

      {/* DIGITAL PRODUCTS */}
      <section className="max-w-6xl px-4 py-20 mx-auto">
        <h2 className="mb-12 text-3xl font-black text-center text-gray-800">
          Our Core Digital Products
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {DIGITAL_PRODUCTS.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.title}
                className="p-8 transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-xl group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl mb-6 group-hover:bg-[#06392F] transition">
                  <Icon className="text-[#06392F] group-hover:text-white" size={28} />
                </div>

                <h3 className="mb-4 text-xl font-bold text-gray-800">
                  {product.title}
                </h3>

                <p className="mb-6 leading-relaxed text-gray-600">
                  {product.description}
                </p>

                <div className="mb-6 text-sm text-gray-500">
                  <strong>Formats:</strong> {product.formats.join(', ')}
                </div>

                <Link
                  href={product.href}
                  className="inline-block text-sm font-bold uppercase tracking-widest text-[#C75B39] hover:underline"
                >
                  Request This Product
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMING SOON PHYSICAL PRODUCTS */}
      <section className="px-4 py-20 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <h3 className="mb-10 text-2xl font-black text-center text-gray-800">
            Marketplace Expansion (Coming Soon)
          </h3>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FUTURE_PRODUCTS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 border border-dashed rounded-2xl bg-gray-50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="text-[#06392F]" />
                    <h4 className="font-bold text-gray-700">{item.title}</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-500">
                    {item.items.map((i) => (
                      <li key={i}>• {i}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A4D40] py-20 px-4 text-center text-white">
        <h3 className="mb-4 text-3xl font-black">
          Need a Custom Design or BOQ?
        </h3>
        <p className="max-w-2xl mx-auto mb-8 text-gray-300">
          Our team can prepare tailored architectural drawings, BOQs, and
          landscape designs specific to your plot, budget, and approvals.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[#C75B39] px-8 py-4 rounded-lg font-bold hover:bg-[#b04b2c] transition shadow-lg"
        >
          Talk to Our Experts
        </Link>
      </section>
    </div>
  );
}

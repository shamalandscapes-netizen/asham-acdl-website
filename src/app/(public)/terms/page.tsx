// app/terms/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Gavel,
  Handshake,
  CreditCard,
  Clock,
  Users,
  Home
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Asham Design & Construction Ltd',
  description: 'Review the terms and conditions governing the use of Asham Design & Construction Ltd\'s services, website, and construction projects.',
  keywords: ['terms of service', 'terms and conditions', 'construction contract', 'NCA terms', 'Asham legal'],
  openGraph: {
    title: 'Terms of Service | Asham Design & Construction Ltd',
    description: 'Legal terms governing our architectural and construction services.',
    images: ['/og-terms.jpg'],
  },
};

export default function TermsPage() {
  const lastUpdated = 'February 18, 2026';
  const effectiveDate = 'March 1, 2026';

  return (
    <main className="min-h-screen bg-[#FDF8F5]">
      
      {/* Hero Section */}
      <section className="relative bg-[#06392F] text-white pt-32 pb-24 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute w-64 h-64 border rounded-full top-20 right-20 border-white/10" />
        <div className="absolute border rounded-full bottom-20 left-20 w-96 h-96 border-white/5" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-[#C75B39]/20 rounded-2xl">
              <Scale size={32} className="text-[#C75B39]" />
            </div>
            <div className="p-3 bg-[#C75B39]/20 rounded-2xl">
              <Gavel size={32} className="text-[#C75B39]" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
            Terms of <span className="text-[#C75B39]">Service</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl font-medium text-white/70">
            Legal terms governing our architectural and construction services, website usage, and client relationships.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <FileText size={14} />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Effective: {effectiveDate}</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2">
          <nav className="flex items-center gap-2 text-xs text-white/40">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white">Terms of Service</span>
          </nav>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl px-4 py-20 mx-auto">
        <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl md:p-12">
          
          {/* Introduction */}
          <div className="pb-12 mb-12 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <Handshake size={28} className="text-[#C75B39]" />
              Agreement to Terms
            </h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Welcome to <strong>Asham Design & Construction Ltd</strong> ("Company," "we," "our," "us"). These Terms of Service ("Terms") govern your access to and use of our website, services, and construction projects, including all architectural design, construction management, and material supply services (collectively, the "Services").
            </p>
            <p className="leading-relaxed text-gray-600">
              By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access our Services. These Terms constitute a legally binding agreement between you and Asham Design & Construction Ltd, in compliance with the laws of the Republic of Kenya.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 gap-3 mb-12 md:grid-cols-4">
            {[
              { href: '#services', label: 'Services', icon: Home },
              { href: '#contracts', label: 'Contracts', icon: FileText },
              { href: '#payments', label: 'Payments', icon: CreditCard },
              { href: '#liability', label: 'Liability', icon: Shield }
            ].map((link) => {
              const Icon = link.icon;
              return (
                <a 
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-[#C75B39]/10 transition-colors group"
                >
                  <Icon size={18} className="text-[#C75B39] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#06392F]">
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* 1. Services Definition */}
          <div id="services" className="mb-12 scroll-mt-24">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              1. Description of Services
            </h3>
            
            <div className="space-y-4 text-gray-600">
              <p>Asham Design & Construction Ltd provides the following services:</p>
              
              <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                {[
                  {
                    title: 'Architectural Design',
                    items: [
                      'Residential and commercial building design',
                      '3D visualization and rendering',
                      'Planning permission assistance',
                      'Interior design services',
                      'Landscape architecture'
                    ]
                  },
                  {
                    title: 'Construction Services',
                    items: [
                      'Project management',
                      'Site supervision',
                      'Structural engineering',
                      'Quality control',
                      'Health and safety compliance'
                    ]
                  },
                  {
                    title: 'Material Supply',
                    items: [
                      'Building materials procurement',
                      'Quality-assured products',
                      'Nationwide delivery',
                      'Trade pricing',
                      'Stock management'
                    ]
                  },
                  {
                    title: 'Consultancy',
                    items: [
                      'Feasibility studies',
                      'Environmental impact assessment',
                      'NEMA compliance',
                      'Cost estimation',
                      'Project documentation'
                    ]
                  }
                ].map((section, idx) => (
                  <div key={idx} className="p-5 bg-gray-50 rounded-xl">
                    <h4 className="font-black text-[#06392F] mb-3 text-sm">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={14} className="text-[#C75B39] shrink-0 mt-0.5" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Client Responsibilities */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              2. Client Responsibilities
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: 'Site Access',
                  desc: 'Clients must provide reasonable access to the construction site for surveys, inspections, and construction work during normal working hours.'
                },
                {
                  title: 'Information Accuracy',
                  desc: 'Clients are responsible for providing accurate site information, property documents, and project requirements.'
                },
                {
                  title: 'Permits and Approvals',
                  desc: 'While we assist with applications, clients are responsible for obtaining necessary permits from local authorities (NCA, county governments).'
                },
                {
                  title: 'Payment Obligations',
                  desc: 'Clients must make timely payments as specified in project contracts and invoices.'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-[#C75B39]/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-[#C75B39]">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-[#06392F] text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Project Contracts */}
          <div id="contracts" className="mb-12 scroll-mt-24">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              3. Project Contracts and Engagements
            </h3>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-black text-[#06392F] mb-4">Contract Formation</h4>
                <p className="mb-4 text-sm text-gray-600">
                  All construction projects require a separate written contract that will:
                </p>
                <ul className="space-y-2">
                  {[
                    'Define scope of work and specifications',
                    'Establish project timeline and milestones',
                    'Specify payment terms and schedule',
                    'Detail warranty provisions',
                    'Include NCA-required clauses',
                    'Address dispute resolution mechanisms'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-[#C75B39] rounded-full mt-1.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-[#06392F]/5 rounded-xl">
                <h4 className="font-black text-[#06392F] mb-4">NCA Compliance</h4>
                <p className="text-sm text-gray-600">
                  All contracts comply with the National Construction Authority (NCA) regulations and include mandatory provisions regarding:
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    'Contractor registration',
                    'Project registration',
                    'Safety requirements',
                    'Quality standards',
                    'Dispute resolution',
                    'Statutory obligations'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Shield size={12} className="text-[#C75B39]" />
                      <span className="text-xs text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Payment Terms */}
          <div id="payments" className="mb-12 scroll-mt-24">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              4. Payment Terms
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  icon: CreditCard,
                  title: 'Deposit',
                  desc: '30-50% deposit required for material procurement and project mobilization'
                },
                {
                  icon: Clock,
                  title: 'Milestone Payments',
                  desc: 'Progress-based payments tied to completed construction phases'
                },
                {
                  icon: Shield,
                  title: 'Retention',
                  desc: '5-10% retention held until project completion and defects liability period'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="p-5 text-center bg-gray-50 rounded-xl">
                    <Icon size={32} className="mx-auto text-[#C75B39] mb-3" />
                    <h4 className="font-black text-[#06392F] text-sm mb-2">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-[#C75B39]/10 rounded-xl">
              <p className="text-sm text-[#06392F] flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                Late payments may incur interest at 1.5% per month and may result in work suspension until payments are current.
              </p>
            </div>
          </div>

          {/* 5. Intellectual Property */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              5. Intellectual Property Rights
            </h3>

            <div className="space-y-4">
              <p className="text-gray-600">
                All architectural drawings, designs, plans, specifications, and related materials created by Asham Design & Construction Ltd remain our intellectual property.
              </p>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-5 border border-gray-100 rounded-xl">
                  <h4 className="font-black text-[#06392F] mb-3 text-sm">What You Own</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• Physical structures built</li>
                    <li>• Final constructed project</li>
                    <li>• Personal project data</li>
                  </ul>
                </div>
                <div className="p-5 border border-gray-100 rounded-xl">
                  <h4 className="font-black text-[#06392F] mb-3 text-sm">What We Retain</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• Copyright in drawings and designs</li>
                    <li>• Construction methodologies</li>
                    <li>• Technical specifications</li>
                  </ul>
                </div>
              </div>

              <p className="mt-2 text-xs italic text-gray-400">
                Drawings and designs may not be reproduced or used for other projects without our written consent, as protected under the Copyright Act of Kenya.
              </p>
            </div>
          </div>

          {/* 6. Limitation of Liability */}
          <div id="liability" className="mb-12 scroll-mt-24">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              6. Limitation of Liability
            </h3>

            <div className="space-y-4">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-black text-[#06392F] mb-3">To the maximum extent permitted by Kenyan law:</h4>
                <ul className="space-y-3">
                  {[
                    'We shall not be liable for any indirect, incidental, special, consequential, or punitive damages',
                    'Our total liability shall not exceed the amount paid for the specific service giving rise to the claim',
                    'We are not responsible for delays caused by circumstances beyond our reasonable control',
                    'Site conditions discovered during construction may require contract adjustments'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[#C75B39] rounded-full mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#06392F]/5 rounded-xl">
                <p className="text-sm text-[#06392F] flex items-start gap-2">
                  <Shield size={18} className="shrink-0 mt-0.5" />
                  We maintain professional indemnity insurance and public liability insurance as required by NCA regulations.
                </p>
              </div>
            </div>
          </div>

          {/* 7. Warranties */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">7. Warranties</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-black text-[#C75B39] mb-3 text-sm">Our Warranties</h4>
                <ul className="space-y-2">
                  {[
                    'Workmanship will meet industry standards',
                    'Materials will be of good quality',
                    'Construction will comply with approved plans',
                    'We hold valid NCA licenses and permits'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-[#C75B39] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-black text-[#C75B39] mb-3 text-sm">Warranty Exclusions</h4>
                <ul className="space-y-2">
                  {[
                    'Normal wear and tear',
                    'Damage from misuse or neglect',
                    'Unauthorized modifications',
                    'Force majeure events'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <AlertCircle size={14} className="text-[#C75B39] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 8. Termination */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">8. Termination</h3>

            <div className="space-y-4">
              <p className="text-gray-600">Either party may terminate a project contract:</p>
              <ul className="ml-6 space-y-2">
                <li className="text-gray-600 list-disc">For cause, with 14 days written notice to cure breach</li>
                <li className="text-gray-600 list-disc">Immediately for safety violations or illegal activities</li>
                <li className="text-gray-600 list-disc">By mutual written agreement</li>
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                Upon termination, client shall pay for all work completed and materials procured up to the termination date.
              </p>
            </div>
          </div>

          {/* 9. Governing Law */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">9. Governing Law</h3>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Kenya, specifically the courts in Kakamega or Nairobi.
            </p>
          </div>

          {/* 10. Dispute Resolution */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">10. Dispute Resolution</h3>

            <div className="space-y-4">
              <p className="text-gray-600">Any dispute arising from these Terms or our Services shall be resolved through:</p>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#C75B39] flex items-center justify-center text-white font-black">1</div>
                <span className="text-sm text-gray-600">Negotiation between parties</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#C75B39] flex items-center justify-center text-white font-black">2</div>
                <span className="text-sm text-gray-600">Mediation through a mutually agreed mediator</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#C75B39] flex items-center justify-center text-white font-black">3</div>
                <span className="text-sm text-gray-600">Arbitration in accordance with the Arbitration Act of Kenya</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#C75B39] flex items-center justify-center text-white font-black">4</div>
                <span className="text-sm text-gray-600">Litigation in Kenyan courts as a last resort</span>
              </div>
            </div>
          </div>

          {/* 11. Contact Information */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">11. Contact Us</h3>

            <div className="bg-[#06392F] text-white rounded-2xl p-8">
              <p className="mb-6 text-white/80">For questions about these Terms, please contact us:</p>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Mail size={18} className="text-[#C75B39]" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black tracking-widest uppercase text-white/60">Email</p>
                    <a href="mailto:legal@ashamconstruction.co.ke" className="text-sm hover:text-[#C75B39] transition-colors">
                      legal@ashamconstruction.co.ke
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Phone size={18} className="text-[#C75B39]" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black tracking-widest uppercase text-white/60">Phone</p>
                    <a href="tel:+254712575077" className="text-sm hover:text-[#C75B39] transition-colors">
                      +254 712 575 077
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <MapPin size={18} className="text-[#C75B39]" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black tracking-widest uppercase text-white/60">Address</p>
                    <p className="text-sm">
                      1st Floor Ambwere Plaza<br />
                      Room 101, Kakamega
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-xs text-center text-gray-400">
            <p>By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link href="/privacy" className="hover:text-[#C75B39] transition-colors">
                Privacy Policy
              </Link>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <Link href="/cookies" className="hover:text-[#C75B39] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Back to top */}
          <div className="mt-12 text-center">
            <a 
              href="#top"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#06392F] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to top
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
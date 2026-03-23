// app/privacy/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Asham Design & Construction Ltd',
  description: 'Learn how Asham Design & Construction Ltd collects, uses, and protects your personal information. Our commitment to your privacy and data security.',
  keywords: ['privacy policy', 'data protection', 'Kenya Data Protection Act', 'NCA compliance', 'Asham privacy'],
  openGraph: {
    title: 'Privacy Policy | Asham Design & Construction Ltd',
    description: 'Our commitment to protecting your personal information and ensuring data privacy.',
    images: ['/og-privacy.jpg'],
  },
};

export default function PrivacyPage() {
  const lastUpdated = 'February 18, 2026';

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

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-[#C75B39]/20 rounded-2xl">
              <Shield size={32} className="text-[#C75B39]" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
            Privacy <span className="text-[#C75B39]">Policy</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl font-medium text-white/70">
            Our commitment to protecting your personal information and ensuring data privacy.
          </p>
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-white/50">
            <FileText size={14} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2">
          <nav className="flex items-center gap-2 text-xs text-white/40">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white">Privacy Policy</span>
          </nav>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl px-4 py-20 mx-auto">
        <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl md:p-12">
          
          {/* Introduction */}
          <div className="pb-12 mb-12 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-black text-[#06392F] mb-6">
              Our Commitment to Your Privacy
            </h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              At <strong>Asham Design & Construction Ltd</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
            </p>
            <p className="leading-relaxed text-gray-600">
              We comply with the <strong>Kenya Data Protection Act, 2019</strong> and other applicable data protection laws. By using our services, you consent to the practices described in this policy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-12 p-6 bg-[#06392F]/5 rounded-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#C75B39] mb-4 flex items-center gap-2">
              <Eye size={16} />
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { href: '#information', label: 'Information We Collect' },
                { href: '#use', label: 'How We Use Data' },
                { href: '#sharing', label: 'Information Sharing' },
                { href: '#rights', label: 'Your Rights' }
              ].map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-[#C75B39] transition-colors flex items-center gap-1"
                >
                  <ChevronRight size={12} className="text-[#C75B39]" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Information We Collect */}
          <div id="information" className="mb-12 scroll-mt-24">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              Information We Collect
            </h3>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-black text-[#06392F] mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#C75B39] rounded-full" />
                  Personal Information You Provide
                </h4>
                <ul className="ml-6 space-y-2 text-gray-600">
                  <li className="list-disc">Name and contact details (email, phone number, address)</li>
                  <li className="list-disc">Project information and construction requirements</li>
                  <li className="list-disc">Payment and billing information</li>
                  <li className="list-disc">Identification documents (for NCA compliance)</li>
                  <li className="list-disc">Property details and site information</li>
                  <li className="list-disc">Communication preferences and history</li>
                </ul>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-black text-[#06392F] mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#C75B39] rounded-full" />
                  Information Automatically Collected
                </h4>
                <ul className="ml-6 space-y-2 text-gray-600">
                  <li className="list-disc">Device information (IP address, browser type, operating system)</li>
                  <li className="list-disc">Usage data (pages visited, time spent, navigation patterns)</li>
                  <li className="list-disc">Cookies and similar tracking technologies</li>
                  <li className="list-disc">Referral sources and search queries</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div id="use" className="mb-12 scroll-mt-24">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              How We Use Your Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  icon: CheckCircle,
                  title: 'Service Delivery',
                  desc: 'To provide architectural and construction services, process payments, and manage projects.'
                },
                {
                  icon: CheckCircle,
                  title: 'Communication',
                  desc: 'To respond to inquiries, send updates about your projects, and share important notices.'
                },
                {
                  icon: CheckCircle,
                  title: 'Improvement',
                  desc: 'To analyze website usage, improve our services, and develop new offerings.'
                },
                {
                  icon: CheckCircle,
                  title: 'Compliance',
                  desc: 'To comply with NCA regulations, legal obligations, and industry standards.'
                },
                {
                  icon: CheckCircle,
                  title: 'Marketing',
                  desc: 'To send newsletters, project updates, and promotional materials (with your consent).'
                },
                {
                  icon: CheckCircle,
                  title: 'Security',
                  desc: 'To protect against fraud, unauthorized access, and ensure system security.'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex gap-4 p-4 transition-colors rounded-xl hover:bg-gray-50">
                    <div className="shrink-0">
                      <Icon size={20} className="text-[#C75B39]" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#06392F] text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal Basis for Processing */}
          <div className="mb-12 p-6 bg-[#06392F]/5 rounded-xl">
            <h4 className="font-black text-[#06392F] mb-4 flex items-center gap-2">
              <Lock size={18} className="text-[#C75B39]" />
              Legal Basis for Processing (Kenya Data Protection Act)
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#C75B39] rounded-full mt-1.5" />
                <span className="text-gray-600">Contract performance (providing construction services)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#C75B39] rounded-full mt-1.5" />
                <span className="text-gray-600">Legal obligations (NCA, tax, regulatory requirements)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#C75B39] rounded-full mt-1.5" />
                <span className="text-gray-600">Legitimate interests (improving services, security)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#C75B39] rounded-full mt-1.5" />
                <span className="text-gray-600">Consent (marketing communications)</span>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div id="sharing" className="mb-12 scroll-mt-24">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              Information Sharing and Disclosure
            </h3>

            <p className="mb-6 text-gray-600">
              We do not sell your personal information. We may share your information with:
            </p>

            <div className="space-y-4">
              {[
                {
                  title: 'Service Providers',
                  desc: 'Engineers, quantity surveyors, subcontractors, and material suppliers necessary for project execution.'
                },
                {
                  title: 'Regulatory Authorities',
                  desc: 'NCA, NEMA, local county governments, and other regulatory bodies as required by law.'
                },
                {
                  title: 'Professional Advisors',
                  desc: 'Legal counsel, accountants, and insurance providers.'
                },
                {
                  title: 'Business Transfers',
                  desc: 'In connection with any merger, sale of assets, or business reorganization.'
                }
              ].map((item, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-xl">
                  <h4 className="font-black text-[#06392F] text-sm mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Security */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              Data Security Measures
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { icon: Lock, text: '256-bit SSL encryption for all data transmission' },
                { icon: Shield, text: 'Secure servers with access controls and monitoring' },
                { icon: Eye, text: 'Regular security audits and vulnerability assessments' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="p-6 text-center bg-gray-50 rounded-xl">
                    <Icon size={32} className="mx-auto text-[#C75B39] mb-3" />
                    <p className="text-xs font-medium text-gray-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Your Rights */}
          <div id="rights" className="mb-12 scroll-mt-24">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#C75B39]" />
              Your Data Protection Rights (Under Kenya Data Protection Act)
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                'Right to be informed about data collection',
                'Right to access your personal data',
                'Right to rectification of inaccurate data',
                'Right to erasure (right to be forgotten)',
                'Right to restrict processing',
                'Right to data portability',
                'Right to object to processing',
                'Right to withdraw consent at any time'
              ].map((right, index) => (
                <div key={index} className="flex items-start gap-3 p-3">
                  <CheckCircle size={16} className="text-[#C75B39] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{right}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#C75B39]/10 rounded-xl">
              <p className="text-sm text-[#06392F] flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                To exercise your rights, contact our Data Protection Officer at dpo@ashamconstruction.co.ke or +254 712 575 077.
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">Cookie Policy</h3>
            <p className="mb-4 text-gray-600">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.
            </p>
            <Link 
              href="/cookies"
              className="text-[#C75B39] hover:text-[#06392F] transition-colors text-sm font-black uppercase tracking-widest inline-flex items-center gap-2"
            >
              Learn more about our Cookie Policy
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Changes to Policy */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">Changes to This Policy</h3>
            <p className="text-gray-600">
              We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page with an updated effective date. We encourage you to review this policy regularly.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-[#06392F] text-white rounded-2xl p-8">
            <h3 className="mb-6 text-xl font-black">Contact Our Data Protection Officer</h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Mail size={18} className="text-[#C75B39]" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-black tracking-widest uppercase text-white/60">Email</p>
                  <a href="mailto:dpo@ashamconstruction.co.ke" className="text-sm hover:text-[#C75B39] transition-colors">
                    dpo@ashamconstruction.co.ke
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
// app/cookies/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Cookie, 
  Settings, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Globe,
  Lock,
  Eye,
  Sliders,
  Info
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | Asham Design & Construction Ltd',
  description: 'Learn how Asham Design & Construction Ltd uses cookies to enhance your browsing experience, analyze site traffic, and personalize content.',
  keywords: ['cookie policy', 'cookies', 'data privacy', 'browser cookies', 'Asham cookies'],
  openGraph: {
    title: 'Cookie Policy | Asham Design & Construction Ltd',
    description: 'Information about how we use cookies on our website.',
    images: ['/og-cookies.jpg'],
  },
};

export default function CookiesPage() {
  const lastUpdated = 'February 18, 2026';

  // Cookie categories
  const cookieCategories = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      icon: Lock,
      description: 'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      examples: ['Session cookies', 'Security cookies', 'Load balancing cookies'],
      required: true,
      duration: 'Session'
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      icon: Settings,
      description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and language settings.',
      examples: ['Language preferences', 'Region selection', 'Saved searches'],
      required: false,
      duration: '1 year'
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      icon: Eye,
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: ['Page visits', 'Time on site', 'Click tracking', 'Traffic sources'],
      required: false,
      duration: '2 years'
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      icon: Globe,
      description: 'These cookies track your browsing habits to deliver targeted advertisements relevant to your interests.',
      examples: ['Ad impressions', 'Campaign tracking', 'Social media sharing'],
      required: false,
      duration: '90 days'
    }
  ];

  // Third-party cookies
  const thirdPartyCookies = [
    {
      name: 'Google Analytics',
      purpose: 'Website traffic analysis and user behavior tracking',
      privacyUrl: 'https://policies.google.com/privacy',
      category: 'Analytics'
    },
    {
      name: 'Facebook Pixel',
      purpose: 'Ad targeting and campaign measurement',
      privacyUrl: 'https://www.facebook.com/policy.php',
      category: 'Marketing'
    },
    {
      name: 'Cloudflare',
      purpose: 'Security and performance optimization',
      privacyUrl: 'https://www.cloudflare.com/privacypolicy/',
      category: 'Essential'
    },
    {
      name: 'Supabase',
      purpose: 'Authentication and database functionality',
      privacyUrl: 'https://supabase.com/privacy',
      category: 'Essential'
    }
  ];

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

        {/* Floating Cookies Animation */}
        <div className="absolute top-20 right-20 opacity-10">
          <Cookie size={120} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10 rotate-12">
          <Cookie size={80} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-[#C75B39]/20 rounded-2xl">
              <Cookie size={32} className="text-[#C75B39]" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
            Cookie <span className="text-[#C75B39]">Policy</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl font-medium text-white/70">
            How we use cookies to enhance your browsing experience and improve our services.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-white/50">
            <Info size={14} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2">
          <nav className="flex items-center gap-2 text-xs text-white/40">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <ChevronRight size={12} />
            <span className="text-white">Cookie Policy</span>
          </nav>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl px-4 py-20 mx-auto">
        <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl md:p-12">
          
          {/* Introduction */}
          <div className="pb-12 mb-12 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-black text-[#06392F] mb-6">
              What Are Cookies?
            </h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide valuable information to website owners.
            </p>
            <p className="leading-relaxed text-gray-600">
              At <strong>Asham Design & Construction Ltd</strong>, we use cookies to enhance your browsing experience, analyze site traffic, and personalize content. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.
            </p>
          </div>

          {/* Cookie Consent Notice */}
          <div className="mb-12 p-6 bg-[#C75B39]/10 rounded-2xl border border-[#C75B39]/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#C75B39] rounded-xl shrink-0">
                <AlertCircle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-[#06392F] mb-2">Your Consent</h3>
                <p className="mb-3 text-sm text-gray-600">
                  By continuing to use our website, you consent to our use of cookies as described in this policy. When you first visit our site, you will see a cookie banner where you can manage your preferences.
                </p>
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-[#06392F] text-white text-[10px] font-black rounded-full">
                    Essential Only
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 text-[10px] font-black rounded-full">
                    Accept All
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 text-[10px] font-black rounded-full">
                    Preferences
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cookie Categories */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6 flex items-center gap-3">
              <Sliders size={24} className="text-[#C75B39]" />
              Types of Cookies We Use
            </h3>

            <div className="space-y-6">
              {cookieCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="overflow-hidden border border-gray-100 rounded-2xl">
                    <div className="p-6 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-white shadow-sm rounded-xl">
                            <Icon size={24} className="text-[#C75B39]" />
                          </div>
                          <div>
                            <h4 className="font-black text-[#06392F] mb-1">{category.name}</h4>
                            <p className="max-w-2xl text-sm text-gray-500">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {category.required ? (
                            <span className="px-3 py-1 bg-[#06392F] text-white text-[10px] font-black rounded-full">
                              Required
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full">
                              Optional
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                        <div>
                          <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">Examples</p>
                          <ul className="space-y-1">
                            {category.examples.map((example, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-1 h-1 bg-[#C75B39] rounded-full" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">Duration</p>
                          <p className="text-sm text-gray-600">{category.duration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">Third-Party Cookies</h3>
            <p className="mb-6 text-gray-600">
              Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. You should check the respective privacy policies of these third parties for information about their cookie usage.
            </p>

            <div className="overflow-hidden bg-gray-50 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-[#06392F] text-white">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Service</th>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Purpose</th>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Category</th>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {thirdPartyCookies.map((cookie, index) => (
                    <tr key={index} className="transition-colors hover:bg-white">
                      <td className="px-6 py-4 font-medium text-[#06392F]">{cookie.name}</td>
                      <td className="px-6 py-4 text-gray-600">{cookie.purpose}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${
                          cookie.category === 'Essential' ? 'bg-[#06392F] text-white' :
                          cookie.category === 'Analytics' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {cookie.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={cookie.privacyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C75B39] hover:text-[#06392F] transition-colors text-xs font-medium"
                        >
                          View Policy →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Control Cookies */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">How to Control Cookies</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-black text-[#06392F] mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-[#C75B39]" />
                  Browser Settings
                </h4>
                <p className="mb-4 text-sm text-gray-600">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="space-y-2">
                  {[
                    'View and delete cookies',
                    'Block third-party cookies',
                    'Block all cookies',
                    'Clear cookies when closing browser'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-[#C75B39]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-black text-[#06392F] mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-[#C75B39]" />
                  Browser Guides
                </h4>
                <ul className="space-y-3">
                  {[
                    { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                    { name: 'Firefox', url: 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer' },
                    { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac' },
                    { name: 'Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' }
                  ].map((browser, i) => (
                    <li key={i}>
                      <a 
                        href={browser.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#C75B39] hover:text-[#06392F] transition-colors flex items-center gap-2"
                      >
                        {browser.name} Guide
                        <ChevronRight size={12} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#C75B39]/10 rounded-xl">
              <p className="text-sm text-[#06392F] flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                Please note that blocking all cookies may affect your experience on our website, preventing certain features from working properly.
              </p>
            </div>
          </div>

          {/* Cookie List Table */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">Detailed Cookie List</h3>

            <div className="overflow-hidden bg-gray-50 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-[#06392F] text-white">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Cookie Name</th>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Provider</th>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Purpose</th>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Duration</th>
                    <th className="px-6 py-4 text-xs font-black tracking-widest text-left uppercase">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    {
                      name: 'sb-access-token',
                      provider: 'Supabase',
                      purpose: 'Authentication and session management',
                      duration: 'Session',
                      type: 'Essential'
                    },
                    {
                      name: 'sb-refresh-token',
                      provider: 'Supabase',
                      purpose: 'Maintain user login session',
                      duration: '7 days',
                      type: 'Essential'
                    },
                    {
                      name: '_ga',
                      provider: 'Google Analytics',
                      purpose: 'Distinguish unique users',
                      duration: '2 years',
                      type: 'Analytics'
                    },
                    {
                      name: '_gid',
                      provider: 'Google Analytics',
                      purpose: 'Store and count pageviews',
                      duration: '24 hours',
                      type: 'Analytics'
                    },
                    {
                      name: '_fbp',
                      provider: 'Facebook',
                      purpose: 'Ad delivery and tracking',
                      duration: '90 days',
                      type: 'Marketing'
                    },
                    {
                      name: 'cookie_consent',
                      provider: 'ashamconstruction.co.ke',
                      purpose: 'Store cookie consent preferences',
                      duration: '1 year',
                      type: 'Functional'
                    },
                    {
                      name: 'cf_clearance',
                      provider: 'Cloudflare',
                      purpose: 'Security and bot protection',
                      duration: '1 year',
                      type: 'Essential'
                    }
                  ].map((cookie, index) => (
                    <tr key={index} className="transition-colors hover:bg-white">
                      <td className="px-6 py-4 font-mono text-xs text-[#06392F]">{cookie.name}</td>
                      <td className="px-6 py-4 text-gray-600">{cookie.provider}</td>
                      <td className="px-6 py-4 text-gray-600">{cookie.purpose}</td>
                      <td className="px-6 py-4 text-gray-600">{cookie.duration}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${
                          cookie.type === 'Essential' ? 'bg-[#06392F] text-white' :
                          cookie.type === 'Analytics' ? 'bg-blue-100 text-blue-800' :
                          cookie.type === 'Marketing' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {cookie.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Updates to This Policy */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">Updates to This Policy</h3>
            <p className="text-gray-600">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. We encourage you to review this policy periodically for any updates. The "Last Updated" date at the top of this page indicates when this policy was last revised.
            </p>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#06392F] mb-6">Questions About Cookies?</h3>

            <div className="bg-[#06392F] text-white rounded-2xl p-8">
              <p className="mb-6 text-white/80">
                If you have any questions about our use of cookies, please contact our Data Protection Officer:
              </p>
              
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
          </div>

          {/* Related Policies */}
          <div className="pt-8 mt-12 border-t border-gray-100">
            <h4 className="mb-4 text-sm font-black tracking-widest text-gray-400 uppercase">Related Policies</h4>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/privacy" 
                className="group flex items-center gap-2 text-sm text-[#06392F] hover:text-[#C75B39] transition-colors"
              >
                <Shield size={16} />
                Privacy Policy
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/terms" 
                className="group flex items-center gap-2 text-sm text-[#06392F] hover:text-[#C75B39] transition-colors"
              >
                <AlertCircle size={16} />
                Terms of Service
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
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
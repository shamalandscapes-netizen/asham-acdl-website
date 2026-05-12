// app/sitemap/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Home, 
  Building2, 
  HardHat, 
  ShoppingBag, 
  Newspaper, 
  Mail, 
  Users,
  ChevronRight,
  FileText,
  Scale,
  Shield,
  Cookie,
  Map,
  ArrowLeft,
  Globe,
  Briefcase,
  Award,
  Phone,
  Calendar
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap | Asham Design & Construction Ltd',
  description: 'Navigate all pages and sections of the Asham Design & Construction Ltd website. Find information about our services, projects, products, and company policies.',
  keywords: ['sitemap', 'website navigation', 'Asham pages', 'site directory'],
  openGraph: {
    title: 'Sitemap | Asham Design & Construction Ltd',
    description: 'Complete website navigation guide.',
    images: ['/og-sitemap.jpg'],
  },
};

export default function SitemapPage() {
  const lastUpdated = 'February 18, 2026';

  // Main sections organized by category
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: Home,
      color: 'bg-[#06392F]',
      links: [
        { name: 'Home', href: '/', description: 'Company overview and featured projects' },
        { name: 'About Us', href: '/about', description: 'Our team, mission, and company history' },
        { name: 'Projects', href: '/projects', description: 'Portfolio of completed and ongoing projects' },
        { name: 'Services', href: '/services', description: 'Architectural and construction services' },
        { name: 'Contact', href: '/contact', description: 'Get in touch with our team' }
      ]
    },
    {
      title: 'Services',
      icon: HardHat,
      color: 'bg-[#C75B39]',
      links: [
        { name: 'Environmental Assessment', href: '/services/eia', description: 'NEMA compliance and ecological audits' },
        { name: 'Construction Services', href: '/services/construction', description: 'Project management and site supervision' },
        { name: 'Architectural Services', href: '/services/architecture', description: 'Design, planning, and 3D visualization' },
        { name: 'Interior Design', href: '/services/interior', description: 'Space planning and interior finishes' },
        { name: 'Landscape Architecture', href: '/services/landscape', description: 'Garden design and outdoor spaces' }
      ]
    },
    {
      title: 'Material Store',
      icon: ShoppingBag,
      color: 'bg-[#06392F]',
      links: [
        { name: 'All Products', href: '/products', description: 'Browse our complete catalog' },
        { name: 'Cement & Binders', href: '/products/cement-binders', description: 'Quality cement and construction binders' },
        { name: 'Steel & Metals', href: '/products/steel-reinforcement', description: 'Reinforcement bars and structural steel' },
        { name: 'Roofing Materials', href: '/products/roofing-materials', description: 'Roofing sheets and accessories' },
        { name: 'Plumbing Supplies', href: '/products/plumbing-water', description: 'Pipes, fittings, and fixtures' },
        { name: 'Timber & Wood', href: '/products/timber', description: 'Lumber and wood products' },
        { name: 'Finishing Materials', href: '/products/finishes', description: 'Paints, tiles, and finishes' },
        { name: 'Digital Plans', href: '/products/digital-plans', description: 'Architectural blueprints and plans' }
      ]
    },
    {
      title: 'The Journal',
      icon: Newspaper,
      color: 'bg-[#C75B39]',
      links: [
        { name: 'All Articles', href: '/blog', description: 'Latest insights and perspectives' },
        { name: 'Design Philosophy', href: '/blog/category/design-philosophy', description: 'Architectural thinking and concepts' },
        { name: 'Sustainability', href: '/blog/category/sustainability', description: 'Green building and eco-design' },
        { name: 'Studio Life', href: '/blog/category/studio-life', description: 'Behind the scenes at Asham' },
        { name: 'Projects', href: '/blog/category/projects', description: 'Project case studies' },
        { name: 'Landscape', href: '/blog/category/landscape', description: 'Outdoor and garden design' }
      ]
    },
    {
      title: 'Company',
      icon: Building2,
      color: 'bg-[#06392F]',
      links: [
        { name: 'Our Team', href: '/about#team', description: 'Meet our leadership and staff' },
        { name: 'Careers', href: '/careers', description: 'Join the Asham team' },
        { name: 'News', href: '/news', description: 'Company announcements and updates' },
        { name: 'Events', href: '/events', description: 'Upcoming industry events' },
        { name: 'Gallery', href: '/gallery', description: 'Photo gallery of our work' }
      ]
    },
    {
      title: 'Legal',
      icon: Scale,
      color: 'bg-[#C75B39]',
      links: [
        { name: 'Privacy Policy', href: '/privacy', description: 'How we handle your data' },
        { name: 'Terms of Service', href: '/terms', description: 'Terms and conditions' },
        { name: 'Cookie Policy', href: '/cookies', description: 'How we use cookies' },
        { name: 'Sitemap', href: '/sitemap', description: 'Website navigation guide' }
      ]
    }
  ];

  // Project pages (would be dynamic in production)
  const projectPages = [
    { name: 'Moureen Residence', href: '/projects/moureen-residence', category: 'Residential' },
    { name: 'Tonny Muyale Bungalow', href: '/projects/tonny-muyale-bungalow', category: 'Residential' },
    { name: 'Samuel Waswa Maisonette', href: '/projects/samuel-waswa-maisonette', category: 'Residential' },
    { name: 'Malava Teachers Plaza', href: '/projects/malava-teachers-plaza', category: 'Commercial' },
    { name: 'Equity Afya Medical Reception', href: '/projects/equity-afya-reception', category: 'Healthcare' }
  ];

  // Quick links for common destinations
  const quickLinks = [
    { name: 'Request a Quote', href: '/contact?type=quote', icon: FileText },
    { name: 'Project Consultation', href: '/contact?type=consultation', icon: Calendar },
    { name: 'View Portfolio', href: '/projects', icon: Briefcase },
    { name: 'Material Catalog', href: '/products', icon: ShoppingBag },
    { name: 'Join Our Team', href: '/careers', icon: Users }
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

        {/* Decorative Map Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100 Q 200 50, 400 100 T 800 100" stroke="white" fill="none" strokeWidth="2" />
          <path d="M0 300 Q 300 250, 600 300 T 1200 300" stroke="white" fill="none" strokeWidth="2" />
          <path d="M200 0 Q 250 200, 200 400" stroke="white" fill="none" strokeWidth="2" />
          <path d="M800 0 Q 850 200, 800 400" stroke="white" fill="none" strokeWidth="2" />
        </svg>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-[#C75B39]/20 rounded-2xl">
              <Map size={32} className="text-[#C75B39]" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
            Site<span className="text-[#C75B39]">map</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl font-medium text-white/70">
            Complete navigation guide to all pages and sections of the Asham Design & Construction website.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-white/50">
            <Globe size={14} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl">
        
        {/* Quick Links Strip */}
        <div className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#C75B39] mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#C75B39] hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-3 bg-[#06392F]/5 rounded-xl group-hover:bg-[#C75B39] transition-colors duration-300 mb-3">
                    <Icon size={24} className="text-[#06392F] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-center text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Sitemap Grid */}
        <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
          {sitemapSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <div 
                key={sectionIndex} 
                className="overflow-hidden transition-shadow bg-white border border-gray-100 shadow-lg rounded-3xl hover:shadow-xl"
              >
                {/* Section Header */}
                <div className={`${section.color} p-6 text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Icon size={24} />
                    </div>
                    <h2 className="text-xl font-black tracking-tighter uppercase">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Section Links */}
                <div className="p-6">
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.href}
                          className="flex items-start gap-3 transition-transform group hover:translate-x-1"
                        >
                          <ChevronRight size={16} className="text-[#C75B39] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div>
                            <span className="text-sm font-black text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                              {link.name}
                            </span>
                            <p className="mt-1 text-xs text-gray-500">
                              {link.description}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section Footer with page count */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {section.links.length} pages
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Projects Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-[#06392F] mb-8 flex items-center gap-3">
            <Briefcase size={24} className="text-[#C75B39]" />
            Featured Project Pages
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectPages.map((project, index) => (
              <Link
                key={index}
                href={project.href}
                className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#C75B39] hover:shadow-lg transition-all"
              >
                <div>
                  <span className="text-sm font-black text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                    {project.name}
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                    {project.category}
                  </p>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#C75B39] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
            <Link
              href="/projects"
              className="group flex items-center justify-center p-6 bg-[#06392F]/5 rounded-2xl border-2 border-dashed border-[#06392F]/20 hover:border-[#C75B39] transition-all"
            >
              <span className="text-xs font-black uppercase tracking-widest text-[#06392F]">
                View All Projects →
              </span>
            </Link>
          </div>
        </div>

        {/* Blog Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-[#06392F] mb-8 flex items-center gap-3">
            <Newspaper size={24} className="text-[#C75B39]" />
            Journal Categories
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              'Design Philosophy',
              'Sustainability',
              'Studio Life',
              'Projects',
              'Landscape',
              'Materials',
              'Industry News',
              'Case Studies'
            ].map((category, index) => (
              <Link
                key={index}
                href={`/blog/category/${category.toLowerCase().replace(' ', '-')}`}
                className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-[#C75B39] text-center transition-all"
              >
                <span className="text-xs font-black uppercase tracking-widest text-[#06392F] group-hover:text-[#C75B39]">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Resource Links */}
        <div className="p-8 mb-16 bg-white border border-gray-100 rounded-3xl">
          <h2 className="text-xl font-black text-[#06392F] mb-6">Resources & Downloads</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: 'Company Profile', href: '/downloads/company-profile.pdf', size: '2.4 MB' },
              { name: 'Project Brochure', href: '/downloads/project-brochure.pdf', size: '1.8 MB' },
              { name: 'Material Catalog', href: '/downloads/material-catalog.pdf', size: '3.2 MB' },
              { name: 'NCA Certifications', href: '/downloads/certifications.pdf', size: '0.5 MB' },
              { name: 'Standard Contract', href: '/downloads/contract-template.pdf', size: '0.3 MB' },
              { name: 'Design Guide', href: '/downloads/design-guide.pdf', size: '1.1 MB' }
            ].map((resource, index) => (
              <a
                key={index}
                href={resource.href}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#C75B39]/10 transition-colors group"
              >
                <div>
                  <span className="text-sm font-medium text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                    {resource.name}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">PDF • {resource.size}</p>
                </div>
                <FileText size={20} className="text-gray-400 group-hover:text-[#C75B39]" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[#06392F] text-white rounded-3xl p-8 mb-16">
          <h2 className="mb-6 text-xl font-black">Need Help Finding Something?</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Phone size={20} className="text-[#C75B39]" />
              </div>
              <div>
                <p className="mb-1 text-xs font-black tracking-widest uppercase text-white/60">Call Us</p>
                <a href="tel:+254712575077" className="text-white hover:text-[#C75B39] transition-colors">
                  +254 712 575 077
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Mail size={20} className="text-[#C75B39]" />
              </div>
              <div>
                <p className="mb-1 text-xs font-black tracking-widest uppercase text-white/60">Email</p>
                <a href="mailto:info@ashamconstruction.co.ke" className="text-white hover:text-[#C75B39] transition-colors">
                  info@ashamconstruction.co.ke
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Map size={20} className="text-[#C75B39]" />
              </div>
              <div>
                <p className="mb-1 text-xs font-black tracking-widest uppercase text-white/60">Visit</p>
                <p className="text-sm">
                  1st Floor Ambwere Plaza<br />
                  Room 101, Kakamega
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Site Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-12 md:grid-cols-4">
          {[
            { label: 'Total Pages', value: '42', icon: FileText },
            { label: 'Projects', value: '12', icon: Building2 },
            { label: 'Products', value: '50+', icon: ShoppingBag },
            { label: 'Blog Posts', value: '8', icon: Newspaper }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="p-6 text-center bg-white border border-gray-100 rounded-2xl">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-[#C75B39]/10 rounded-xl">
                    <Icon size={24} className="text-[#C75B39]" />
                  </div>
                </div>
                <p className="text-2xl font-black text-[#06392F]">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* XML Sitemap Note */}
        <div className="p-8 text-center bg-gray-50 rounded-2xl">
          <p className="mb-2 text-sm text-gray-600">
            Looking for the XML sitemap for search engines?
          </p>
          <a 
            href="/sitemap.xml"
            className="text-[#C75B39] hover:text-[#06392F] transition-colors text-sm font-medium inline-flex items-center gap-2"
          >
            <FileText size={16} />
            View XML Sitemap
          </a>
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
      </section>
    </main>
  );
}
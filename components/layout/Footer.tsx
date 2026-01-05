'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Facebook, Twitter, Instagram, Linkedin, 
  Mail, Phone, MapPin, ArrowRight, Send 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // In a real app, you'd send this to your API
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-[#06392F] text-white pt-20 pb-10 border-t-4 border-[#C75B39]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 gap-16 mb-16 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                <span className="text-[#C75B39]">Asham</span> Design Construction Ltd
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Building the future across Kenya with premium materials and expert architectural design.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Stay Updated</h4>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="w-full px-4 py-3 text-sm text-white bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75B39] focus:bg-white/15 placeholder-gray-400 transition-all duration-200" 
                  aria-label="Email address for newsletter"
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-2 bg-[#C75B39] rounded-lg hover:bg-[#a84a2e] active:scale-95 transition-all duration-200 shadow-lg"
                  aria-label="Subscribe"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400">Subscribe for project updates and material deals.</p>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-[#C75B39] pb-2 border-b border-white/10">Company</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Projects', href: '/projects' },
                { name: 'Services', href: '/services' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.name} className="group">
                  <Link 
                    href={link.href} 
                    className="flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white hover:translate-x-1"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C75B39] opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Material Store - Functional Categories */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-[#C75B39] pb-2 border-b border-white/10">Material Store</h3>
            <ul className="space-y-4">
              {[
                { name: 'Cement & Binders', slug: 'cement-binders' },
                { name: 'Steel & Metals', slug: 'steel-reinforcement' },
                { name: 'Roofing Sheets', slug: 'roofing-materials' },
                { name: 'Plumbing Supplies', slug: 'plumbing-water' },
                { name: 'Furniture', slug: 'furniture' }
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link 
                    href={`/products/${cat.slug}`} 
                    className="flex items-center justify-between text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/products/digital-plans" 
                  className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  Digital Plans 
                  <span className="text-[10px] bg-[#C75B39] text-white px-2 py-1 rounded font-bold animate-pulse">NEW</span>
                </Link>
              </li>
              <li className="pt-4">
                <Link 
                  href="/products" 
                  className="inline-flex items-center text-sm text-[#C75B39] hover:text-[#a84a2e] font-medium transition-colors duration-200 group"
                >
                  View All Products
                  <ArrowRight size={14} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-8">
            <h3 className="text-lg font-bold mb-8 text-[#C75B39] pb-2 border-b border-white/10">Get In Touch</h3>
            <div className="space-y-6">
              <ContactItem icon={MapPin} text="Ambwere Plaza, Kakamega, Kenya" />
              <ContactItem icon={Phone} text="+254 712 575 077" />
              <ContactItem icon={Mail} text="info@ashamconstruction.co.ke" isLink />
            </div>
            
            <div className="pt-4">
              <h4 className="mb-4 text-sm font-semibold text-white">Connect With Us</h4>
              <div className="flex gap-3">
                <SocialIcon icon={Facebook} label="Facebook" href="https://facebook.com/asham" />
                <SocialIcon icon={Twitter} label="Twitter" href="https://twitter.com/asham" />
                <SocialIcon icon={Instagram} label="Instagram" href="https://instagram.com/asham" />
                <SocialIcon icon={Linkedin} label="LinkedIn" href="https://linkedin.com/company/asham" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 pt-10 mt-10 text-sm border-t border-white/10 md:flex-row">
          <div className="text-center text-gray-500 md:text-left">
            <p className="font-medium">© {currentYear} Asham Construction & Design Ltd.</p>
            <p className="mt-1 text-xs text-gray-500">All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="text-gray-400 transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 transition-colors hover:text-white">Terms of Service</Link>
            <Link href="/sitemap" className="text-gray-400 transition-colors hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({ icon: Icon, text, isLink }: { icon: any, text: string, isLink?: boolean }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="p-2 transition-colors duration-200 rounded-lg bg-white/5 group-hover:bg-white/10">
        <Icon className="text-[#C75B39]" size={18} aria-hidden="true" />
      </div>
      <div className="flex-1">
        {isLink ? (
          <a 
            href={`mailto:${text}`} 
            className="text-sm text-gray-400 transition-colors duration-200 hover:text-white group-hover:underline"
          >
            {text}
          </a>
        ) : (
          <span className="text-sm text-gray-400">{text}</span>
        )}
      </div>
    </div>
  );
}

function SocialIcon({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-xl bg-white/5 hover:bg-[#C75B39] transition-all duration-200 transform hover:-translate-y-1 active:scale-95"
      aria-label={`Visit our ${label} page`}
    >
      <Icon size={20} aria-hidden="true" />
    </a>
  );
}
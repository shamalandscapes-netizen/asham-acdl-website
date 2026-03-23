'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Send,
  HardHat,
  Home,
  Building2,
  Trees,
  Droplets
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you for subscribing! Check your inbox for updates.', {
      icon: '🏗️',
      duration: 4000
    });
    
    setEmail('');
    setIsSubscribing(false);
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#06392F] to-[#052e26] text-white pt-24 pb-10 overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke='%23C75B39' strokeWidth='0.5' opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-64 h-64 border rounded-full top-20 right-10 border-white/5"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute border rounded-full bottom-20 left-10 w-96 h-96 border-white/5"
      />

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Column 1: Brand & Newsletter (spans 4 columns) */}
          <div className="space-y-8 lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                <span className="text-[#C75B39]">Asham</span>
                <br />
                <span className="text-sm font-bold tracking-[0.3em] text-white/60">DESIGN & CONSTRUCTION</span>
              </h2>
              <p className="max-w-sm mt-6 text-sm leading-relaxed text-gray-300">
                Precision-built infrastructure anchored in innovation, craftsmanship, and legacy. 
                Since 2019, we've been transforming the Kenyan landscape.
              </p>
            </motion.div>
            
            <motion.form 
              onSubmit={handleSubscribe} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#C75B39]" />
                <h4 className="text-xs font-black tracking-widest uppercase text-white/80">Newsletter</h4>
              </div>
              
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  required
                  disabled={isSubscribing}
                  className="w-full px-5 py-4 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75B39] focus:bg-white/10 focus:border-transparent placeholder-gray-500 transition-all duration-200 pr-24" 
                  aria-label="Email address for newsletter"
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="absolute right-2 top-2 bottom-2 px-5 bg-[#C75B39] rounded-lg hover:bg-[#b04b2c] active:scale-95 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[80px] justify-center"
                  aria-label="Subscribe"
                >
                  {isSubscribing ? (
                    <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      <span className="text-xs font-bold">Join</span>
                    </>
                  )}
                </button>
              </div>
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1 h-1 bg-[#C75B39] rounded-full" />
                Quarterly briefings • No spam • Unsubscribe anytime
              </p>
            </motion.form>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#C75B39]/20 border-2 border-[#C75B39] flex items-center justify-center">
                  <span className="text-[10px] font-black">NCA</span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 border-2 rounded-full bg-white/10 border-white/20">
                  <span className="text-[8px] font-black">MAAK</span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 border-2 rounded-full bg-white/10 border-white/20">
                  <span className="text-[8px] font-black">NEMA</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-500">Licensed & Certified</span>
            </div>
          </div>

          {/* Column 2: Company (spans 2 columns) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-[#C75B39] mb-6 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-[#C75B39]" />
                Company
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Our Projects', href: '/projects' },
                  { name: 'Services', href: '/services' },
                  { name: 'The Journal', href: '/blog' },
                  { name: 'Contact', href: '/contact' }
                ].map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  >
                    <Link 
                      href={link.href} 
                      className="flex items-center text-sm text-gray-400 transition-all duration-200 group hover:text-white hover:translate-x-1"
                    >
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 mr-2 transition-all duration-200 text-[#C75B39]" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Column 3: Material Store (spans 3 columns) */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-[#C75B39] mb-6 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-[#C75B39]" />
                Material Store
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Cement & Binders', slug: 'cement-binders', icon: HardHat },
                  { name: 'Steel & Metals', slug: 'steel-reinforcement', icon: Building2 },
                  { name: 'Roofing Sheets', slug: 'roofing-materials', icon: Home },
                  { name: 'Plumbing Supplies', slug: 'plumbing-water', icon: Droplets },
                  { name: 'Timber & Wood', slug: 'timber', icon: Trees },
                  { name: 'Finishing Materials', slug: 'finishes', icon: Mail }
                ].map((cat, index) => {
                  const Icon = cat.icon;
                  return (
                    <motion.div
                      key={cat.slug}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    >
                      <Link 
                        href={`/products/${cat.slug}`} 
                        className="flex items-center gap-3 p-3 transition-all duration-200 group rounded-xl hover:bg-white/5"
                      >
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#C75B39] transition-colors duration-200">
                          <Icon size={14} className="text-white/60 group-hover:text-white" />
                        </div>
                        <span className="text-xs text-gray-400 transition-colors group-hover:text-white">
                          {cat.name}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="pt-4 mt-4 border-t border-white/5">
                <Link 
                  href="/products/digital-plans" 
                  className="inline-flex items-center gap-2 text-xs text-gray-400 transition-colors hover:text-white group"
                >
                  <span className="px-2 py-1 bg-[#C75B39] text-white text-[8px] font-black rounded-full animate-pulse">
                    NEW
                  </span>
                  Digital Plans & Blueprints
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Column 4: Contact (spans 3 columns) */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-[#C75B39] mb-6 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-[#C75B39]" />
                Get In Touch
              </h3>
              
              <div className="mb-8 space-y-4">
                <ContactItem 
                  icon={MapPin} 
                  text="1st Floor Ambwere Plaza, Room 101, Kakamega, Kenya" 
                  delay={0.5}
                />
                <ContactItem 
                  icon={Phone} 
                  text="+254 712 575 077" 
                  href="tel:+254712575077"
                  delay={0.55}
                />
                <ContactItem 
                  icon={Mail} 
                  text="info@ashamconstruction.co.ke" 
                  href="mailto:info@ashamconstruction.co.ke"
                  delay={0.6}
                />
              </div>
              
              <div>
                <h4 className="mb-4 text-xs font-black tracking-widest uppercase text-white/60">Connect With Us</h4>
                <div className="flex flex-wrap gap-3">
                  <SocialIcon icon={Facebook} label="Facebook" href="https://facebook.com/ashamconstruction" delay={0.65} />
                  <SocialIcon icon={Twitter} label="Twitter" href="https://twitter.com/asham" delay={0.7} />
                  <SocialIcon icon={Instagram} label="Instagram" href="https://instagram.com/ashamdesign" delay={0.75} />
                  <SocialIcon icon={Linkedin} label="LinkedIn" href="https://linkedin.com/company/asham-construction" delay={0.8} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col items-center justify-between gap-6 pt-10 mt-10 text-sm border-t border-white/10 md:flex-row"
        >
          <div className="text-center text-gray-500 md:text-left">
            <p className="text-xs font-medium">
              © {currentYear} <span className="text-white">Asham Design & Construction Ltd.</span>
            </p>
            <p className="mt-1 text-[10px] text-gray-600">
              All rights reserved. NCA 6 Certified • MAAK Reg. 4305
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <Link 
              href="/privacy" 
              className="text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-white"
            >
              Terms
            </Link>
            <Link 
              href="/sitemap" 
              className="text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-white"
            >
              Sitemap
            </Link>
            <Link 
              href="/careers" 
              className="text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-white"
            >
              Careers
            </Link>
          </div>
        </motion.div>

        {/* Accreditation Strip */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-8 mt-8 border-t border-white/5"
        >
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">NCA 6: BUILDING WORKS CONTRACTOR</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">MAAK REG. 4305</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">NEMA LEAD EXPERT</span>
        </motion.div>
      </div>
    </footer>
  );
}

// Enhanced Contact Item with animations
function ContactItem({ 
  icon: Icon, 
  text, 
  href, 
  delay = 0 
}: { 
  icon: any; 
  text: string; 
  href?: string;
  delay?: number;
}) {
  const content = (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-3 group"
    >
      <div className="p-2 transition-all duration-200 rounded-lg bg-white/5 group-hover:bg-[#C75B39] shrink-0">
        <Icon size={16} className="transition-colors text-white/60 group-hover:text-white" />
      </div>
      <span className="text-sm text-gray-400 break-words transition-colors group-hover:text-white">
        {text}
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <a 
        href={href}
        className="block hover:no-underline"
      >
        {content}
      </a>
    );
  }

  return content;
}

// Enhanced Social Icon with animations
function SocialIcon({ 
  icon: Icon, 
  label, 
  href, 
  delay = 0 
}: { 
  icon: any; 
  label: string; 
  href: string;
  delay?: number;
}) {
  return (
    <motion.a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay, type: "spring", stiffness: 200 }}
      whileHover={{ y: -4, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-3 rounded-xl bg-white/5 hover:bg-[#C75B39] transition-all duration-200 shadow-lg"
      aria-label={`Visit our ${label} page`}
    >
      <Icon size={18} className="text-white/80 hover:text-white" />
    </motion.a>
  );
}
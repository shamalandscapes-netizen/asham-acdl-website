'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  Mail,
  Send,
  Bell,
  Users,
  Building2,
  HardHat,
  Leaf,
  Heart,
  Star
} from 'lucide-react';

// --- STATIC JOB DATA (Empty for now) ---
const OPEN_POSITIONS: any[] = []; // Empty array means no openings

const BENEFITS = [
  'Competitive Salary & Bonuses',
  'Health Insurance Coverage',
  'Professional Development Training',
  'Collaborative Work Environment',
  'Career Growth Opportunities',
  'Paid Time Off',
  'Flexible Working Arrangements',
  'Team Building Events'
];

const TEAM_VALUES = [
  {
    icon: HardHat,
    title: 'Safety First',
    desc: 'We prioritize the well-being of our team above all else.'
  },
  {
    icon: Heart,
    title: 'Integrity',
    desc: 'Honest, transparent, and ethical in everything we do.'
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    desc: 'Building with respect for the environment and future generations.'
  },
  {
    icon: Star,
    title: 'Excellence',
    desc: 'Striving for the highest quality in every project.'
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F5]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#06392F] text-white pt-32 pb-24 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-[#C75B39]/20 rounded-2xl">
                <Users size={32} className="text-[#C75B39]" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              Build Your <span className="text-[#C75B39]">Future</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl font-medium text-white/70">
              Join a team of passionate professionals dedicated to transforming the construction landscape in Kenya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- NO OPENINGS MESSAGE (Conditional) --- */}
      {OPEN_POSITIONS.length === 0 && (
        <section className="relative z-20 px-4 -mt-16">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl border-2 border-[#C75B39] p-12 text-center relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C75B39]/5 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C75B39]/5 rounded-full -ml-16 -mb-16" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-[#C75B39]/10 rounded-full">
                    <Briefcase size={48} className="text-[#C75B39]" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-[#06392F] mb-4">
                  No Open Positions at This Time
                </h2>
                
                <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600">
                  We're always looking for talented individuals to join our team. 
                  Even though there are no current openings, we encourage you to:
                </p>

                <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-3">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-[#C75B39] rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Bell size={24} className="text-white" />
                    </div>
                    <h3 className="font-black text-[#06392F] mb-2">Stay Updated</h3>
                    <p className="text-sm text-gray-500">Check back regularly for new opportunities</p>
                  </div>
                  
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-[#C75B39] rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-white" />
                    </div>
                    <h3 className="font-black text-[#06392F] mb-2">Send Your CV</h3>
                    <p className="text-sm text-gray-500">Submit your application for future consideration</p>
                  </div>
                  
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-[#C75B39] rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Users size={24} className="text-white" />
                    </div>
                    <h3 className="font-black text-[#06392F] mb-2">Connect With Us</h3>
                    <p className="text-sm text-gray-500">Follow us on social media for updates</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a 
                    href="mailto:careers@ashamconstruction.co.ke"
                    className="group inline-flex items-center justify-center gap-3 bg-[#C75B39] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#06392F] transition-all duration-300 shadow-lg"
                  >
                    <Mail size={18} />
                    Send Your CV
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  
                  <Link 
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-3 bg-white border-2 border-[#06392F] text-[#06392F] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#06392F] hover:text-white transition-all duration-300"
                  >
                    Contact HR
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* --- VALUES / BENEFITS SECTION --- */}
      <section className="px-4 py-24 mx-auto max-w-7xl">
        <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#06392F] uppercase tracking-tighter mb-6">
              Why work at <span className="text-[#C75B39]">Asham?</span>
            </h2>
            
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              At Asham Design & Construction, we believe our people are our greatest asset. 
              We foster a culture of innovation, integrity, and excellence. Whether you are on-site 
              or in the office, your work directly contributes to building high-quality structures that last.
            </p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {BENEFITS.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 text-gray-700 bg-white shadow-sm rounded-xl"
                >
                  <CheckCircle className="text-[#C75B39] shrink-0" size={20} />
                  <span className="text-sm font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl"
          >
            <h3 className="text-2xl font-black text-[#06392F] mb-6">Our Team Values</h3>
            
            <div className="space-y-6">
              {TEAM_VALUES.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="p-3 bg-[#06392F]/5 rounded-xl group-hover:bg-[#C75B39] transition-colors duration-300">
                      <Icon size={24} className="text-[#06392F] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#06392F] mb-1">{value.title}</h4>
                      <p className="text-sm text-gray-500">{value.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 mt-8 border-t border-gray-100">
              <p className="mb-4 text-sm text-gray-500">
                <span className="font-black text-[#C75B39]">Note:</span> We are an equal opportunity employer. 
                All qualified applicants will receive consideration for employment without regard to race, 
                color, religion, gender, or national origin.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- HOW TO APPLY SECTION --- */}
      <section className="px-4 py-20 bg-white border-gray-100 border-y">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#06392F] uppercase tracking-tighter mb-6">
              Stay <span className="text-[#C75B39]">Connected</span>
            </h2>
            
            <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-600">
              While we don't have immediate openings, we're always interested in connecting with talented 
              professionals. Send us your CV and we'll keep you in mind for future opportunities.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a 
                href="mailto:careers@ashamconstruction.co.ke"
                className="group inline-flex items-center justify-center gap-3 bg-[#06392F] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#C75B39] transition-all duration-300 shadow-lg"
              >
                <Mail size={18} />
                Send Your CV
              </a>
              
              <Link 
                href="/about#team"
                className="group inline-flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-600 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:border-[#C75B39] hover:text-[#C75B39] transition-all duration-300"
              >
                Meet Our Team
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <p className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
              <Bell size={14} />
              We'll update this page as new positions become available
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- OPEN POSITIONS SECTION (Conditional) --- */}
      {OPEN_POSITIONS.length > 0 && (
        <section className="max-w-5xl px-4 py-20 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#06392F] uppercase tracking-tighter mb-4">
              Current <span className="text-[#C75B39]">Openings</span>
            </h2>
            <p className="text-gray-600">Explore opportunities to join our team.</p>
          </div>

          <div className="space-y-4">
            {OPEN_POSITIONS.map((job) => (
              <motion.div 
                key={job.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-[#C75B39] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-[#C75B39]/10 text-[#C75B39] rounded-full">
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={14} /> {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 mb-3 text-sm text-gray-500">
                    <MapPin size={16} /> {job.location}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <a 
                  href={`mailto:careers@ashamconstruction.co.ke?subject=Application for ${job.title}`}
                  className="shrink-0 flex items-center gap-2 px-6 py-3 bg-[#06392F] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#C75B39] transition-all group/btn"
                >
                  Apply Now 
                  <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* --- BOTTOM CTA --- */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 bg-gradient-to-br from-[#06392F] to-[#1a4a3e] rounded-3xl text-white">
            <h3 className="mb-4 text-2xl font-black">Don't see the right role?</h3>
            <p className="mb-6 text-white/80">
              We're always looking for exceptional talent. Send us your CV anyway and we'll reach out when something matches your skills.
            </p>
            <a 
              href="mailto:careers@ashamconstruction.co.ke"
              className="inline-flex items-center gap-3 bg-white text-[#06392F] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#C75B39] hover:text-white transition-all duration-300 shadow-xl"
            >
              <Send size={18} />
              Send General Application
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
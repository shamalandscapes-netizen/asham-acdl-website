// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Loader2, 
  Send, 
  CheckCircle, 
  Clock,
  MessageSquare,
  Building2,
  ArrowRight,
  Sparkles,
  HardHat
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'General Inquiry',
    message: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', service: 'General Inquiry', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      lines: ['+254 712 575 077', '+254 735 184 292'],
      action: 'tel:+254712575077'
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['info@ashamconstruction.co.ke', 'sales@ashamconstruction.co.ke'],
      action: 'mailto:info@ashamconstruction.co.ke'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: ['Ambwere Plaza, 1st Floor', 'Kenyatta Ave., Kakamega'],
      action: '#'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      lines: ['Mon - Fri: 8am - 5pm', 'Sat: 9am - 2pm'],
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] relative overflow-hidden">
      {/* Architectural Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(to right, #06392F 1px, transparent 1px),
            linear-gradient(to bottom, #06392F 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
        
        {/* Organic Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C75B39]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#06392F]/5 rounded-full blur-[120px]" />
        
        {/* Decorative Arcs */}
        <svg className="absolute top-20 left-10 w-32 h-32 text-[#C75B39]/10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
        <svg className="absolute bottom-20 right-10 w-48 h-48 text-[#06392F]/10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
      </div>

      {/* Hero Section */}
      <div className="relative px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white rounded-full shadow-sm border border-[#06392F]/10"
          >
            <MessageSquare className="w-4 h-4 text-[#C75B39]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#06392F]">
              Let&apos;s Connect
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#06392F] leading-[1.1] mb-6"
          >
            Start Your Project
            <span className="block text-[#C75B39] mt-2">With a Conversation</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-[#06392F]/60 leading-relaxed"
          >
            Whether you&apos;re dreaming of a new home, planning a commercial space, or need quality materials, 
            we&apos;re here to listen and guide you every step of the way.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl px-6 pb-20 mx-auto -mt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          
          {/* Contact Cards - Left Side */}
          <div className="space-y-4 lg:col-span-2">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.title}
                  href={item.action || undefined}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="group block p-6 bg-white rounded-2xl border border-[#06392F]/5 shadow-sm hover:shadow-lg hover:border-[#C75B39]/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F5F0] flex items-center justify-center text-[#C75B39] group-hover:bg-[#C75B39] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#06392F] mb-2 group-hover:text-[#C75B39] transition-colors">
                        {item.title}
                      </h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-sm text-[#06392F]/60 leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                    {item.action && (
                      <ArrowRight className="w-5 h-5 text-[#06392F]/20 group-hover:text-[#C75B39] group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                </motion.a>
              );
            })}

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gradient-to-br from-[#06392F] to-[#0a4d3f] rounded-2xl text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-[#C75B39]" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/60">
                  Why Choose Us
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/80">
                15+ years of building dreams across Kenya. NEMA licensed, BORAQS registered, and committed to excellence.
              </p>
            </motion.div>
          </div>

          {/* Form - Right Side */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-[2rem] shadow-xl shadow-[#06392F]/5 border border-[#06392F]/5 overflow-hidden">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px] text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-20 h-20 rounded-full bg-[#06392F] flex items-center justify-center mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[#06392F] mb-3">Message Received!</h3>
                    <p className="text-[#06392F]/60 mb-8 max-w-sm">
                      Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStatus('idle')}
                      className="px-8 py-3 bg-[#F5F5F0] text-[#06392F] rounded-full font-semibold text-sm hover:bg-[#C75B39] hover:text-white transition-colors"
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="p-8 space-y-6 md:p-12"
                  >
                    {/* Form Header */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#06392F]/5">
                      <div className="w-12 h-12 rounded-xl bg-[#C75B39]/10 flex items-center justify-center">
                        <HardHat className="w-6 h-6 text-[#C75B39]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#06392F]">Project Inquiry</h3>
                        <p className="text-sm text-[#06392F]/50">Tell us about your vision</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#06392F]/60">
                          Full Name
                        </label>
                        <div className={`
                          relative rounded-xl overflow-hidden transition-all duration-300
                          ${focusedField === 'name' ? 'ring-2 ring-[#C75B39] shadow-lg' : 'shadow-sm'}
                        `}>
                          <input 
                            type="text" 
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-4 py-4 bg-[#F5F5F0] border-0 text-[#06392F] placeholder:text-[#06392F]/30 focus:outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#06392F]/60">
                          Email Address
                        </label>
                        <div className={`
                          relative rounded-xl overflow-hidden transition-all duration-300
                          ${focusedField === 'email' ? 'ring-2 ring-[#C75B39] shadow-lg' : 'shadow-sm'}
                        `}>
                          <input 
                            type="email" 
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-4 py-4 bg-[#F5F5F0] border-0 text-[#06392F] placeholder:text-[#06392F]/30 focus:outline-none"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#06392F]/60">
                          Phone Number
                        </label>
                        <div className={`
                          relative rounded-xl overflow-hidden transition-all duration-300
                          ${focusedField === 'phone' ? 'ring-2 ring-[#C75B39] shadow-lg' : 'shadow-sm'}
                        `}>
                          <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-4 py-4 bg-[#F5F5F0] border-0 text-[#06392F] placeholder:text-[#06392F]/30 focus:outline-none"
                            placeholder="+254 712 345 678"
                          />
                        </div>
                      </div>

                      {/* Service */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#06392F]/60">
                          Service Interested In
                        </label>
                        <div className={`
                          relative rounded-xl overflow-hidden transition-all duration-300
                          ${focusedField === 'service' ? 'ring-2 ring-[#C75B39] shadow-lg' : 'shadow-sm'}
                        `}>
                          <select 
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('service')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-4 py-4 bg-[#F5F5F0] border-0 text-[#06392F] focus:outline-none appearance-none cursor-pointer"
                          >
                            <option>General Inquiry</option>
                            <option>Construction Quote</option>
                            <option>Architecture & Design</option>
                            <option>Interior Design</option>
                            <option>Product Purchase</option>
                          </select>
                          <div className="absolute -translate-y-1/2 pointer-events-none right-4 top-1/2">
                            <svg className="w-4 h-4 text-[#06392F]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#06392F]/60">
                        Your Message
                      </label>
                      <div className={`
                        relative rounded-xl overflow-hidden transition-all duration-300
                        ${focusedField === 'message' ? 'ring-2 ring-[#C75B39] shadow-lg' : 'shadow-sm'}
                      `}>
                        <textarea 
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          rows={5}
                          className="w-full px-4 py-4 bg-[#F5F5F0] border-0 text-[#06392F] placeholder:text-[#06392F]/30 focus:outline-none resize-none"
                          placeholder="Tell us about your project, timeline, and any specific requirements..."
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 text-sm text-center text-red-600 border border-red-100 rounded-xl bg-red-50"
                      >
                        Unable to send message. Please try again or contact us directly by phone.
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button 
                      type="submit"
                      disabled={status === 'loading'}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 px-8 bg-[#06392F] text-white rounded-xl font-semibold text-sm tracking-wide hover:bg-[#C75B39] transition-all duration-300 shadow-lg shadow-[#06392F]/20 hover:shadow-[#C75B39]/30 disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending your message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-xs text-[#06392F]/40">
                      We typically respond within 24 hours during business days.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
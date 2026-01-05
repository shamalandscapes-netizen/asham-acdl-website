'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Loader2, Send, CheckCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'General Inquiry',
    message: ''
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Header */}
      <div className="bg-[#06392F] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold">Get in Touch</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300">
            Ready to start your next project? Have questions about our services? 
            We are here to help you build your vision.
          </p>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-12 mx-auto -mt-8">
        <div className="flex flex-col overflow-hidden bg-white shadow-xl rounded-2xl md:flex-row">
          
          {/* Contact Info (Left Side) */}
          <div className="bg-[#0A4D40] text-white p-8 md:p-12 md:w-1/3 flex flex-col justify-between">
            <div>
              <h3 className="mb-6 text-2xl font-bold">Contact Information</h3>
              <p className="mb-8 leading-relaxed text-gray-300">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="shrink-0 text-[#C75B39]" />
                  <div>
                    <p className="font-bold">Phone</p>
                    <p className="text-gray-300">+254 712 575 077</p>
                    <p className="text-gray-300">+254 735 184 292</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="shrink-0 text-[#C75B39]" />
                  <div>
                    <p className="font-bold">Email</p>
                    <p className="text-gray-300">info@ashamconstruction.co.ke</p>
                    <p className="text-gray-300">sales@ashamconstruction.co.ke</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="shrink-0 text-[#C75B39]" />
                  <div>
                    <p className="font-bold">Office Location</p>
                    <p className="text-gray-300">
                      Ambwere Plaza, 1st Floor<br />
                      Kenyatta Ave., Kakamega
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="shrink-0 text-[#C75B39]" />
                  <div>
                    <p className="font-bold">Working Hours</p>
                    <p className="text-gray-300">Mon - Fri: 8am - 5pm</p>
                    <p className="text-gray-300">Sat: 9am - 2pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons Placeholder */}
            <div className="mt-12 pt-8 border-t border-[#1a5f50]">
              <p className="text-sm text-gray-400">Follow us on social media for project updates.</p>
            </div>
          </div>

          {/* Form (Right Side) */}
          <div className="p-8 bg-white md:p-12 md:w-2/3">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
                <div className="flex items-center justify-center w-16 h-16 mb-6 text-green-600 bg-green-100 rounded-full">
                  <CheckCircle size={32} />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">Message Sent!</h3>
                <p className="max-w-sm mb-8 text-gray-600">
                  Thank you for contacting Asham Construction. We have received your inquiry and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-[#06392F] font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F] transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F] transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F] transition-all"
                      placeholder="+254..."
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">Service Interested In</label>
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F] transition-all cursor-pointer"
                    >
                      <option>General Inquiry</option>
                      <option>Construction Quote</option>
                      <option>Architecture & Design</option>
                      <option>Interior Design</option>
                      <option>Product Purchase</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-700">Your Message</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F] transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 text-sm text-center text-red-600 rounded-lg bg-red-50">
                    Failed to send message. Please try again or call us directly.
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#06392F] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#0A4D40] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
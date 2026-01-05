'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  project: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'James Kamau',
    role: 'Property Developer',
    company: 'Urban Living Developers',
    content: 'Asham Construction delivered our 50-unit residential project ahead of schedule. Their quality materials and expert execution were exceptional. The team was professional and responsive throughout.',
    rating: 5,
    project: 'Nairobi Residential Estate'
  },
  {
    id: 2,
    name: 'Sarah Omondi',
    role: 'Architect',
    company: 'Design Solutions Ltd',
    content: 'The architectural drawings and 3D models we purchased were of professional quality. Excellent service for our firm. Their digital products saved us weeks of work.',
    rating: 5,
    project: 'Mombasa Commercial Complex'
  },
  {
    id: 3,
    name: 'David Mwangi',
    role: 'Construction Manager',
    company: 'BuildRight Contractors',
    content: 'Consistently reliable materials supply and technical support. A trusted partner for all our construction needs in Kenya. Their NCA 6 accreditation gives us confidence.',
    rating: 5,
    project: 'Industrial Park Development'
  }
];

export default function TestimonialsCarousel() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const next = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#06392F]">What Our Clients Say</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Trusted by builders, architects, and developers across Kenya.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Testimonial Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="p-8 bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-2xl md:p-12"
              >
                <Quote className="w-12 h-12 mb-6 text-[#C75B39]/20" />
                
                <div className="flex mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C75B39] text-[#C75B39]" />
                  ))}
                </div>
                
                <p className="mb-8 text-lg italic leading-relaxed text-gray-700 md:text-xl">
                  "{testimonials[currentTestimonial].content}"
                </p>
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex flex-col justify-between md:flex-row md:items-center">
                    <div>
                      <h4 className="text-xl font-bold text-[#06392F]">{testimonials[currentTestimonial].name}</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {testimonials[currentTestimonial].role}, <span className="text-[#C75B39] font-medium">{testimonials[currentTestimonial].company}</span>
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#06392F]/5 text-[#06392F]">
                        Project: {testimonials[currentTestimonial].project}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-8 mt-10">
              <button
                onClick={prev}
                className="p-4 transition-all bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:bg-[#06392F] group border border-gray-100"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-[#06392F] group-hover:text-white transition-colors" />
              </button>
              
              <div className="flex gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-[#C75B39] w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={next}
                className="p-4 transition-all bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:bg-[#06392F] group border border-gray-100"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-[#06392F] group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-6 mt-20 md:grid-cols-4">
            {[
              { value: '200+', label: 'Projects Completed' },
              { value: '15+', label: 'Years Experience' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '50+', label: 'Team Members' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 text-center bg-white shadow-lg rounded-xl border border-gray-100 hover:border-[#C75B39]/30 transition-colors"
              >
                <div className="mb-2 text-3xl font-bold md:text-4xl text-[#C75B39]">{stat.value}</div>
                <div className="text-sm font-medium tracking-wide text-gray-600 uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
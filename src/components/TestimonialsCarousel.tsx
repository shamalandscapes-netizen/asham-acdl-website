'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Moureen',
    role: 'Homeowner',
    company: 'Private Residence',
    content:
      'Asham brought our vision to life with incredible attention to detail. The quality of workmanship exceeded our expectations.',
    initials: 'M',
  },
  {
    id: 2,
    name: 'Tonny Muyale',
    role: 'Homeowner',
    company: 'Private Client',
    content:
      'The two-bedroom bungalow is everything I dreamed of. They managed every detail perfectly, from the front porch to the integrated garage.',
    initials: 'T',
  },
  {
    id: 3,
    name: 'Malava Teachers SACCO',
    role: 'Board Chairman',
    company: 'Malava Teachers SACCO',
    content:
      'The Malava Teachers Plaza demonstrates Asham\'s capability to handle complex mixed-use developments with precision.',
    initials: 'MT',
  },
  {
    id: 4,
    name: 'Samuel Waswa',
    role: 'Homeowner',
    company: 'Private Client',
    content:
      'Every aspect from foundation trenches to window schedules was meticulously documented. A truly holistic approach.',
    initials: 'SW',
  },
  {
    id: 5,
    name: 'Equity Afya',
    role: 'Facilities Manager',
    company: 'Equity Afya',
    content:
      'They transformed our medical reception with a design that balances professionalism with patient comfort.',
    initials: 'EA',
  },
];

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section className="relative py-16 lg:py-20 bg-[#FDF8F5]">
      <div className="px-6 mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[#C75B39] text-xs font-semibold tracking-[0.3em] uppercase">
            Client Stories
          </span>
          <h2 className="mt-2 text-2xl lg:text-3xl font-light text-[#06392F]">
            Trusted by <span className="font-semibold">Homeowners</span> & Developers
          </h2>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative bg-white rounded-2xl border border-[#06392F]/5 shadow-sm overflow-hidden"
        >
          {/* Quote icon */}
          <div className="absolute top-6 left-6 text-[#06392F]/[0.04]">
            <Quote size={48} />
          </div>

          <div className="relative p-8 lg:p-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction < 0 ? 40 : -40 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* Quote */}
                <p className="text-base lg:text-lg text-[#06392F]/70 leading-relaxed mb-8 max-w-2xl">
                  "{t.content}"
                </p>

                {/* Client */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#06392F] flex items-center justify-center text-white text-xs font-bold">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#06392F]">
                        {t.name}
                      </div>
                      <div className="text-xs text-[#06392F]/40">
                        {t.role}, {t.company}
                      </div>
                    </div>
                  </div>

                  {/* Counter */}
                  <span className="text-xs font-mono text-[#06392F]/30">
                    {String(current + 1).padStart(2, '0')} /{' '}
                    {String(testimonials.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="absolute bottom-8 right-8 lg:right-10 flex gap-2">
              <button
                onClick={prev}
                className="w-8 h-8 rounded-full border border-[#06392F]/10 flex items-center justify-center text-[#06392F]/40 hover:text-[#06392F] hover:border-[#06392F]/30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={next}
                className="w-8 h-8 rounded-full bg-[#C75B39] flex items-center justify-center text-white hover:bg-[#b54d2e] transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-[#C75B39] w-6' : 'bg-[#06392F]/10 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
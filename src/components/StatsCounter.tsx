'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

const stats: StatItem[] = [
  {
    value: 10,
    suffix: '+',
    label: 'Years',
  },
  {
    value: 127,
    suffix: '+',
    label: 'Projects',
  },
  {
    value: 100,
    suffix: '%',
    label: 'Compliance',
  },
  {
    value: 0,
    label: 'Incidents',
  },
];

const AnimatedCounter = ({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
  });

  const display = useTransform(spring, (v) => Math.floor(v));
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  useEffect(() => {
    const unsub = display.on('change', setNum);
    return () => unsub();
  }, [display]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {num}
      {suffix}
    </span>
  );
};

export default function StatsCounter() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative px-6 -mt-14 z-30">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl border border-[#06392F]/10 bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_-10px_rgba(6,57,47,0.12)] overflow-hidden"
        >
          {/* Top statement bar */}
          <div className="relative px-6 py-4 lg:px-10 border-b border-[#06392F]/5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex w-1.5 h-1.5 rounded-full bg-[#C75B39]" />
                <p className="text-xs lg:text-sm text-[#06392F]/60 font-light tracking-wide">
                  <span className="font-medium text-[#06392F]">Built on precision.</span>{' '}
                  Verified delivery since 2015.
                </p>
              </div>
              <Link href="/about">
                <motion.div
                  whileHover={{ x: 2, y: -2 }}
                  className="hidden md:flex items-center gap-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C75B39] cursor-pointer shrink-0"
                >
                  Our Story
                  <ArrowUpRight size={12} />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Four stat pills */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#06392F]/5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                className={`
                  relative group bg-white py-5 px-4 cursor-default
                  transition-colors duration-300
                  ${hovered === i ? 'bg-[#FDF8F5]' : ''}
                `}
              >
                {/* Hover top line */}
                <motion.div
                  className="absolute top-0 left-3 right-3 h-[2px] bg-[#C75B39] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hovered === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ originX: 0.5 }}
                />

                <div className="flex flex-col items-center text-center">
                  {/* Number */}
                  <div className="text-2xl lg:text-3xl font-extralight tracking-tight text-[#06392F]">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </div>

                  {/* Label */}
                  <div className="mt-1 text-[10px] tracking-[0.15em] uppercase text-[#06392F]/40 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
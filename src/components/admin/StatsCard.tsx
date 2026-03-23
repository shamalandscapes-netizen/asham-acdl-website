'use client';

import { LucideIcon, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  description: string;
  // Added variant to handle different "Alert" states
  variant?: 'default' | 'danger' | 'success';
  // Added progress to make the bottom bar meaningful
  progress?: number; 
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description,
  variant = 'default',
  progress
}: StatsCardProps) {
  
  // Dynamic Styles based on variant
  const themes = {
    default: {
      iconBg: 'bg-[#06392F]/5',
      iconText: 'text-[#06392F]',
      hoverBg: 'group-hover:bg-[#06392F]',
      bar: 'bg-[#C75B39]'
    },
    danger: {
      iconBg: 'bg-rose-50',
      iconText: 'text-rose-600',
      hoverBg: 'group-hover:bg-rose-600',
      bar: 'bg-rose-500'
    },
    success: {
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-600',
      hoverBg: 'group-hover:bg-emerald-600',
      bar: 'bg-emerald-500'
    }
  };

  const theme = themes[variant];

  return (
    <div className={`p-8 transition-all duration-500 bg-white border border-slate-100 shadow-sm rounded-[2rem] hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden`}>
      
      {/* Decorative background element for "Danger" state */}
      {variant === 'danger' && (
        <div className="absolute top-0 right-0 p-4 opacity-5 text-rose-600">
          <AlertCircle size={80} strokeWidth={1} />
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        {/* Icon Container */}
        <div className={`h-14 w-14 ${theme.iconBg} rounded-2xl flex items-center justify-center ${theme.iconText} ${theme.hoverBg} group-hover:text-white transition-all duration-500 ease-out shadow-inner`}>
          <Icon size={28} />
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${
              trend.isUp 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}
          >
            {trend.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend.value}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          {title}
        </p>
        <h3 className={`text-3xl font-black tracking-tight ${variant === 'danger' ? 'text-rose-600' : 'text-slate-900'}`}>
          {value}
        </h3>
        <p className="text-xs italic font-medium text-slate-500">
          {description}
        </p>
      </div>

      {/* Functional Progress Bar */}
      <div className="w-full h-1.5 mt-6 overflow-hidden rounded-full bg-slate-50 border border-slate-100/50">
        <div 
          className={`h-full ${theme.bar} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${progress || 100}%`, opacity: variant === 'default' ? 0.3 : 1 }} 
        />
      </div>
    </div>
  );
}

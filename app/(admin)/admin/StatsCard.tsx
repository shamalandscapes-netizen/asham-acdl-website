'use client';

import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  description: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description 
}: StatsCardProps) {
  return (
    <div className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md group">
      <div className="flex items-center justify-between mb-4">
        {/* Icon Container */}
        <div className="h-12 w-12 bg-[#06392F]/5 rounded-xl flex items-center justify-center text-[#06392F] group-hover:bg-[#06392F] group-hover:text-white transition-colors duration-300">
          <Icon size={24} />
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
              trend.isUp 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
            }`}
          >
            {trend.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend.value}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
          {title}
        </p>
        <h3 className="text-2xl font-black tracking-tight text-gray-900">
          {value}
        </h3>
        <p className="text-[11px] text-gray-500 font-medium">
          {description}
        </p>
      </div>

      {/* Decorative Progress Bar (Optional Professional Touch) */}
      <div className="w-full h-1 mt-4 overflow-hidden rounded-full bg-gray-50">
        <div 
          className="h-full bg-[#C75B39] rounded-full opacity-20" 
          style={{ width: '40%' }} 
        />
      </div>
    </div>
  );
}
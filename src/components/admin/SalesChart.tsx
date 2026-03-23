'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Loader2, ArrowUpRight } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface ChartData {
  date: string;
  revenue: number;
}

export default function SalesChart() {
  const supabase = createClient();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const thirtyDaysAgo = subDays(new Date(), 30);

        const { data: orders, error } = await supabase
          .from('orders')
          .select('created_at, total_amount')
          .eq('status', 'completed')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Generate full 30-day timeline
        const allDays = eachDayOfInterval({
          start: thirtyDaysAgo,
          end: new Date(),
        });

        const revenueMap = new Map();
        allDays.forEach(day => {
          revenueMap.set(format(day, 'MMM dd'), 0);
        });

        orders?.forEach((order: any) => {
          const dateKey = format(new Date(order.created_at), 'MMM dd');
          if (revenueMap.has(dateKey)) {
            revenueMap.set(dateKey, revenueMap.get(dateKey) + Number(order.total_amount));
          }
        });

        const chartArray = Array.from(revenueMap, ([date, revenue]) => ({
          date,
          revenue
        }));

        setData(chartArray);
        setTotalRevenue(chartArray.reduce((sum, item) => sum + item.revenue, 0));
      } catch (err) {
        console.error('Chart Sync Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesData();
  }, [supabase]);

  if (loading) return (
    <div className="h-[300px] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#06392F]" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="w-full space-y-8 duration-700 animate-in fade-in">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-[#06392F]">Revenue Flow</h2>
            <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center gap-1 shadow-lg shadow-emerald-100">
              <ArrowUpRight size={10} strokeWidth={3} /> +12.5%
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Net realized earnings • 30 Day Window</p>
        </div>
        
        <div className="md:text-right">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Gross Yield</p>
          <p className="text-4xl font-black tracking-tighter text-[#06392F] italic">
            <span className="mr-1 text-lg not-italic opacity-30">KES</span>
            {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="h-[320px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06392F" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#06392F" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f8fafc" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fontWeight: 900, fill: '#cbd5e1' }}
              interval={6} 
              dy={15}
            />
            <YAxis hide={true} domain={['dataMin', 'auto']} />
            <Tooltip 
              cursor={{ stroke: '#06392F', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#06392F] px-4 py-3 rounded-2xl shadow-2xl border border-white/10">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{payload[0].payload.date}</p>
                      <p className="text-sm italic font-black tracking-tight text-white">
                        KES {payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#06392F" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
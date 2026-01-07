'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Loader2, TrendingUp, ArrowUpRight } from 'lucide-react';

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
      // Fetching completed orders from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: orders, error } = await supabase
        .from('orders')
        .select('created_at, total_price')
        .eq('status', 'completed') // Only count realized revenue
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Chart Error:', error);
        return;
      }

      // Grouping logic: Aggregate total_price by date
      const aggregated = orders.reduce((acc: any, order: any) => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        acc[date] = (acc[date] || 0) + Number(order.total_price);
        return acc;
      }, {});

      const chartArray = Object.keys(aggregated).map(date => ({
        date,
        revenue: aggregated[date]
      }));

      setData(chartArray);
      setTotalRevenue(chartArray.reduce((sum, item) => sum + item.revenue, 0));
      setLoading(false);
    }

    fetchSalesData();
  }, []);

  if (loading) return (
    <div className="h-[400px] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-100">
      <Loader2 className="animate-spin text-[#06392F]" size={32} />
    </div>
  );

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-slate-900 text-nowrap">Revenue Performance</h2>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md flex items-center gap-1">
              <ArrowUpRight size={10} /> +12%
            </span>
          </div>
          <p className="text-xs font-medium text-slate-400">Total earnings from the last 30 days of hardware sales.</p>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monthly Gross</p>
          <p className="text-3xl font-black text-[#06392F]">KES {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06392F" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#06392F" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              hide={true} // Hide Y Axis for a cleaner "Apple-style" look
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#06392F" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#06392F]"></div>
          Realized Revenue
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-[#06392F] cursor-pointer transition-colors">7 Days</span>
          <span className="text-[#06392F] border-b-2 border-[#06392F] pb-1">30 Days</span>
          <span className="hover:text-[#06392F] cursor-pointer transition-colors">12 Months</span>
        </div>
      </div>
    </div>
  );
}
import { createClient } from '@/lib/supabase/server';
import { Mail, Download, UserCheck } from 'lucide-react';

export default async function SubscribersPage() {
  const supabase = await createClient();
  
  // ✅ Using 'as any' to bypass the missing table definition in types
  // Note: Ensure your table name is actually 'newsletter_subscribers' in Supabase
  const { data: subscribers } = await (supabase
    .from('newsletter_subscribers' as any)
    .select('*')
    .order('created_at', { ascending: false }) as any);

  return (
    <div className="space-y-8 duration-500 animate-in fade-in">
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#06392F]">
            Newsletter List
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Total Audience: {subscribers?.length || 0}
            </p>
          </div>
        </header>

        <button className="flex items-center gap-2 bg-white border border-gray-100 text-[#06392F] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Subscriber</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date Joined</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!subscribers || subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                    <Mail className="mx-auto mb-3 text-gray-200" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">No subscribers yet</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub: any) => (
                  <tr key={sub.id} className="transition-colors hover:bg-gray-50/50 group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#06392F]/5 flex items-center justify-center text-[#06392F]">
                          <UserCheck size={14} />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{sub.email}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(sub.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-[8px] font-black uppercase tracking-widest rounded-full border border-green-100">
                        {sub.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] text-center">
        Audience data is synced in real-time with Supabase
      </p>
    </div>
  );
}

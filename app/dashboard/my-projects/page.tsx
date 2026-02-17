'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';
import { Loader2, Construction, ArrowRight, Plus, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsListPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllProjects() {
      try {
        setLoading(true);
        // Using 'as any' to bypass outdated TypeScript types
        const { data, error } = await supabase
          .from('projects' as any)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProjects(data || []);
      } catch (e) {
        console.error("Project list fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAllProjects();
  }, [supabase]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Portfolio...</p>
    </div>
  );

  return (
    <div className="px-4 py-12 mx-auto space-y-12 duration-700 max-w-7xl animate-in fade-in">
      <div className="flex flex-col items-start justify-between gap-6 pb-10 border-b border-gray-100 md:flex-row md:items-end">
        <div>
          <h1 className="text-5xl font-black text-[#06392F] tracking-tighter uppercase leading-none">Project Portfolio</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-4">Real-time Construction Tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? projects.map((project) => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
            <div className="group bg-white border border-gray-100 rounded-[3rem] p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <span className="px-4 py-1.5 bg-[#06392F] text-white text-[9px] font-black rounded-full uppercase tracking-widest">
                  {project.status || 'ACTIVE'}
                </span>
                <div>
                  <h3 className="text-2xl font-black text-[#06392F] uppercase leading-[1.1] group-hover:text-[#C75B39] transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    <MapPin size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{project.city || 'KENYA'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-xs font-black text-[#06392F]">View Details</span>
                  <ArrowRight size={20} className="text-[#C75B39] group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem]">
            <p className="text-xs font-black text-gray-400 uppercase">No Projects Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  MapPin, Calendar, CheckCircle2, Clock, Camera, 
  ArrowLeft, Download, ShieldCheck, AlertCircle, Loader2, Ruler, Wallet 
} from 'lucide-react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ProjectDetailPage({ params }: { params: any }) {
  const id = params?.id;
  const reportRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      if (!id) return;
      try {
        setLoading(true);
        // We use 'as any' to bypass the outdated TypeScript definitions
        // Step 1: Fetch core project info
        const { data: projData, error: projError } = await supabase
          .from('projects' as any)
          .select('*')
          .eq('id', id)
          .single();

        if (projError) throw projError;

        // Step 2: Fetch updates separately
        const { data: updatesData } = await supabase
          .from('project_updates' as any)
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: true });

        setProject({ ...(projData as any), project_updates: updatesData || [] });
      } catch (err: any) {
        console.error("Detail fetch error:", err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectData();
  }, [id, supabase]);

  const handleExportPDF = async () => {
    if (!reportRef.current || !project) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ASHAM-REPORT-${project.name?.toUpperCase()}.pdf`);
    } catch (e) {
      console.error("PDF Export Error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2 className="animate-spin text-[#06392F]" size={48} />
      <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Syncing Site Progress...</p>
    </div>
  );

  if (errorMsg || !project) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <AlertCircle className="mb-4 text-red-500" size={48} />
      <h2 className="text-xl font-black text-[#06392F] uppercase">Site Record Not Found</h2>
      <Link href="/dashboard/projects" className="mt-4 text-[#C75B39] font-black text-xs uppercase underline tracking-widest">Return to Portfolio</Link>
    </div>
  );

  const budgetProgress = project.estimated_budget > 0 ? (project.actual_spent / project.estimated_budget) * 100 : 0;

  return (
    <div className="max-w-6xl px-4 pb-32 mx-auto space-y-8 duration-1000 animate-in fade-in">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/projects" className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#C75B39] transition-all">
          <div className="p-3 bg-white border border-gray-100 shadow-sm rounded-xl"><ArrowLeft size={14} /></div>
          BACK TO PORTFOLIO
        </Link>
        <button 
          onClick={handleExportPDF} 
          disabled={isExporting}
          className="px-6 py-3 bg-[#06392F] text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg hover:bg-black transition-all disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="inline mr-2 animate-spin" size={12} /> : <Download className="inline mr-2" size={12} />}
          {isExporting ? 'Generating...' : 'Export PDF Report'}
        </button>
      </div>

      <div ref={reportRef} className="p-2 space-y-10">
        <div className="bg-white border border-gray-100 rounded-[4rem] p-12 shadow-2xl shadow-gray-200/50 flex flex-col lg:flex-row gap-12 relative overflow-hidden">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 text-[#C75B39]">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Asham Property</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#06392F] tracking-tighter leading-[0.85]">{project.name}</h1>
            <div className="flex flex-wrap gap-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-2"><MapPin size={16} /> {project.city}, {project.address || 'KENYA'}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> STARTED {new Date(project.start_date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8 bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * Math.min(100, budgetProgress)) / 100}
                  className="text-[#C75B39]" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-[#06392F] text-xl">
                {Math.round(budgetProgress)}%
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
              <p className="text-xl font-black text-[#06392F] uppercase">{project.status}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl lg:col-span-1">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
              <Ruler size={16} className="text-[#C75B39]" /> Construction Path
            </h3>
            <div className="relative space-y-10">
              <div className="absolute left-[19px] top-2 bottom-2 w-px border-l border-dashed border-gray-200" />
              {project.project_updates.map((update: any) => (
                <div key={update.id} className="relative flex gap-6">
                  <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${update.is_completed ? 'bg-[#06392F] text-white' : 'bg-white border border-gray-100 text-gray-300'}`}>
                    {update.is_completed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <div className="pt-1">
                    <p className={`text-xs font-black uppercase ${update.is_completed ? 'text-[#06392F]' : 'text-gray-400'}`}>{update.phase_name}</p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{update.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10 lg:col-span-2">
            <div className="bg-[#06392F] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 flex flex-col justify-between gap-10 md:flex-row">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest flex items-center gap-2"><Wallet size={12} /> Total Disbursement</p>
                    <h2 className="text-5xl font-black tracking-tighter">KES {Number(project.actual_spent).toLocaleString()}</h2>
                    <p className="text-[10px] font-black uppercase opacity-40">Projected Budget: KES {Number(project.estimated_budget).toLocaleString()}</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl">
               <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                 <Camera size={18} className="text-[#C75B39]" /> Site Visuals
               </h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {project.project_updates.filter((u:any) => u.image_url).map((u:any) => (
                    <div key={u.id} className="rounded-[2.5rem] overflow-hidden aspect-[4/3] border border-gray-100 bg-gray-50">
                      <img src={u.image_url} className="object-cover w-full h-full" crossOrigin="anonymous" alt="Site Update" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
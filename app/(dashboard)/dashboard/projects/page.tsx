'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  HardHat, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Loader2, 
  Plus, 
  CheckCircle2,
  Clock
} from 'lucide-react';

// --- Interface ---
interface Project {
  id: string;
  title: string;
  location: string | null;
  status: 'planning' | 'foundation' | 'structure' | 'finishing' | 'completed';
  progress: number;
  start_date: string;
  next_milestone: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // ✅ FIX: Cast 'projects' to any to bypass TypeScript error
        // untill you regenerate your types.
        const { data, error } = await supabase
          .from('projects' as any) 
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Error fetching projects:', error.message);
        } else if (data) {
          // ✅ FIX: Safely cast the raw data to your Project type
          setProjects(data as unknown as Project[]);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Helper: Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'finishing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'structure': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'foundation': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#06392F]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#06392F]">
            <HardHat className="text-[#C75B39]" size={32} /> My Projects
          </h1>
          <p className="mt-2 text-gray-500">
            Track the progress of your ongoing construction and design sites.
          </p>
        </div>
        
        <Link 
          href="/contact" 
          className="flex items-center gap-2 px-5 py-2.5 font-bold text-white bg-[#06392F] rounded-lg hover:bg-[#0A4D40] transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Start New Project
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        // --- Empty State ---
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border-2 border-gray-200 border-dashed rounded-2xl">
          <div className="p-4 mb-4 rounded-full bg-gray-50">
            <HardHat className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No Active Projects</h3>
          <p className="max-w-md mt-2 mb-8 text-gray-500">
            You don't have any active construction projects tracked with us yet. 
            Contact us to start your next build!
          </p>
          <Link 
            href="/contact" 
            className="text-[#C75B39] font-bold hover:underline flex items-center gap-2"
          >
            Get a Quote <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        // --- Project Cards ---
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="overflow-hidden transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md group"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  {project.progress === 100 ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <Clock className="text-gray-400" size={18} />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#C75B39] transition-colors">
                  {project.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                   {project.location && (
                     <div className="flex items-center gap-1">
                       <MapPin size={14} /> {project.location}
                     </div>
                   )}
                   <div className="flex items-center gap-1">
                     <Calendar size={14} /> Started: {new Date(project.start_date).toLocaleDateString()}
                   </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="p-6 bg-gray-50">
                <div className="flex justify-between mb-2 text-sm font-bold text-gray-700">
                  <span>Completion</span>
                  <span>{project.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  {/* Note: Inline style is required here for dynamic percentage values */}
                  <div 
                    className="bg-[#06392F] h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                {project.next_milestone && (
                  <div className="flex items-start gap-2 text-sm">
                    <span className="font-bold text-gray-600 whitespace-nowrap">Next Step:</span>
                    <span className="text-gray-500">{project.next_milestone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
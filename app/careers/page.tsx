'use client';

import Link from 'next/link';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle, Mail } from 'lucide-react';

// --- STATIC JOB DATA (Edit this list to add/remove jobs) ---
const OPEN_POSITIONS = [
  {
    id: 1,
    title: 'Senior Site Engineer',
    department: 'Engineering',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    description: 'We are looking for an experienced Site Engineer to oversee construction projects, ensure safety compliance, and manage site operations.'
  },
  {
    id: 2,
    title: 'Architectural Drafter',
    department: 'Design',
    location: 'Remote / Hybrid',
    type: 'Contract',
    description: 'Create detailed technical drawings and plans. Proficiency in AutoCAD and Revit is required.'
  },
  {
    id: 3,
    title: 'Sales Representative',
    department: 'Sales',
    location: 'Thika',
    type: 'Full-time',
    description: 'Drive sales for our construction materials division. Must have a strong network in the hardware sector.'
  }
];

const BENEFITS = [
  'Competitive Salary & Bonuses',
  'Health Insurance Coverage',
  'Professional Development Training',
  'Collaborative Work Environment',
  'Career Growth Opportunities',
  'Paid Time Off'
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-[#06392F] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Build Your Future With Us</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200">
            Join a team of passionate professionals dedicated to transforming the construction landscape in Kenya.
          </p>
        </div>
      </div>

      {/* --- VALUES / BENEFITS SECTION --- */}
      <div className="max-w-6xl px-4 py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-800">Why work at Asham?</h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              At Asham Construction, we believe our people are our greatest asset. We foster a culture of innovation, integrity, and excellence. Whether you are on-site or in the office, your work directly contributes to building high-quality structures that last.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {BENEFITS.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-[#C75B39]" size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#C75B39]">
            <h3 className="mb-4 text-xl font-bold text-gray-800">How to Apply</h3>
            <p className="mb-6 text-gray-600">
              Don't see a role that fits? We are always looking for talent. Send your CV and portfolio to our HR department.
            </p>
            <a 
              href="mailto:careers@ashamconstruction.co.ke"
              className="flex items-center justify-center gap-2 w-full bg-[#06392F] text-white py-3 rounded-lg font-bold hover:bg-[#0A4D40] transition-colors"
            >
              <Mail size={20} /> Email Your CV
            </a>
          </div>
        </div>
      </div>

      {/* --- OPEN POSITIONS --- */}
      <div className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-5xl px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Current Openings</h2>
            <p className="mt-2 text-gray-500">Explore opportunities to join our team.</p>
          </div>

          <div className="space-y-4">
            {OPEN_POSITIONS.length === 0 ? (
              <div className="py-12 text-center border border-gray-300 border-dashed bg-gray-50 rounded-xl">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-600">No positions currently open</h3>
                <p className="text-gray-500">Please check back later or send us a general application.</p>
              </div>
            ) : (
              OPEN_POSITIONS.map((job) => (
                <div 
                  key={job.id} 
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-[#C75B39] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 text-xs font-bold text-blue-700 uppercase bg-blue-100 rounded">
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} /> {job.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#C75B39] transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 mb-3 text-sm text-gray-500">
                      <MapPin size={16} /> {job.location}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <a 
                    href={`mailto:careers@ashamconstruction.co.ke?subject=Application for ${job.title}`}
                    className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-[#06392F] hover:text-white transition-all"
                  >
                    Apply Now <ArrowRight size={18} />
                  </a>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

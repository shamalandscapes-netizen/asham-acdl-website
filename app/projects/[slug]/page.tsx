// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Award,
  CheckCircle2,
  ArrowRight,
  Home,
  Building2,
  HeartPulse,
  Warehouse,
  Ruler,
  HardHat,
  Clock,
  Share2,
  Printer
} from 'lucide-react';

// --- PROJECT DATABASE (same data from ProjectsPage) ---
const PROJECTS = [
  {
    id: 1,
    slug: 'moureen-residence',
    title: 'Moureen Residence',
    category: 'Residential',
    location: 'Nairobi, Kenya',
    image: '/assets/images/projects/moureen-residence.jpg',
    gallery: [
      '/assets/images/projects/moureen-residence-1.jpg',
      '/assets/images/projects/moureen-residence-2.jpg',
      '/assets/images/projects/moureen-residence-3.jpeg',
    ],
    description: 'A striking two-storey residence featuring natural stone blockwork with vibrant red and yellow trims. The design maximizes daylighting through large window openings, reducing energy consumption while enhancing indoor comfort.',
    fullDescription: 'This two-storey residential house was designed and constructed for our client Moureen, blending functionality with a bold, expressive aesthetic. The exterior features natural stone blockwork accentuated with vibrant red and yellow trims that frame the windows and structural edges, adding a unique visual identity to the home. The structure includes large window openings for maximum daylighting, enhancing indoor comfort while reducing energy use. The gable roof, combined with additional shed roof projections, adds a dynamic roofline while providing protection from weather elements. Still in the final stages of completion, this home sits beautifully within its green surroundings, offering a spacious, modern living experience tailored to the client\'s vision and family needs.',
    features: [
      'Natural stone cladding',
      'Vibrant red and yellow architectural trims',
      'Large daylight-optimized windows',
      'Gable roof with shed projections',
      'Expansive green surroundings',
      'Open-plan living areas'
    ],
    client: 'Moureen',
    year: '2019',
    status: 'Completed',
    architect: 'John M. Shamala',
    siteSupervisor: 'John M. Shamala',
    area: '320 sq m',
    duration: '12 months',
    testimonial: {
      text: "Asham brought our vision to life with incredible attention to detail. The vibrant colors and stonework make our home truly unique.",
      author: "Moureen",
      role: "Homeowner"
    }
  },
  {
    id: 2,
    slug: 'tonny-muyale-bungalow',
    title: 'Tonny Muyale Bungalow',
    category: 'Residential',
    location: 'Malava, Kakamega',
    image: '/assets/images/projects/tonny-bungalow.png',
    gallery: [
      '/assets/images/projects/tonny-bungalow-1.jpg',
      '/assets/images/projects/tonny-bungalow-2.png',
    ],
    description: 'An elegant two-bedroom bungalow with pitched terracotta roof and natural stone cladding. Features a welcoming front porch, integrated single-car garage, and mature landscaped surroundings with blooming hydrangeas.',
    fullDescription: 'This elegant two-bedroom bungalow, designed for Mr. Tonny Muyale, blends functionality with timeless architectural charm. The house features a compact yet well-planned layout, ideal for comfortable modern living. Its pitched terracotta roof adds a warm, rustic aesthetic while enhancing durability and weather resistance. The facade is finished with natural stone cladding, giving the structure a grounded and textured appeal. A centrally positioned front porch, supported by sleek red columns and framed under a bold gable with a circular window, creates a strong focal point and a welcoming entryway. The design incorporates spacious front porch with low walls for semi-privacy and comfort, integrated single-car garage providing both convenience and curb appeal, generous windows that bring in natural light and improve ventilation, and symmetrical design that ensures balance and visual harmony.',
    features: [
      'Pitched terracotta roof',
      'Natural stone cladding facade',
      'Front porch with red columns',
      'Circular gable window',
      'Integrated single-car garage',
      'Mature landscaping with hydrangeas'
    ],
    client: 'Mr. Tonny Muyale',
    year: '2024',
    status: 'In Progress',
    architect: 'John M. Shamala',
    siteSupervisor: 'Gabriel Wanjala',
    area: '185 sq m',
    duration: '8 months'
  },
  {
    id: 3,
    slug: 'flat-roof-residence',
    title: 'Modern Flat-Roof Residence',
    category: 'Residential',
    location: 'Bungoma',
    image: '/assets/images/projects/flat-roof-residence.jpg',
    gallery: [
      '/assets/images/projects/flat-roof-residence-1.jpg',
      '/assets/images/projects/flat-roof-residence-2.jpg',
    ],
    description: 'A sleek two-bedroom flat-roofed home combining minimalist elegance with smart functionality. The open-plan layout connects living, dining, and kitchen areas, with potential for rooftop terrace or solar integration.',
    fullDescription: 'A modern two-bedroom flat-roofed house combines minimalist elegance with smart functionality. Its clean horizontal lines, large windows, and simple geometric form give it a sleek, contemporary aesthetic. The open-plan layout connects the living, dining, and kitchen areas, creating a spacious and airy interior perfect for modern lifestyles. Each bedroom is well-sized, offering ample natural light and storage, with the master bedroom featuring an en-suite bathroom. The flat roof not only enhances the modern look but also provides potential for a rooftop terrace or future solar integration. This home is ideal for small families, young professionals, or anyone seeking stylish comfort in a compact and efficient design.',
    features: [
      'Minimalist flat roof design',
      'Open-plan living concept',
      'Large windows for natural light',
      'Master en-suite bathroom',
      'Rooftop terrace potential',
      'Solar integration ready'
    ],
    client: 'Private Client',
    year: '2024',
    status: 'Completed',
    architect: 'Noel Syambi',
    siteSupervisor: 'Gabriel Wanjala',
    area: '140 sq m',
    duration: '6 months'
  },
  {
    id: 4,
    slug: 'nakuru-residential-apartments',
    title: 'Nakuru Residential Apartments',
    category: 'Residential',
    location: 'Nakuru, Kenya',
    image: '/assets/images/projects/nakuru-apartments.jpg',
    gallery: [],
    description: 'A stunning residential apartment block with bold geometric volumes, full-height windows, and spacious balconies with glass balustrades. The minimalist palette of neutral tones is complemented by integrated landscaping.',
    fullDescription: 'We are excited to share this stunning residential apartment designed and delivered by Asham Design Construction Ltd for a client in Nakuru. This project showcases bold geometric volumes with clean lines, creating a strong street presence. Large full-height windows flood the interiors with natural light while maintaining a modern aesthetic. Spacious balconies with glass balustrades connect indoor living with outdoor relaxation. A minimalist palette of neutral tones paired with well-placed greenery creates a warm, welcoming environment. Integrated landscaping complements the architecture, providing privacy and aesthetic value.',
    features: [
      'Bold geometric volumes',
      'Full-height windows',
      'Glass balustrade balconies',
      'Neutral minimalist palette',
      'Integrated landscaping',
      'Strong street presence'
    ],
    client: 'Private Developer',
    year: '2024',
    status: 'Completed',
    architect: 'John M. Shamala',
    siteSupervisor: 'Jephrice Machio',
    area: '450 sq m (total)',
    duration: '14 months'
  },
  {
    id: 5,
    slug: 'modern-apartment-block',
    title: 'Modern Residential Apartment Block',
    category: 'Residential',
    location: 'Nairobi',
    image: '/assets/images/projects/apartment-block.jpg',
    gallery: [],
    description: 'A three-storey residential building with a clean contemporary façade and bold maroon structural accents. Features a striking central glass panel highlighting the entrance and common areas, with pitched roof providing weather protection.',
    fullDescription: 'This impressive building is a modern residential apartment block thoughtfully designed and built by Asham Construction Ltd. Architecturally, it features a clean, contemporary façade with a balanced arrangement of large windows that allow plenty of natural light into each unit. The building stands three storeys tall, with a striking central vertical glass panel that highlights the entrance and common areas, adding elegance and openness to the design. The pitched roof with extended eaves not only enhances the building\'s aesthetic appeal but also provides practical protection against the elements. The subtle grey exterior is accented with bold maroon structural elements, creating a refined and attractive contrast. The ground level includes spacious covered entrances supported by sturdy columns, adding to the sense of grand arrival for residents and visitors alike.',
    features: [
      'Three-storey design',
      'Maroon structural accents',
      'Central glass atrium',
      'Pitched roof with eaves',
      'Covered entrance columns',
      'Contemporary grey facade'
    ],
    client: 'Private Client',
    year: '2024',
    status: 'Completed',
    architect: 'Noel Syambi',
    siteSupervisor: 'Jephrice Machio',
    area: '680 sq m',
    duration: '16 months'
  },
  {
    id: 6,
    slug: 'five-bedroom-residence',
    title: 'Five-Bedroom Residence',
    category: 'Residential',
    location: 'Nairobi',
    image: '/assets/images/projects/five-bedroom.jpg',
    gallery: [],
    description: 'A contemporary two-storey residence with clean architectural lines and expansive glass openings. Features a rooftop leisure space with swimming pool offering panoramic views, master suite with walk-in closet and balcony.',
    fullDescription: 'This modern two-storey 4-bedroom residence is a striking blend of luxury, functionality, and contemporary design. The house features clean architectural lines, expansive glass openings, and a sleek façade that maximizes natural light and connectivity to the outdoors. On the ground floor, an open-plan living, dining, and kitchen area flows seamlessly, ideal for both family living and entertaining. The guest bedroom is tucked away for privacy, with direct access to a landscaped garden. Upstairs, the master suite offers a private retreat with a walk-in closet and balcony views, while two additional bedrooms share a well-appointed bathroom. The centerpiece of the design is a rooftop leisure space, crowned with a stylish swimming pool that offers panoramic views — perfect for relaxation, sunset gatherings, or weekend entertainment.',
    features: [
      'Rooftop swimming pool',
      'Master suite with walk-in closet',
      'Master bedroom balcony',
      'Open-plan living areas',
      'Expansive glass openings',
      'Landscaped gardens'
    ],
    client: 'Private Client',
    year: '2024',
    status: 'In Progress',
    architect: 'John M. Shamala',
    siteSupervisor: 'Gabriel Wanjala',
    area: '520 sq m',
    duration: '18 months (ongoing)'
  },
{
        id: 7,
        slug: 'malava-teachers-plaza',
        title: 'Malava Teachers Plaza',
        category: 'Commercial',
        location: 'Malava, Kakamega',
        image: '/assets/images/projects/malava-plaza.jpg',
        gallery: [],
        description: 'A contemporary mixed-use development with ground floor banking hall, first floor flexible office spaces, and second floor two-bedroom apartments. Organized parking and secure access enhance user experience.',
        fullDescription: 'Malava Teachers Plaza is a contemporary mixed-use development designed to support commercial activity, professional services, and modern residential living within the growing Malava town. The building presents a bold architectural character with clean modern lines, functional balconies, and a practical layout that enhances both usability and visual appeal. The ground floor is dedicated to a banking hall, providing a secure, highly accessible financial service hub for the surrounding community. Its strategic street-level placement ensures visibility, convenience, and efficient customer flow. The first floor is designed as flexible office space that can be partitioned to accommodate multiple professional tenants. The layout allows for customization to suit businesses such as consultancy firms, educational services, administrative offices, and small corporate setups. Large openings allow natural light, creating a productive and comfortable working environment. The second floor consists of well-planned two-bedroom apartments, offering modern and comfortable living spaces ideal for teachers, professionals, and small families.',
        features: [
        'Mixed-use development',
        'Ground floor banking hall',
        'First floor flexible offices',
        'Second floor apartments',
        'Organized parking',
        'Secure access points'
        ],
        client: 'Malava Teachers SACCO',
        year: '2024',
        status: 'Completed',
        architect: 'John M. Shamala',
        siteSupervisor: 'Jephrice Machio',
        area: '890 sq m',
        duration: '14 months'
    },
    {
    id: 10,
    slug: 'samuel-waswa-maisonette',
    title: 'Samuel Waswa Maisonette',
    category: 'Residential',
    location: 'Mlolongo, Nairobi',
    image: '/assets/images/projects/samuel-waswa.png',
    gallery: [
        '/assets/images/projects/samuel-waswa-render.png',
        '/assets/images/projects/samuel-waswa-floorplan.png',
        '/assets/images/projects/samuel-waswa-elevation.png',
        '/assets/images/projects/samuel-waswa-landscape.jpg',
        '/assets/images/projects/samuel-waswa-sections.jpg',
    ],
    description: 'A meticulously designed two-storey maisonette featuring comprehensive architectural documentation including floor plans, elevations, sections, and detailed landscape design. The project showcases integrated sustainable features with permanent ventilation, bituminous DPC, and hoop iron reinforcement.',
    fullDescription: 'This proposed maisonette for Mr. Samuel Waswa in Mlolongo, Nairobi, represents a comprehensive architectural solution with complete construction documentation. The design includes detailed floor plans, north and east elevations, sectional drawings, and integrated landscape architecture. Technical specifications include permanent ventilation (PV) above all door openings except bathroom windows, one layer of bituminous felt DPC under all walls above ground, and hoop iron reinforcement at every alternate course for walls under 200mm thickness. The landscape design incorporates a kitchen garden for productive greenery, Polyalthia longifolia for boundary screening, stone pavers for elegant hardscape, mass planting of shrubs along boundaries, forecourt planters at the entrance, and a pergola for shaded outdoor living. The extensive wall schedule documents over 30 wall elements totaling 381.01m of wall length and 569.38m² of plaster area. Door and window schedules specify 13 door types and multiple window configurations including triple windows and sliding doors. The septic tank schematics and drainage details ensure proper sanitation infrastructure.',
    features: [
        'Complete architectural drawing set (10+ sheets)',
        'Isometric and ground floor renders',
        'North and East elevations',
        'Sectional details',
        'Septic tank schematics',
        'Comprehensive wall, door & window schedules',
        'Permanent ventilation (PV) above doors',
        'Bituminous felt DPC moisture protection',
        'Hoop iron wall reinforcement',
        'Integrated kitchen garden',
        'Polyalthia longifolia boundary screening',
        'Stone paver hardscape',
        'Forecourt planters',
        'Pergola with shaded seating',
        'Mass planting of shrubs and groundcovers'
    ],
    client: 'Mr. Samuel Waswa',
    year: '2026',
    status: 'Preliminary Design',
    architect: 'John M. Shamala',
    siteSupervisor: 'Noel Syambi',
    area: 'Wall length: 381m • Plaster: 569m²',
    duration: 'Design phase - WIP Revision 01',
    testimonial: {
        text: "The level of detail in these architectural drawings is exceptional. Every aspect from foundation trenches to window schedules has been meticulously documented.",
        author: "Samuel Waswa",
        role: "Client"
    },
    technicalDetails: {
        wallSchedule: '381.01m total wall length',
        plasterArea: '569.38m²',
        doorTypes: 13,
        windowTypes: 'Multiple configurations',
        foundationDepth: '600mm minimum',
        dpcType: 'Bituminous felt',
        reinforcement: 'Hoop iron at alternate courses',
        pavingSlabs: '600×600×500mm precast concrete',
        drainage: '150mm concrete encasement',
        waterMeter: '300mm above ground level'
    },
    drawingSet: [
        'A.01.1 - Isometric Render',
        'A.01.2 - Ground Floor Render',
        'A.02.1 & A.02.2 - Floor Plans',
        'A.03.1 - Roof Plan',
        'E-01 - North Elevation',
        'E-02 - East Elevation',
        'A.03.3.1 - Section and Details',
        'A.03.3.2 - Section and Septic Tank Schematics',
        'A.04.1 - Window, Door, Wall Schedules'
    ],
    plotReference: 'S.F./2025/086',
    revision: '01 - WIP',
    date: '2/17/2026',
    architects: 'Asham Design Construction Ltd',
    office: '1st Floor Ambwere Plaza, Room 101, P.O.Box 4242 - 00200 Nairobi'
    },
  {
    id: 8,
    slug: 'siaya-maisonette',
    title: 'Siaya Maisonette',
    category: 'Residential',
    location: 'Siaya, Kenya',
    image: '/assets/images/projects/siaya-maisonette.jpg',
    gallery: [
        '/assets/images/projects/siaya-maisonette-1.jpg',
        '/assets/images/projects/siaya-maisonette-2.jpg',
        '/assets/images/projects/siaya-maisonette-3.jpg',
        '/assets/images/projects/siaya-maisonette-4.jpg',
        '/assets/images/projects/siaya-maisonette-5.jpg',
        '/assets/images/projects/siaya-maisonette-6.jpg',
        '/assets/images/projects/siaya-maisonette-7.jpg',
        '/assets/images/projects/siaya-maisonette-8.jpg',
    ],
    description: 'A modern two-bedroom maisonette with clean architectural lines and expansive glass openings. Features a rooftop leisure space with swimming pool offering panoramic views, master suite with walk-in closet and balcony.',
    fullDescription: 'This is a modern two-bedroom maisonette project designed and executed by Asham Construction Ltd. The design features clean architectural lines, expansive glass openings, and a rooftop leisure space with a swimming pool offering panoramic views. The master suite includes a walk-in closet and balcony for private relaxation.',
    features: [
      'Curved reception desk',
      'White and wood finishes',
      'Raised privacy counter',
      'Orange accent columns',
      'Recessed lighting',
      'Healthcare-specific layout'
    ],
    client: 'Mr. John Ochieng',
    year: '2025',
    status: 'In Progress',
    architect: 'Millicent Adhiambo',
    siteSupervisor: 'Gabriel Wanjala',
    area: '120 sq m',
    duration: '3 months'
  },
  {
    id: 9,
    slug: 'shipping-container-centre',
    title: 'Shipping Container Shopping Centre',
    category: 'Retail',
    location: 'Nairobi',
    image: '/assets/images/projects/container-centre.jpg',
    gallery: [
      '/assets/images/projects/container-centre-1.jpg',
      '/assets/images/projects/container-centre-2.jpg',
      '/assets/images/projects/container-centre-3.jpg',
    ],
    description: 'An innovative eco-conscious retail hub constructed from repurposed shipping containers. Two-storey design features boutiques, eateries, and open-air terraces with landscaped courtyards and shaded walkways.',
    fullDescription: 'This innovative shopping centre is a modern, eco-conscious retail hub constructed entirely from repurposed shipping containers. Spanning two storeys, the design emphasizes flexibility, sustainability, and contemporary urban style. Each container unit is carefully assembled and modified to create an interconnected system of retail spaces, eateries, and communal areas. The ground floor features a vibrant mix of boutique shops, coffee outlets, and service kiosks, while the upper floor houses additional retail units and open-air terraces perfect for cafes or lounges. External staircases and walkways connect the levels, promoting circulation and accessibility. The facade showcases the industrial character of the containers, enhanced with bold colors, glass panels, and steel railings to give a trendy, modular aesthetic.',
    features: [
      'Repurposed shipping containers',
      'Sustainable construction',
      'Open-air terraces',
      'Landscaped courtyards',
      'Shaded walkways',
      'Modular retail units'
    ],
    client: 'Private Developer',
    year: '2024',
    status: 'Completed',
    architect: 'Noel Syambi',
    siteSupervisor: 'Jephrice Machio',
    area: '450 sq m',
    duration: '9 months'
  }
];

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Residential': return <Home size={20} />;
    case 'Commercial': return <Building2 size={20} />;
    case 'Healthcare': return <HeartPulse size={20} />;
    case 'Retail': return <Warehouse size={20} />;
    default: return <Building2 size={20} />;
  }
};

// Generate metadata for SEO - UPDATED with async params
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  // Await the params
  const { slug } = await params;
  
  const project = PROJECTS.find(p => p.slug === slug);
  
  if (!project) {
    return {
      title: 'Project Not Found | Asham Design Construction',
    };
  }

  return {
    title: `${project.title} | Asham Design Construction Portfolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

// Main component - UPDATED with async params
export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Await the params
  const { slug } = await params;
  
  const project = PROJECTS.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FDF8F5]">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <Link 
              href="/projects" 
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#06392F] hover:text-[#C75B39] transition-colors"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 transition-colors rounded-full hover:bg-gray-100">
                <Share2 size={16} className="text-gray-400" />
              </button>
              <button className="p-2 transition-colors rounded-full hover:bg-gray-100">
                <Printer size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] bg-[#06392F] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06392F] via-[#06392F]/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="px-6 pb-16 mx-auto text-white max-w-7xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-[#C75B39] rounded-full text-[10px] font-black uppercase tracking-widest">
                {project.category}
              </span>
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                project.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'
              }`}>
                {project.status}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 max-w-4xl leading-[0.9]">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <MapPin size={16} /> {project.location}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> {project.year}
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} /> {project.client}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-2">
            
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-black text-[#06392F] uppercase tracking-tighter mb-6">
                Project Overview
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                {project.fullDescription}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-black text-[#06392F] uppercase tracking-tighter mb-6">
                Key Features
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl">
                    <CheckCircle2 size={18} className="text-[#C75B39] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial (if available) */}
            {project.testimonial && (
              <div className="bg-gradient-to-br from-[#06392F] to-[#1a4a3e] text-white p-10 rounded-3xl">
                <div className="text-6xl font-serif text-[#C75B39] mb-4">"</div>
                <p className="mb-6 text-xl italic">{project.testimonial.text}</p>
                <div>
                  <p className="font-black text-[#C75B39]">{project.testimonial.author}</p>
                  <p className="text-sm text-white/60">{project.testimonial.role}</p>
                </div>
              </div>
            )}

            {/* Gallery (if images available) */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-[#06392F] uppercase tracking-tighter mb-6">
                  Project Gallery
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {project.gallery.map((img, index) => (
                    <div key={index} className="relative overflow-hidden aspect-square rounded-2xl">
                      <Image
                        src={img}
                        alt={`${project.title} - ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky space-y-6 top-28">
              
              {/* Project Details Card */}
              <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#C75B39] mb-6">
                  Project Details
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Category
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-[#06392F]/5 rounded-lg">
                        {getCategoryIcon(project.category)}
                      </div>
                      <span className="font-black text-[#06392F]">{project.category}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Architect
                    </p>
                    <p className="font-black text-[#06392F]">{project.architect}</p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Site Supervisor
                    </p>
                    <p className="font-black text-[#06392F]">{project.siteSupervisor}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Area
                      </p>
                      <p className="font-black text-[#06392F] flex items-center gap-1">
                        <Ruler size={14} /> {project.area}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Duration
                      </p>
                      <p className="font-black text-[#06392F] flex items-center gap-1">
                        <Clock size={14} /> {project.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Card */}
              <div className="bg-gradient-to-br from-[#C75B39] to-[#a04022] text-white rounded-3xl p-8 shadow-xl">
                <h3 className="mb-4 text-xs font-black tracking-widest uppercase text-white/80">
                  Need Something Similar?
                </h3>
                <p className="mb-6 text-sm text-white/90">
                  Our team is ready to bring your vision to life with the same attention to detail and structural excellence.
                </p>
                <Link 
                  href="/contact"
                  className="block w-full bg-white text-[#C75B39] text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#06392F] hover:text-white transition-colors"
                >
                  Start Your Project
                </Link>
              </div>

              {/* Related Projects Suggestion */}
              <div className="p-8 bg-white border border-gray-100 rounded-3xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#C75B39] mb-4">
                  Explore More
                </h3>
                <div className="space-y-4">
                  {PROJECTS.filter(p => p.category === project.category && p.id !== project.id)
                    .slice(0, 2)
                    .map(related => (
                      <Link 
                        key={related.id}
                        href={`/projects/${related.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="relative w-16 h-16 overflow-hidden rounded-xl">
                          <Image
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                            {related.title}
                          </p>
                          <p className="text-[9px] text-gray-400">{related.location}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-[#C75B39] transition-colors" />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next/Previous Navigation */}
      <section className="border-t border-gray-200">
        <div className="px-6 py-12 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <Link 
              href={`/projects/${PROJECTS[Math.max(0, PROJECTS.findIndex(p => p.id === project.id) - 1)]?.slug || '#'}`}
              className={`group flex items-center gap-3 ${PROJECTS.findIndex(p => p.id === project.id) === 0 ? 'invisible' : ''}`}
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Previous</p>
                <p className="text-xs font-black text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                  {PROJECTS[Math.max(0, PROJECTS.findIndex(p => p.id === project.id) - 1)]?.title}
                </p>
              </div>
            </Link>

            <Link 
              href={`/projects/${PROJECTS[Math.min(PROJECTS.length - 1, PROJECTS.findIndex(p => p.id === project.id) + 1)]?.slug || '#'}`}
              className={`group flex items-center gap-3 text-right ${PROJECTS.findIndex(p => p.id === project.id) === PROJECTS.length - 1 ? 'invisible' : ''}`}
            >
              <div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Next</p>
                <p className="text-xs font-black text-[#06392F] group-hover:text-[#C75B39] transition-colors">
                  {PROJECTS[Math.min(PROJECTS.length - 1, PROJECTS.findIndex(p => p.id === project.id) + 1)]?.title}
                </p>
              </div>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
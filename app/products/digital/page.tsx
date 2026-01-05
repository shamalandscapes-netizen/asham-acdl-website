'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ArrowRight, 
  Loader2, 
  Search,
  CheckCircle
} from 'lucide-react';

interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  type: 'digital';
}

export default function DigitalProductsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function fetchDigitalProducts() {
      // Fetch only DIGITAL products based on is_digital field
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_digital', true) // Use is_digital field instead of type
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching digital products:', error);
      } else if (data) {
        // Transform database data to match DigitalProduct interface
        const digitalProducts: DigitalProduct[] = data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: Number(product.price),
          category: product.category || '',
          type: 'digital' as const,
          image_url: product.image_url || '',
        }));
        setProducts(digitalProducts);
      }
      setLoading(false);
    }

    fetchDigitalProducts();
  }, []);

  // Client-side search filter
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO SECTION */}
      <div className="bg-[#06392F] text-white py-16 px-4 relative overflow-hidden">
        {/* Background Pattern Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#C75B39]/20 text-[#C75B39] border border-[#C75B39]/30 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4">
                <Download size={14} /> Instant Access
              </div>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">Digital Architectural Library</h1>
              <p className="text-lg leading-relaxed text-gray-300">
                Browse our collection of professional building plans, structural blueprints, and design templates. Purchase and download instantly to kickstart your project.
              </p>
            </div>

            {/* Stats / Trust Badges */}
            <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
              <div className="p-4 border bg-white/10 backdrop-blur rounded-xl border-white/10">
                <div className="text-2xl font-bold">PDF/CAD</div>
                <div className="text-xs text-gray-400">High Quality Formats</div>
              </div>
              <div className="p-4 border bg-white/10 backdrop-blur rounded-xl border-white/10">
                <div className="text-2xl font-bold">Instant</div>
                <div className="text-xs text-gray-400">Secure Download</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & CONTENT */}
      <div className="relative z-20 max-w-6xl px-4 py-10 mx-auto -mt-8">
        
        {/* Search Bar */}
        <div className="flex items-center max-w-2xl gap-4 p-4 mb-10 bg-white border border-gray-100 shadow-lg rounded-xl">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search plans (e.g., '3 bedroom', 'bungalow')..." 
            className="flex-1 text-gray-700 outline-none placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#06392F] mb-4" size={32} />
            <p className="text-gray-500">Loading library...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-gray-400 bg-gray-100 rounded-full">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No plans found</h3>
            <p className="text-gray-500">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Link 
                href={`/products/digital/${product.id}`}
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#06392F] transition-all flex flex-col h-full"
              >
                {/* Thumbnail Area */}
                <div className="relative flex items-center justify-center h-56 p-6 overflow-hidden transition-colors bg-blue-50 group-hover:bg-blue-100">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="object-contain w-full h-full shadow-lg" 
                    />
                  ) : (
                    <FileText className="w-24 h-24 text-blue-200" />
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-[#06392F]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-2 px-6 py-3 font-bold text-white border border-white rounded-full">
                      View Details <ArrowRight size={16} />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                      Digital
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{product.category}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight group-hover:text-[#06392F] transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                    {product.description || "Detailed architectural plan tailored for modern construction standards."}
                  </p>

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-50">
                    <div>
                      <span className="block text-xs text-gray-400">Price</span>
                      <span className="text-lg font-bold text-[#C75B39]">
                        KES {product.price.toLocaleString()}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      title="Download this plan"
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-[#06392F] group-hover:text-white transition-colors"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER NOTE */}
      <div className="max-w-4xl px-4 pb-16 mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm text-gray-500 bg-white border border-gray-100 rounded-full shadow-sm">
          <CheckCircle size={16} className="text-green-500" />
          <span>All digital plans include secure, instant download links after payment.</span>
        </div>
      </div>

    </div>
  );
}
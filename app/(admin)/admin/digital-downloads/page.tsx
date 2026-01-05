'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';

// Types
interface DigitalProduct {
  id: string;
  name: string;
  file_path: string | null;
  category: string;
}

export default function DigitalDownloadsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const supabase = createClient();

  // 1. Fetch only DIGITAL products
  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, file_path, category')
      .eq('type', 'digital')
      .order('name');
    
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Handle File Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedProduct) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // A. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedProduct}-${Date.now()}.${fileExt}`;
      const filePath = `blueprints/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Link file to the Product in Database
      const { error: dbError } = await supabase
        .from('products')
        .update({ file_path: filePath })
        .eq('id', selectedProduct);

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'File uploaded and linked successfully!' });
      setFile(null);
      setSelectedProduct('');
      fetchProducts(); // Refresh list

    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-2 text-2xl font-bold text-gray-800">Digital Downloads Manager</h1>
      <p className="mb-8 text-gray-500">Upload blueprints and architectural drawings for your digital products.</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* --- LEFT: UPLOAD FORM --- */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl h-fit">
          <h2 className="flex items-center gap-2 mb-4 font-bold text-gray-800">
            <UploadCloud className="text-[#C75B39]" /> Upload New File
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            
            {/* Product Select */}
            <div>
              {/* ✅ FIX: Added htmlFor */}
              <label htmlFor="product-select" className="block mb-1 text-xs font-bold text-gray-500 uppercase">
                Select Product
              </label>
              <select 
                id="product-select" /* ✅ FIX: Added ID to match label */
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#C75B39] outline-none"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              >
                <option value="">-- Choose a Blueprint --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.file_path ? '(File Exists)' : '(No File)'}
                  </option>
                ))}
              </select>
            </div>

            {/* File Input */}
            <div className="p-6 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".pdf,.zip,.dwg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="file-upload" className="block cursor-pointer">
                {file ? (
                  <div className="text-[#06392F] font-bold break-all">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    {file.name}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <span className="text-sm font-medium">Click to upload PDF or ZIP</span>
                  </div>
                )}
              </label>
            </div>

            {/* Status Message */}
            {message.text && (
              <div className={`p-3 rounded text-sm flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={uploading || !file || !selectedProduct}
              className="w-full bg-[#06392F] text-white py-3 rounded-lg font-bold hover:bg-[#0A4D40] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {uploading && <Loader2 className="animate-spin" size={18} />}
              {uploading ? 'Uploading...' : 'Upload & Link File'}
            </button>
          </form>
        </div>

        {/* --- RIGHT: FILE LIST --- */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm lg:col-span-2 rounded-xl">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Current Digital Inventory</h3>
          </div>

          {loading ? (
             <div className="p-8 text-center text-gray-400">Loading products...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 bg-white border-b">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">File Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#06392F]">
                      {product.name}
                      <div className="text-xs font-normal text-gray-400">{product.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      {product.file_path ? (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full w-fit">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full w-fit">
                          <AlertCircle size={12} /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-right text-gray-400">
                      {product.file_path ? (
                        <div className="flex items-center justify-end gap-2">
                           <FileText size={14} /> {product.file_path.split('/').pop()}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
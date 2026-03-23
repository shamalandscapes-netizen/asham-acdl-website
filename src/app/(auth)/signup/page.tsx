'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/supabase/client' // Updated to your new path
import Button from '@/components/ui/Button' 
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Advanced Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Security keys do not match.')
      return
    }
    if (formData.fullName.trim().split(' ').length < 2) {
      setError('Please enter your full legal name (First & Last).')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
   
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // This data is what the 'handle_new_user' trigger reads!
          data: {
            full_name: formData.fullName,
            phone_number: formData.phone, // Match the key in your SQL trigger
            role: 'customer', 
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      setSuccess(true)
      
    } catch (err: any) {
      setError(err.message || 'Identity transmission failed.')
    } finally {
      setLoading(false)
    }
  }

  // SUCCESS STATE VIEW
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-[#FBFBFB]">
        <div className="w-full max-w-[420px] p-10 text-center bg-white border border-gray-100 shadow-2xl rounded-3xl animate-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-50">
            <CheckCircle2 className="w-10 h-10 text-[#06392F]" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-[#06392F] uppercase mb-2">Verification Sent</h1>
          <p className="mb-8 text-sm font-medium leading-relaxed text-gray-500">
            We have dispatched a secure link to <span className="font-bold text-gray-900">{formData.email}</span>. 
            Please authorize your account to access the Asham portal.
          </p>
          <Link href="/login" className="block w-full">
            <Button className="w-full py-4 bg-[#06392F] text-white rounded-xl font-black uppercase text-xs tracking-widest">
              Return to Terminal
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-[#FBFBFB]">
      <div className="w-full max-w-[450px]">
        <div className="px-4 py-10 bg-white border border-gray-100 shadow-2xl sm:rounded-3xl sm:px-10">
          
          {/* HEADER */}
          <div className="mb-8 text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-12 mb-4">
               <Image 
                  src="/assets/images/logos/Asset 2.png" 
                  alt="Asham Logo" 
                  fill 
                  className="object-contain"
                  priority
               />
            </div>
            <h2 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Account Enrollment</h2>
            <p className="mt-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
              Standard Access Protocol
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 border border-red-100 rounded-2xl bg-red-50/50 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-tight text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* FULL NAME */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute w-5 h-5 text-gray-300 -translate-y-1/2 left-4 top-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#06392F] focus:bg-white outline-none transition-all font-medium text-sm"
                  placeholder="e.g. Samuel Asham"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               {/* EMAIL */}
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute w-4 h-4 text-gray-300 -translate-y-1/2 left-3.5 top-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#06392F] outline-none transition-all text-sm"
                    placeholder="name@asham.com"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute w-4 h-4 text-gray-300 -translate-y-1/2 left-3.5 top-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#06392F] outline-none transition-all text-sm"
                    placeholder="+254..."
                  />
                </div>
              </div>
            </div>

            {/* PASSWORD PAIR */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Security Key</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#06392F] outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#06392F] outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-4 mt-4 bg-[#06392F] text-white rounded-xl shadow-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                'Transmit Enrollment'
              )}
            </Button>
          </form>

          <div className="pt-6 mt-8 border-t border-gray-50">
            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Existing identity? <Link href="/login" className="text-[#06392F] underline underline-offset-4">Authenticate</Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Asham Construction Portal • Secure Environment
        </p>
      </div>
    </div>
  )
}
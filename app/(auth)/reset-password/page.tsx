'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/supabase/client'
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Security keys do not match.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to login or dashboard after a short delay
      setTimeout(() => {
        router.push('/login?message=password-updated')
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'Failed to update security credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-[#FBFBFB]">
      <div className="w-full max-w-[420px]">
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
            <h2 className="text-xl font-black tracking-tighter text-gray-900 uppercase">New Security Key</h2>
            <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
              Override Authentication
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-4">
                {/* NEW PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute w-5 h-5 text-gray-300 -translate-y-1/2 left-4 top-1/2" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#06392F] focus:bg-white outline-none transition-all font-medium text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute w-5 h-5 text-gray-300 -translate-y-1/2 left-4 top-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#06392F] focus:bg-white outline-none transition-all font-medium text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 border border-red-50 rounded-2xl bg-red-50/50 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-tight text-red-800">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full py-4 bg-[#06392F] text-white rounded-xl shadow-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-2" 
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Identity Key'}
              </Button>
            </form>
          ) : (
            <div className="text-center animate-in fade-in zoom-in-95">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-50">
                <CheckCircle2 className="w-8 h-8 text-[#06392F]" />
              </div>
              <h2 className="mb-2 text-lg font-black tracking-tight text-gray-900 uppercase">Access Restored</h2>
              <p className="text-sm font-medium text-gray-500">
                Your credentials have been updated. <br />
                Redirecting to terminal...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
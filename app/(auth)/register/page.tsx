'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button' 
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react'

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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
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
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: 'customer', // Sets default role in metadata for the trigger to read
          },
          // Ensures the user returns to your site after clicking the confirmation email
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      // If registration is successful
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-dark/5 to-green-light/5">
        <div className="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-2xl">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-light" />
          <h1 className="mb-4 text-3xl font-bold text-green-dark">Check Your Email!</h1>
          <p className="mb-6 text-gray-600">
            We've sent a verification link to <strong>{formData.email}</strong>. 
            Please verify your account to continue.
          </p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-dark/5 to-green-light/5">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-xl">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold text-green-dark">Create Account</h1>
          <p className="mt-2 text-gray-600">Join Asham Construction</p>
        </div>

        {error && (
          <div className="flex items-center p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
            <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
            <span className="text-sm font-medium text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full py-3 pl-10 pr-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-light focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full py-3 pl-10 pr-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-light focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full py-3 pl-10 pr-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-light focus:border-transparent"
                placeholder="+254 700 000 000"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full py-3 pl-10 pr-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-light focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full py-3 pl-10 pr-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-light focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-green-light/20"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="pt-6 mt-8 border-t border-gray-100">
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold transition-colors text-green-light hover:text-green-dark">
              Sign in
            </Link>
          </p>
          
          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-800"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
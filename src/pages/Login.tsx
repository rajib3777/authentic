import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageTransition } from '@/components/layout/PageTransition'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-hot-toast'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { user, signIn } = useAuthStore()

    React.useEffect(() => {
        if (user) {
            navigate('/account')
        }
    }, [user, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Mock login logic - accepting any password for now as per user request
            // In a real app, this would be an API call
            signIn(email || 'john@example.com', 'John Doe')
            toast.success('Welcome back to Authentic')
            navigate('/account')
        } catch (error) {
            toast.error('Invalid credentials')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageTransition>
            <section className="py-32 min-h-screen flex items-center justify-center">
                <Container className="max-w-md">
                    <div className="bg-white border border-black/5 rounded-[40px] p-10 shadow-luxury">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold font-outfit mb-2 text-black">Welcome Back</h1>
                            <p className="text-black/40 italic text-sm">Enter your credentials to access your account.</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-black/40">Password</label>
                                    <Link to="/forgot-password" title="Forgot password link" className="text-[10px] uppercase font-bold tracking-widest text-black/40 hover:text-black transition-colors">Forgot password?</Link>
                                </div>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button className="w-full" size="lg" type="submit" isLoading={isLoading}>
                                Sign In
                            </Button>
                        </form>
                        <div className="mt-8 text-center text-[11px] uppercase tracking-[0.1em] font-bold text-black/40">
                            Don't have an account? <Link to="/register" className="text-brand-brown font-bold hover:underline">Register</Link>
                        </div>
                    </div>
                </Container>
            </section>
        </PageTransition>
    )
}

export default Login

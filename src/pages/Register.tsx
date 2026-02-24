import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageTransition } from '@/components/layout/PageTransition'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-hot-toast'

const Register = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
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
            // Mock register logic
            signIn(email, `${firstName} ${lastName}`)
            toast.success('Account created successfully')
            navigate('/account')
        } catch (error) {
            toast.error('Something went wrong')
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
                            <h1 className="text-3xl font-bold font-outfit mb-2 text-black">Create Account</h1>
                            <p className="text-black/40 italic text-sm">Join us to start your premium furniture journey.</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Last Name"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button className="w-full" size="lg" type="submit" isLoading={isLoading}>
                                Sign Up
                            </Button>
                        </form>
                        <div className="mt-8 text-center text-[11px] uppercase tracking-[0.1em] font-bold text-black/40">
                            Already have an account? <Link to="/login" className="text-brand-brown font-bold hover:underline">Login</Link>
                        </div>
                    </div>
                </Container>
            </section>
        </PageTransition>
    )
}

export default Register

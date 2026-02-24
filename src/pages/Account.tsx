import React, { useState } from 'react'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageTransition } from '@/components/layout/PageTransition'
import { User, Package, Settings, LogOut, ChevronRight, Clock, MapPin } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { Price } from '@/components/ui/Price'
import { useNavigate } from 'react-router-dom'

const Account = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile')
    const { user, signOut } = useAuthStore()
    const orders = useOrderStore((state) => state.orders)
    const navigate = useNavigate()

    const handleSignOut = () => {
        signOut()
        navigate('/')
    }

    if (!user) {
        navigate('/login')
        return null
    }

    return (
        <PageTransition>
            <section className="py-40 bg-brand-cream min-h-screen">
                <Container>
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-black">My Account</h1>
                        <p className="text-black/40 italic">Welcome back, {user.name}.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-2">
                            {[
                                { id: 'profile', icon: User, label: 'Profile' },
                                { id: 'orders', icon: Package, label: 'Orders' },
                                { id: 'settings', icon: Settings, label: 'Settings' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-bold uppercase tracking-widest ${activeTab === item.id
                                        ? 'bg-black text-brand-cream shadow-luxury'
                                        : 'text-black/40 hover:text-black hover:bg-black/5'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            ))}
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold uppercase tracking-widest mt-8 border border-red-100"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {activeTab === 'profile' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Card className="p-10 bg-white border border-black/5 rounded-[40px] shadow-soft">
                                            <div className="flex items-center gap-6 mb-10">
                                                <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-beige shadow-inner">
                                                    <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-black">{user.name}</h3>
                                                    <p className="text-sm text-black/40">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <div className="text-[10px] text-black/40 uppercase tracking-[0.2em] font-bold mb-1">Loyalty Status</div>
                                                    <div className="text-black font-medium flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-brand-brown animate-pulse" />
                                                        Elite Member
                                                    </div>
                                                </div>
                                                <Button variant="ghost" className="w-full mt-4 border border-black/5 rounded-2xl h-12 uppercase tracking-widest text-[10px] font-bold">Edit Profile Details</Button>
                                            </div>
                                        </Card>

                                        <Card className="p-10 bg-white border border-black/5 rounded-[40px] shadow-soft">
                                            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-black/40">Quick Insights</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-6 bg-brand-cream rounded-3xl">
                                                    <div className="text-2xl font-bold text-black mb-1">{orders.length}</div>
                                                    <div className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Total Orders</div>
                                                </div>
                                                <div className="p-6 bg-brand-cream rounded-3xl">
                                                    <div className="text-2xl font-bold text-black mb-1">৳0</div>
                                                    <div className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Rewards</div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <h3 className="text-xl font-bold text-black mb-8 px-2">Recent Purchases</h3>
                                    {orders.length === 0 ? (
                                        <Card className="p-20 text-center bg-white border border-black/5 rounded-[40px] shadow-soft">
                                            <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Clock className="text-black/20" size={32} />
                                            </div>
                                            <p className="text-black/40 italic mb-8">No order history found. Begin your journey in our catalog.</p>
                                            <Button onClick={() => navigate('/shop')} className="px-10 h-14 rounded-2xl uppercase tracking-widest font-bold">Explore Catalog</Button>
                                        </Card>
                                    ) : (
                                        <div className="space-y-6">
                                            {orders.map((order) => (
                                                <Card key={order.id} className="p-8 bg-white border border-black/5 rounded-[32px] shadow-soft hover:shadow-luxury transition-all group overflow-hidden relative">
                                                    <div className="flex flex-col md:flex-row justify-between gap-8">
                                                        <div className="flex gap-6">
                                                            <div className="flex -space-x-4">
                                                                {order.items.slice(0, 3).map((item, idx) => (
                                                                    <div key={idx} className="w-16 h-20 rounded-xl bg-brand-cream border-2 border-white overflow-hidden shadow-soft">
                                                                        <img src={item.images[0]} className="w-full h-full object-cover" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-1">Order #{order.id}</div>
                                                                <div className="text-black font-bold uppercase tracking-widest text-[12px] mb-2">
                                                                    {order.items.length} {order.items.length === 1 ? 'Piece' : 'Pieces'}
                                                                </div>
                                                                <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-black/30">
                                                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                                                    <span className="flex items-center gap-1"><MapPin size={12} /> {order.address.city}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-4">
                                                            <div className="px-4 py-1.5 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-black">
                                                                {order.status}
                                                            </div>
                                                            <Price amount={order.total} className="text-xl font-bold text-black" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronRight className="text-black/20" />
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <Card className="p-12 bg-white border border-black/5 rounded-[40px] shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <h3 className="text-xl font-bold text-black mb-8">Account Preferences</h3>
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between p-6 bg-brand-cream rounded-3xl">
                                            <div>
                                                <div className="text-sm font-bold text-black mb-1">Email Notifications</div>
                                                <div className="text-[10px] uppercase font-bold text-black/30 tracking-widest">Updates on orders & collection drops</div>
                                            </div>
                                            <div className="w-12 h-6 bg-black rounded-full relative p-1 cursor-pointer">
                                                <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-6 bg-brand-cream rounded-3xl">
                                            <div>
                                                <div className="text-sm font-bold text-black mb-1">Two-Factor Authentication</div>
                                                <div className="text-[10px] uppercase font-bold text-black/30 tracking-widest">Enhanced security for your account</div>
                                            </div>
                                            <div className="w-12 h-6 bg-black/10 rounded-full relative p-1 cursor-pointer">
                                                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </Container>
            </section>
        </PageTransition>
    )
}

export default Account

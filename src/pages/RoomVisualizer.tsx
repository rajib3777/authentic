import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload,
    RotateCcw,
    Download,
    Layers,
    Maximize2,
    Trash2,
    Sun,
    ChevronLeft
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageTransition } from '@/components/layout/PageTransition'
import { useProducts } from '@/services/api/productQueries'
import { fabric } from 'fabric'

// Inner components will be defined here or imported
import { VisualizerCanvas } from '@/features/visualizer/VisualizerCanvas'
import { VisualizerSidebar } from '@/features/visualizer/VisualizerSidebar'
import { VisualizerControls } from '@/features/visualizer/VisualizerControls'

const RoomVisualizer = () => {
    const [roomImage, setRoomImage] = useState<string | null>(null)
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
    const canvasRef = useRef<fabric.Canvas | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setRoomImage(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const exportCanvas = () => {
        if (!canvasRef.current) return
        const dataUrl = canvasRef.current.toDataURL({
            format: 'png',
            quality: 1
        })
        const link = document.createElement('a')
        link.download = 'authentic-room-design.png'
        link.href = dataUrl
        link.click()
    }

    const resetCanvas = () => {
        if (window.confirm('Reset workspace? All unsaved changes will be lost.')) {
            setRoomImage(null)
            if (canvasRef.current) {
                canvasRef.current.clear()
                canvasRef.current.backgroundColor = '#F7F3EA'
                canvasRef.current.renderAll()
            }
        }
    }

    return (
        <PageTransition>
            <section className="pt-24 lg:pt-32 pb-12 bg-brand-cream min-h-screen">
                <div className="px-6 lg:px-12">
                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 py-4 border-b border-brand-dark/5">
                        <div>
                            <h1 className="text-2xl font-outfit font-light tracking-wide text-brand-dark">Room Visualizer</h1>
                            <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">Authentic Workspace v1.0</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="gap-2 border border-brand-dark/5 px-6"
                            >
                                <Upload size={14} /> Upload Room
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetCanvas}
                                className="gap-2 border border-brand-dark/5"
                            >
                                <RotateCcw size={14} /> Reset
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={exportCanvas}
                                className="gap-2 px-8"
                            >
                                <Download size={14} /> Export
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[75vh]">
                        {/* Sidebar Left: Products */}
                        <div className="lg:col-span-3 h-full overflow-hidden">
                            <VisualizerSidebar onAdd={(product) => {
                                // Logic to add to fabric canvas
                                if (canvasRef.current) {
                                    fabric.Image.fromURL(product.images[0], (img) => {
                                        img.scale(0.3)
                                        img.set({
                                            left: 100,
                                            top: 100,
                                            cornerStyle: 'circle',
                                            cornerColor: '#4A3728',
                                            transparentCorners: false,
                                            borderColor: '#4A3728'
                                        })
                                        canvasRef.current?.add(img)
                                        canvasRef.current?.setActiveObject(img)
                                    }, { crossOrigin: 'anonymous' })
                                }
                            }} />
                        </div>

                        {/* Center: Canvas Area */}
                        <div className="lg:col-span-6 h-[50vh] lg:h-full relative bg-white/50 rounded-[32px] overflow-hidden border border-brand-dark/5 shadow-soft">
                            {!roomImage ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                                    <div className="w-20 h-20 bg-brand-dark/5 rounded-full flex items-center justify-center mb-6">
                                        <Upload size={32} className="text-brand-dark/20" />
                                    </div>
                                    <h3 className="text-xl font-outfit mb-4">Start by uploading a room photo</h3>
                                    <p className="text-sm text-brand-dark/40 max-w-xs mb-8">
                                        Choose a clear photo of your space. High-resolution images work best for realism.
                                    </p>
                                    <Button onClick={() => fileInputRef.current?.click()}>Choose File</Button>
                                </div>
                            ) : (
                                <VisualizerCanvas
                                    imageUrl={roomImage}
                                    onCanvasReady={(canvas) => {
                                        canvasRef.current = canvas
                                        canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0] || null))
                                        canvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0] || null))
                                        canvas.on('selection:cleared', () => setSelectedObject(null))
                                    }}
                                />
                            )}
                        </div>

                        {/* Sidebar Right: Controls */}
                        <div className="lg:col-span-3 h-auto lg:h-full overflow-hidden">
                            <VisualizerControls
                                selectedObject={selectedObject}
                                onUpdate={() => canvasRef.current?.renderAll()}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </PageTransition>
    )
}

export default RoomVisualizer

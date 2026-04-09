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
    
    // Magic Eraser States
    const [isDrawingMode, setIsDrawingMode] = useState(false)
    const [isProcessingErase, setIsProcessingErase] = useState(false)

    const toggleMagicEraser = async () => {
        if (!canvasRef.current || !roomImage) return;

        if (isDrawingMode) {
            // Apply Magic Eraser (Turn OFF drawing mode and process)
            setIsDrawingMode(false)
            canvasRef.current.isDrawingMode = false
            
            // Extract the paths drawn by the user to use as a mask
            const paths = canvasRef.current.getObjects('path')
            if (paths.length === 0) return; // Nothing drawn

            // Simulated AI API Processing Delay
            setIsProcessingErase(true)
            
            await new Promise(resolve => setTimeout(resolve, 3500)) // Fake 3.5s SDXL delay

            // To simulate "erased background", we apply a heavy blur localized to the drawn area mask
            // In a real backend, we'd send `roomImage` + `maskData` and receive a new background image.
            
            // Simulated AI Inpainting using Canvas Context localized blurring (Content-Aware fake)
            const canvas = canvasRef.current
            
            // Collect the paths
            const pathGroup = new fabric.Group(paths, { selectable: false, evented: false });
            
            fabric.Image.fromURL(roomImage, (bgClone) => {
                // Scale it exactly like the original background
                const scaleX = canvas.width! / bgClone.width!
                const scaleY = canvas.height! / bgClone.height!
                const scale = Math.max(scaleX, scaleY)
                
                bgClone.set({
                    scaleX: scale,
                    scaleY: scale,
                    left: canvas.width! / 2,
                    top: canvas.height! / 2,
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false,
                })
                
                // Apply a heavy blur to smudge the background colors across the furniture
                const blurFilter = new fabric.Image.filters.Blur({ blur: 0.8 });
                bgClone.filters?.push(blurFilter);
                bgClone.applyFilters();
                
                // Clip the blurred background copy to strictly the painted mask!
                bgClone.clipPath = pathGroup;
                
                // Remove the raw red drawn paths
                paths.forEach(p => canvas.remove(p));
                
                // Add the new "inpaint smudge" patch over the image
                canvas.add(bgClone);
                bgClone.sendToBack(); // but keep it above the actual background image
                canvas.renderAll();
                
                setIsProcessingErase(false);
            }, { crossOrigin: 'anonymous' })

        } else {
            // Turn ON drawing mode
            setIsDrawingMode(true)
            canvasRef.current.isDrawingMode = true
            
            // Set brush thick and red (ruby color)
            canvasRef.current.freeDrawingBrush = new fabric.PencilBrush(canvasRef.current);
            canvasRef.current.freeDrawingBrush.color = 'rgba(239, 68, 68, 0.5)' // Red overlay
            canvasRef.current.freeDrawingBrush.width = 40
        }
    }

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
                                variant={isDrawingMode ? "primary" : "ghost"}
                                size="sm"
                                onClick={toggleMagicEraser}
                                className={`gap-2 border border-brand-dark/5 px-6 ${isDrawingMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' : ''}`}
                            >
                                <Sun size={14} /> {isDrawingMode ? "Apply AI Magic Eraser" : "Magic Erase Room"}
                            </Button>
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

                    {isDrawingMode && (
                        <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                <Sun size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-indigo-900">AI Magic Eraser Active</h4>
                                <p className="text-xs text-indigo-700">Paint over any existing furniture in your room photo using your mouse. Click "Apply AI Magic Eraser" when done to reconstruct the background.</p>
                            </div>
                        </div>
                    )}

                    {isProcessingErase && (
                        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                             <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                             <h2 className="text-xl font-outfit font-bold text-brand-dark tracking-wide">Generative Fill Processing...</h2>
                             <p className="text-sm text-brand-dark/50 mt-2">Running SDXL Inpainting to reconstruct the floor and walls.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[75vh]">
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
                                            borderColor: '#4A3728',
                                            productData: product,
                                            originalUrl: product.images[0]
                                        } as any)
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

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
import { HfInference } from '@huggingface/inference'

// Inner components will be defined here or imported
import { VisualizerCanvas } from '@/features/visualizer/VisualizerCanvas'
import { VisualizerSidebar } from '@/features/visualizer/VisualizerSidebar'
import { VisualizerControls } from '@/features/visualizer/VisualizerControls'

const RoomVisualizer = () => {
    const [roomImage, setRoomImage] = useState<string | null>(null)
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
    const canvasRef = useRef<fabric.Canvas | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [isDrawingMode, setIsDrawingMode] = useState(false)
    const [isProcessingErase, setIsProcessingErase] = useState(false)
    const [brushSize] = useState(40)

    // Builds a black-and-white mask image from the red drawn paths on the canvas
    const buildMaskBase64 = async (canvas: fabric.Canvas): Promise<string> => {
        const W = canvas.width!
        const H = canvas.height!

        // Export full canvas (room image + red paths drawn by user)
        const exportedDataUrl = canvas.toDataURL({ format: 'png', multiplier: 1 })

        const offscreen = document.createElement('canvas')
        offscreen.width = W
        offscreen.height = H
        const ctx = offscreen.getContext('2d', { willReadFrequently: true })!

        await new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => { ctx.drawImage(img, 0, 0, W, H); resolve() }
            img.src = exportedDataUrl
        })

        const imgData = ctx.getImageData(0, 0, W, H)
        const d = imgData.data

        // Convert: red pixels → white (area to inpaint), all else → black (keep)
        for (let i = 0; i < W * H; i++) {
            const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2]
            const isRed = r > 160 && r - g > 55 && r - b > 55
            const v = isRed ? 255 : 0
            d[i * 4] = v; d[i * 4 + 1] = v; d[i * 4 + 2] = v; d[i * 4 + 3] = 255
        }

        ctx.putImageData(imgData, 0, 0)
        return offscreen.toDataURL('image/png').split('base64,')[1]
    }

    // Resize an image dataURL to target dimensions for HF API (512x512 or 768x768)
    const resizeImageToBase64 = (dataUrl: string, targetW: number, targetH: number): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => {
                const c = document.createElement('canvas')
                c.width = targetW; c.height = targetH
                const ctx = c.getContext('2d')!
                ctx.drawImage(img, 0, 0, targetW, targetH)
                resolve(c.toDataURL('image/png').split('base64,')[1])
            }
            img.src = dataUrl
        })
    }

    // Call HuggingFace Stable Diffusion Inpainting via Standard Fetch API (Robust)
    const applyRemoteInpainting = async (canvas: fabric.Canvas, originalRoomImage: string): Promise<string> => {
        const HF_TOKEN = (import.meta.env.VITE_HF_TOKEN as string || '').trim()

        if (!HF_TOKEN) {
            throw new Error('HuggingFace Token Missing. Please add VITE_HF_TOKEN to Vercel and Redeploy.')
        }

        const SIZE = 512

        // Build B&W mask from drawn paths
        const maskRawB64 = await buildMaskBase64(canvas)
        const maskDataUrl = `data:image/png;base64,${maskRawB64}`

        // Resize both to 512x512
        const [imageB64, maskB64] = await Promise.all([
            resizeImageToBase64(originalRoomImage, SIZE, SIZE),
            resizeImageToBase64(maskDataUrl, SIZE, SIZE),
        ])

        const toBlob = (b64: string): Blob => {
            const byteChars = atob(b64)
            const byteNums = new Array(byteChars.length)
            for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i)
            return new Blob([new Uint8Array(byteNums)], { type: 'image/png' })
        }

        const payload = {
            inputs: {
                image: toBlob(imageB64),
                mask_image: toBlob(maskB64),
            },
            parameters: {
                prompt: 'empty room interior, clean wall, hardwood floor, photorealistic, high resolution, seamless',
                negative_prompt: 'furniture, sofa, chair, person, blurry, messy, distorted',
                num_inference_steps: 30,
                guidance_scale: 7.5,
            }
        }

        // Standard fetch with multi-part or blob handling for HF API
        // For SD Inpainting, HF API usually expects a binary payload or specific JSON
        const response = await fetch(
            'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-inpainting',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    'x-wait-for-model': 'true',
                    'x-use-cache': 'false'
                },
                body: await toBlob(imageB64) // Simplest approach for free API if multi-input is tricky
            }
        )
        
        // Actually, the multi-input serverless API works better with specific JSON + base64 for inpainting
        // Let's use the most reliable JSON schema for the free Inference API
        const inpaintResponse = await fetch(
            'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-inpainting',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json',
                    'x-wait-for-model': 'true'
                },
                body: JSON.stringify({
                    inputs: {
                        image: imageB64,
                        mask_image: maskB64,
                    },
                    parameters: {
                        prompt: 'empty clean room, architectural photography, seamless',
                        num_inference_steps: 25
                    }
                })
            }
        )

        if (!inpaintResponse.ok) {
            const errorText = await inpaintResponse.text()
            throw new Error(`HF API ${inpaintResponse.status}: ${errorText}`)
        }

        const resultBlob = await inpaintResponse.blob()
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(resultBlob)
        })
    }

    const toggleMagicEraser = async () => {
        if (!canvasRef.current || !roomImage) return

        if (isDrawingMode) {
            setIsDrawingMode(false)
            canvasRef.current.isDrawingMode = false

            const paths = canvasRef.current.getObjects('path')
            if (paths.length === 0) return

            setIsProcessingErase(true)
            try {
                const inpaintedDataUrl = await applyRemoteInpainting(canvasRef.current, roomImage)

                paths.forEach(p => canvasRef.current?.remove(p))
                canvasRef.current.renderAll()
                setRoomImage(inpaintedDataUrl)
            } catch (err: any) {
                console.error('Inpainting failed:', err)
                const HF_TOKEN = (import.meta.env.VITE_HF_TOKEN as string || '').trim()
                const maskedToken = HF_TOKEN 
                    ? `${HF_TOKEN.substring(0, 5)}...${HF_TOKEN.substring(HF_TOKEN.length - 4)}` 
                    : 'NOT SET (CHECK VERCEL)'
                
                alert(`Magic Eraser Error: ${err.message}\n\nToken Detection: ${maskedToken}\nVercel Tip: Ensure VITE_HF_TOKEN is set and you have Redeployed.`)
            } finally {
                setIsProcessingErase(false)
            }
        } else {
            setIsDrawingMode(true)
            canvasRef.current.isDrawingMode = true
            canvasRef.current.freeDrawingBrush = new fabric.PencilBrush(canvasRef.current)
            canvasRef.current.freeDrawingBrush.color = 'rgba(239, 68, 68, 0.85)'
            canvasRef.current.freeDrawingBrush.width = brushSize
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

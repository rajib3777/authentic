import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Maximize2,
    RotateCw,
    Sun,
    Layers,
    Trash2,
    ChevronUp,
    ChevronDown,
    Box,
    Cloudy,
    ThermometerSun,
    Move,
    Sparkles,
    Image as ImageIcon,
    Loader2
} from 'lucide-react'
import { fabric } from 'fabric'
import { removeBackground, Config } from '@imgly/background-removal'

interface VisualizerControlsProps {
    selectedObject: fabric.Object | null
    onUpdate: () => void
}

export const VisualizerControls = ({ selectedObject, onUpdate }: VisualizerControlsProps) => {
    const [opacity, setOpacity] = useState(1)
    const [shadowBlur, setShadowBlur] = useState(0)
    const [shadowOpacity, setShadowOpacity] = useState(0.5)
    const [brightness, setBrightness] = useState(0)
    const [warmth, setWarmth] = useState(0)
    
    // Custom states for the AI and Gallery features
    const [isRemovingBg, setIsRemovingBg] = useState(false)
    const [productImages, setProductImages] = useState<string[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    
    // 3D Perspective States
    const [skewX, setSkewX] = useState(0)
    const [skewY, setSkewY] = useState(0)

    useEffect(() => {
        if (selectedObject) {
            setOpacity(selectedObject.opacity || 1)

            const currentShadow = selectedObject.shadow as fabric.Shadow
            if (currentShadow) {
                setShadowBlur(currentShadow.blur || 0)
                // We keep track of opacity locally for the slider
            } else {
                setShadowBlur(0)
            }

            // Extract custom data if any
            const data = (selectedObject as any).productData
            if (data && data.images) {
                setProductImages(data.images)
                // Determine current angle by comparing originalUrl
                const currentOriginalUrl = (selectedObject as any).originalUrl
                const idx = data.images.indexOf(currentOriginalUrl)
                setCurrentImageIndex(idx !== -1 ? idx : 0)
                
                // Set initial perspectives
                setSkewX(selectedObject.skewX || 0)
                setSkewY(selectedObject.skewY || 0)
            } else {
                setProductImages([])
            }
        } else {
            setProductImages([])
            setCurrentImageIndex(0)
            setSkewX(0)
            setSkewY(0)
        }
    }, [selectedObject])

    const updateShadow = (blur: number, op: number) => {
        if (selectedObject) {
            if (blur === 0) {
                selectedObject.set({ shadow: undefined })
            } else {
                selectedObject.set({
                    shadow: new fabric.Shadow({
                        color: `rgba(0,0,0,${op})`,
                        blur: blur,
                        offsetX: blur * 0.4,
                        offsetY: blur * 0.6,
                    })
                })
            }
            setShadowBlur(blur)
            setShadowOpacity(op)
            onUpdate()
        }
    }

    const updateFilter = (type: 'brightness' | 'warmth', val: number) => {
        if (!selectedObject || !(selectedObject instanceof fabric.Image)) return

        const img = selectedObject as fabric.Image
        img.filters = img.filters || []

        if (type === 'brightness') {
            setBrightness(val)
            const filter = new fabric.Image.filters.Brightness({ brightness: val })
            applyOrUpdateFilter(img, 'Brightness', filter)
        } else if (type === 'warmth') {
            setWarmth(val)
            // ColorMatrix for warmth (adjusting red and blue channels)
            const filter = new fabric.Image.filters.ColorMatrix({
                matrix: [
                    1 + val, 0, 0, 0, 0,
                    0, 1, 0, 0, 0,
                    0, 0, 1 - val, 0, 0,
                    0, 0, 0, 1, 0
                ] as any
            })
            applyOrUpdateFilter(img, 'ColorMatrix', filter)
        }

        img.applyFilters()
        onUpdate()
    }

    const applyOrUpdateFilter = (img: fabric.Image, name: string, filter: any) => {
        const index = img.filters!.findIndex(f => (f as any).type === name)
        if (index > -1) {
            img.filters![index] = filter
        } else {
            img.filters!.push(filter)
        }
    }

    const handleOpacityChange = (val: number) => {
        if (selectedObject) {
            selectedObject.set({ opacity: val })
            setOpacity(val)
            onUpdate()
        }
    }

    const updatePerspective = (type: 'skewX' | 'skewY', val: number) => {
        if (selectedObject) {
            if (type === 'skewX') {
                selectedObject.set({ skewX: val })
                setSkewX(val)
            } else {
                selectedObject.set({ skewY: val })
                setSkewY(val)
            }
            onUpdate()
        }
    }

    const bringForward = () => {
        if (selectedObject) {
            selectedObject.bringForward()
            onUpdate()
        }
    }

    const sendBackward = () => {
        if (selectedObject) {
            selectedObject.sendBackwards()
            onUpdate()
        }
    }

    const removeObject = () => {
        if (selectedObject && selectedObject.canvas) {
            selectedObject.canvas.remove(selectedObject)
            onUpdate()
        }
    }

    const changeAngle = (url: string, index: number) => {
        if (selectedObject && selectedObject instanceof fabric.Image) {
            const canvas = selectedObject.canvas
            if (!canvas) return

            setCurrentImageIndex(index)
            const left = selectedObject.left
            const top = selectedObject.top
            const scaleX = selectedObject.scaleX
            const scaleY = selectedObject.scaleY
            const angle = selectedObject.angle
            const shadow = selectedObject.shadow
            const currentSkewX = selectedObject.skewX || 0
            const currentSkewY = selectedObject.skewY || 0

            fabric.Image.fromURL(url, (newImg) => {
                newImg.set({
                    left,
                    top,
                    scaleX,
                    scaleY,
                    angle,
                    shadow,
                    skewX: currentSkewX,
                    skewY: currentSkewY,
                    cornerStyle: 'circle',
                    cornerColor: '#4A3728',
                    transparentCorners: false,
                    borderColor: '#4A3728',
                    productData: (selectedObject as any).productData,
                    originalUrl: url
                } as any)
                
                // Copy filters
                const oldImg = selectedObject as fabric.Image
                if (oldImg.filters && oldImg.filters.length > 0) {
                    newImg.filters = [...oldImg.filters]
                    newImg.applyFilters()
                }

                const objIndex = canvas.getObjects().indexOf(selectedObject)
                canvas.remove(selectedObject)
                canvas.insertAt(newImg, objIndex, false)
                canvas.setActiveObject(newImg)
                canvas.renderAll()
                onUpdate()
            }, { crossOrigin: 'anonymous' })
        }
    }

    const handleRemoveBackground = async () => {
        if (!selectedObject || !(selectedObject instanceof fabric.Image)) return
        
        const originalUrl = (selectedObject as any).originalUrl
        if (!originalUrl) return

        setIsRemovingBg(true)
        try {
            // High-tech AI background removal client side (optimized config to prevent freezing)
            const config: Config = {
                model: 'isnet_quint8', // Use quantized 8-bit model for much faster load and lower RAM usage, preventing browser freeze
                debug: false
            }
            
            // Note: processing can take a few seconds on first run due to WASM network fetching.
            const blob = await removeBackground(originalUrl, config)
            const url = URL.createObjectURL(blob)
            
            const canvas = selectedObject.canvas
            if (!canvas) return

            const left = selectedObject.left
            const top = selectedObject.top
            const scaleX = selectedObject.scaleX
            const scaleY = selectedObject.scaleY
            const angle = selectedObject.angle
            const shadow = selectedObject.shadow

            fabric.Image.fromURL(url, (newImg) => {
                newImg.set({
                    left,
                    top,
                    scaleX: scaleX,
                    scaleY: scaleY,
                    angle,
                    shadow,
                    cornerStyle: 'circle',
                    cornerColor: '#4A3728',
                    transparentCorners: false,
                    borderColor: '#4A3728',
                    productData: (selectedObject as any).productData,
                    originalUrl: originalUrl // keep the original URL so we know what angle we are on
                } as any)

                // Copy filters
                const oldImg = selectedObject as fabric.Image
                if (oldImg.filters && oldImg.filters.length > 0) {
                    newImg.filters = [...oldImg.filters]
                    newImg.applyFilters()
                }

                const objIndex = canvas.getObjects().indexOf(selectedObject)
                canvas.remove(selectedObject)
                canvas.insertAt(newImg, objIndex, false)
                canvas.setActiveObject(newImg)
                canvas.renderAll()
                onUpdate()
            })
        } catch (error) {
            console.error("Failed to remove background:", error)
            alert("Failed to remove background. Please try another image.")
        } finally {
            setIsRemovingBg(false)
        }
    }

    if (!selectedObject) {
        return (
            <div className="h-full bg-white rounded-[32px] border border-brand-dark/5 shadow-soft p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center mb-6">
                    <Maximize2 className="text-brand-dark/10" size={24} />
                </div>
                <p className="text-sm font-outfit text-brand-dark/30 uppercase tracking-[0.1em]">Select an object to unlock Realism Engine</p>
                <div className="mt-8 flex justify-center space-x-2">
                     <span className="h-1.5 w-1.5 rounded-full bg-brand-dark/20 animate-pulse"></span>
                     <span className="h-1.5 w-1.5 rounded-full bg-brand-dark/20 animate-pulse" style={{animationDelay: '150ms'}}></span>
                     <span className="h-1.5 w-1.5 rounded-full bg-brand-dark/20 animate-pulse" style={{animationDelay: '300ms'}}></span>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full bg-white rounded-[32px] border border-brand-dark/5 shadow-soft p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-10 flex items-center justify-between">
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-dark/40">Realism Engine v2.0</h3>
                <button onClick={removeObject} className="text-red-500 hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-10">

                {/* AI Features */}
                <div>
                    <h4 className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-violet-600 mb-4">
                        <Sparkles size={14} /> AI Processing
                    </h4>
                    <button
                        onClick={handleRemoveBackground}
                        disabled={isRemovingBg}
                        className="w-full relative overflow-hidden group bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl p-4 flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isRemovingBg ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-[11px] uppercase tracking-widest font-bold">Extracting Object...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                <span className="text-[11px] uppercase tracking-widest font-bold">Smart Background Erase</span>
                            </>
                        )}
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>
                </div>

                {/* Angles/Variants */}
                {productImages.length > 1 && (
                    <div>
                        <h4 className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-brand-dark mb-4">
                            <ImageIcon size={14} className="opacity-40" /> Switch Angles
                        </h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {productImages.map((imgUrl, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changeAngle(imgUrl, idx)}
                                    className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-brand-dark shadow-md' : 'border-transparent hover:border-brand-dark/30'}`}
                                >
                                    <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover bg-brand-cream/50" />
                                    {currentImageIndex === idx && (
                                        <div className="absolute inset-0 bg-brand-dark/5" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Shadow Engine */}
                <div>
                    <h4 className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-brand-dark mb-6">
                        <Cloudy size={14} className="opacity-40" /> Ambient Shadow
                    </h4>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-40">
                                <span>Softness</span>
                                <span>{shadowBlur}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={shadowBlur}
                                onChange={(e) => updateShadow(parseInt(e.target.value), shadowOpacity)}
                                className="w-full accent-brand-dark h-1 bg-brand-cream rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-40">
                                <span>Density</span>
                                <span>{Math.round(shadowOpacity * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={shadowOpacity}
                                onChange={(e) => updateShadow(shadowBlur, parseFloat(e.target.value))}
                                className="w-full accent-brand-dark h-1 bg-brand-cream rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Lighting Control */}
                <div>
                    <h4 className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-brand-dark mb-6">
                        <ThermometerSun size={14} className="opacity-40" /> Light Matching
                    </h4>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-40">
                                <span>Warmth</span>
                                <span>{Math.round(warmth * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="-0.5"
                                max="0.5"
                                step="0.05"
                                value={warmth}
                                onChange={(e) => updateFilter('warmth', parseFloat(e.target.value))}
                                className="w-full accent-orange-400 h-1 bg-brand-cream rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-40">
                                <span>Brightness</span>
                                <span>{Math.round(brightness * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="-0.5"
                                max="0.5"
                                step="0.05"
                                value={brightness}
                                onChange={(e) => updateFilter('brightness', parseFloat(e.target.value))}
                                className="w-full accent-brand-dark h-1 bg-brand-cream rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-brand-dark mb-6">
                        <Sun size={14} className="opacity-40" /> Opacity
                    </h4>
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={opacity}
                        onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                        className="w-full accent-brand-dark h-1 bg-brand-cream rounded-full appearance-none cursor-pointer"
                    />
                </div>

                {/* 3D Perspective Controls */}
                <div>
                    <h4 className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-brand-dark mb-6">
                        <Box size={14} className="opacity-40" /> 3D Perspective Adjust
                    </h4>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-40">
                                <span>Horizontal Skew (Side Angle)</span>
                                <span>{skewX}°</span>
                            </div>
                            <input
                                type="range"
                                min="-45"
                                max="45"
                                step="1"
                                value={skewX}
                                onChange={(e) => updatePerspective('skewX', parseFloat(e.target.value))}
                                className="w-full accent-brand-dark h-1 bg-brand-cream rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-40">
                                <span>Vertical Skew (Top/Bottom Angle)</span>
                                <span>{skewY}°</span>
                            </div>
                            <input
                                type="range"
                                min="-45"
                                max="45"
                                step="1"
                                value={skewY}
                                onChange={(e) => updatePerspective('skewY', parseFloat(e.target.value))}
                                className="w-full accent-brand-dark h-1 bg-brand-cream rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Depth & Order */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={bringForward}
                        className="flex flex-col items-center justify-center gap-3 py-6 bg-brand-cream rounded-2xl border border-black/5 hover:border-black/10 transition-all group"
                    >
                        <ChevronUp size={16} className="text-brand-dark/40 group-hover:text-black transition-colors" />
                        <span className="text-[9px] font-bold tracking-widest uppercase text-brand-dark/60">Forward</span>
                    </button>
                    <button
                        onClick={sendBackward}
                        className="flex flex-col items-center justify-center gap-3 py-6 bg-brand-cream rounded-2xl border border-black/5 hover:border-black/10 transition-all group"
                    >
                        <ChevronDown size={16} className="text-brand-dark/40 group-hover:text-black transition-colors" />
                        <span className="text-[9px] font-bold tracking-widest uppercase text-brand-dark/60">Backward</span>
                    </button>
                </div>

                <div className="pt-6 border-t border-brand-dark/5">
                    <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed opacity-20 text-center">
                        Depth Scaling is handled automatically <br />based on perspective position.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VisualizerControls

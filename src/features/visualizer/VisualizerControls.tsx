import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    Move
} from 'lucide-react'
import { fabric } from 'fabric'

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

    if (!selectedObject) {
        return (
            <div className="h-full bg-white rounded-[32px] border border-brand-dark/5 shadow-soft p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center mb-6">
                    <Maximize2 className="text-brand-dark/10" size={24} />
                </div>
                <p className="text-sm font-outfit text-brand-dark/30 uppercase tracking-[0.1em]">Select an object to unlock Realism Engine</p>
            </div>
        )
    }

    return (
        <div className="h-full bg-white rounded-[32px] border border-brand-dark/5 shadow-soft p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-10 flex items-center justify-between">
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-dark/40">Realism Engine v1.0</h3>
                <button onClick={removeObject} className="text-red-500 hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-10">
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

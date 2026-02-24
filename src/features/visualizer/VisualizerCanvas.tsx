import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

interface VisualizerCanvasProps {
    imageUrl: string
    onCanvasReady: (canvas: fabric.Canvas) => void
}

export const VisualizerCanvas = ({ imageUrl, onCanvasReady }: VisualizerCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null)

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return

        const { clientWidth, clientHeight } = containerRef.current

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: clientWidth,
            height: clientHeight,
            backgroundColor: '#F7F3EA',
            preserveObjectStacking: true,
        })

        fabricCanvasRef.current = canvas
        onCanvasReady(canvas)

        // Load Background Image
        fabric.Image.fromURL(imageUrl, (img) => {
            const scaleX = canvas.width! / img.width!
            const scaleY = canvas.height! / img.height!
            const scale = Math.max(scaleX, scaleY)

            img.set({
                scaleX: scale,
                scaleY: scale,
                left: canvas.width! / 2,
                top: canvas.height! / 2,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
            })

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
        }, { crossOrigin: 'anonymous' })

        // Smart Scaling Logic: Simulating 3D Depth
        canvas.on('object:moving', (e) => {
            const obj = e.target
            if (!obj || obj.type === 'line' || (obj as any).isBackground) return

            // Calculate scale based on Y position
            // Higher up = Farther away = Smaller
            // Lower down = Closer = Larger
            const canvasHeight = canvas.height || 600
            const baseYScale = (obj as any).baseScale || 0.4

            // Normalize Y position (0 at top, 1 at bottom)
            const normalizedY = obj.top! / canvasHeight

            // Perspective factor: 0.7 at top, 1.3 at bottom
            const perspectiveFactor = 0.7 + (normalizedY * 0.6)

            obj.scale(baseYScale * perspectiveFactor)
        })

        // When an object is added, we set its base scale
        canvas.on('object:added', (e) => {
            const obj = e.target
            if (obj && !(obj as any).baseScale) {
                (obj as any).baseScale = obj.scaleX
            }
        })

        // Update baseScale when manually scaled so perspective logic stays consistent
        canvas.on('object:scaled', (e) => {
            const obj = e.target
            if (obj && (obj as any).baseScale) {
                // We need to reverse the perspective factor to get the 'raw' base scale
                const canvasHeight = canvas.height || 600
                const normalizedY = obj.top! / canvasHeight
                const perspectiveFactor = 0.7 + (normalizedY * 0.6);
                (obj as any).baseScale = obj.scaleX! / perspectiveFactor;
            }
        })

        const handleResize = () => {
            if (!containerRef.current || !fabricCanvasRef.current) return
            const { clientWidth, clientHeight } = containerRef.current
            fabricCanvasRef.current.setDimensions({
                width: clientWidth,
                height: clientHeight
            })
            fabricCanvasRef.current.renderAll()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            canvas.dispose()
        }
    }, [imageUrl])

    return (
        <div ref={containerRef} className="w-full h-full relative cursor-crosshair">
            <canvas ref={canvasRef} />
        </div>
    )
}

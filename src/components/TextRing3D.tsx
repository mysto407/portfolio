"use client"

import { useEffect, useRef } from "react"

interface TextRing3DProps {
  text: string
  className?: string
}

export function TextRing3D({ text, className = "" }: TextRing3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Duplicate text to fill the full ring
  const fullText = `${text}  •  ${text}  •  `
  const characters = fullText.split("")

  // Rotation animation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rotation = 0
    let animationId: number

    const animate = () => {
      rotation -= 0.3
      container.style.transform = `rotateX(-15deg) rotateY(${rotation}deg)`
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  const radius = 280
  const anglePerChar = 360 / characters.length

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="relative"
        style={{
          perspective: "1000px",
          perspectiveOrigin: "center center",
        }}
      >
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: `${radius * 2}px`,
            height: "60px",
            transformStyle: "preserve-3d",
          }}
        >
          {characters.map((char, i) => {
            const angle = i * anglePerChar

            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 text-4xl sm:text-5xl md:text-6xl font-bold font-mono"
                style={{
                  transform: `
                    translateX(-50%)
                    translateY(-50%)
                    rotateY(${angle}deg)
                    translateZ(${radius}px)
                  `,
                  transformStyle: "preserve-3d",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

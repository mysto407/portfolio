"use client"

import { useMemo } from "react"

interface TextRing3DProps {
  text: string
  className?: string
  radius?: number
  repeat?: number
}

export function TextRing3D({ 
  text, 
  className = "", 
  radius = 280, 
  repeat = 2 
}: TextRing3DProps) {
  
  // 1. Memoization: Only recalculate logic if text changes
  const { characters, anglePerChar, fullTextString } = useMemo(() => {
    const chunk = `${text}  •  `
    const fullString = chunk.repeat(repeat)
    const chars = fullString.split("")
    
    return {
      characters: chars,
      anglePerChar: 360 / chars.length,
      fullTextString: fullString
    }
  }, [text, repeat])

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      // 2. Accessibility: Label the whole element, hide the split spans
      aria-label={fullTextString}
    >
      <style>{`
        @keyframes rotateRing {
          from { transform: rotateX(-15deg) rotateY(0deg); }
          to { transform: rotateX(-15deg) rotateY(-360deg); }
        }
        .text-ring-3d {
          animation: rotateRing 20s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .text-ring-3d { animation: none; transform: rotateX(-15deg) rotateY(0deg); }
        }
      `}</style>
      
      <div
        className="relative"
        style={{
          perspective: "300px", // Kept at 300px per your request
          perspectiveOrigin: "center center",
        }}
      >
        <div
          className="relative text-ring-3d will-change-transform"
          style={{
            width: `${radius * 2}px`,
            height: "60px",
            transformStyle: "preserve-3d",
          }}
          aria-hidden="true" 
        >
          {characters.map((char, i) => {
            const angle = i * anglePerChar

            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 text-4xl sm:text-5xl md:text-6xl font-bold font-mono backface-hidden"
                style={{
                  transform: `
                    translateX(-50%)
                    translateY(-50%)
                    rotateY(${angle}deg)
                    translateZ(${radius}px)
                  `,
                  transformStyle: "preserve-3d",
                  whiteSpace: "nowrap" 
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
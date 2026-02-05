"use client"

interface TextRing3DProps {
  text: string
  className?: string
}

export function TextRing3D({ text, className = "" }: TextRing3DProps) {
  // Duplicate text to fill the full ring
  const fullText = `${text}  •  ${text}  •  `
  const characters = fullText.split("")

  const radius = 280
  const anglePerChar = 360 / characters.length

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes rotateRing {
          from { transform: rotateX(-15deg) rotateY(0deg); }
          to { transform: rotateX(-15deg) rotateY(-360deg); }
        }
        .text-ring-3d {
          animation: rotateRing 20s linear infinite;
        }
      `}</style>
      <div
        className="relative"
        style={{
          perspective: "330px",
          perspectiveOrigin: "center center",
        }}
      >
        <div
          className="relative text-ring-3d"
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

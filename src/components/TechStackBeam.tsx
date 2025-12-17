"use client"

import { useRef, useEffect, useState } from "react"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiNextdotjs,
  SiVite,
  SiPostgresql,
  SiMongodb,
  SiGit,
  SiFigma,
  SiDocker,
  SiVercel,
} from "react-icons/si"

const techStack = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Vite", icon: SiVite },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Git", icon: SiGit },
  { name: "Figma", icon: SiFigma },
  { name: "Docker", icon: SiDocker },
  { name: "Vercel", icon: SiVercel },
]

export function TechStackBeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [rotation, setRotation] = useState(0)

  // Create stable refs for each tech icon
  const ref0 = useRef<HTMLDivElement>(null)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const ref4 = useRef<HTMLDivElement>(null)
  const ref5 = useRef<HTMLDivElement>(null)
  const ref6 = useRef<HTMLDivElement>(null)
  const ref7 = useRef<HTMLDivElement>(null)
  const ref8 = useRef<HTMLDivElement>(null)
  const ref9 = useRef<HTMLDivElement>(null)
  const ref10 = useRef<HTMLDivElement>(null)
  const ref11 = useRef<HTMLDivElement>(null)

  const techRefs = [ref0, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.15) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const radius = 180

  return (
    <div
      className="relative flex h-[500px] w-full items-center justify-center rounded-lg p-10"
      ref={containerRef}
    >
      {/* Center Avatar */}
      <div
        ref={centerRef}
        className="absolute z-20 flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-background shadow-lg"
      >
        <img
          src="https://api.dicebear.com/9.x/lorelei/svg?seed=Christopher&beard[]&beardProbability=0&earrings[]&earringsColor[]&earringsProbability=0&eyebrows[]&frecklesProbability=100&glassesProbability=100&hair=variant07,variant11,variant12,variant43,variant06&hairAccessoriesColor[]&hairAccessoriesProbability=0"
          alt="Avatar"
          className="h-16 w-16 rounded-full"
        />
      </div>

      {/* Tech Icons arranged in a rotating circle */}
      {techStack.map((tech, index) => {
        const baseAngle = (index * 360) / techStack.length - 90
        const angle = baseAngle + rotation
        const x = Math.cos((angle * Math.PI) / 180) * radius
        const y = Math.sin((angle * Math.PI) / 180) * radius

        return (
          <div
            key={tech.name}
            ref={techRefs[index]}
            className="absolute z-10 flex flex-col items-center gap-1 hover:scale-110 transition-transform cursor-pointer"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <div className="z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-white dark:bg-neutral-900 p-2 shadow-md">
              <tech.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{tech.name}</span>
          </div>
        )
      })}

      {/* Animated Beams - only render after mount */}
      {mounted && techStack.map((tech, index) => (
        <AnimatedBeam
          key={`beam-${tech.name}`}
          containerRef={containerRef}
          fromRef={techRefs[index]}
          toRef={centerRef}
          curvature={0}
          pathColor="hsl(var(--muted-foreground))"
          pathOpacity={0.15}
          gradientStartColor="#ffaa40"
          gradientStopColor="#9c40ff"
          duration={4 + index * 0.3}
          delay={index * 0.1}
          updateInterval={50}
        />
      ))}
    </div>
  )
}

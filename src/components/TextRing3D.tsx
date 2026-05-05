import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

interface TextRing3DProps {
  lines: string[]
  className?: string
  fontSize?: number
  radius?: number
  lineSpacing?: number
}

function RingLine({
  text,
  radius,
  yOffset,
  angleOffset,
  fontSize,
}: {
  text: string
  radius: number
  yOffset: number
  angleOffset: number
  fontSize: number
}) {
  const fullText = `${text}  \u2022  ${text}  \u2022  `
  const characters = fullText.split("")
  const anglePerChar = (Math.PI * 2) / characters.length

  return (
    <group position={[0, yOffset, 0]}>
      {characters.map((char, i) => {
        const angle = i * anglePerChar + angleOffset
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        return (
          <Text
            key={i}
            position={[x, 0, z]}
            rotation={[0, Math.PI + angle, 0]}
            fontSize={fontSize}
            font="/fonts/Inter-Bold.woff"
            anchorX="center"
            anchorY="middle"
          >
            {char === " " ? "\u00A0" : char}
            <meshBasicMaterial
              side={THREE.FrontSide}
              color="black"
              transparent
              opacity={0.9}
            />
          </Text>
        )
      })}
    </group>
  )
}

function SpinningRing({
  lines,
  radius,
  lineSpacing,
  fontSize,
}: {
  lines: string[]
  radius: number
  lineSpacing: number
  fontSize: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  const totalHeight = lineSpacing * (lines.length - 1)

  return (
    <group ref={groupRef} rotation={[0.35, 0, 0]}>
      {lines.map((line, i) => {
        const yOffset = i * lineSpacing - totalHeight / 2
        const angleOffset = 0

        return (
          <RingLine
            key={i}
            text={line}
            radius={radius}
            yOffset={yOffset}
            angleOffset={angleOffset}
            fontSize={fontSize}
          />
        )
      })}
    </group>
  )
}

export function TextRing3D({
  lines,
  className = "",
  fontSize = 0.4,
  radius = 6,
  lineSpacing = 0.55,
}: TextRing3DProps) {
  return (
    <div className={className} style={{ minHeight: "200px" }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <SpinningRing
          lines={lines}
          radius={radius}
          lineSpacing={lineSpacing}
          fontSize={fontSize}
        />
      </Canvas>
    </div>
  )
}

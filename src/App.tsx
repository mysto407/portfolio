import { useState, useEffect, useLayoutEffect, useRef, useCallback, lazy, Suspense } from "react"
import { animate, createTimeline } from 'animejs'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Send, MessageSquare, Palette, Code, Rocket } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { projects } from "./data/projects"
import { GlassFrame, GlassCard } from "@/components/GlassFrame"
import { VibratingBorder } from "@/components/VibratingBorder"

const TechStackBeam = lazy(() =>
  import("@/components/TechStackBeam").then(m => ({ default: m.TechStackBeam }))
)

// Padding that positions content safely inside the glass frame
// Frame: top 8vh, sides 5%, bottom 8vh — we add ~2vh/2% inner breathing room
const FRAME = "pt-[11vh] pb-[10vh] px-[7%]"

const PROJECT_IDS = projects.map((_, i) => `project-${i}`)

const SECTION_TITLES: Record<string, string> = {
  hero: "Full-Stack Dev.",
  about: "About.",
  ...Object.fromEntries(PROJECT_IDS.map(id => [id, "Selected Work."])),
  process: "Process.",
  faq: "FAQ.",
  contact: "Contact.",
}

const NAV_ITEMS = [
  { id: 'about', label: 'About.' },
  ...projects.map((p, i) => ({ id: `project-${i}`, label: p.title })),
  { id: 'process', label: 'Process.' },
  { id: 'faq', label: 'FAQ.' },
  { id: 'contact', label: 'Contact.' },
]

const BULGE_RADIUS = 100
const BULGE_MAX_SCALE = 1.55

function BulgeNav({ activeSection, onNav }: { activeSection: string | null; onNav: (id: string) => void }) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    itemRefs.current.forEach(btn => {
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const dist = Math.abs(e.clientX - cx)
      const t = Math.max(0, 1 - dist / BULGE_RADIUS)
      btn.style.transform = `scale(${1 + (BULGE_MAX_SCALE - 1) * t * t})`
    })
  }, [])

  const handleLeave = useCallback(() => {
    itemRefs.current.forEach(btn => { if (btn) btn.style.transform = 'scale(1)' })
  }, [])

  return (
    <div className="flex items-center gap-6" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {NAV_ITEMS.map(({ id, label }, i) => (
        <button
          key={id}
          ref={el => { itemRefs.current[i] = el }}
          onClick={() => onNav(id)}
          className={`text-xs whitespace-nowrap ${activeSection === id ? 'opacity-100 font-semibold' : 'opacity-50 hover:opacity-100'}`}
          style={{ transformOrigin: 'center bottom', transition: 'transform 0.12s ease' }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}


function SmoothWidth({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const isFirst = useRef(true)

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return
    const to = innerRef.current.scrollWidth
    if (isFirst.current) {
      outerRef.current.style.width = to + 'px'
      isFirst.current = false
      return
    }
    const anim = animate(outerRef.current, {
      width: [outerRef.current.offsetWidth, to],
      duration: 400,
      easing: 'easeInOutQuad',
    })
    return () => { anim.cancel() }
  }, [children])

  return (
    <span ref={outerRef} style={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden' }}>
      <span ref={innerRef} style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', width: 'max-content' }}>
        {children}
      </span>
    </span>
  )
}


const IFRAME_MOBILE_WIDTH = 390
const IFRAME_DESKTOP_WIDTH = 1280

function ProjectPreview({ url, title }: { url: string; title: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [iframeHeight, setIframeHeight] = useState(900)
  const [iframeWidth, setIframeWidth] = useState(IFRAME_DESKTOP_WIDTH)

  const measure = useCallback(() => {
    const el = wrapperRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const targetWidth = window.innerWidth >= 768 ? IFRAME_DESKTOP_WIDTH : IFRAME_MOBILE_WIDTH
    setIframeWidth(targetWidth)
    const s = width / targetWidth
    setScale(s)
    setIframeHeight(height / s)
  }, [])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (wrapperRef.current) observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div ref={wrapperRef} className="w-full h-full overflow-hidden bg-white">
      <iframe
        src={url}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{
          width: iframeWidth,
          height: iframeHeight,
          border: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  )
}

function PillIndicator({ projectTitle }: { projectTitle: string | null }) {
  const badgeWrapRef = useRef<HTMLSpanElement>(null)
  const badgeRef    = useRef<HTMLSpanElement>(null)
  const dotsWrapRef = useRef<HTMLDivElement>(null)
  const dotsRef     = useRef<HTMLDivElement>(null)
  const dot1Ref     = useRef<HTMLSpanElement>(null)
  const dot2Ref     = useRef<HTMLSpanElement>(null)
  const didMount    = useRef(false)
  const initTitle   = useRef(projectTitle)
  const prevTitle   = useRef(projectTitle)
  const active      = useRef<Array<{ cancel(): void }>>([])

  const cancelAll = () => { active.current.forEach(a => a.cancel()); active.current = [] }

  const startDots = () => {
    const dc = dotsRef.current, d1 = dot1Ref.current, d2 = dot2Ref.current
    if (!dc || !d1 || !d2) return
    active.current.push(
      animate(dc, { rotate: 360, duration: 2400, easing: 'linear', loop: true }),
      animate(d1, { scale: [1, 1.6], duration: 500, easing: 'easeInOutSine', loop: true, alternate: true }),
      animate(d2, { scale: [1, 1.6], duration: 500, easing: 'easeInOutSine', loop: true, alternate: true, delay: 500 }),
    )
  }

  // Set correct initial state before first paint — no animation flash
  useLayoutEffect(() => {
    const bw = badgeWrapRef.current, bi = badgeRef.current
    const dw = dotsWrapRef.current, d1 = dot1Ref.current, d2 = dot2Ref.current
    if (!bw || !bi || !dw) return
    bw.style.overflow = 'hidden'
    if (initTitle.current) {
      bw.style.width = bi.scrollWidth + 'px'
      dw.style.width = '0px'
      if (d1) d1.style.opacity = '0'
      if (d2) d2.style.opacity = '0'
    } else {
      bw.style.width = '0px'
      dw.style.width = '20px'
    }
  }, [])

  // Start dots on mount — only if we didn't open on a project section
  useEffect(() => {
    if (!initTitle.current) startDots()
    return cancelAll
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Badge shine — restarts for each new project
  useEffect(() => {
    const bi = badgeRef.current
    if (!projectTitle || !bi) return
    const state = { pos: 200 }
    const shine = animate(state, {
      pos: -200, duration: 2500, easing: 'linear', loop: true,
      onUpdate: () => { if (bi) bi.style.backgroundPosition = `${state.pos}% center` },
    })
    return () => { shine.cancel() }
  }, [projectTitle])

  // Morph: circles combine → pill, or pill separates → circles
  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return }
    const bw = badgeWrapRef.current, bi = badgeRef.current
    const dw = dotsWrapRef.current, d1 = dot1Ref.current, d2 = dot2Ref.current
    if (!bw || !bi || !dw || !d1 || !d2) return

    const prev = prevTitle.current
    prevTitle.current = projectTitle

    cancelAll()

    // Project → project: just tween the badge width, no combine/separate needed
    if (prev && projectTitle) {
      active.current.push(
        animate(bw, { width: [bw.offsetWidth, bi.scrollWidth], duration: 400, easing: 'easeInOutQuad' })
      )
      return cancelAll
    }

    if (projectTitle) {
      // 1. Circles converge toward center and shrink (easeInBack gives a slight pull-back before collapsing)
      active.current.push(
        animate(d1, { translateY: 4,  scale: 0, opacity: 0, duration: 240, easing: 'easeInBack' }),
        animate(d2, { translateY: -4, scale: 0, opacity: 0, duration: 240, easing: 'easeInBack' }),
        animate(dw, { width: 0, duration: 260, easing: 'easeInQuad' }),
      )
      // 2. Orange pill expands from where the dots were
      const t = window.setTimeout(() => {
        active.current.push(animate(bw, { width: [0, bi.scrollWidth], duration: 380, easing: 'easeOutExpo' }))
      }, 160)
      return () => { window.clearTimeout(t); cancelAll() }
    } else {
      // 1. Pill collapses, then dots wrapper opens, then circles pop out
      const tl = createTimeline({ onComplete: startDots })
      tl.add(bw, { width: [bw.offsetWidth, 0], duration: 300, easing: 'easeInExpo' })
        .add(dw, { width: [0, 20], duration: 200, easing: 'easeOutQuad' })
        .add(d1, { translateY: 0, scale: 1, opacity: 1, duration: 320, easing: 'easeOutBack' })
        .add(d2, { translateY: 0, scale: 1, opacity: 1, duration: 320, easing: 'easeOutBack' }, '<')
      active.current.push(tl)
      return cancelAll
    }
  }, [projectTitle]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <span ref={badgeWrapRef} style={{ display: 'inline-flex', overflow: 'hidden' }}>
        <span
          ref={badgeRef}
          className="hidden md:inline-flex items-center px-2.5 pt-0.5 pb-1 rounded-full text-[10px] text-white whitespace-nowrap"
          style={{
            background: 'linear-gradient(90deg, #c2410c, #f97316, #fdba74, #f97316, #c2410c)',
            backgroundSize: '200% auto',
            backgroundPosition: '200% center',
          }}
        >
          {projectTitle}
        </span>
      </span>
      <div ref={dotsWrapRef} className="hidden md:flex">
        <div ref={dotsRef} className="relative w-5 h-5 shrink-0 flex">
          <span ref={dot1Ref} className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400" />
          <span ref={dot2Ref} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-400" />
        </div>
      </div>
    </>
  )
}

function App() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" })
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [pemaOpen, setPemaOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pemaRef = useRef<HTMLDivElement>(null)
  const pemaExpandRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const menu = menuRef.current
    if (menu) {
      menu.style.opacity = '0'
      menu.style.pointerEvents = 'none'
      menu.style.transform = 'translateY(8px) scale(0.96)'
    }
    const pema = pemaRef.current
    if (pema) {
      pema.style.opacity = '0'
      pema.style.pointerEvents = 'none'
      pema.style.transform = 'translateY(-6px) scale(0.97)'
    }
    const pemaExpand = pemaExpandRef.current
    if (pemaExpand) {
      pemaExpand.style.width = '0'
      pemaExpand.style.opacity = '0'
    }
  }, [])

  useEffect(() => {
    const el = menuRef.current
    if (!el) return
    if (menuOpen) {
      el.style.pointerEvents = 'auto'
      const anim = animate(el, { opacity: [0, 1], translateY: [8, 0], scale: [0.96, 1], duration: 200, easing: 'easeOutQuad' })
      return () => { anim.cancel() }
    } else {
      el.style.pointerEvents = 'none'
      const anim = animate(el, { opacity: [1, 0], translateY: [0, 8], scale: [1, 0.96], duration: 200, easing: 'easeInQuad' })
      return () => { anim.cancel() }
    }
  }, [menuOpen])

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768
    if (isDesktop) {
      const el = pemaExpandRef.current
      if (!el) return
      if (pemaOpen) {
        const target = el.scrollWidth
        const anim = animate(el, { width: [0, target], opacity: [0, 1], duration: 300, easing: 'easeOutExpo' })
        return () => { anim.cancel() }
      } else {
        const anim = animate(el, { width: [el.offsetWidth, 0], opacity: [1, 0], duration: 200, easing: 'easeInQuad' })
        return () => { anim.cancel() }
      }
    } else {
      const el = pemaRef.current
      if (!el) return
      if (pemaOpen) {
        el.style.pointerEvents = 'auto'
        const anim = animate(el, { opacity: [0, 1], translateY: [-6, 0], scale: [0.97, 1], duration: 200, easing: 'easeOutQuad' })
        return () => { anim.cancel() }
      } else {
        el.style.pointerEvents = 'none'
        const anim = animate(el, { opacity: [1, 0], translateY: [0, -6], scale: [1, 0.97], duration: 200, easing: 'easeInQuad' })
        return () => { anim.cancel() }
      }
    }
  }, [pemaOpen])

  useEffect(() => {
    const ids = ["hero", ...Object.keys(SECTION_TITLES)]
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.4 }
    )

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("loading")
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      if (!response.ok) throw new Error("Failed to send")
      setFormStatus("success")
      setFormState({ name: "", email: "", message: "" })
    } catch {
      setFormStatus("error")
    }
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  return (
    <div className="relative h-screen w-full">
      <GlassFrame />
      <VibratingBorder />

      {/* Section title */}
      {(() => {
        const projectIndex = activeSection ? PROJECT_IDS.indexOf(activeSection) : -1
        const sectionLabel = activeSection ? (SECTION_TITLES[activeSection] ?? '') : ''
        const projectTitle = projectIndex !== -1 ? (projects[projectIndex].pill ?? projects[projectIndex].title) : null
        return (
          <div
            className="fixed top-[calc(8vh-42px)] right-[5%] z-50 transition-opacity duration-300"
            style={{ opacity: sectionLabel ? 1 : 0, pointerEvents: 'none' }}
          >
            <GlassCard style={{ borderRadius: '999px 999px 0 999px', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', minHeight: '36px' }}>
              <SmoothWidth>
                <span className="font-syncopate text-sm tracking-tight">
                  <span className="md:hidden">{projectTitle ?? sectionLabel}</span>
                  <span className="hidden md:inline">{sectionLabel}</span>
                </span>
              </SmoothWidth>
              <PillIndicator projectTitle={projectTitle} />
            </GlassCard>
          </div>
        )
      })()}

      {/* Get a Quote */}
      <div className="fixed bottom-[calc(8vh-44px)] right-[5%] z-50">
        <GlassCard style={{ borderRadius: '999px 0 999px 999px', padding: '8px 24px' }}>
          <button
            onClick={() => scrollToSection("contact")}
            className="font-syncopate text-sm tracking-tight whitespace-nowrap"
          >
            Get a Quote →
          </button>
        </GlassCard>
      </div>

      {/* Bottom-left nav — desktop */}
      <div className="hidden md:block fixed bottom-[calc(8vh-36px)] left-[5%] z-50">
        <GlassCard style={{ borderRadius: '0 999px 999px 999px', padding: '8px 24px' }}>
          <BulgeNav activeSection={activeSection} onNav={scrollToSection} />
        </GlassCard>
      </div>

      {/* Bottom-left nav — mobile */}
      <div className="md:hidden fixed bottom-[calc(8vh-44px)] left-[5%] z-50">
        {/* Expanded menu — absolute so it doesn't shift the button */}
        <div
          ref={menuRef}
          className="absolute bottom-full left-0 mb-2"
          style={{ transformOrigin: 'bottom left' }}
        >
          <div style={{ borderRadius: '0 999px 999px 0', padding: '14px 22px', background: '#000' }}>
            <div className="flex flex-col gap-4">
              {NAV_ITEMS.map(({ id, label }) => {
                const isActive = activeSection === id
                return (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`text-xs text-left text-white whitespace-nowrap transition-opacity ${isActive ? 'opacity-100 font-semibold' : 'opacity-40'}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Menu trigger */}
        <GlassCard style={{ borderRadius: '0 999px 999px 999px', padding: '8px 20px' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="font-syncopate text-sm tracking-tight"
          >
            {menuOpen ? 'Close ×' : 'Menu'}
          </button>
        </GlassCard>
      </div>

      {/* Logo */}
      <div className="fixed top-[calc(8vh-42px)] left-[5%] z-50">
        {/* Mobile dropdown */}
        <div
          ref={pemaRef}
          className="absolute top-full left-0 mt-0.5 md:hidden"
          style={{ transformOrigin: 'top left' }}
        >
          <div style={{ borderRadius: '0 999px 999px 999px', padding: '14px 22px', background: '#000' }}>
            <div className="flex flex-col gap-3">
              <span className="text-xs text-white opacity-60">Based in Melbourne</span>
              <a href="mailto:pema.lhagyal.work@gmail.com" className="text-xs text-white opacity-40 hover:opacity-100 transition-opacity">
                pema.lhagyal.work@gmail.com
              </a>
            </div>
          </div>
        </div>

        <GlassCard style={{ borderRadius: '999px 999px 999px 0', padding: '8px 24px' }}>
          <div
            className="flex items-center"
            onMouseEnter={() => { if (window.innerWidth >= 768) setPemaOpen(true) }}
            onMouseLeave={() => { if (window.innerWidth >= 768) setPemaOpen(false) }}
          >
            <button
              onClick={() => { if (window.innerWidth < 768) setPemaOpen(o => !o) }}
              className="font-syncopate font-bold text-sm tracking-tight whitespace-nowrap"
            >
              Pema.
            </button>
            {/* Desktop pill expansion */}
            <span
              ref={pemaExpandRef}
              className="hidden md:inline-flex overflow-hidden items-center"
            >
              <span className="flex items-center gap-4 pl-4">
                <span className="w-px h-3 opacity-20" style={{ background: 'currentColor' }} />
                <span className="text-xs opacity-60 whitespace-nowrap">Based in Melbourne</span>
                <a href="mailto:pema.lhagyal.work@gmail.com" className="text-xs opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap">
                  pema.lhagyal.work@gmail.com
                </a>
              </span>
            </span>
          </div>
        </GlassCard>
      </div>

      <main className="relative z-10 h-screen overflow-y-scroll snap-y snap-mandatory">

        {/* ── Hero ── */}
        <section id="hero" className="h-screen snap-start snap-always overflow-hidden">
          <div className={`h-full flex flex-col justify-between ${FRAME}`}>
            <div className="flex justify-end">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">Melbourne, AU</p>
            </div>

            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.92] tracking-tight">
                Code Meets<br />
                <span className="text-foreground/30">Strategy.</span>
              </h1>
              <img
                src="/images/portfolioPhoto.webp"
                alt="Pema Lhagyal"
                fetchPriority="high"
                className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover object-[0%_10%] shrink-0"
              />
            </div>

            <div className="flex items-end justify-between">
              <p className="text-xs text-foreground/40 max-w-[40ch] leading-relaxed">
                Websites and web apps built with React, Next.js &amp; TypeScript —
                from landing pages to complex platforms.
              </p>
              <button onClick={() => scrollToSection("about")} className="text-xs text-foreground/40 hover:text-foreground transition-colors">
                Scroll ↓
              </button>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="h-screen snap-start snap-always overflow-hidden">
          <div className={`h-full flex flex-col justify-center ${FRAME}`}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-center">
              <div className="md:w-1/2 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
                <h2 className="text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-tight tracking-tight shrink-0">
                  Make Your<br />Business<br />Impossible<br />to Ignore.
                </h2>
                <ul className="leading-tight">
                  {[
                    "Full-stack.",
                    "React & Next.js.",
                    "Fast & clean.",
                    "Built to last.",
                  ].map(point => (
                    <li key={point} className="text-[clamp(1.75rem,4vw,3.5rem)] font-bold tracking-tight text-foreground/30 md:whitespace-nowrap">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:flex md:w-1/2 flex-col justify-center">
                <Suspense fallback={<div className="h-[500px]" />}>
                  <TechStackBeam />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* ── Projects (one section per project) ── */}
        {projects.map((project, index) => (
          <section key={index} id={`project-${index}`} className="h-screen snap-start snap-always overflow-hidden">
            <div className={`h-full flex flex-col justify-between ${FRAME}`}>

              {/* top bar */}
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-[0.3em] text-foreground/40">Selected Work</span>
                <span className="text-xs font-mono text-foreground/30">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
              </div>

              {/* two-col body */}
              <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-16 items-center min-h-0 py-3 md:py-6">

                {/* left — project info */}
                <div className="md:w-1/4 flex flex-col gap-3 md:gap-5 shrink-0">
                  <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.92] tracking-tight">
                    {project.title}
                  </h2>
                  <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 md:line-clamp-none">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs border border-foreground/20 px-3 py-1 rounded-full text-foreground/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.logo && (
                    <img
                      src={project.logo}
                      alt={`${project.title} logo`}
                      className="w-14 h-14 object-contain opacity-90"
                    />
                  )}
                </div>

                {/* right — browser preview */}
                {project.link && (
                  <div className="flex flex-col w-full max-h-[45vh] md:max-h-none md:flex-1 md:h-full min-h-0 rounded-xl overflow-hidden border border-foreground/10 shadow-2xl">
                    {/* browser chrome */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/5 border-b border-foreground/10 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                      <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                      <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                      <span className="ml-3 flex-1 bg-foreground/10 rounded-full text-[10px] text-foreground/40 px-3 py-0.5 truncate">
                        {project.link.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                    {/* screenshots or live iframe */}
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      {project.previews ? (
                        project.previews.map((src, i) => (
                          <img key={i} src={src} alt={`${project.title} preview ${i + 1}`} className="w-full block" loading="lazy" decoding="async" />
                        ))
                      ) : project.preview ? (
                        <img src={project.preview} alt={`${project.title} preview`} className="w-full block" loading="lazy" decoding="async" />
                      ) : (
                        <ProjectPreview url={project.link} title={project.title} />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* bottom bar */}
              <div className="flex items-end justify-between">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm border-b border-foreground/40 hover:border-foreground pb-0.5 transition-colors"
                  >
                    Visit Site →
                  </a>
                ) : (
                  <span />
                )}
                {index < projects.length - 1 && (
                  <button
                    onClick={() => scrollToSection(`project-${index + 1}`)}
                    className="text-xs text-foreground/40 hover:text-foreground transition-colors"
                  >
                    Next ↓
                  </button>
                )}
              </div>

            </div>
          </section>
        ))}

        {/* ── Process ── */}
        <section id="process" className="h-screen snap-start snap-always overflow-hidden">
          <div className={`h-full flex flex-col justify-center gap-16 ${FRAME}`}>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-tight max-w-[16ch]">
              Simple.<br />Transparent.<br />Reliable.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: "01", icon: MessageSquare, title: "Discovery", desc: "We align on your goals, audience, and requirements before anything is built." },
                { num: "02", icon: Palette, title: "Design", desc: "Wireframes and mockups for your approval. Revisions included." },
                { num: "03", icon: Code, title: "Develop", desc: "Clean, modern code. Regular updates so you're never in the dark." },
                { num: "04", icon: Rocket, title: "Launch", desc: "Thorough testing, deployment, and handover — ready to go live." },
              ].map(({ num, icon: Icon, title, desc }) => (
                <div key={num} className="flex flex-col gap-3">
                  <span className="text-xs text-foreground/30 font-mono">{num}</span>
                  <Icon className="h-5 w-5 text-foreground/50" />
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-xs text-foreground/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="h-screen snap-start snap-always overflow-hidden">
          <div className={`h-full flex flex-col gap-6 ${FRAME}`}>
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold tracking-tight">Common Questions</h2>

            <div className="flex-1 overflow-y-auto">
              <Accordion type="single" collapsible className="w-full">
                {[
                  { id: "timeline", q: "How long does a typical project take?", a: "A landing page takes 1–2 weeks. Multi-page sites 3–4 weeks. Complex apps 6–10 weeks. I'll give you an accurate estimate after our first chat." },
                  { id: "requirements", q: "What do you need from me to get started?", a: "Content (text, images, logos), access to existing accounts if any, and a clear goal. We'll sort everything else out in discovery." },
                  { id: "maintenance", q: "Do you offer ongoing maintenance?", a: "Yes — maintenance packages from $100/month covering updates, security patches, backups, and minor content changes." },
                  { id: "revisions", q: "What if I'm not happy with the design?", a: "I offer revisions at every stage. If we can't agree on a direction before development starts, I'll refund the deposit in full." },
                  { id: "updates", q: "Will I be able to update the site myself?", a: "Yes. I set up a CMS for sites that need regular updates, with training and documentation included." },
                ].map(({ id, q, a }) => (
                  <AccordionItem key={id} value={id} className="border-b border-foreground/10">
                    <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-foreground/60 pb-4 leading-relaxed">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="h-screen snap-start snap-always overflow-hidden">
          <div className={`h-full flex flex-col justify-center ${FRAME}`}>
            <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
              <div className="md:w-2/5 space-y-6">
                <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight">
                  Let's build<br />something<br />together.
                </h2>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Have a project in mind? Reach out below or email me directly.
                </p>
                <a href="mailto:pema.lhagyal.work@gmail.com" className="block text-sm border-b border-foreground/40 hover:border-foreground pb-0.5 w-fit transition-colors">
                  pema.lhagyal.work@gmail.com
                </a>
              </div>

              <div className="md:w-3/5">
                {formStatus === "success" ? (
                  <div className="flex flex-col gap-4">
                    <Check className="h-6 w-6 text-foreground/40" />
                    <p className="font-semibold">Message sent.</p>
                    <p className="text-sm text-foreground/60">I'll get back to you within 24 hours.</p>
                    <button onClick={() => setFormStatus("idle")} className="text-sm underline underline-offset-4 w-fit text-foreground/50 hover:text-foreground transition-colors">
                      Send another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="bg-transparent border-foreground/20 focus:border-foreground rounded-none text-sm"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="bg-transparent border-foreground/20 focus:border-foreground rounded-none text-sm"
                      />
                    </div>
                    <Textarea
                      placeholder="Tell me about your project..."
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="bg-transparent border-foreground/20 focus:border-foreground rounded-none text-sm resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={formStatus === "loading"}
                        className="flex items-center gap-2 text-sm border-b border-foreground/40 hover:border-foreground pb-0.5 transition-colors disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {formStatus === "loading" ? "Sending..." : "Send Message"}
                      </button>
                      {formStatus === "error" && (
                        <p className="text-xs text-red-500">Failed to send. Please try again.</p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  )
}

export default App

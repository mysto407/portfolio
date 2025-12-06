import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Check, Menu, X, Send, MessageSquare, Palette, Code, Rocket } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { pricingPlans } from "./data/pricingPlans"

// Tech stack icons as SVG components (monochrome)
const TechIcons: Record<string, React.ReactNode> = {
  React: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
      <ellipse cx="12" cy="12" fill="none" stroke="currentColor" strokeWidth="1" rx="10" ry="4"/>
      <ellipse cx="12" cy="12" fill="none" stroke="currentColor" strokeWidth="1" rx="10" ry="4" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" fill="none" stroke="currentColor" strokeWidth="1" rx="10" ry="4" transform="rotate(120 12 12)"/>
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M3 3h18v18H3V3Zm14.25 9.75v1h-2v5.5h-1.5v-5.5h-2v-1h5.5Zm-8 1.47v4.03h-1.5v-4.03H6v-1h5.25v1h-2Z"/>
    </svg>
  ),
  Tailwind: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.47 6 12 6ZM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.47 12 7 12Z"/>
    </svg>
  ),
  "Node.js": (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M12 1.85c-.27 0-.53.07-.76.2L3.47 6.6c-.47.27-.76.78-.76 1.32v9.16c0 .54.29 1.05.76 1.32l7.77 4.55c.23.13.49.2.76.2s.53-.07.76-.2l7.77-4.55c.47-.27.76-.78.76-1.32V7.92c0-.54-.29-1.05-.76-1.32l-7.77-4.55a1.52 1.52 0 0 0-.76-.2Zm0 3.15L17.5 8v4l-2.75 1.58V17l-2.75 1.58L9.25 17v-3.42L6.5 12V8L12 5Z"/>
    </svg>
  ),
  "Next.js": (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.5 14.5v-9l7.5 10h-2l-5.5-7.5v6.5h-1.5v-9H10.5v9h-1.5Z"/>
    </svg>
  ),
  PostgreSQL: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h1v2c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2h1c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7Zm-2 15H9v-1h1v1Zm4 0h-1v-1h1v1Zm1.5-4.5c-.83.83-1.5 1.5-1.5 2.5h-4c0-1-.67-1.67-1.5-2.5C7.5 12.5 7 11.3 7 10c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.3-.5 2.5-1.5 3.5Z"/>
    </svg>
  ),
  Git: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M23.55 10.98 13.02.45a1.53 1.53 0 0 0-2.17 0L8.67 2.63l2.74 2.74a1.82 1.82 0 0 1 2.3 2.32l2.64 2.64a1.82 1.82 0 1 1-1.09 1.03l-2.46-2.46v6.47a1.82 1.82 0 1 1-1.5-.08V8.72a1.82 1.82 0 0 1-.99-2.39L7.6 3.6.45 10.76a1.53 1.53 0 0 0 0 2.17l10.53 10.53a1.53 1.53 0 0 0 2.17 0l10.4-10.4a1.53 1.53 0 0 0 0-2.17v.09Z"/>
    </svg>
  ),
  MongoDB: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M12.5 2.1c-.2-.4-.4-.8-.6-1.2-.1-.1-.1-.2-.2-.4-.1-.2-.3-.2-.4 0l-.2.4c-.2.4-.4.8-.6 1.2-.6 1.2-1.3 2.3-2.1 3.3-.6.7-1.2 1.3-1.8 1.9-.6.5-1.2 1-1.9 1.4-.4.3-.6.6-.4 1.1l.1.2c.2.4.3.8.5 1.2.6 1.1 1.4 2.1 2.2 3 .9 1 1.9 1.8 3 2.5.2.1.3.2.4.4l.1.2c.1.3 0 .6-.4.7-.2 0-.4 0-.6 0-.5-.1-.9-.3-1.3-.6-.6-.4-1.1-.8-1.6-1.3-1.3-1.2-2.3-2.7-2.9-4.3-.3-.7-.4-1.5-.5-2.2-.1-.8 0-1.5.1-2.3.1-.7.4-1.3.7-2 .3-.7.8-1.4 1.3-2 .5-.6 1.1-1.2 1.7-1.6.8-.6 1.6-1 2.5-1.3.3-.1.6-.1.8 0 .7.1 1.4.3 2 .6.7.3 1.3.8 1.9 1.3 1 .9 1.8 1.9 2.4 3.1.3.6.5 1.2.7 1.8.2.7.3 1.4.2 2.1 0 .5-.1 1.1-.2 1.6-.2.7-.5 1.4-.8 2.1-.6 1.2-1.4 2.3-2.4 3.2-.6.5-1.2 1-1.9 1.4-.2.1-.5.3-.7.4-.2.1-.3.1-.5.1-.3 0-.6-.3-.5-.6 0-.2.1-.3.2-.4.1-.1.3-.3.4-.4 1-.8 1.8-1.6 2.5-2.6.7-.9 1.3-2 1.7-3.1.3-.7.5-1.4.5-2.2.1-.8 0-1.5-.2-2.3-.2-.6-.5-1.3-.9-1.8-.4-.6-.9-1.1-1.4-1.5-.5-.4-1.1-.7-1.7-.9-.2-.1-.4-.1-.6-.1-.3 0-.5.1-.7.3Zm-.7 17.6c0 .4-.1.9-.1 1.3 0 .2 0 .4 0 .6 0 .2.1.4.3.4.1 0 .3 0 .4 0 .3 0 .4-.2.5-.5 0-.2 0-.4 0-.6 0-.4 0-.9-.1-1.3 0-.1-.1-.2-.1-.2-.2-.1-.4-.1-.6 0-.2.1-.3.2-.3.4Z"/>
    </svg>
  ),
  Vite: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="m21.9 4.6-9.5 17c-.2.4-.8.4-1 0L2 4.6c-.2-.4.1-.9.6-.8l9.3 1.8c.1 0 .2 0 .3 0l9.2-1.8c.5-.1.8.4.6.8ZM15.5 1.5l-6.3 1.2c-.2 0-.3.2-.3.4l-.4 6.6c0 .3.3.5.5.4l1.8-.4c.3-.1.5.2.4.4l-.5 2.5c0 .3.2.5.5.4l1.1-.3c.3-.1.5.2.5.4l-.8 4c0 .4.5.6.7.2l.2-.2 4.3-8.5c.2-.3-.1-.6-.4-.6l-1.9.4c-.3.1-.5-.2-.4-.5l1.2-5.1c.1-.3-.2-.5-.5-.5Z"/>
    </svg>
  ),
  Figma: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4ZM4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4ZM4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4ZM12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0ZM20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4Z"/>
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M13.98 11.08h2.12c.1 0 .19-.09.19-.19V9.01c0-.1-.09-.19-.19-.19h-2.12c-.1 0-.19.09-.19.19v1.88c0 .1.09.19.19.19Zm-2.95-3.6h2.12c.1 0 .19-.08.19-.18V5.42c0-.1-.09-.19-.19-.19h-2.12c-.1 0-.19.09-.19.19V7.3c0 .1.09.18.19.18Zm0 3.6h2.12c.1 0 .19-.09.19-.19V9.01c0-.1-.09-.19-.19-.19h-2.12c-.1 0-.19.09-.19.19v1.88c0 .1.09.19.19.19Zm-2.93 0h2.12c.1 0 .19-.09.19-.19V9.01c0-.1-.09-.19-.19-.19H8.1c-.1 0-.19.09-.19.19v1.88c0 .1.09.19.19.19Zm-2.96 0h2.12c.1 0 .19-.09.19-.19V9.01c0-.1-.09-.19-.19-.19H5.14c-.1 0-.19.09-.19.19v1.88c0 .1.09.19.19.19Zm5.89-3.6h2.12c.1 0 .19-.08.19-.18V5.42c0-.1-.09-.19-.19-.19H8.1c-.1 0-.19.09-.19.19V7.3c0 .1.09.18.19.18Zm8.85 4.72c-.51-.34-1.68-.46-2.58-.3-.12-.87-.6-1.63-1.18-2.24l-.4-.39-.42.36c-.7.6-1.1 1.45-1.19 2.47-.12.58-.08 1.13.1 1.62-.52.3-1.1.44-1.63.49H2.1c-.25 1.4.08 3.23 1.08 4.52 1 1.25 2.54 1.89 4.58 1.89 4.36 0 7.6-2.02 9.1-5.69.6.01 1.87.01 2.53-1.25l.14-.25-.4-.23Z"/>
    </svg>
  ),
  AWS: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M6.76 15.01c0 .29.03.52.08.7.06.17.13.36.23.56.04.06.05.12.05.17 0 .07-.05.15-.14.22l-.48.32c-.06.04-.12.06-.19.07-.08 0-.15-.04-.22-.11-.1-.12-.18-.24-.27-.35-.08-.12-.16-.27-.23-.44-.58.68-1.31 1.03-2.19 1.03-.63 0-1.13-.18-1.5-.54-.37-.36-.56-.84-.56-1.44 0-.64.22-1.15.68-1.55.45-.39 1.06-.59 1.82-.59.25 0 .51.02.79.06.27.04.55.1.85.17v-.55c0-.57-.12-.97-.36-1.2-.24-.24-.64-.35-1.22-.35-.26 0-.53.03-.81.1-.28.06-.55.15-.81.26l-.27.1c-.04.01-.08.02-.12.02-.1 0-.15-.08-.15-.23v-.38c0-.12.01-.21.05-.27.04-.06.11-.12.23-.17.26-.14.58-.25.94-.34.37-.1.76-.14 1.18-.14.9 0 1.56.2 1.98.61.41.41.62 1.03.62 1.86v2.45Zm9.53 1.25c-.31.08-.64.12-1.01.12-.38 0-.74-.04-1.04-.12-.34-.08-.6-.17-.78-.27-.11-.06-.18-.13-.21-.2-.03-.07-.04-.13-.04-.2v-.4c0-.15.06-.22.17-.22.04 0 .09.01.13.02l.17.05c.23.1.49.19.76.25.28.06.55.09.83.09.44 0 .78-.08 1.02-.23.24-.15.37-.38.37-.67 0-.2-.06-.36-.18-.5-.13-.13-.36-.25-.7-.36l-1-.31c-.51-.16-.88-.4-1.11-.7-.23-.3-.35-.64-.35-1.02 0-.3.06-.56.19-.78.12-.23.29-.43.5-.58.21-.16.45-.28.73-.36.27-.08.56-.12.86-.12.15 0 .31.01.46.02.16.02.3.04.43.06l.38.09c.12.03.21.07.28.1.1.05.18.1.23.17.04.06.07.14.07.26v.37c0 .15-.06.22-.17.22-.06 0-.15-.03-.27-.08-.4-.18-.86-.28-1.37-.28-.4 0-.71.06-.93.2-.22.13-.33.33-.33.62 0 .2.07.37.2.5.14.14.4.27.77.4l.98.3c.5.16.86.38 1.08.67.22.29.34.62.34 1 0 .3-.06.58-.18.82-.12.24-.3.45-.52.62-.22.17-.48.3-.79.38ZM9.71 17.05c-.13 0-.22-.02-.28-.07-.06-.04-.12-.14-.16-.27l-1.8-5.93c-.03-.08-.05-.15-.07-.21-.02-.07-.02-.12-.02-.16 0-.11.05-.17.16-.17h.56c.14 0 .23.02.29.07.06.04.11.14.15.27l1.29 5.07 1.2-5.07c.03-.14.08-.23.14-.27.06-.05.16-.07.3-.07h.45c.14 0 .23.02.3.07.06.04.11.14.14.27l1.21 5.12 1.33-5.12c.04-.14.1-.23.15-.27.06-.05.15-.07.29-.07h.53c.11 0 .17.05.17.17 0 .03 0 .07-.02.11-.01.04-.03.1-.05.18l-1.85 5.93c-.04.14-.1.23-.16.27-.06.05-.15.07-.28.07h-.49c-.14 0-.23-.02-.3-.07-.06-.05-.11-.14-.14-.28l-1.19-4.93-1.18 4.92c-.04.14-.09.23-.15.28-.06.05-.16.07-.3.07h-.49Z"/>
    </svg>
  ),
}

// Tech stack data
const techStack = [
  { name: "React" },
  { name: "TypeScript" },
  { name: "Tailwind" },
  { name: "Node.js" },
  { name: "Next.js" },
  { name: "Vite" },
  { name: "PostgreSQL" },
  { name: "MongoDB" },
  { name: "Git" },
  { name: "Figma" },
  { name: "Docker" },
  { name: "AWS" },
]

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = encodeURIComponent(`Website Inquiry from ${formState.name}`)
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    )

    window.location.href = `mailto:pema.lhagyal.work@gmail.com?subject=${subject}&body=${body}`
    setFormStatus("success")
    setFormState({ name: "", email: "", message: "" })
  }

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-xl font-bold">Pema Lhagyal</span>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Process
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t bg-background py-4">
            <div className="container flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("about")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("process")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Process
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-28 hero-gradient">
        <motion.div
          className="flex flex-col items-center text-center gap-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
            variants={fadeInUp}
          >
            Web Development Services
          </motion.h1>
          <motion.p
            className="max-w-[600px] text-muted-foreground md:text-xl"
            variants={fadeInUp}
          >
            Professional websites and web applications built with modern technologies.
            From simple landing pages to complex web apps.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-4"
            variants={fadeInUp}
          >
            <Button onClick={() => scrollToSection("pricing")} className="shadow-lg hover:shadow-xl transition-shadow">
              View Pricing
            </Button>
            <Button variant="outline" onClick={() => scrollToSection("contact")} className="hover:shadow-lg transition-shadow">
              <Mail className="mr-2 h-4 w-4" />
              Get a Quote
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="border-t scroll-mt-16">
        <div className="container py-16 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter mb-4">
              Technologies I Use
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground mb-12 max-w-[600px] mx-auto">
              Modern tools and frameworks to build fast, scalable, and maintainable applications.
            </motion.p>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
              variants={staggerContainer}
            >
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  variants={fadeInUp}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  {TechIcons[tech.name]}
                  <span className="text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t scroll-mt-16">
        <div className="container py-16 md:py-20">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter mb-6">About Me</motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-4">
              I'm a web developer passionate about creating fast, accessible, and visually appealing websites.
              I specialize in modern technologies like React, TypeScript, and Tailwind CSS to build
              solutions that help businesses grow online.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-muted-foreground">
              Every project starts with understanding your goals. Whether you need a simple landing page
              or a complex web application, I focus on delivering clean code, responsive design, and
              a smooth user experience that converts visitors into customers.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="border-t bg-muted/50 scroll-mt-16">
        <div className="container py-16 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter mb-4 text-center">How It Works</motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
              A simple, transparent process from first contact to launch.
            </motion.p>
            <motion.div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">1. Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  We discuss your goals, requirements, and vision. I'll ask questions to understand exactly what you need.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <Palette className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">2. Design</h3>
                <p className="text-sm text-muted-foreground">
                  I create mockups and wireframes for your approval before any coding begins. Revisions included.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <Code className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">3. Develop</h3>
                <p className="text-sm text-muted-foreground">
                  I build your site with clean, modern code. You'll get regular updates and can provide feedback throughout.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <Rocket className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">4. Launch</h3>
                <p className="text-sm text-muted-foreground">
                  Final testing, deployment, and handover. I'll make sure everything works perfectly before going live.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t scroll-mt-16">
        <div className="container py-16 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter mb-4 text-center">Pricing</motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
              Transparent pricing for every budget. All packages include responsive design and modern best practices.
            </motion.p>
            <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto" variants={staggerContainer}>
              {pricingPlans.map((plan) => (
                <motion.div key={plan.name} variants={fadeInUp}>
                  <Card className={`card-glow flex flex-col h-full ${plan.popular ? 'border-primary shadow-lg gradient-border' : ''}`}>
                    <CardHeader>
                      {plan.popular && (
                        <Badge className="w-fit mb-2">Most Popular</Badge>
                      )}
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="text-3xl font-bold">{plan.price}</div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
                        <Link to={`/plan/${plan.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="border-t bg-muted/50 scroll-mt-16">
        <div className="container py-16 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter mb-4 text-center">Frequently Asked Questions</motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
              Common questions about working together.
            </motion.p>
          </motion.div>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="timeline" className="bg-background rounded-lg border px-6">
              <AccordionTrigger>How long does a typical project take?</AccordionTrigger>
              <AccordionContent>
                A simple landing page takes 1-2 weeks. Multi-page websites typically take 3-4 weeks.
                Complex web applications vary based on features but usually 6-10 weeks. I'll give you
                an accurate timeline after our initial consultation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="requirements" className="bg-background rounded-lg border px-6 mt-4">
              <AccordionTrigger>What do you need from me to get started?</AccordionTrigger>
              <AccordionContent>
                I'll need your content (text, images, logos), access to any existing accounts (domain, hosting),
                and a clear idea of what you want to achieve. Don't worry if you're not sure about everything—we'll
                figure it out together during the discovery phase.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="maintenance" className="bg-background rounded-lg border px-6 mt-4">
              <AccordionTrigger>Do you offer ongoing maintenance?</AccordionTrigger>
              <AccordionContent>
                Yes! I offer monthly maintenance packages starting at $100/month that include updates,
                security patches, backups, and minor content changes. This is optional but recommended
                for business-critical websites.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="revisions" className="bg-background rounded-lg border px-6 mt-4">
              <AccordionTrigger>What if I'm not happy with the design?</AccordionTrigger>
              <AccordionContent>
                I offer revisions at each stage of the project. During the design phase, we'll work together
                until you're completely satisfied before moving to development. If we can't reach an agreement
                on the design direction, I offer a full refund of the deposit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="updates" className="bg-background rounded-lg border px-6 mt-4">
              <AccordionTrigger>Will I be able to update the website myself?</AccordionTrigger>
              <AccordionContent>
                Absolutely. For websites that need regular updates, I set up a content management system (CMS)
                that lets you edit text, images, and add new pages without any coding knowledge. I'll also
                provide training and documentation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t scroll-mt-16">
        <div className="container py-16 md:py-20">
          <h2 className="text-3xl font-bold tracking-tighter mb-4 text-center">Let's Work Together</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
            Have a project in mind? Fill out the form below or email me directly for a free consultation.
          </p>

          <div className="max-w-lg mx-auto">
            {formStatus === "success" ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-4">
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setFormStatus("idle")}>
                    Send Another Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project..."
                        rows={5}
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm text-muted-foreground mb-2">Or email me directly at</p>
                    <a
                      href="mailto:pema.lhagyal.work@gmail.com"
                      className="text-primary hover:underline font-medium"
                    >
                      pema.lhagyal.work@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pema Lhagyal. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:pema.lhagyal.work@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                pema.lhagyal.work@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

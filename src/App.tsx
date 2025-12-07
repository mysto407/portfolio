import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Check, Menu, X, Send, MessageSquare, Palette, Code, Rocket } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { pricingPlans } from "./data/pricingPlans"
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

// Tech stack data with Simple Icons
const techStack = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
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
      <section className="container py-20 md:py-28">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Web Development Services
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Professional websites and web applications built with modern technologies.
            From simple landing pages to complex web apps.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Button onClick={() => scrollToSection("pricing")} className="shadow-lg hover:shadow-xl transition-shadow">
              View Pricing
            </Button>
            <Button variant="outline" onClick={() => scrollToSection("contact")} className="hover:shadow-lg transition-shadow">
              <Mail className="mr-2 h-4 w-4" />
              Get a Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="border-t scroll-mt-16">
        <div className="container py-16 md:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">
              Technologies I Use
            </h2>
            <p className="text-muted-foreground mb-12 max-w-[600px] mx-auto">
              Modern tools and frameworks to build fast, scalable, and maintainable applications.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <tech.icon className="w-8 h-8" />
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t scroll-mt-16">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-6">About Me</h2>
            <p className="text-lg text-muted-foreground mb-4">
              I'm a web developer passionate about creating fast, accessible, and visually appealing websites.
              I specialize in modern technologies like React, TypeScript, and Tailwind CSS to build
              solutions that help businesses grow online.
            </p>
            <p className="text-muted-foreground">
              Every project starts with understanding your goals. Whether you need a simple landing page
              or a complex web application, I focus on delivering clean code, responsive design, and
              a smooth user experience that converts visitors into customers.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="border-t bg-muted/50 scroll-mt-16">
        <div className="container py-16 md:py-20">
          <h2 className="text-3xl font-bold tracking-tighter mb-4 text-center">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
            A simple, transparent process from first contact to launch.
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">1. Discovery</h3>
              <p className="text-sm text-muted-foreground">
                We discuss your goals, requirements, and vision. I'll ask questions to understand exactly what you need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <Palette className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">2. Design</h3>
              <p className="text-sm text-muted-foreground">
                I create mockups and wireframes for your approval before any coding begins. Revisions included.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <Code className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">3. Develop</h3>
              <p className="text-sm text-muted-foreground">
                I build your site with clean, modern code. You'll get regular updates and can provide feedback throughout.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <Rocket className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">4. Launch</h3>
              <p className="text-sm text-muted-foreground">
                Final testing, deployment, and handover. I'll make sure everything works perfectly before going live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t scroll-mt-16">
        <div className="container py-16 md:py-20">
          <h2 className="text-3xl font-bold tracking-tighter mb-4 text-center">Pricing</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
            Transparent pricing for every budget. All packages include responsive design and modern best practices.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`card-glow flex flex-col h-full ${plan.popular ? 'border-primary shadow-lg gradient-border' : ''}`}>
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
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="border-t bg-muted/50 scroll-mt-16">
        <div className="container py-16 md:py-20">
          <h2 className="text-3xl font-bold tracking-tighter mb-4 text-center">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
            Common questions about working together.
          </p>
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

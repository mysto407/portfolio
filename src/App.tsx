import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Check, Send, MessageSquare, Palette, Code, Rocket } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { pricingPlans } from "./data/pricingPlans"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
import { TechStackBeam } from "@/components/TechStackBeam"
import { TextRing3D } from "@/components/TextRing3D"
import { HyperText } from "@/components/ui/hyper-text"
import { projects } from "./data/projects"
import { ProjectCard } from "@/components/ProjectCard"

function App() {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("loading")

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })

      if (!response.ok) {
        throw new Error("Failed to send")
      }

      setFormStatus("success")
      setFormState({ name: "", email: "", message: "" })
    } catch {
      setFormStatus("error")
    }
  }

  const scrollToSection = (id: string) => {
    // setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <BackgroundRippleEffect />
      {/* Header removed */}

      {/* Pema Logo Card */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
        <Card className="bg-white/5 backdrop-blur-md border-2 border-white/20 shadow-lg w-16 h-16 md:w-32 md:h-32 flex items-center justify-center transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none overflow-hidden">
            <span className="absolute -top-2 -left-2 text-4xl font-bold text-black blur-[2px] animate-drift opacity-60">Pema</span>
            <span className="absolute top-8 -right-4 text-5xl font-bold text-black blur-[3px] animate-drift-slow delay-1000 opacity-40">Pema</span>
            <span className="absolute -bottom-6 left-4 text-6xl font-bold text-black blur-[4px] animate-drift delay-2000 opacity-30">Pema</span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5rem] font-bold text-black blur-[5px] animate-drift-slow delay-700 opacity-20">.</span>
            <span className="absolute bottom-2 right-2 text-2xl font-bold text-black blur-[1px] animate-drift delay-500 opacity-50">.</span>
          </div>
          <CardContent className="p-0 relative z-10">
            <span className="font-syne font-extrabold text-base md:text-2xl group-hover:scale-110 transition-transform duration-300 block">Pema.</span>
          </CardContent>
        </Card>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container pt-12 pb-24 md:pt-16 md:pb-32">
          <div className="flex flex-col items-center text-center gap-4">
            <TextRing3D text="secivreS tnempoleveD beW" className="h-[160px] mb-0" />
            <img
              src="https://api.dicebear.com/9.x/lorelei/svg?seed=Adrian&beardProbability=0&earringsProbability=0&glasses=variant01,variant03,variant04,variant05&glassesProbability=100&hair=variant43&hairAccessoriesColor[]&hairAccessoriesProbability=0&mouth=happy01,happy02,happy03,happy04,happy05,happy06,happy07,happy09,happy11,happy12,happy13,happy14,happy15,happy17,happy18,happy16"
              alt="Avatar"
              className="w-24 h-24 rounded-full mt-4 sm:-mt-16"
            />
            <HyperText className="max-w-[600px] text-muted-foreground text-sm md:text-base font-normal mt-2 sm:-mt-2" delay={300}>Professional websites and web applications built with modern technologies. From simple landing pages to complex web apps.</HyperText>
            <div className="flex flex-wrap justify-center gap-4 mt-6 sm:mt-4">
              {/* <Button onClick={() => scrollToSection("pricing")} className="shadow-lg hover:shadow-xl transition-shadow">
                View Pricing
              </Button> */}
              <Button variant="outline" onClick={() => scrollToSection("contact")} className="hover:shadow-lg transition-shadow">
                <Mail className="mr-2 h-4 w-4" />
                Get a Quote
              </Button>
            </div>
          </div>
        </section>



        {/* About Section */}
        <section id="about" className="scroll-mt-16 relative overflow-hidden mt-0 md:mt-48">
          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none" />

          <div className="container py-12 md:py-32">
            <div className="max-w-4xl mx-auto">
              <div className="relative z-10 p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                <div className="relative z-10 text-center space-y-8">


                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Building the web, <br className="hidden sm:block" /> one pixel at a time.
                  </h2>

                  <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    <p>
                      I'm a web developer who believes that a great website isn't just about code—it's about telling a story.
                      I specialize in building accessible, high-performance web applications that look beautiful and work seamlessly on every device.
                    </p>
                    <p>
                      With a focus on modern technologies like React, TypeScript, and Tailwind CSS, I turn complex requirements into clean, maintainable solutions.
                    </p>
                  </div>

                  <div className="py-8">
                    <TechStackBeam />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-16 bg-muted/30">
          <div className="container py-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">
                Recent Projects
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                A selection of recent work and side projects.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {projects.map((project, index) => (
                <div key={index} className="h-full">
                  <ProjectCard project={project} />
                </div>
              ))}
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
        {/* <section id="pricing" className="border-t scroll-mt-16">
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
        </section> */}

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
                      <Button type="submit" className="w-full" disabled={formStatus === "loading"}>
                        {formStatus === "loading" ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                      {formStatus === "error" && (
                        <p className="text-sm text-red-500 text-center mt-2">
                          Failed to send message. Please try again or email directly.
                        </p>
                      )}
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
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t py-8 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pema Lhagyal. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
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
    </div >
  )
}

export default App

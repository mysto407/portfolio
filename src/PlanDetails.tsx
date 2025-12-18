import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, ArrowLeft, Clock, Users, X, Wrench, HelpCircle, CreditCard, Shield, Calculator, Plus, Printer, Send, ArrowRight, ExternalLink, Menu } from "lucide-react"
import { pricingPlans } from "./data/pricingPlans"

const planSuggestions: Record<string, { id: string; text: string }[]> = {
  starter: [
    { id: "professional", text: "Need a CMS or more pages? Check out the Professional plan for self-editing and SEO power." },
  ],
  professional: [
    { id: "starter", text: "Just need a simple landing page? The Starter plan might be perfect." },
    { id: "enterprise", text: "Need custom features like payments or user accounts? See the Enterprise plan." },
  ],
  enterprise: [
    { id: "professional", text: "Don't need custom app features? The Professional plan offers great value for multi-page sites." },
  ],
}

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
]

function PlanDetails() {
  const { planId } = useParams()
  const plan = pricingPlans.find((p) => p.id === planId)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
        body: JSON.stringify({
          ...formState,
          message: `[Interested in: ${plan?.name} - ${plan?.price}]\n\n${formState.message}`,
        }),
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

  useEffect(() => {
    window.scrollTo(0, 0)
    if (plan) {
      document.title = `${plan.name} Plan | Pema Lhagyal`
    }
    return () => {
      document.title = "Pema Lhagyal | Web Development Services"
    }
  }, [planId, plan])

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan not found</h1>
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="text-lg font-bold">Pema Lhagyal</Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-64 border-t" : "max-h-0"
          }`}
        >
          <nav className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="container py-4 sm:py-8 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 print:hidden">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden sm:flex">
            <Printer className="mr-1 h-4 w-4" />Print
          </Button>
        </div>

        <div>
          {/* Plan header */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{plan.name}</h1>
              {plan.popular && <Badge className="text-xs">Most Popular</Badge>}
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-primary sm:ml-auto">{plan.price}</span>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base mb-4">{plan.details.overview}</p>

          {/* Sample project link */}
          {'sampleUrl' in plan.details && plan.details.sampleUrl && (
            <div className="mb-6 print:hidden">
              <Button variant="outline" size="sm" asChild>
                <a href={plan.details.sampleUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live Example
                </a>
              </Button>
            </div>
          )}

          {/* Quick info bar */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <strong>Timeline:</strong> {plan.details.timeline}
            </div>
            <div className="flex items-start gap-1">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
              <span><strong>Payment:</strong> {plan.details.payment}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <strong>Guarantee:</strong> Satisfaction guaranteed
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-6 sm:mb-8">
            {/* Price Breakdown */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Price Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  {plan.details.priceBreakdown.map((item) => (
                    <div key={item.item} className="flex justify-between items-center py-1 border-b last:border-0 gap-2">
                      <span className="flex-1 min-w-0">{item.item}</span>
                      <div className="flex gap-2 sm:gap-4 flex-shrink-0">
                        <span className="text-muted-foreground hidden sm:inline">{item.hours}</span>
                        <span className="font-medium w-14 sm:w-16 text-right">{item.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-bold">Total ({plan.details.totalHours} @ {plan.details.hourlyRate})</span>
                  <span className="font-bold text-primary">{plan.price}</span>
                </div>
                {'note' in plan.details && (
                  <p className="text-xs text-muted-foreground mt-2">{plan.details.note}</p>
                )}
              </CardContent>
            </Card>

            {/* What's included */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <ul className="grid gap-1 text-xs sm:text-sm">
                  {plan.details.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Process - Compact horizontal timeline */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6">
              <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {plan.details.process.map((step, index) => (
                  <div key={step.step} className="relative p-2 sm:p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-xs sm:text-sm">{step.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-3">{step.description}</p>
                    <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Three column layout */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-6 sm:mb-8">
            {/* Technologies */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <div className="flex flex-wrap gap-1">
                  {plan.details.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ideal for */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Ideal For
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <ul className="space-y-1 text-xs sm:text-sm">
                  {plan.details.idealFor.map((item) => (
                    <li key={item} className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Not included */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  Not Included
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                  {plan.details.notIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-1">
                      <X className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Add-ons */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Available Add-ons
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs sm:text-sm">
                {plan.details.addOns.map((addon) => (
                  <div key={addon.name} className="flex justify-between items-center p-2 bg-muted/50 rounded gap-2">
                    <span className="min-w-0">{addon.name}</span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">{addon.price}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQs - Compact grid */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {plan.details.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h4 className="font-medium text-xs sm:text-sm mb-1">{faq.question}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Guarantee + CTA */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6 sm:mb-8">
            <Card className="border-primary">
              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Satisfaction Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <p className="text-xs sm:text-sm">{plan.details.guarantee}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Ready to get started?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <div className="hidden print:block">
                  <p className="text-sm">Contact: pema.lhagyal.work@gmail.com</p>
                </div>
                <div className="print:hidden">
                  {formStatus === "success" ? (
                    <div className="text-center py-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-medium mb-1">Message sent!</p>
                      <p className="text-sm text-muted-foreground mb-3">I'll get back to you soon.</p>
                      <Button variant="outline" size="sm" onClick={() => setFormStatus("idle")}>
                        Send another
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Your name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                      <Textarea
                        placeholder="Tell me about your project..."
                        rows={3}
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />
                      <Button type="submit" className="w-full" disabled={formStatus === "loading"}>
                        {formStatus === "loading" ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                      {formStatus === "error" && (
                        <p className="text-sm text-red-500 text-center">
                          Failed to send. Please try again.
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other plans suggestion */}
          {planId && planSuggestions[planId] && (
            <div className="border-t pt-4 sm:pt-6 print:hidden">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Looking for something different?</p>
              <div className="flex flex-col gap-2">
                {planSuggestions[planId].map((suggestion) => {
                  const suggestedPlan = pricingPlans.find((p) => p.id === suggestion.id)
                  return (
                    <Link
                      key={suggestion.id}
                      to={`/plan/${suggestion.id}`}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm">{suggestion.text}</p>
                        {suggestedPlan && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {suggestedPlan.name} - {suggestedPlan.price}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-2 sm:ml-3" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Pema Lhagyal. All rights reserved.</span>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default PlanDetails

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Check } from "lucide-react"
import { pricingPlans } from "./data/pricingPlans"

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-xl font-bold">Pema Lhagyal</span>
          <nav className="flex items-center gap-4">
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Web Development <span className="text-primary">Services</span>
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Professional websites and web applications built with modern technologies.
            From simple landing pages to complex web apps.
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild>
              <a href="#pricing">View Pricing</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#contact">
                <Mail className="mr-2 h-4 w-4" />
                Get a Quote
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t bg-muted/50">
        <div className="container py-16 md:py-24">
          <h2 className="text-3xl font-bold tracking-tighter mb-4 text-center">Pricing</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
            Transparent pricing for every budget. All packages include responsive design and modern best practices.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
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
                    <Link to={`/plan/${plan.id}`}>Get Started</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t">
        <div className="container py-16 md:py-24">
          <h2 className="text-3xl font-bold tracking-tighter mb-4 text-center">Let's Work Together</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-[600px] mx-auto">
            Have a project in mind? Get in touch for a free consultation and quote.
          </p>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <a href="mailto:pema.lhagyal.work@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                pema.lhagyal.work@gmail.com
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pema Lhagyal. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App

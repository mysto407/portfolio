import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Menu, X } from "lucide-react"

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
]

function PrivacyPolicy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "Privacy Policy | Pema Lhagyal"
    return () => {
      document.title = "Pema Lhagyal | Web Development Services"
    }
  }, [])

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

      <div className="container py-8 px-4 sm:px-8 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link>
        </Button>

        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-muted-foreground">
              This Privacy Policy explains how I collect, use, and protect your personal information when you use this website.
              I respect your privacy and am committed to protecting your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Information I Collect</h2>
            <p className="text-muted-foreground mb-2">
              When you use the contact form on this website, I collect the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Your name</li>
              <li>Your email address</li>
              <li>The message you send</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How I Use Your Information</h2>
            <p className="text-muted-foreground">
              I use the information you provide solely to respond to your inquiries and communicate with you about potential projects.
              I will never sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Storage</h2>
            <p className="text-muted-foreground">
              Your contact form submissions are processed through Resend, a secure email delivery service.
              Messages are delivered to my email inbox and are not stored in any database on this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Request access to any personal data I hold about you</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent for me to contact you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact me at{" "}
              <a href="mailto:pema.lhagyal.work@gmail.com" className="text-primary hover:underline">
                pema.lhagyal.work@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pema Lhagyal. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy

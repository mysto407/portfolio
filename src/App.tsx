import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react"

const projects = [
  {
    title: "Project One",
    description: "A brief description of your first project and what technologies were used.",
    tags: ["React", "TypeScript", "Tailwind"],
    link: "#",
  },
  {
    title: "Project Two",
    description: "A brief description of your second project and the problem it solves.",
    tags: ["Node.js", "Express", "MongoDB"],
    link: "#",
  },
  {
    title: "Project Three",
    description: "A brief description of your third project and its key features.",
    tags: ["Next.js", "Prisma", "PostgreSQL"],
    link: "#",
  },
]

const skills = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python",
  "Tailwind CSS", "Git", "PostgreSQL", "MongoDB", "AWS"
]

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-xl font-bold">Your Name</span>
          <nav className="flex items-center gap-4">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Projects</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Hi, I'm <span className="text-primary">Your Name</span>
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            A passionate developer creating beautiful and functional web experiences.
          </p>
          <div className="flex gap-4 mt-4">
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Contact Me
            </Button>
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t bg-muted/50">
        <div className="container py-16 md:py-24">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">About Me</h2>
          <div className="max-w-[800px] mx-auto">
            <p className="text-muted-foreground text-center mb-8">
              I'm a full-stack developer with a passion for building modern web applications.
              With experience in React, Node.js, and cloud technologies, I create solutions
              that are both beautiful and performant.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="border-t">
        <div className="container py-16 md:py-24">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.title}
                    <a href={project.link} className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t bg-muted/50">
        <div className="container py-16 md:py-24">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">Get In Touch</h2>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:your@email.com">
                <Mail className="mr-2 h-5 w-5" />
                Email
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Name. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { Project } from "../data/projects"

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    const CardContentWrapper = project.link ? 'a' : 'div';
    const wrapperProps = project.link ? {
        href: project.link,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "block h-full cursor-pointer"
    } : { className: "block h-full" };

    return (
        <CardContentWrapper {...wrapperProps}>
            <Card className="group flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-muted/40 bg-gradient-to-br from-background to-muted/20 hover:border-primary/50 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {project.image && (
                    <div className="w-full h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                )}

                <CardHeader className="relative z-10">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 flex items-center justify-between">
                        {project.title}
                        {project.link && (
                            <ExternalLink className="h-4 w-4 opacity-50 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                        )}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-3 text-base">
                        {project.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 relative z-10 pb-16">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="font-normal bg-secondary/50 hover:bg-secondary transition-colors"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>

                {project.logo && (
                    <div className="absolute bottom-4 right-4 z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <img
                            src={project.logo}
                            alt={`${project.title} logo`}
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                )}
            </Card>
        </CardContentWrapper>
    )
}

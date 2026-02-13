export interface Project {
    title: string;
    description: string;
    tags: string[];
    link?: string;
    image?: string;
    logo?: string;
}

export const projects: Project[] = [
    {
        title: "KlockIn.app",
        description: "A comprehensive workforce management solution allowing businesses to schedule shifts, track attendance, and manage payroll. Features include drag-and-drop scheduling, GPS geofencing, and real-time analytics for industries like healthcare and retail.",
        tags: ["React", "TypeScript", "Tailwind CSS", "SaaS"],
        link: "https://klockin.app",
        // image: "/path/to/klockin-image.jpg",
        logo: "/images/KlockIn_Logo_white.png"
    },
    {
        title: "Yodsel Bhutan",
        description: "Official website for Yodsel Tours & Treks, a premier Bhutanese tour operator. The platform showcases extreme expedition tourism, cultural packages, and sustainable travel experiences with a focus on ease of booking and visual storytelling.",
        tags: ["Next.js", "React", "Travel Tech"],
        link: "https://yodselbhutan.com",
        // image: "/path/to/yodsel-image.jpg",
        logo: "/images/ytatLogoOG_HD_White.png"
    },
    {
        title: "Acland Grange SRS",
        description: "A purpose-built Supported Residential Service (SRS) providing compassionate care and accommodation for elderly and disabled individuals. The website features a welcoming design, service information, and easy contact options for families.",
        tags: ["React", "Tailwind CSS", "Vite"],
        link: "https://www.aclandgrangesrs.com.au/",
        // image: "",
        logo: "/images/ag_logo.svg"
    },
];

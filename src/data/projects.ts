export interface Project {
    title: string;
    pill?: string;         // overrides title in the top-right badge pill
    description: string;
    tags: string[];
    link?: string;
    image?: string;
    logo?: string;
    preview?: string;      // single screenshot, used instead of iframe when the live site is too heavy
    previews?: string[];   // multiple screenshots, stacked and scrollable
}

export const projects: Project[] = [
    {
        title: "KlockIn.app",
        description: "A comprehensive workforce management solution allowing businesses to schedule shifts, track attendance, and manage payroll. Features include drag-and-drop scheduling, GPS geofencing, and real-time analytics for industries like healthcare and retail.",
        tags: ["React", "TypeScript", "Tailwind CSS", "SaaS"],
        link: "https://klockin.app",
        // image: "/path/to/klockin-image.jpg",
        logo: "/images/KlockIn_Logo_white.webp"
    },
    {
        title: "Yodsel Bhutan",
        description: "Official website for Yodsel Tours & Treks, a premier Bhutanese tour operator. The platform showcases extreme expedition tourism, cultural packages, and sustainable travel experiences with a focus on ease of booking and visual storytelling.",
        tags: ["Next.js", "React", "Travel Tech"],
        link: "https://yodselbhutan.com",
        // image: "/path/to/yodsel-image.jpg",
        logo: "/images/ytatLogoOG_HD_White.webp"
    },
    {
        title: "Charrd Burger",
        pill: "Charrd Burger (concept)",
        description: "Website for Charrd, a burger restaurant. Bold design built to match the brand's attitude — showcasing the menu and driving foot traffic.",
        tags: ["React", "Tailwind CSS", "Vite", "Three.js", "Supabase"],
        link: "https://charrd.netlify.app",
        // logo: "/images/charrd_logo.png"
    },
    {
        title: "Nerudas Brunswick",
        description: "Website for Nerudas, a South American restaurant in Brunswick, Melbourne. Features the menu, atmosphere, and booking flow — designed to capture the warmth and character of the dining experience.",
        tags: ["Next.js", "React", "Tailwind CSS", "Three.js", "Supabase"],
        link: "https://neruda-blue.vercel.app",
        previews: [
            "/images/neruda_home.webp",
            "/images/neruda_book.webp",
            "/images/neruda_events.webp",
            "/images/neruda_gallery.webp",
            "/images/neruda_about.webp",
        ],
        // logo: "/images/nerudas_logo.png"
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

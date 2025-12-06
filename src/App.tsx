import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Check, Menu, X, Send, MessageSquare, Palette, Code, Rocket, ExternalLink } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { pricingPlans } from "./data/pricingPlans"

// Tech stack icons as SVG components
const TechIcons: Record<string, React.ReactNode> = {
  React: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#61DAFB">
      <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
      <path fill="none" stroke="#61DAFB" strokeWidth="1" d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 11s4.477 10 10 10Z" opacity="0"/>
      <ellipse cx="12" cy="12" fill="none" stroke="#61DAFB" strokeWidth="1" rx="10" ry="4"/>
      <ellipse cx="12" cy="12" fill="none" stroke="#61DAFB" strokeWidth="1" rx="10" ry="4" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" fill="none" stroke="#61DAFB" strokeWidth="1" rx="10" ry="4" transform="rotate(120 12 12)"/>
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#3178C6">
      <path d="M1 5a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V5Zm13.29 6.71v1.2h-2.28v6.6H10.2v-6.6H7.91v-1.2h6.38Zm.96 3.68c0-.33.06-.63.19-.9.13-.27.3-.5.53-.7.22-.19.49-.34.79-.44.3-.1.63-.16.98-.16.31 0 .6.03.88.1.28.07.53.17.75.32.22.14.4.32.53.54.13.22.2.48.2.78v3.26c0 .28.02.55.05.8.03.26.09.45.17.59h-1.57a2.3 2.3 0 0 1-.13-.61c-.23.25-.5.44-.82.56-.32.12-.66.18-1.02.18-.27 0-.52-.04-.76-.11a1.78 1.78 0 0 1-.62-.33 1.54 1.54 0 0 1-.42-.54 1.73 1.73 0 0 1-.15-.74c0-.31.06-.57.17-.77.12-.2.27-.37.46-.5.19-.13.4-.23.65-.3.24-.07.49-.13.75-.17l.72-.1c.22-.03.4-.08.55-.14.15-.06.22-.16.22-.3 0-.15-.03-.27-.1-.36a.57.57 0 0 0-.25-.2 1.08 1.08 0 0 0-.34-.1 2.3 2.3 0 0 0-.38-.02c-.3 0-.54.07-.73.2-.18.13-.29.35-.32.66h-1.48Zm2.83 1.25a.83.83 0 0 1-.26.1l-.35.07-.38.05-.38.06c-.12.03-.23.07-.33.12a.7.7 0 0 0-.24.2.52.52 0 0 0-.1.33c0 .12.03.23.08.32.05.09.12.16.2.21.1.06.2.1.31.12.12.03.24.04.37.04.3 0 .53-.05.72-.15.18-.1.32-.22.42-.37.1-.15.16-.3.2-.47.03-.16.05-.31.05-.44v-.5c-.08.05-.18.1-.31.14Z"/>
    </svg>
  ),
  Tailwind: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#06B6D4">
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.47 6 12 6ZM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.47 12 7 12Z"/>
    </svg>
  ),
  "Node.js": (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#339933">
      <path d="M12 1.85a1.45 1.45 0 0 0-.73.2L3.5 6.6a1.47 1.47 0 0 0-.73 1.27v9.27c0 .52.28 1 .73 1.27l2.05 1.18c.99.5 1.36.5 1.81.5 1.49 0 2.34-.9 2.34-2.47V8.49c0-.11-.1-.21-.21-.21h-.93c-.12 0-.21.1-.21.21v9.13c0 .7-.72 1.4-1.9.8L4.2 17.18a.22.22 0 0 1-.11-.18V7.87c0-.07.04-.14.1-.18l7.78-4.55a.2.2 0 0 1 .22 0l7.77 4.55c.07.04.11.1.11.18V17c0 .07-.04.14-.1.18l-7.78 4.54a.22.22 0 0 1-.22 0l-2-1.18a.16.16 0 0 0-.16 0c-.55.31-.65.35-1.17.53-.13.04-.32.12.07.35l2.6 1.54c.23.13.49.2.75.2s.52-.07.74-.2l7.78-4.55c.45-.27.73-.75.73-1.27V7.87c0-.52-.28-1-.73-1.27l-7.78-4.55a1.44 1.44 0 0 0-.74-.2Zm2.18 5.3c-2.2 0-3.5 1.01-3.5 2.7 0 1.83 1.41 2.33 3.4 2.56 2.38.27 2.56.68 2.56 1.22 0 .95-.76 1.35-2.54 1.35-2.24 0-2.73-.56-2.9-1.68a.21.21 0 0 0-.2-.17h-.97a.21.21 0 0 0-.2.21c0 1.2.64 2.62 4.27 2.62 2.55 0 4.02-.9 4.02-2.64 0-1.8-1.22-2.28-3.8-2.62-2.6-.34-2.86-.52-2.86-1.13 0-.5.23-1.18 2.17-1.18 1.73 0 2.38.37 2.64 1.55.02.1.11.17.21.17h.97c.06 0 .11-.02.15-.07a.21.21 0 0 0 .05-.15c-.15-1.8-1.35-2.64-4.02-2.64h-.45Z"/>
    </svg>
  ),
  "Next.js": (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9.5 15.5v-7l7 9.5h-1.8l-5.2-7v4.5h-1.5v-7h1.5v7Zm8.5-1.62-1.5-1.94V8h1.5v5.88Z"/>
    </svg>
  ),
  PostgreSQL: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#4169E1">
      <path d="M17.13 21.13c-.36.07-.68.1-.97.1-1.78 0-2.56-1.25-2.56-2.43 0-.06 0-.13.02-.2.14-1.06.68-2.1 1.3-2.93.4-.53.75-.95 1.1-1.33l.02-.02a6.35 6.35 0 0 0 1.67-3.7c.07-.67.06-1.34-.08-2a5.59 5.59 0 0 0-.83-1.9c-.01-.03-.03-.05-.04-.07-.22-.3-.47-.57-.75-.82a5.94 5.94 0 0 0-2.36-1.3 7.1 7.1 0 0 0-2.02-.33c-.78 0-1.56.12-2.3.4a5.28 5.28 0 0 0-2.6 2.02 5.14 5.14 0 0 0-.73 1.63 6.72 6.72 0 0 0-.18 2.37c.06.65.19 1.3.38 1.91.1.29.2.58.33.86.24.55.54 1.06.9 1.53.28.37.6.7.95 1 .16.14.34.26.52.38.38.25.82.44 1.27.56l.19.05c-.01.26 0 .53.03.79.06.45.17.89.33 1.31.01.03.02.05.03.08l-.07-.01a3.02 3.02 0 0 1-.72-.24 4.3 4.3 0 0 1-.8-.49 5.13 5.13 0 0 1-1.23-1.35c-.16-.23-.3-.47-.42-.73a6.54 6.54 0 0 1-.54-1.65 8.05 8.05 0 0 1-.14-2.29c.04-.58.14-1.15.3-1.7a6.4 6.4 0 0 1 .91-1.9 6.52 6.52 0 0 1 3.13-2.4 7.81 7.81 0 0 1 2.67-.5c.84 0 1.67.13 2.46.4a7.14 7.14 0 0 1 2.82 1.6c.34.3.64.65.9 1.02.01.01.02.03.03.04.39.56.68 1.18.87 1.83.2.69.28 1.42.22 2.14a7.5 7.5 0 0 1-1.96 4.38c-.37.42-.75.86-1.2 1.45-.6.8-1.03 1.72-1.14 2.59v.11c0 .56.28.96.74 1.11Z"/>
    </svg>
  ),
  Git: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#F05032">
      <path d="M23.55 10.98 13.02.45a1.53 1.53 0 0 0-2.17 0L8.67 2.63l2.74 2.74a1.82 1.82 0 0 1 2.3 2.32l2.64 2.64a1.82 1.82 0 1 1-1.09 1.03l-2.46-2.46v6.47a1.82 1.82 0 1 1-1.5-.08V8.72a1.82 1.82 0 0 1-.99-2.39L7.6 3.6.45 10.76a1.53 1.53 0 0 0 0 2.17l10.53 10.53a1.53 1.53 0 0 0 2.17 0l10.4-10.4a1.53 1.53 0 0 0 0-2.17v.09Z"/>
    </svg>
  ),
  MongoDB: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#47A248">
      <path d="M12.55 2.24c-.19-.4-.39-.79-.58-1.18-.06-.12-.13-.24-.18-.37-.08-.18-.27-.2-.36 0l-.18.39c-.19.4-.39.8-.59 1.2-.58 1.18-1.3 2.28-2.13 3.28-.55.66-1.15 1.28-1.8 1.85-.58.52-1.22.97-1.89 1.37-.44.26-.56.62-.4 1.06.02.05.03.1.05.15.15.4.32.78.53 1.15.6 1.1 1.35 2.1 2.2 3 .9.96 1.91 1.8 3.01 2.53.16.11.3.24.42.4.04.04.08.1.1.15.13.31-.02.65-.35.72-.2.04-.4.03-.6-.02-.48-.1-.92-.3-1.33-.56-.57-.36-1.1-.78-1.58-1.25a11.53 11.53 0 0 1-2.86-4.57c-.25-.72-.42-1.46-.51-2.22a7.87 7.87 0 0 1 .12-2.26c.14-.68.36-1.33.66-1.95A7.57 7.57 0 0 1 6.9 2.84 7.64 7.64 0 0 1 9.36 1c.73-.28 1.48-.45 2.26-.5.28-.01.55 0 .83.04.7.1 1.37.31 2 .62.69.34 1.33.77 1.9 1.27 1 .87 1.81 1.9 2.43 3.06.3.57.53 1.17.69 1.79a7.57 7.57 0 0 1-.01 3.5 9.5 9.5 0 0 1-1.07 2.76c-.58 1.01-1.3 1.92-2.14 2.71-.62.59-1.3 1.1-2.03 1.55-.24.15-.48.28-.74.39-.16.07-.33.1-.5.1-.33-.01-.55-.27-.5-.6.02-.15.1-.28.2-.38.13-.14.28-.26.44-.37a14.6 14.6 0 0 0 2.95-2.66 10.7 10.7 0 0 0 2.09-3.4c.28-.7.45-1.43.53-2.18a6.42 6.42 0 0 0-.39-2.83 7.1 7.1 0 0 0-1.45-2.41A7.44 7.44 0 0 0 14.23 2c-.55-.19-1.12-.27-1.68.24Zm-.67 17.58c-.04.43-.06.87-.07 1.3 0 .2 0 .39-.02.59-.02.23.07.38.28.45.14.05.3.07.44.05.26-.03.44-.2.47-.48.02-.19 0-.39 0-.58-.01-.44-.03-.88-.08-1.33a.32.32 0 0 0-.14-.22.55.55 0 0 0-.58 0c-.18.1-.27.25-.28.45-.01-.08-.02-.15-.02-.23Z"/>
    </svg>
  ),
  Python: (
    <svg viewBox="0 0 24 24" className="w-10 h-10">
      <path fill="#3776AB" d="M11.91 1c-1.5 0-2.93.14-4.2.4-3.76.75-4.44 2.32-4.44 5.21v3.82h8.88v1.28H4.46c-2.58 0-4.84 1.55-5.55 4.5-.81 3.39-.85 5.5 0 9.04.63 2.63 2.14 4.5 4.72 4.5h3.05v-4.05c0-2.93 2.54-5.52 5.54-5.52h8.87c2.46 0 4.43-2.03 4.43-4.5V6.61c0-2.4-2.03-4.2-4.43-4.64A26.43 26.43 0 0 0 11.91 1Zm-4.8 2.65a1.65 1.65 0 1 1 0 3.3 1.65 1.65 0 0 1 0-3.3Z"/>
      <path fill="#FFC331" d="M18.35 10.71v3.94c0 3.06-2.6 5.62-5.54 5.62h-8.87c-2.43 0-4.44 2.08-4.44 4.5v8.43c0 2.4 2.08 3.8 4.44 4.5 2.82.83 5.53.99 8.87 0 2.22-.65 4.44-1.97 4.44-4.5v-3.38h-8.88v-1.13h13.31c2.58 0 3.54-1.8 4.44-4.5.93-2.77.89-5.44 0-9.04-.64-2.58-1.86-4.5-4.44-4.5l-3.33.06Zm-5 18.88a1.65 1.65 0 1 1 0 3.3 1.65 1.65 0 0 1 0-3.3Z"/>
    </svg>
  ),
  Figma: (
    <svg viewBox="0 0 24 24" className="w-10 h-10">
      <path fill="#F24E1E" d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8Z"/>
      <path fill="#A259FF" d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z"/>
      <path fill="#1ABCFE" d="M12 0v8h4a4 4 0 0 0 0-8h-4Z"/>
      <path fill="#0ACF83" d="M4 4a4 4 0 0 0 4 4h4V0H8a4 4 0 0 0-4 4Z"/>
      <path fill="#FF7262" d="M16 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/>
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#2496ED">
      <path d="M13.98 11.08h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.88c0 .1.09.19.19.19Zm-2.95-3.6h2.12a.19.19 0 0 0 .19-.18V5.42a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19V7.3c0 .1.09.18.19.18Zm0 3.6h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.88c0 .1.09.19.19.19Zm-2.93 0h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19H8.1a.19.19 0 0 0-.19.19v1.88c0 .1.09.19.19.19Zm-2.96 0h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19H5.14a.19.19 0 0 0-.19.19v1.88c0 .1.09.19.19.19Zm5.89-3.6h2.12a.19.19 0 0 0 .19-.18V5.42a.19.19 0 0 0-.19-.19H8.1a.19.19 0 0 0-.19.19V7.3c0 .1.09.18.19.18Zm8.85 4.72c-.51-.34-1.68-.46-2.58-.3-.12-.87-.6-1.63-1.18-2.24l-.4-.39-.42.36a4.69 4.69 0 0 0-1.19 2.47c-.12.58-.08 1.13.1 1.62-.52.3-1.1.44-1.63.49H2.1c-.25 1.4.08 3.23 1.08 4.52 1 1.25 2.54 1.89 4.58 1.89 4.36 0 7.6-2.02 9.1-5.69.6.01 1.87.01 2.53-1.25l.14-.25-.4-.23Zm-17.78-.5h2.12a.19.19 0 0 0 .19-.2V9.63a.19.19 0 0 0-.19-.19H5.14a.19.19 0 0 0-.19.19v1.88c0 .1.09.19.19.19Z"/>
    </svg>
  ),
  AWS: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#FF9900">
      <path d="M6.76 15.01c0 .29.03.52.08.7.06.17.13.36.23.56.04.06.05.12.05.17 0 .07-.05.15-.14.22l-.48.32a.35.35 0 0 1-.19.07c-.08 0-.15-.04-.22-.11a2.27 2.27 0 0 1-.27-.35 5.77 5.77 0 0 1-.23-.44c-.58.68-1.31 1.03-2.19 1.03-.63 0-1.13-.18-1.5-.54-.37-.36-.56-.84-.56-1.44 0-.64.22-1.15.68-1.55.45-.39 1.06-.59 1.82-.59.25 0 .51.02.79.06.27.04.55.1.85.17v-.55c0-.57-.12-.97-.36-1.2-.24-.24-.64-.35-1.22-.35-.26 0-.53.03-.81.1-.28.06-.55.15-.81.26-.12.05-.21.08-.27.1a.47.47 0 0 1-.12.02c-.1 0-.15-.08-.15-.23v-.38c0-.12.01-.21.05-.27.04-.06.11-.12.23-.17.26-.14.58-.25.94-.34.37-.1.76-.14 1.18-.14.9 0 1.56.2 1.98.61.41.41.62 1.03.62 1.86v2.45Zm-3.02.93c.24 0 .49-.04.75-.13.26-.09.49-.25.68-.47.12-.14.2-.3.25-.47.05-.18.08-.39.08-.65v-.31c-.22-.05-.45-.1-.7-.13a5.86 5.86 0 0 0-.71-.05c-.5 0-.86.1-1.1.3-.24.2-.36.47-.36.83 0 .33.09.58.27.75.17.18.42.27.74.27l.1.06Zm5.97 1.11c-.13 0-.22-.02-.28-.07-.06-.04-.12-.14-.16-.27l-1.8-5.93a1.44 1.44 0 0 1-.07-.28c0-.11.05-.17.16-.17h.56c.14 0 .23.02.29.07.06.04.11.14.15.27l1.29 5.07 1.2-5.07c.03-.14.08-.23.14-.27a.54.54 0 0 1 .3-.07h.45c.14 0 .23.02.3.07.05.04.11.14.14.27l1.21 5.12 1.33-5.12c.04-.14.1-.23.15-.27.06-.05.15-.07.29-.07h.53c.11 0 .17.05.17.17 0 .03 0 .07-.02.11a.97.97 0 0 1-.05.18l-1.85 5.93c-.04.14-.1.23-.16.27a.55.55 0 0 1-.28.07h-.49c-.14 0-.23-.02-.3-.07-.06-.05-.11-.14-.14-.28l-1.19-4.93-1.18 4.92c-.04.14-.09.23-.15.28-.06.05-.16.07-.3.07h-.49Zm9.53.22a4.5 4.5 0 0 1-1.04-.12c-.34-.08-.6-.17-.78-.27-.11-.06-.18-.13-.21-.2a.52.52 0 0 1-.04-.2v-.4c0-.15.06-.22.17-.22.04 0 .09 0 .13.02l.17.05c.23.1.49.19.76.25.28.06.55.09.83.09.44 0 .78-.08 1.02-.23.24-.15.37-.38.37-.67 0-.2-.06-.36-.18-.5-.13-.13-.36-.25-.7-.36l-1-.31c-.5-.16-.88-.4-1.11-.7a1.66 1.66 0 0 1-.35-1.02c0-.3.06-.56.19-.78.12-.23.29-.43.5-.58.21-.16.45-.28.73-.36.27-.08.56-.12.86-.12.15 0 .31 0 .46.02l.43.06.38.09c.12.03.21.07.28.1.1.05.18.1.23.17.04.06.07.14.07.26v.37c0 .15-.06.22-.17.22a.78.78 0 0 1-.27-.08 3.26 3.26 0 0 0-1.37-.28c-.4 0-.71.06-.93.2-.22.13-.33.33-.33.62 0 .2.07.37.2.5.14.14.4.27.77.4l.98.3c.5.16.86.38 1.08.67.23.28.34.61.34 1 0 .3-.06.58-.18.82-.13.24-.3.45-.52.62-.22.17-.48.3-.79.38-.32.1-.66.14-1.01.14ZM21.2 19.38c-2.5 1.84-6.11 2.82-9.23 2.82-4.37 0-8.3-1.62-11.28-4.3-.23-.21-.02-.5.26-.34 3.21 1.87 7.19 3 11.29 3 2.77 0 5.81-.57 8.62-1.76.42-.18.77.28.34.58Z"/>
      <path d="M22.39 17.95c-.32-.4-2.1-.2-2.9-.1-.24.03-.28-.18-.06-.34 1.42-1 3.75-.7 4.02-.38.27.34-.07 2.67-1.4 3.78-.2.17-.4.08-.31-.14.3-.76.98-2.44.65-2.82Z"/>
    </svg>
  ),
}

// Tech stack data
const techStack = [
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "Node.js", color: "#339933" },
  { name: "Next.js", color: "#000000" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Git", color: "#F05032" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Python", color: "#3776AB" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Docker", color: "#2496ED" },
  { name: "AWS", color: "#FF9900" },
]

// Projects data
const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack online store with payment integration, inventory management, and admin dashboard.",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    image: "🛒",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "SaaS Dashboard",
    description: "Analytics dashboard with real-time data visualization, user management, and subscription billing.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    image: "📊",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Portfolio Generator",
    description: "Tool that helps developers create stunning portfolios with customizable themes and components.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    image: "✨",
    gradient: "from-orange-500 to-yellow-500",
  },
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
              onClick={() => scrollToSection("projects")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </button>
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
                onClick={() => scrollToSection("projects")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </button>
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
            Web Development <span className="gradient-text">Services</span>
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
              className="flex flex-wrap justify-center gap-8 md:gap-12"
              variants={staggerContainer}
            >
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  variants={fadeInUp}
                  className="tech-icon flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted"
                >
                  {TechIcons[tech.name]}
                  <span className="text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="border-t bg-muted/50 scroll-mt-16">
        <div className="container py-16 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter mb-4 text-center">
              Featured Projects
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto">
              A selection of recent work showcasing my skills and expertise.
            </motion.p>
            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
              variants={staggerContainer}
            >
              {projects.map((project) => (
                <motion.div key={project.title} variants={fadeInUp}>
                  <Card className="card-glow h-full overflow-hidden group">
                    <div className={`h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{project.image}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {project.title}
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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

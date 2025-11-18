# Design Guidelines: Kei Nishkori Portfolio

## Design Approach

**Selected Approach**: Hybrid — Swiss Minimalism + Modern Developer Portfolio References (Linear, Vercel, Stripe)

**Core Principle**: Type-first, whitespace-rich layout with premium micro-interactions. Every element must earn its place on the page through clear purpose and elegant execution.

---

## Typography System

**Primary Typeface**: Inter (via Google Fonts CDN)
- Hero/Display: `text-6xl md:text-7xl lg:text-8xl font-light tracking-tight`
- Page Headings (H1): `text-5xl md:text-6xl font-normal tracking-tight`
- Section Headings (H2): `text-3xl md:text-4xl font-medium`
- Subheadings (H3): `text-xl md:text-2xl font-medium`
- Body Text: `text-base md:text-lg leading-relaxed font-normal`
- Captions/Meta: `text-sm md:text-base font-light tracking-wide uppercase`

**Hierarchy Rules**:
- Maximum line length: `max-w-2xl` for body text, `max-w-4xl` for headings
- Line height: Generous — `leading-relaxed` (1.75) for body, `leading-tight` (1.25) for headings
- Letter spacing: Tight for large type (`tracking-tight`), normal for body

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 8, 12, 16, 20, 24, 32** (e.g., `p-4`, `gap-8`, `mt-12`, `py-32`)

**Container Strategy**:
- Page container: `max-w-7xl mx-auto px-6 md:px-8 lg:px-12`
- Content sections: Vertical padding `py-20 md:py-32` for generous breathing room
- Component spacing: `gap-12` or `gap-16` between major sections

**Grid System**:
- About page: Single column, centered content with `max-w-3xl`
- Work gallery: Mosaic grid using `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`
- Contact page: Two-column split on desktop `grid md:grid-cols-2 gap-12`

---

## Component Library

### Navigation
- Fixed top navigation with blur backdrop: `backdrop-blur-md bg-white/80 dark:bg-black/80`
- Minimal nav items: About, Work, Contact + Dark mode toggle
- Active section indicator using subtle underline: `border-b-2 transition-all`
- Height: `h-16 md:h-20`

### Hero Section (About Page)
- Full-bleed hero with AI-generated abstract minimal background (subtle, low-opacity)
- Large display typography announcing name/role
- Hero height: `min-h-[70vh] md:min-h-[85vh]` — not forced viewport, natural flow
- Soft fade-in animation on page load (Framer Motion)
- CTA button with backdrop blur: `backdrop-blur-md bg-white/10 border border-white/20`

### Work Section — Mosaic Gallery
- Staggered grid with varying aspect ratios (Pinterest/Bento box style)
- Project cards with:
  - AI-generated hero image with device frame overlay (MacBook/mobile)
  - Project title: `text-2xl font-medium`
  - Tech stack tags: `text-xs uppercase tracking-wider`
  - Hover state: Subtle lift (`hover:scale-[1.02]`) + shadow increase
- Card structure: Image first, minimal text overlay on dark gradient at bottom

### Case Study Modal
- Full-screen overlay with centered content container `max-w-5xl`
- Three-section structure: Problem → Approach → Result
- Large project screenshots in device frames
- Close button: Top-right, minimal X icon
- Background: `backdrop-blur-xl bg-black/60`

### Contact Form
- Clean, minimal inputs with subtle borders
- Labels: `text-sm uppercase tracking-wider mb-2`
- Inputs: `p-4 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2`
- Submit button: Primary CTA style with loading state
- Social icons: Arranged horizontally below form, `size-5` with `gap-6`

### Resume Download
- Floating action button (bottom-right corner on desktop, bottom center on mobile)
- Pill-shaped button with icon: `rounded-full px-6 py-3 backdrop-blur-md`
- Hover state: Subtle scale + shadow increase

---

## Motion & Interaction

**Page Transitions**: Smooth fade-in on route changes (Framer Motion)

**Micro-Interactions**:
- Button hover: Slight scale `hover:scale-105` + shadow depth increase
- Card hover: Lift effect `hover:translate-y-[-4px]` with shadow
- Link underline: Animated width expansion `hover:w-full transition-all`

**Scroll Behavior**:
- Smooth scroll enabled globally
- Navigation active state updates on scroll intersection
- Minimal parallax on hero background (optional, very subtle)

**Animation Constraints**: Use sparingly — only for:
- Page load hero text fade-in
- Gallery card stagger on initial render
- Button/link hover states
- Modal open/close transitions

---

## Responsive Breakpoints

- Mobile: Base styles (< 768px)
- Tablet: `md:` (768px - 1023px)
- Desktop: `lg:` (1024px+)

**Mobile-First Considerations**:
- Stack all multi-column layouts on mobile
- Reduce font sizes by 1-2 steps
- Navigation collapses to hamburger menu
- Hero height: `min-h-[60vh]` on mobile

---

## Dark/Light Mode

Implement system-based toggle with smooth transitions. Use Tailwind's `dark:` variant extensively.

**Key Color Tokens** (names only, values defined in theme):
- Background: `bg-background`
- Foreground text: `text-foreground`
- Muted text: `text-muted-foreground`
- Borders: `border-border`
- Accent elements: `bg-accent text-accent-foreground`

**Transition**: Apply `transition-colors duration-200` to switching elements

---

## Images

**Hero Background (About Page)**:
- AI-generated abstract minimal texture (geometric shapes, gradients, or noise patterns)
- Low opacity overlay to maintain text readability
- Generated prompt example: "Abstract minimal geometric pattern, muted tones, Swiss design aesthetic"

**Project Hero Images (Work Gallery)**:
- AI-generated mock screens showing project interfaces within device frames
- Prompts based on project tags (e.g., "E-commerce dashboard UI in dark mode with data visualizations, displayed on MacBook Pro mockup")
- Each project gets unique hero image reflecting its aesthetic and technology

**Resume PDF Cover Art**:
- AI-generated minimal cover with name and professional title
- Geometric patterns or abstract shapes aligned with personal brand
- Generated on-the-fly when PDF is requested

**Image Placement**:
- About page: Full-bleed hero background
- Work gallery: Each project card contains generated hero image
- Contact page: No images (type and form focused)
- Modal case studies: Multiple project screenshots in device frames

---

## Accessibility

- All interactive elements have clear focus states: `focus:ring-2 focus:ring-offset-2`
- Minimum touch target size: 44x44px on mobile
- Form inputs have associated labels with proper ARIA attributes
- Color contrast meets WCAG AA standards (tested in both modes)
- Keyboard navigation fully supported across all interactive components

---

## Performance Targets

- Lighthouse Performance: 95+
- Minimize layout shift with skeleton loaders during AI image generation
- Lazy load below-the-fold images
- Preload critical fonts
- Optimize AI-generated images to WebP format
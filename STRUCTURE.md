# 🌳 Estructura Visual del Proyecto

```
personal/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript config
│   ├── next.config.mjs             # Next.js config
│   ├── tailwind.config.ts          # TailwindCSS config
│   ├── postcss.config.mjs          # PostCSS config
│   ├── eslint.config.mjs           # ESLint config
│   ├── sanity.config.ts            # Sanity CMS config
│   ├── .gitignore                  # Git ignore rules
│   └── .env.local.example          # Environment variables example
│
├── 📚 Documentation
│   ├── README.md                   # Main documentation
│   ├── GETTING_STARTED.md          # Quick start guide
│   ├── PROJECT_SUMMARY.md          # Complete project summary
│   ├── ARCHITECTURE.md             # Architecture decisions
│   ├── DEPLOYMENT.md               # Vercel deployment guide
│   ├── SAMPLE_DATA.md              # Sample data for Sanity
│   ├── CONTRIBUTING.md             # Contribution guidelines
│   ├── CHANGELOG.md                # Version history
│   └── LICENSE                     # MIT License
│
└── 📁 src/
    │
    ├── 🎨 app/                     # Next.js App Router
    │   ├── globals.css            # Global styles & animations
    │   ├── layout.tsx             # Root layout with fonts
    │   ├── page.tsx               # Home page (main)
    │   ├── opengraph-image.tsx    # OG image generator
    │   └── admin/                 # Sanity Studio
    │       └── [[...index]]/
    │           ├── page.tsx       # Studio page
    │           └── layout.tsx     # Studio layout
    │
    ├── 🧩 components/
    │   │
    │   ├── layout/                # Layout components
    │   │   ├── Navbar.tsx        # Navigation bar
    │   │   ├── Footer.tsx        # Footer
    │   │   └── MainLayout.tsx    # Main layout wrapper
    │   │
    │   ├── sections/              # Page sections
    │   │   ├── HeroSection.tsx   # Hero with typing effect
    │   │   ├── AboutSection.tsx  # About with skills
    │   │   └── ProjectsSection.tsx # Projects grid
    │   │
    │   └── ui/                    # Reusable UI components
    │       ├── Button.tsx         # Button with animations
    │       ├── Card.tsx           # Card with 3D hover
    │       ├── Tag.tsx            # Technology tags
    │       └── SectionTitle.tsx   # Animated section title
    │
    ├── 🎯 domain/
    │   └── models/
    │       └── index.ts           # TypeScript interfaces
    │
    ├── 🔌 services/
    │   └── cms/                   # CMS integration
    │       ├── sanityClient.ts   # Sanity client setup
    │       ├── siteSettings.ts   # Site config query
    │       ├── hero.ts           # Hero query
    │       ├── about.ts          # About query
    │       ├── projects.ts       # Projects queries
    │       └── index.ts          # Exports
    │
    ├── 📝 sanity/
    │   └── schemas/               # Sanity schemas
    │       ├── index.ts          # Schema index
    │       ├── siteSettings.ts   # Site config schema
    │       ├── hero.ts           # Hero schema
    │       ├── about.ts          # About schema
    │       ├── project.ts        # Project schema
    │       ├── skillGroup.ts     # Skill group schema
    │       ├── skill.ts          # Skill schema
    │       └── socialLink.ts     # Social link schema
    │
    └── 🛠️ utils/
        └── cn.ts                  # Class name utility

```

## 📊 Estadísticas

```
Total Files:        56
Total Components:   11
Total Schemas:      7
Total Services:     6
Total Docs:         9
Lines of Code:      ~3,500+
```

## 🎨 Component Hierarchy

```
MainLayout
├── Navbar
├── main
│   ├── HeroSection
│   │   ├── Button (x2)
│   │   ├── SocialLinks
│   │   └── Avatar (parallax)
│   │
│   ├── AboutSection
│   │   ├── SectionTitle
│   │   ├── Card (main content)
│   │   ├── Card (stats)
│   │   └── SkillGroups
│   │       └── Card[] (skills)
│   │           ├── Tag (level)
│   │           └── Skills list
│   │
│   └── ProjectsSection
│       ├── SectionTitle
│       ├── Card[] (project cards)
│       │   ├── Image
│       │   ├── Tag[] (technologies)
│       │   └── Links
│       └── Modal (project detail)
│           ├── Image (large)
│           ├── Gallery
│           ├── PortableText (description)
│           ├── Tag[] (technologies)
│           └── Button[] (actions)
│
└── Footer
    ├── Brand
    ├── Links
    └── Social Icons
```

## 🔄 Data Flow

```
User Browser
    │
    ↓
Next.js Page (SSR/ISR)
    │
    ↓
Service Layer (GROQ queries)
    │
    ↓
Sanity API
    │
    ↓
Sanity CMS (Content)
    │
    ↓
[Back to Next.js]
    │
    ↓
Components (Render)
    │
    ↓
Browser (Display)
```

## 🎭 Animation Flow

```
Page Load
    │
    ├─→ Navbar slides down (0.5s)
    │
    ├─→ Hero fades in (0.8s)
    │   ├─→ Text appears left (0.8s)
    │   ├─→ Typing effect starts
    │   └─→ Avatar appears right (1.0s)
    │
    ├─→ Scroll Reveal
    │   ├─→ About section (scroll trigger)
    │   │   ├─→ Title animates (0.6s)
    │   │   └─→ Cards stagger (0.2s each)
    │   │
    │   └─→ Projects section (scroll trigger)
    │       ├─→ Title animates (0.6s)
    │       └─→ Cards stagger (0.15s each)
    │
    └─→ Continuous
        ├─→ Parallax on avatar
        ├─→ Blob animation (7s loop)
        └─→ Cursor blink in typing
```

## 📦 Key Dependencies Graph

```
Next.js 14
    ├── React 18
    ├── TypeScript 5.3
    │
    ├── Styling
    │   ├── TailwindCSS 3.4
    │   ├── PostCSS
    │   └── @tailwindcss/typography
    │
    ├── Animations
    │   └── Framer Motion 11
    │
    ├── CMS
    │   ├── Sanity 3.30
    │   ├── @sanity/client
    │   ├── @sanity/image-url
    │   ├── @sanity/vision
    │   ├── next-sanity
    │   └── @portabletext/react
    │
    ├── Icons
    │   └── react-icons 5.0
    │
    └── Utilities
        ├── clsx
        └── tailwind-merge
```

## 🎯 Feature Map

```
Portfolio
│
├── 🎨 UI/UX
│   ├── Responsive Design ✅
│   ├── Dark Mode Ready ✅
│   ├── Smooth Animations ✅
│   ├── Glassmorphism ✅
│   └── Custom Scrollbar ✅
│
├── 🚀 Performance
│   ├── Server Components ✅
│   ├── Image Optimization ✅
│   ├── Code Splitting ✅
│   ├── ISR ✅
│   └── Font Optimization ✅
│
├── 📝 Content (CMS)
│   ├── Site Settings ✅
│   ├── Hero Section ✅
│   ├── About Section ✅
│   ├── Projects ✅
│   ├── Skills ✅
│   └── Social Links ✅
│
├── 🎭 Animations
│   ├── Scroll Reveal ✅
│   ├── Typing Effect ✅
│   ├── Parallax ✅
│   ├── Hover 3D ✅
│   ├── Particles ✅
│   └── Smooth Transitions ✅
│
├── 🔧 Developer
│   ├── TypeScript ✅
│   ├── ESLint ✅
│   ├── Path Aliases ✅
│   ├── Hot Reload ✅
│   └── Type Safety ✅
│
└── 📚 Documentation
    ├── Setup Guide ✅
    ├── Architecture ✅
    ├── Deployment ✅
    ├── Sample Data ✅
    └── Contributing ✅
```

## 🌈 Color Palette

```
┌─────────────────────────────────────┐
│  Brand Colors                       │
├─────────────────────────────────────┤
│  🟣 Primary:       #6C5CE7         │
│  🟪 Primary Soft:  #A29BFE         │
│  🟢 Secondary:     #00B894         │
│  🔴 Accent:        #FF7675         │
├─────────────────────────────────────┤
│  Background Colors                  │
├─────────────────────────────────────┤
│  ⬜ BG Soft:       #F8FAFC         │
│  ⬛ BG Dark:       #0F172A         │
│  ⬜ Surface:       #FFFFFF         │
│  ⬛ Surface Dark:  #111827         │
├─────────────────────────────────────┤
│  Text Colors                        │
├─────────────────────────────────────┤
│  ⬛ Text:          #0F172A         │
│  ⬜ Text Light:    #FFFFFF         │
│  ⬜ Muted:         #6B7280         │
│  ⬜ Border:        #E5E7EB         │
└─────────────────────────────────────┘
```

## 📱 Responsive Breakpoints

```
Mobile:      < 640px   (sm)
Tablet:      640-768px (md)
Desktop:     768-1024px (lg)
Wide:        1024-1280px (xl)
Ultra Wide:  > 1280px (2xl)
```

---

**✨ Proyecto completo y listo para personalizar! ✨**

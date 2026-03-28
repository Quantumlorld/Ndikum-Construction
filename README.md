# Ndikum Construction Website

A premium hybrid industrial + intelligent system interface for Ndikum Construction - a data-driven construction company.

## 🚀 Features

- **Hero Section** with strong identity and system-focused messaging
- **Premium Auth System** with system access panel (Login/Register)
- **Intelligence System Section** showcasing AI-powered production
- **Metrics System** with animated count-up cards
- **Dashboard Section** with live production data
- **System Flow** visualization of production process
- **Production Capacity** showcase with machine status
- **Transparent Pricing Calculator** with cost breakdown
- **Smart Design Lab** for custom designs
- **Contact Section** with form and contact information

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)

## 🎨 Design System

- **Theme**: Premium Hybrid Industrial + Intelligent System
- **Colors**:
  - Background: Black (#000000) / White (#FFFFFF)
  - Primary: Blue (#2563EB)
  - Accent: Green (#16A34A)
  - Text: White / Black

- **Style**: Clean white sections, black contrast sections, smooth animations

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🏗️ Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/
│   ├── auth/              # Authentication components
│   │   └── AuthModal.tsx  # Login/Register modal
│   ├── layout/            # Layout components
│   │   └── Navigation.tsx # Main navigation
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── GlassCard.tsx
│   │   ├── MetricCard.tsx
│   │   └── VideoBackground.tsx
│   └── sections/          # Page sections
│       ├── Hero.tsx
│       ├── IntelligenceSystem.tsx
│       ├── MetricsSystem.tsx
│       ├── Dashboard.tsx
│       ├── SystemFlow.tsx
│       ├── ProductionCapacity.tsx
│       ├── PricingCalculator.tsx
│       ├── SmartDesignLab.tsx
│       └── Contact.tsx
├── lib/
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript types
```

## 🎥 Videos & Images

Place media files in `/public/`:
- `videos/hero-bg.mp4` - Hero section background
- `images/factory-machine.jpg` - Production machine images
- `images/block-machine.jpg` - Block production images

## 🎯 Key Features

- **System Interface**: High-end industrial + intelligent system feel
- **Premium Auth**: System access panel with professional design
- **Responsive Design**: Mobile-first approach
- **Performance Optimized**: Lazy loading, optimized animations
- **Interactive Elements**: Hover effects, smooth transitions
- **Real-time Calculations**: Live pricing calculator with cost breakdown
- **Modern UI**: Clean design with strategic color contrast

## 📱 Mobile Support

The website is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🚀 Deployment

Ready for deployment on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any platform supporting Next.js

## 📄 License

© 2024 Ndikum Construction. All rights reserved.

# Ndikum Construction Website

A futuristic, high-performance website for Ndikum Construction - a data-driven construction company.

## 🚀 Features

- **Hero Section** with video background and real-time metrics
- **Metrics System** with animated count-up cards
- **Dashboard Section** with video overlay and floating UI elements
- **System Flow** visualization of production process
- **Production Capacity** showcase
- **Pricing Calculator** with live cost calculations
- **Contact Section** with form and contact information

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)

## 🎨 Design System

- **Theme**: Dark Futuristic
- **Colors**:
  - Background: #0B0F19
  - Primary: #00D1FF (electric blue)
  - Accent: #F5B942 (gold)
  - Text: white / light gray

- **Style**: Glassmorphism cards, soft glow effects, smooth transitions

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
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── GlassCard.tsx
│   │   ├── MetricCard.tsx
│   │   └── VideoBackground.tsx
│   └── sections/          # Page sections
│       ├── Hero.tsx
│       ├── MetricsSystem.tsx
│       ├── Dashboard.tsx
│       ├── SystemFlow.tsx
│       ├── ProductionCapacity.tsx
│       ├── PricingCalculator.tsx
│       └── Contact.tsx
├── lib/
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript types
```

## 🎥 Videos

Place video files in `/public/videos/`:

- `hero-bg.mp4` - Hero section background
- `factory-operations.mp4` - Dashboard section
- `block-production.mp4` - Production capacity section

## 🎯 Key Features

- **Responsive Design**: Mobile-first approach
- **Performance Optimized**: Lazy loading, optimized animations
- **Interactive Elements**: Hover effects, smooth transitions
- **Real-time Calculations**: Live pricing calculator
- **Modern UI**: Glassmorphism, gradient effects, animations

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

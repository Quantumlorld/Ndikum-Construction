import { Navigation } from '@/components/layout/Navigation'
import { Hero } from '@/components/sections/Hero'
import { MetricsSystem } from '@/components/sections/MetricsSystem'
import { Dashboard } from '@/components/sections/Dashboard'
import { SystemFlow } from '@/components/sections/SystemFlow'
import { IntelligenceSystem } from '@/components/sections/IntelligenceSystem'
import { ProductionCapacity } from '@/components/sections/ProductionCapacity'
import { PricingCalculator } from '@/components/sections/PricingCalculator'
import { SmartDesignLab } from '@/components/sections/SmartDesignLab'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <MetricsSystem />
      <Dashboard />
      <SystemFlow />
      <IntelligenceSystem />
      <ProductionCapacity />
      <PricingCalculator />
      <SmartDesignLab />
      <Contact />
    </main>
  )
}

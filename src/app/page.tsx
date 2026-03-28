import { Navigation } from '@/components/layout/Navigation'
import { Hero } from '@/components/sections/Hero'
import { MetricsSystem } from '@/components/sections/MetricsSystem'
import { ProductionControlCenter } from '@/components/sections/ProductionControlCenter'
import { SystemFlow } from '@/components/sections/SystemFlow'
import { ProductionCapacity } from '@/components/sections/ProductionCapacity'
import { IntelligenceSystem } from '@/components/sections/IntelligenceSystem'
import { PricingCalculator } from '@/components/sections/PricingCalculator'
import { SmartDesignLab } from '@/components/sections/SmartDesignLab'
import { Contact } from '@/components/sections/Contact'
import { ToastNotifications } from '@/components/ui/ToastNotifications'
import { AppStateProvider } from '@/store/ProductionState'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export default function Home() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <main className="min-h-screen bg-white">
          <Navigation />
          <Hero />
          <MetricsSystem />
          <ProductionControlCenter />
          <SystemFlow />
          <ProductionCapacity />
          <IntelligenceSystem />
          <PricingCalculator />
          <SmartDesignLab />
          <Contact />
          <ToastNotifications />
        </main>
      </AppStateProvider>
    </ErrorBoundary>
  )
}

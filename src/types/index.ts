export interface Metric {
  id: string
  label: string
  value: number
  unit?: string
  trend?: number
  icon: React.ComponentType<{ className?: string }>
}

export interface ProcessStep {
  id: string
  title: string
  description: string
  icon: string
  video?: string
}

export interface PricingTier {
  id: string
  name: string
  price: number
  unit: string
  minQuantity: number
  features: string[]
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
}

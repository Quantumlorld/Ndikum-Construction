import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function animateValue(start: number, end: number, duration: number, callback: (value: number) => void) {
  const startTimestamp = Date.now()
  const step = () => {
    const timestamp = Date.now()
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    callback(Math.floor(progress * (end - start) + start))
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

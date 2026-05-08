import Stripe from 'stripe'

export const TEST_MODE = process.env.STRIPE_TEST_MODE === 'true'

export const stripe = TEST_MODE
  ? (null as unknown as Stripe)
  : new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export const PRICE_IDS: Record<string, string> = {
  individual: process.env.STRIPE_PRICE_INDIVIDUAL!,
  team:       process.env.STRIPE_PRICE_TEAM!,
  multi_bay:  process.env.STRIPE_PRICE_MULTI_BAY!,
}

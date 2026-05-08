import { NextRequest, NextResponse } from 'next/server'
import { stripe, TEST_MODE } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLAN_MAP: Record<string, string> = {
  [process.env.STRIPE_PRICE_INDIVIDUAL!]: 'individual',
  [process.env.STRIPE_PRICE_TEAM!]:       'team',
  [process.env.STRIPE_PRICE_MULTI_BAY!]:  'multi_bay',
}

export async function POST(request: NextRequest) {
  if (TEST_MODE) {
    return NextResponse.json({ received: true, test: true })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('[mechiq/webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan

        if (!userId || !plan) {
          console.error('[mechiq/webhook] Missing metadata:', session.id)
          break
        }

        const stripeCustomerId = session.customer as string

        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          tier: plan,
          status: 'active',
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: session.subscription as string,
          current_period_end: null,
        }, { onConflict: 'user_id' })

        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const priceId = sub.items.data[0]?.price.id
        const plan = PLAN_MAP[priceId] ?? 'individual'
        const periodEnd = new Date(sub.current_period_end * 1000).toISOString()

        const status = sub.status === 'active' ? 'active'
          : sub.status === 'past_due' ? 'past_due'
          : 'canceled'

        // Update by subscription ID (set on checkout.session.completed)
        // Also upsert by customer ID as a fallback for created events
        const { rowCount } = await supabaseAdmin
          .from('subscriptions')
          .update({ tier: plan, status, current_period_end: periodEnd })
          .eq('stripe_subscription_id', sub.id)
          .select('id')
          .then(r => ({ rowCount: r.data?.length ?? 0 }))

        if (rowCount === 0) {
          // Row not found by subscription ID — try customer ID
          await supabaseAdmin
            .from('subscriptions')
            .update({
              tier: plan, status, current_period_end: periodEnd,
              stripe_subscription_id: sub.id,
            })
            .eq('stripe_customer_id', sub.customer as string)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription

        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', sub.id)

        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('[mechiq/webhook] Handler error:', err)
  }

  return NextResponse.json({ received: true })
}

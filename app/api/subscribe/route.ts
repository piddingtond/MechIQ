import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICE_IDS, TEST_MODE } from '@/lib/stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const VALID_PLANS = ['individual', 'team', 'multi_bay'] as const
type Plan = typeof VALID_PLANS[number]

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    if (!VALID_PLANS.includes(plan as Plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    if (TEST_MODE) {
      return NextResponse.json({ url: `${origin}/dashboard?subscribed=1&plan=${plan}&test=1` })
    }

    const priceId = PRICE_IDS[plan as Plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
        plan,
      },
      success_url: `${origin}/dashboard?subscribed=1`,
      cancel_url: `${origin}/pricing`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('[mechiq/subscribe]', error)
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'An error occurred' : String(error) },
      { status: 500 }
    )
  }
}

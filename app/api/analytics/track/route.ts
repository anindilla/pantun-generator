import { NextRequest, NextResponse } from 'next/server'
import { saveAnalyticsEvent } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { event_type, event_data } = await request.json()

    if (!event_type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    // Save analytics event
    await saveAnalyticsEvent(event_type, event_data)

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}

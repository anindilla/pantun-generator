import { NextRequest, NextResponse } from 'next/server'
import { getPantunBySlug, incrementViewCount } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Get pantun from database
    const pantun = await getPantunBySlug(slug)

    if (!pantun) {
      return NextResponse.json(
        { error: 'Pantun not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await incrementViewCount(slug)

    return NextResponse.json({
      success: true,
      pantun: {
        id: pantun.id,
        slug: pantun.slug,
        content: pantun.content,
        mode: pantun.mode,
        created_at: pantun.created_at,
        view_count: pantun.view_count + 1
      }
    })
  } catch (error) {
    console.error('Error getting pantun:', error)
    return NextResponse.json(
      { error: 'Failed to get pantun' },
      { status: 500 }
    )
  }
}

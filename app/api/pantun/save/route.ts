import { NextRequest, NextResponse } from 'next/server'
import { savePantun } from '@/lib/db'
import { generateUniqueSlug } from '@/lib/slug-generator'

export async function POST(request: NextRequest) {
  try {
    const { content, mode } = await request.json()

    if (!content || !mode) {
      return NextResponse.json(
        { error: 'Content and mode are required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    const slug = generateUniqueSlug()

    // Save to database
    const pantun = await savePantun(slug, content, mode)

    return NextResponse.json({
      success: true,
      slug: pantun.slug,
      pantun: {
        id: pantun.id,
        slug: pantun.slug,
        content: pantun.content,
        mode: pantun.mode,
        created_at: pantun.created_at
      }
    })
  } catch (error) {
    console.error('Error saving pantun:', error)
    return NextResponse.json(
      { error: 'Failed to save pantun' },
      { status: 500 }
    )
  }
}

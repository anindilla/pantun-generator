import { sql } from '@vercel/postgres'

export interface Pantun {
  id: number
  slug: string
  content: string
  mode: string
  created_at: Date
  view_count: number
}

export interface AnalyticsEvent {
  id: number
  event_type: string
  event_data: any
  created_at: Date
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Check if database connection is available
    if (!process.env.POSTGRES_URL) {
      console.log('Database not configured, skipping initialization')
      return
    }

    // Create pantuns table
    await sql`
      CREATE TABLE IF NOT EXISTS pantuns (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        mode VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        view_count INTEGER DEFAULT 0
      );
    `

    // Create analytics_events table
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    console.log('Database tables initialized successfully')
  } catch (error) {
    console.log('Database initialization failed (optional):', error instanceof Error ? error.message : String(error))
    // Don't throw error - database is optional
  }
}

// Save pantun to database
export async function savePantun(slug: string, content: string, mode: string): Promise<Pantun> {
  try {
    if (!process.env.POSTGRES_URL) {
      throw new Error('Database not configured')
    }

    const result = await sql`
      INSERT INTO pantuns (slug, content, mode)
      VALUES (${slug}, ${content}, ${mode})
      RETURNING *
    `
    return result.rows[0] as Pantun
  } catch (error) {
    console.log('Database save failed (optional):', error instanceof Error ? error.message : String(error))
    throw error
  }
}

// Get pantun by slug
export async function getPantunBySlug(slug: string): Promise<Pantun | null> {
  try {
    if (!process.env.POSTGRES_URL) {
      return null
    }

    const result = await sql`
      SELECT * FROM pantuns WHERE slug = ${slug}
    `
    return result.rows[0] as Pantun || null
  } catch (error) {
    console.log('Database get failed (optional):', error instanceof Error ? error.message : String(error))
    return null
  }
}

// Increment view count
export async function incrementViewCount(slug: string): Promise<void> {
  try {
    if (!process.env.POSTGRES_URL) {
      return
    }

    await sql`
      UPDATE pantuns 
      SET view_count = view_count + 1 
      WHERE slug = ${slug}
    `
  } catch (error) {
    console.log('Database increment failed (optional):', error instanceof Error ? error.message : String(error))
  }
}

// Save analytics event
export async function saveAnalyticsEvent(eventType: string, eventData: any): Promise<void> {
  try {
    if (!process.env.POSTGRES_URL) {
      return
    }

    await sql`
      INSERT INTO analytics_events (event_type, event_data)
      VALUES (${eventType}, ${JSON.stringify(eventData)})
    `
  } catch (error) {
    console.log('Analytics save failed (optional):', error instanceof Error ? error.message : String(error))
  }
}

// Get analytics data
export async function getAnalyticsData() {
  try {
    if (!process.env.POSTGRES_URL) {
      return []
    }

    const events = await sql`
      SELECT event_type, COUNT(*) as count, 
             DATE_TRUNC('day', created_at) as date
      FROM analytics_events 
      GROUP BY event_type, DATE_TRUNC('day', created_at)
      ORDER BY date DESC
    `
    return events.rows
  } catch (error) {
    console.log('Analytics data failed (optional):', error instanceof Error ? error.message : String(error))
    return []
  }
}

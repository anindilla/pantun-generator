// Word lists for generating unique, memorable slugs
const adjectives = [
  'happy', 'sunny', 'bright', 'calm', 'swift', 'gentle', 'warm', 'cool',
  'fresh', 'sweet', 'kind', 'bold', 'wise', 'pure', 'clear', 'soft',
  'strong', 'quick', 'smooth', 'sharp', 'deep', 'wide', 'tall', 'small',
  'big', 'new', 'old', 'young', 'rich', 'poor', 'fast', 'slow'
]

const nouns = [
  'sunrise', 'sunset', 'moon', 'star', 'cloud', 'rain', 'wind', 'wave',
  'mountain', 'river', 'forest', 'flower', 'bird', 'fish', 'tree', 'leaf',
  'stone', 'sand', 'snow', 'ice', 'fire', 'light', 'shadow', 'dream',
  'hope', 'love', 'peace', 'joy', 'smile', 'laugh', 'song', 'dance'
]

export function generateSlug(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective}-${noun}`
}

export function generateUniqueSlug(): string {
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36)
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective}-${noun}-${timestamp}`
}

// Validate slug format
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z]+-[a-z]+(-[a-z0-9]+)?$/
  return slugRegex.test(slug)
}

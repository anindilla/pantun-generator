import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { mode, input, mood } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'API key tidak ditemukan. Silakan periksa konfigurasi.' }, { status: 500 })
    }

    console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length)
    console.log('GROQ_API_KEY starts with:', process.env.GROQ_API_KEY?.substring(0, 10))
    console.log('Environment check passed, proceeding with API call...')


    let systemPrompt = `You are an Indonesian pantun generator. Follow these rules strictly:

# STRUCTURE
- Always write exactly 4 lines.
- Follow rhyme pattern **a-b-a-b** with EXACT last 2 characters matching.
- Each line should have 8–12 syllables max.
- Two first lines = **sampiran** (intro or setup, usually about nature, daily life, or simple imagery).
- Two last lines = **isi** (the real meaning, emotion, or message).
- Sampiran and isi must sound naturally connected, not random.
- CRITICAL: Last 2 characters of line 1 must EXACTLY match line 3, line 2 must EXACTLY match line 4.

# STYLE
- Use natural, poetic, and fluent Indonesian.
- Avoid forced rhymes or weird word choices.
- Avoid any English words, slang, or unnatural mix of languages.
- DO NOT hallucinate or generate nonsense phrases.
- DO NOT make fantasy or surreal scenes (no dragons, planets, time travel, etc).
- Keep it grounded in real life, human emotion, and local imagery.
- Tone can be playful, romantic, funny, or emotional depending on request.

# STRICT GUIDELINES
- DO NOT break rhyme pattern (must be a-b-a-b).
- DO NOT write less or more than 4 lines.
- DO NOT explain or comment—output pantun only.
- DO NOT repeat same rhyme endings for all lines.
- DO NOT force words just to make it rhyme. If it sounds unnatural, change it.
- Example of GOOD pantun with EXACT rhyme:
  Jalan-jalan ke kota Blitar,  (ends with "ar")
  Beli onde di pinggir kali.   (ends with "li")
  Kalau hati sedang bergetar,  (ends with "ar" - EXACT match with line 1)
  Tandanya rindu mulai bersemi. (ends with "mi" - EXACT match with line 2)

Remember:
✅ Simple, rhythmic, emotionally natural.  
❌ No weird logic. No filler. No forced rhyme.  
❌ Never break the 4-line, a-b-a-b format.  
Output pantun only. No extra text.`

    let userPrompt = ''

    switch (mode) {
      case 'random':
        userPrompt = 'Generate a random pantun with natural rhyme a-b-a-b. Keep it simple and emotionally natural.'
        break
      
      case 'continue':
        const inputLines = input.trim().split('\n').filter((line: string) => line.trim())
        const lineCount = inputLines.length
        
        if (lineCount === 1) {
          userPrompt = `Complete this first line into a full 4-line pantun:\n"${input}"\n\nMaintain a-b-a-b rhyme. Lines 1-2 = sampiran, lines 3-4 = isi.`
        } else if (lineCount === 2) {
          userPrompt = `Complete this sampiran into a full 4-line pantun:\n"${input}"\n\nAdd 2 lines of isi with a-b-a-b rhyme.`
        } else if (lineCount === 3) {
          userPrompt = `Complete this pantun with the final line:\n"${input}"\n\nMaintain a-b-a-b rhyme pattern.`
        } else {
          userPrompt = `Fix this pantun to have correct structure:\n"${input}"\n\nEnsure 4 lines, a-b-a-b rhyme, lines 1-2 sampiran, lines 3-4 isi.`
        }
        break
      
      case 'mood':
        userPrompt = `Generate a pantun reflecting this mood: "${mood}". Lines 1-2 = sampiran (simple imagery), lines 3-4 = isi (emotion/message). Natural rhyme a-b-a-b.`
        break
      
      default:
        return NextResponse.json({ error: 'Mode tidak valid' }, { status: 400 })
    }

    // Function to validate word quality and prevent made-up words
    const validateWords = (pantun: string): boolean => {
      const words = pantun.toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .split(/\s+/)
      
      let suspiciousWords = 0
      for (const word of words) {
        // Check for suspicious patterns
        if (word.length > 20) return false // Too long
        if (word.includes('kan') && word.length > 8 && word.endsWith('kan')) {
          // Check for made-up -kan verbs
          const base = word.slice(0, -3)
          if (base.length > 5 && !isValidIndonesianBase(base)) {
            suspiciousWords++
          }
        }
        if (word.includes('an') && word.length > 10 && word.endsWith('an')) {
          // Check for made-up -an nouns
          const base = word.slice(0, -2)
          if (base.length > 6 && !isValidIndonesianBase(base)) {
            suspiciousWords++
          }
        }
      }
      
      // Allow max 1 suspicious word per pantun
      return suspiciousWords <= 1
    }

    // Helper function to check if a word base is valid Indonesian
    const isValidIndonesianBase = (base: string): boolean => {
      const commonBases = [
        'makan', 'minum', 'jalan', 'duduk', 'tidur', 'bangun', 'kerja', 'belajar',
        'membeli', 'menjual', 'membuat', 'mengajar', 'menulis', 'membaca',
        'rumah', 'sekolah', 'pasar', 'taman', 'pantai', 'gunung', 'sungai',
        'sayur', 'buah', 'ikan', 'ayam', 'sapi', 'kambing', 'kucing', 'anjing'
      ]
      return commonBases.some(common => base.includes(common) || common.includes(base))
    }

    // Function to validate semantic coherence
    const validateSemantics = (pantun: string): boolean => {
      const words = pantun.toLowerCase().split(/\s+/)
      const wordFreq = new Map()
      
      for (const word of words) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
      }
      
      // Flag if same uncommon word appears 3+ times
      let hasRepetitiveWords = false
      wordFreq.forEach((count, word) => {
        if (count >= 3 && word.length > 5) {
          hasRepetitiveWords = true
        }
      })
      
      return !hasRepetitiveWords
    }

    // Function to count syllables in Indonesian (approximate)
    const countSyllables = (word: string): number => {
      // Indonesian syllables are typically vowel-based
      const vowels = word.match(/[aiueo]/gi)
      return vowels ? vowels.length : 0
    }

    const validateSyllables = (pantun: string): boolean => {
      const lines = pantun.split('\n').filter((line: string) => line.trim())
      if (lines.length !== 4) return false
      
      for (const line of lines) {
        const words = line.trim().replace(/[.,!?;:]$/, '').split(/\s+/)
        const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0)
        
        // Allow 8-12 syllables per line (with some flexibility 7-14)
        if (syllableCount < 7 || syllableCount > 14) {
          console.log(`Line syllable count out of range: ${syllableCount} - "${line}"`)
          return false
        }
      }
      
      return true
    }

    // Function to validate rhyme pattern (a-b-a-b) with EXACT last 2 characters
    const validateRhyme = (pantun: string): boolean => {
      const lines = pantun.split('\n').filter((line: string) => line.trim())
      if (lines.length !== 4) return false
      
      const getLastTwoChars = (line: string): string => {
        const cleaned = line.trim().replace(/[.,!?;:]$/, '')
        const words = cleaned.split(' ')
        const lastWord = words[words.length - 1].toLowerCase()
        
        // Get exactly the last 2 characters
        return lastWord.slice(-2)
      }
      
      const rhyme1 = getLastTwoChars(lines[0])
      const rhyme2 = getLastTwoChars(lines[1])
      const rhyme3 = getLastTwoChars(lines[2])
      const rhyme4 = getLastTwoChars(lines[3])
      
      // Log for debugging
      console.log(`Rhyme validation: Line 1 (${rhyme1}) vs Line 3 (${rhyme3})`)
      console.log(`Rhyme validation: Line 2 (${rhyme2}) vs Line 4 (${rhyme4})`)
      
      // Check for EXACT character match (last 2 characters must be identical)
      const isRhyme1 = rhyme1 === rhyme3 && rhyme1.length === 2
      const isRhyme2 = rhyme2 === rhyme4 && rhyme2.length === 2
      const isDifferent = rhyme1 !== rhyme2
      
      console.log(`Rhyme validation result: ${isRhyme1 && isRhyme2 && isDifferent}`)
      
      return isRhyme1 && isRhyme2 && isDifferent
    }

    // Function to generate pantun with retry logic
    const generatePantunWithRetry = async (attempt: number = 1): Promise<string> => {
      // More conservative parameters for natural, high-quality output
      const temperature = attempt === 1 ? 0.7 : attempt === 2 ? 0.6 : 0.5
      const top_p = attempt === 1 ? 0.85 : attempt === 2 ? 0.8 : 0.75
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 200, // Increased from 150 for more flexibility
          temperature,
          top_p,
          frequency_penalty: 0.5, // Increased from 0.3 to reduce repetition
          presence_penalty: 0.3,  // Increased from 0.2 for more variety
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Groq API error response:', errorText)
        throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const completion = await response.json()
      const pantun = completion.choices[0]?.message?.content?.trim()

      if (!pantun) {
        throw new Error('Gagal menghasilkan pantun')
      }

      return pantun
    }

    // Fallback pantuns for when all attempts fail
    const fallbackPantuns = [
      "Jalan-jalan ke tepi pantai\nMelihat ombak bergulung-gulung\nHidup ini penuh arti\nJaga selalu hati yang tenang",
      "Bunga mawar di taman\nHarum semerbak di pagi hari\nCinta sejati takkan pudar\nSelamanya di dalam hati",
      "Ikan berenang di kolam\nAir jernih mengalir tenang\nBelajar rajin setiap hari\nAgar masa depan cerah",
      "Burung berkicau di dahan\nSuara merdu di pagi hari\nJangan pernah menyerah\nTerus berjuang dengan hati",
      "Matahari terbit di timur\nMenyinari bumi yang luas\nBerbuat baik setiap saat\nAgar hidup penuh berkah"
    ]

    // Try to generate pantun with validation and retry
    let pantun = ''
    let attempts = 0
    const maxAttempts = 5 // Increased from 3 for better quality assurance

    try {
      while (attempts < maxAttempts) {
        attempts++
        try {
          pantun = await generatePantunWithRetry(attempts)
          
          // Multi-stage validation
          const rhymeValid = validateRhyme(pantun)
          const wordsValid = validateWords(pantun)
          const semanticsValid = validateSemantics(pantun)
          const syllablesValid = validateSyllables(pantun) // NEW
          
          console.log(`Attempt ${attempts}: Rhyme=${rhymeValid}, Words=${wordsValid}, Semantics=${semanticsValid}, Syllables=${syllablesValid}`)
          
          if (rhymeValid && wordsValid && semanticsValid && syllablesValid) {
            console.log('All validations passed!')
            break
          } else if (attempts < maxAttempts) {
            console.log(`Attempt ${attempts}: Validation failed, retrying...`)
            continue
          } else {
            console.log('Max attempts reached, using fallback pantun')
            // Use fallback pantun when all attempts fail
            pantun = fallbackPantuns[Math.floor(Math.random() * fallbackPantuns.length)]
            break
          }
        } catch (error) {
          console.log(`Attempt ${attempts} failed:`, error instanceof Error ? error.message : String(error))
          if (attempts >= maxAttempts) {
            throw error
          }
        }
      }
    } catch (error) {
      console.log('All API attempts failed, using fallback pantun')
      pantun = fallbackPantuns[Math.floor(Math.random() * fallbackPantuns.length)]
    }

    return NextResponse.json({ pantun })

  } catch (error: any) {
    console.error('Error generating pantun:', error)
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Kuota API Groq habis. Silakan periksa billing Anda atau gunakan API key yang berbeda.' },
        { status: 402 }
      )
    }
    
    if (error.code === 'model_not_found') {
      return NextResponse.json(
        { error: 'Model tidak tersedia. Silakan periksa konfigurasi API.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghasilkan pantun. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

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

    // Function to normalize mood to basic categories
    const normalizeMood = (mood: string): string => {
      const moodLower = mood.toLowerCase()
      
      // Map complex moods to basic categories
      if (moodLower.includes('lapar') || moodLower.includes('hungry')) return 'lapar'
      if (moodLower.includes('sedih') || moodLower.includes('sad') || moodLower.includes('kehilangan')) return 'sedih'
      if (moodLower.includes('senang') || moodLower.includes('happy') || moodLower.includes('gembira')) return 'senang'
      if (moodLower.includes('marah') || moodLower.includes('angry') || moodLower.includes('kesal')) return 'marah'
      if (moodLower.includes('rindu') || moodLower.includes('kangen') || moodLower.includes('miss')) return 'rindu'
      if (moodLower.includes('cinta') || moodLower.includes('love') || moodLower.includes('sayang')) return 'cinta'
      if (moodLower.includes('takut') || moodLower.includes('afraid') || moodLower.includes('scared')) return 'takut'
      if (moodLower.includes('lelah') || moodLower.includes('tired') || moodLower.includes('capek')) return 'lelah'
      
      // Return original if no match
      return mood
    }

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
- DO NOT create made-up words or nonsensical phrases.
- DO NOT use words that don't exist in Indonesian language.
- DO NOT combine random syllables to create fake words.
- ONLY use real, common Indonesian words that people actually use.

# CRITICAL RHYME REQUIREMENTS
- Line 1 and Line 3 MUST end with EXACTLY the same sound/characters
- Line 2 and Line 4 MUST end with EXACTLY the same sound/characters  
- Line 1/3 and Line 2/4 must have DIFFERENT rhyme patterns
- Examples: "ang" rhymes with "ang", "at" rhymes with "at", "ah" rhymes with "ah"
- WRONG: "it" does NOT rhyme with "at" or "ah" or "an"
- The rhyme pattern is MANDATORY - no exceptions!
- Example of GOOD pantun with EXACT rhyme:
  Jalan-jalan ke kota Blitar,  (ends with "ar")
  Beli onde di pinggir kali.   (ends with "li")
  Kalau hati sedang bergetar,  (ends with "ar" - EXACT match with line 1)
  Tandanya rindu mulai bersemi. (ends with "mi" - EXACT match with line 2)

- Example of MOOD pantun (for "lapar"):
  Perut keroncongan tak tertahan,  (ends with "an")
  Aroma nasi gudeg menggiurkan.   (ends with "an")
  Lapar sekali ingin makan,        (ends with "an" - EXACT match with line 1)
  Segera ke warung untuk makan.   (ends with "an" - EXACT match with line 2)

# PERFECT EXAMPLES TO LEARN FROM:
Here are examples of EXCELLENT pantuns with perfect a-b-a-b rhyme patterns:

1. Humor/Jenaka:
   "Jalan-jalan ke pinggir empang,     (ends with "empang")
   Nemu katak di pinggir empang.       (ends with "empang")
   Hati siapa tak bimbang,            (ends with "bimbang")
   Kamu botak minta dikepang."         (ends with "kepang")
   Pattern: empang/empang/bimbang/kepang (a-b-a-b)

2. Social Commentary:
   "Emak nyapu pakai sapu lidi,        (ends with "lidi")
   Sudah lapar makan apa pun jadi.     (ends with "jadi")
   Tak ada kerja, nganggur pun jadi,   (ends with "jadi")
   Tak ada gigi, ompong pun jadi."      (ends with "jadi")
   Pattern: lidi/jadi/jadi/jadi (a-b-a-b)

3. Modern Life:
   "Aku ingin ke Korea Selatan,        (ends with "Selatan")
   Kamu justru ingin ke Jepang.       (ends with "Jepang")
   Walaupun kita sudah jadi mantan,   (ends with "mantan")
   Namun aku masih tetap sayang."      (ends with "sayang")
   Pattern: Selatan/Jepang/mantan/sayang (a-b-a-b)

4. Family Humor:
   "Kapal berlayar di Laut Jawa,       (ends with "Jawa")
   Nakhoda mengacungkan jempol.       (ends with "jempol")
   Adik menangis lalu tertawa,        (ends with "tertawa")
   Melihat kakak masih mengompol."     (ends with "mengompol")
   Pattern: Jawa/jempol/tertawa/mengompol (a-b-a-b)

5. Love/Romance:
   "Bunga mawar warnanya merah,        (ends with "merah")
   Mekar indah di taman hati.          (ends with "hati")
   Cintaku padamu takkan goyah,       (ends with "goyah")
   Sampai akhir hayat ini."            (ends with "ini")
   Pattern: merah/hati/goyah/ini (a-b-a-b)

6. Educational:
   "Ke pasar beli mangga muda,         (ends with "muda")
   Mangga dimakan manis terasa.        (ends with "terasa")
   Rajin belajar sepanjang masa,      (ends with "masa")
   Agar kelak hidup bahagia."          (ends with "bahagia")
   Pattern: muda/terasa/masa/bahagia (a-b-a-b)

STUDY THESE EXAMPLES CAREFULLY:
- Notice how Line 1 & 3 ALWAYS end with the SAME sound/characters
- Notice how Line 2 & 4 ALWAYS end with the SAME sound/characters  
- Notice how the two rhyme patterns are DIFFERENT from each other
- Notice the natural, flowing language
- Notice the meaningful content that makes sense
- Notice the proper Indonesian word usage

# EXAMPLES OF WHAT NOT TO DO:
❌ WRONG - Made-up words:
  "Berkelanjutan dengan berkelanjutan" (berkelanjutan is not a real word)
  "Menggembirakan hati yang menggembirakan" (redundant and unnatural)

❌ WRONG - Nonsensical phrases:
  "Matahari terbit di malam hari" (contradictory)
  "Air mengalir ke atas gunung" (impossible)

❌ WRONG - Forced rhymes with fake words:
  "Hati yang bergetar-getaran" (bergetar-getaran is not a real word)
  "Mata yang berkedip-kedipan" (berkedip-kedipan is not a real word)

Remember:
✅ Simple, rhythmic, emotionally natural.  
❌ No weird logic. No filler. No forced rhyme.  
❌ No made-up words. No nonsensical phrases.  
❌ Never break the 4-line, a-b-a-b format.  
Output pantun only. No extra text.`

    let userPrompt = ''

    switch (mode) {
      case 'random':
        userPrompt = `Generate a random pantun with natural rhyme a-b-a-b. 

STUDY THE EXAMPLES IN THE SYSTEM PROMPT - they show perfect a-b-a-b patterns:
- Use natural, flowing Indonesian language like the examples
- Make it meaningful and interesting like the humor/social commentary examples
- Follow the exact rhyme pattern like the examples
- Be creative but keep it grounded in real life
- Keep it simple and emotionally natural.`
        break
      
      case 'continue':
        const inputLines = input.trim().split('\n').filter((line: string) => line.trim())
        const lineCount = inputLines.length
        
        if (lineCount === 1) {
          userPrompt = `CRITICAL: You MUST continue from the given first line. Do NOT create a completely new pantun.

Complete this first line into a full 4-line pantun:
"${input}"

REQUIREMENTS:
- MUST use the given first line exactly as provided
- Add 3 more lines to complete the pantun
- Maintain a-b-a-b rhyme pattern
- Lines 1-2 = sampiran (imagery), lines 3-4 = isi (meaning)
- Use natural, flowing Indonesian language
- Make it meaningful and connected to the input line`
        } else if (lineCount === 2) {
          userPrompt = `CRITICAL: You MUST continue from the given sampiran. Do NOT create a completely new pantun.

Complete this sampiran into a full 4-line pantun:
"${input}"

REQUIREMENTS:
- MUST use the given 2 lines exactly as provided
- Add 2 more lines (isi) to complete the pantun
- Maintain a-b-a-b rhyme pattern
- Lines 1-2 = sampiran (given), lines 3-4 = isi (new)
- Use natural, flowing Indonesian language
- Make it meaningful and connected to the given sampiran`
        } else if (lineCount === 3) {
          userPrompt = `CRITICAL: You MUST continue from the given 3 lines. Do NOT create a completely new pantun.

Complete this pantun with the final line:
"${input}"

REQUIREMENTS:
- MUST use the given 3 lines exactly as provided
- Add only 1 final line to complete the pantun
- Maintain a-b-a-b rhyme pattern
- The final line must rhyme with line 2
- Use natural, flowing Indonesian language
- Make it meaningful and connected to the given lines`
        } else {
          userPrompt = `CRITICAL: You MUST fix the given pantun. Do NOT create a completely new pantun.

Fix this pantun to have correct structure:
"${input}"

REQUIREMENTS:
- MUST use the given lines as the foundation
- Fix the structure to be 4 lines with a-b-a-b rhyme
- Lines 1-2 = sampiran, lines 3-4 = isi
- Use natural, flowing Indonesian language
- Make it meaningful and connected to the given content`
        }
        break
      
      case 'mood':
        const normalizedMood = normalizeMood(mood || '')
        userPrompt = `Generate a pantun about this specific mood: "${normalizedMood}"

STUDY THE EXAMPLES IN THE SYSTEM PROMPT - they show perfect a-b-a-b patterns:
- Use natural, flowing Indonesian language like the examples
- Make it meaningful and connected to the mood
- Follow the exact rhyme pattern like the examples
- Be creative but keep it grounded in real life

CRITICAL: The pantun MUST be about this mood. The content and imagery should relate to the feeling.

Mood-specific guidance:
- "lapar": Write about hunger, food, eating, appetite, stomach, cooking, or meals
- "sedih": Write about sadness, tears, loneliness, loss, grief, or melancholy
- "senang": Write about happiness, joy, laughter, celebration, or cheerfulness
- "marah": Write about anger, frustration, annoyance, or rage
- "rindu": Write about longing, missing someone, distance, or wanting to return
- "cinta": Write about love, affection, romance, or devotion
- "takut": Write about fear, worry, anxiety, or being scared
- "lelah": Write about tiredness, exhaustion, rest, or fatigue

Structure:
- Lines 1-2: sampiran (imagery that evokes the mood)
- Lines 3-4: isi (directly expresses the feeling or situation)
- Must have a-b-a-b rhyme with exact last 2 characters matching

Example for "sedih":
Hujan turun di malam hari,
Suara rintik menambah pilu.
Hati ini penuh nestapa,
Air mata tak bisa tertahan.

Example for "lapar":
Perut keroncongan tak tertahan,
Aroma nasi gudeg menggiurkan.
Lapar sekali ingin makan,
Segera ke warung untuk makan.`
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
      const madeUpWords: string[] = []
      
      for (const word of words) {
        // Check for suspicious patterns
        if (word.length > 15) {
          console.log(`Suspicious long word: ${word}`)
          suspiciousWords++
          madeUpWords.push(word)
        }
        
        // Check for made-up suffixes with stricter validation
        if (word.endsWith('kan') && word.length > 6) {
          const base = word.slice(0, -3)
          if (!isValidIndonesianBase(base) && !isCommonIndonesianWord(base)) {
            console.log(`Suspicious -kan suffix: ${word} (base: ${base})`)
            suspiciousWords++
            madeUpWords.push(word)
          }
        }
        
        if (word.endsWith('an') && word.length > 5) {
          const base = word.slice(0, -2)
          if (!isValidIndonesianBase(base) && !isCommonIndonesianWord(base)) {
            console.log(`Suspicious -an suffix: ${word} (base: ${base})`)
            suspiciousWords++
            madeUpWords.push(word)
          }
        }
        
        // Check for made-up prefixes
        if (word.startsWith('ber') && word.length > 6) {
          const base = word.slice(3)
          if (!isValidIndonesianBase(base) && !isCommonIndonesianWord(base)) {
            console.log(`Suspicious ber- prefix: ${word} (base: ${base})`)
            suspiciousWords++
            madeUpWords.push(word)
          }
        }
        
        // Check for completely made-up words (no common patterns)
        if (word.length > 4 && !isCommonIndonesianWord(word) && !isValidIndonesianBase(word)) {
          console.log(`Potentially made-up word: ${word}`)
          suspiciousWords++
          madeUpWords.push(word)
        }
      }
      
      // More lenient validation - allow some suspicious words but not too many
      const isValid = suspiciousWords <= 2 // Allow 2 suspicious words
      if (!isValid) {
        console.log(`Word validation failed. Made-up words: ${madeUpWords.join(', ')}`)
      }
      console.log(`Word validation: ${suspiciousWords} suspicious words, valid: ${isValid}`)
      return isValid
    }

    // Helper function to check if a word base is valid Indonesian
    const isValidIndonesianBase = (base: string): boolean => {
      // Common Indonesian word patterns
      const validPatterns = [
        /^[a-z]{2,6}$/, // Basic 2-6 letter words
        /^ber[a-z]{2,6}$/, // ber- prefix
        /^ter[a-z]{2,6}$/, // ter- prefix
        /^me[a-z]{2,6}$/, // me- prefix
        /^di[a-z]{2,6}$/, // di- prefix
        /^ke[a-z]{2,6}$/, // ke- prefix
        /^se[a-z]{2,6}$/, // se- prefix
        /^pe[a-z]{2,6}$/, // pe- prefix
      ]
      
      return validPatterns.some(pattern => pattern.test(base))
    }
    
    // Helper function to check if a word is a common Indonesian word
    const isCommonIndonesianWord = (word: string): boolean => {
      const commonWords = [
        // Basic words
        'aku', 'kamu', 'dia', 'kita', 'kami', 'mereka', 'saya', 'anda',
        'ini', 'itu', 'sana', 'sini', 'mana', 'kapan', 'bagaimana', 'mengapa',
        'yang', 'dengan', 'untuk', 'dari', 'ke', 'di', 'pada', 'dalam', 'atas', 'bawah',
        'besar', 'kecil', 'tinggi', 'rendah', 'panjang', 'pendek', 'lebar', 'sempit',
        'baik', 'buruk', 'bagus', 'jelek', 'cantik', 'ganteng', 'tampan', 'cantik',
        'makan', 'minum', 'tidur', 'bangun', 'jalan', 'lari', 'duduk', 'berdiri',
        'rumah', 'kantor', 'sekolah', 'toko', 'pasar', 'jalan', 'jalanan', 'jalan',
        'matahari', 'bulan', 'bintang', 'langit', 'bumi', 'air', 'api', 'angin',
        'hujan', 'salju', 'panas', 'dingin', 'hangat', 'sejuk', 'lembab', 'kering',
        'senang', 'sedih', 'marah', 'takut', 'gembira', 'bahagia', 'susah', 'sulit',
        'mudah', 'sulit', 'cepat', 'lambat', 'baru', 'lama', 'tua', 'muda',
        'lapar', 'kenyang', 'haus', 'dahaga', 'lelah', 'capek', 'segar', 'sehat',
        'sakit', 'sehat', 'kuat', 'lemah', 'gemuk', 'kurus', 'tinggi', 'pendek',
        'cinta', 'sayang', 'kasih', 'rindu', 'kangen', 'benci', 'marah', 'kesal',
        'teman', 'sahabat', 'keluarga', 'ibu', 'bapak', 'ayah', 'ibu', 'anak',
        'kakak', 'adik', 'nenek', 'kakek', 'paman', 'bibi', 'sepupu', 'saudara',
        'buku', 'pena', 'pensil', 'kertas', 'meja', 'kursi', 'pintu', 'jendela',
        'lampu', 'listrik', 'telepon', 'komputer', 'internet', 'televisi', 'radio',
        'mobil', 'motor', 'sepeda', 'pesawat', 'kapal', 'kereta', 'bus', 'taksi',
        'uang', 'duit', 'rupiah', 'dollar', 'murah', 'mahal', 'gratis', 'bayar',
        'beli', 'jual', 'toko', 'pasar', 'warung', 'restoran', 'kafe', 'hotel',
        'makanan', 'minuman', 'nasi', 'roti', 'daging', 'ikan', 'sayur', 'buah',
        'air', 'susu', 'kopi', 'teh', 'jus', 'soda', 'bir', 'wine', 'minuman',
        'pakaian', 'baju', 'celana', 'rok', 'sepatu', 'sandal', 'topi', 'jaket',
        'warna', 'merah', 'biru', 'kuning', 'hijau', 'hitam', 'putih', 'abu-abu',
        'bentuk', 'bulat', 'kotak', 'segitiga', 'persegi', 'lingkaran', 'garis',
        'waktu', 'jam', 'menit', 'detik', 'hari', 'minggu', 'bulan', 'tahun',
        'pagi', 'siang', 'sore', 'malam', 'senin', 'selasa', 'rabu', 'kamis',
        'jumat', 'sabtu', 'minggu', 'januari', 'februari', 'maret', 'april',
        'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
      ]
      
      return commonWords.includes(word.toLowerCase())
    }

    // Function to validate semantic coherence
    const validateSemantics = (pantun: string): boolean => {
      const words = pantun.toLowerCase().split(/\s+/)
      const wordFreq = new Map()
      
      for (const word of words) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
      }
      
      // Flag if same uncommon word appears 4+ times (more lenient)
      let hasRepetitiveWords = false
      wordFreq.forEach((count, word) => {
        if (count >= 4 && word.length > 6) {
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

    // Function to validate mood correlation for mood mode
    const validateMood = (pantun: string, mood: string): boolean => {
      if (mode !== 'mood') return true // Skip validation for non-mood modes
      
      const pantunText = pantun.toLowerCase()
      const normalizedMood = normalizeMood(mood)
      const moodLower = normalizedMood.toLowerCase()
      
      console.log(`Mood validation: checking normalized mood="${normalizedMood}" (original: "${mood}") against pantun`)
      
      // Check for mood-specific keywords (using expanded list from step 1)
      const moodKeywords = {
        'lapar': ['lapar', 'makan', 'perut', 'nasi', 'makanan', 'keroncongan', 'kenyang', 'haus', 'menu', 'warung', 'dapur', 'masak', 'hidangan'],
        'sedih': ['sedih', 'menangis', 'air mata', 'pilu', 'duka', 'nestapa', 'tangis', 'lara', 'derita', 'sendu', 'murung', 'galau', 'sepi', 'sunyi', 'rindu', 'kehilangan'],
        'senang': ['senang', 'gembira', 'bahagia', 'ceria', 'riang', 'suka', 'tertawa', 'senyum', 'girang', 'sukacita', 'bangga'],
        'marah': ['marah', 'kesal', 'geram', 'murka', 'dendam', 'jengkel', 'dongkol', 'berang'],
        'rindu': ['rindu', 'kangen', 'merindukan', 'ingin', 'jauh', 'pergi', 'pulang', 'kembali'],
        'cinta': ['cinta', 'sayang', 'kasih', 'hati', 'jatuh cinta', 'mencintai', 'kekasih', 'pacar'],
        'takut': ['takut', 'ngeri', 'seram', 'gentar', 'cemas', 'khawatir', 'was-was'],
        'lelah': ['lelah', 'capek', 'penat', 'letih', 'istirahat', 'tidur', 'rehat']
      }
      
      // Find matching mood category
      let expectedKeywords: string[] = []
      for (const [moodKey, keywords] of Object.entries(moodKeywords)) {
        if (moodLower === moodKey) {
          expectedKeywords = keywords
          console.log(`Found mood category: ${moodKey}, checking ${keywords.length} keywords`)
          break
        }
      }
      
      // If no specific mood found, check if mood words appear in pantun
      if (expectedKeywords.length === 0) {
        const moodWords = moodLower.split(' ').filter(word => word.length > 2)
        console.log(`No specific mood category found, checking mood words: ${moodWords.join(', ')}`)
        const hasMoodWords = moodWords.some(word => pantunText.includes(word))
        console.log(`Mood validation result: ${hasMoodWords}`)
        return hasMoodWords
      }
      
      // Check if any expected keywords appear in the pantun
      const hasMoodKeywords = expectedKeywords.some(keyword => pantunText.includes(keyword))
      const matchedKeywords = expectedKeywords.filter(keyword => pantunText.includes(keyword))
      console.log(`Found keywords in pantun: ${matchedKeywords.join(', ') || 'none'}`)
      console.log(`Mood validation result: ${hasMoodKeywords}`)
      return hasMoodKeywords
    }

    // Function to validate rhyme pattern (a-b-a-b) with EXACT character matching
    const validateRhyme = (pantun: string): boolean => {
      const lines = pantun.split('\n').filter((line: string) => line.trim())
      if (lines.length !== 4) return false
      
      const getRhymeEnding = (line: string): string => {
        const cleaned = line.trim().replace(/[.,!?;:]$/, '')
        const words = cleaned.split(' ')
        const lastWord = words[words.length - 1].toLowerCase()
        
        // For compound words like "bergulung-gulung", take the last part
        const compoundParts = lastWord.split('-')
        const actualLastWord = compoundParts[compoundParts.length - 1]
        
        // Try 3 characters first for common Indonesian endings
        if (actualLastWord.length >= 3) {
          const threeChars = actualLastWord.slice(-3)
          // Check for common Indonesian 3-character endings
          if (['ang', 'ung', 'ing', 'ong', 'eng'].includes(threeChars)) {
            return threeChars
          }
        }
        
        // Try 2 characters for shorter endings
        if (actualLastWord.length >= 2) {
          const twoChars = actualLastWord.slice(-2)
          // Check for common Indonesian 2-character endings
          if (['an', 'un', 'in', 'on', 'en', 'at', 'it', 'ut', 'ot', 'et', 'ar', 'er', 'ir', 'or', 'ur', 'as', 'es', 'is', 'os', 'us', 'ah', 'eh', 'ih', 'oh', 'uh', 'ai', 'ti', 'si', 'ni', 'mi', 'li', 'ki', 'gi', 'di', 'bi', 'pi'].includes(twoChars)) {
            return twoChars
          }
        }
        
        // Fallback to last 2 characters
        return actualLastWord.slice(-2)
      }
      
      const rhyme1 = getRhymeEnding(lines[0])
      const rhyme2 = getRhymeEnding(lines[1])
      const rhyme3 = getRhymeEnding(lines[2])
      const rhyme4 = getRhymeEnding(lines[3])
      
      // Log for debugging
      console.log(`Rhyme validation: Line 1 (${rhyme1}) vs Line 3 (${rhyme3})`)
      console.log(`Rhyme validation: Line 2 (${rhyme2}) vs Line 4 (${rhyme4})`)
      
      // Check for EXACT character match - must be identical
      const isRhyme1 = rhyme1 === rhyme3 && rhyme1.length >= 2
      const isRhyme2 = rhyme2 === rhyme4 && rhyme2.length >= 2
      const isDifferent = rhyme1 !== rhyme2
      
      console.log(`Rhyme validation details:`)
      console.log(`- Line 1 & 3 match: ${isRhyme1} (${rhyme1} === ${rhyme3})`)
      console.log(`- Line 2 & 4 match: ${isRhyme2} (${rhyme2} === ${rhyme4})`)
      console.log(`- Different rhyme patterns: ${isDifferent} (${rhyme1} !== ${rhyme2})`)
      console.log(`- Final result: ${isRhyme1 && isRhyme2 && isDifferent}`)
      
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

    // Mood-specific fallback pantuns
    const moodFallbackPantuns: Record<string, string[]> = {
      'lapar': [
        "Perut keroncongan tak tertahan,\nAroma nasi gudeg menggiurkan.\nLapar sekali ingin makan,\nSegera ke warung untuk makan.",
        "Matahari tinggi di langit sana,\nPerut kosong mulai berbunyi.\nMakanan lezat yang diimpikan,\nSegera datang untuk mengisi."
      ],
      'sedih': [
        "Hujan turun di malam hari,\nSuara rintik menambah pilu.\nHati ini penuh nestapa,\nAir mata tak bisa tertahan.",
        "Burung terbang jauh ke langit,\nMeninggalkan sarang yang sunyi.\nHati ini terasa sakit,\nKehilangan yang tak terlupakan."
      ],
      'senang': [
        "Bunga mawar warnanya merah,\nMekar indah di taman hati.\nCintaku padamu takkan goyah,\nSampai akhir hayat ini.",
        "Jalan-jalan ke kota tua,\nBeli oleh-oleh manisan pepaya.\nCinta kita setia selamanya,\nBerdua selalu dalam bahagia."
      ],
      'marah': [
        "Guntur menggelegar di langit,\nPetir menyambar dengan dahsyat.\nHati ini penuh amarah,\nKesal yang sulit tertahankan.",
        "Api membara di tungku panas,\nNyala merah menjilat-jilat.\nKemarahan memuncak lepas,\nEmosi yang sulit dikendalikan."
      ],
      'rindu': [
        "Burung terbang jauh ke langit,\nMeninggalkan sarang yang sunyi.\nRindu ini terasa sakit,\nIngin bertemu kembali.",
        "Bulan bersinar di malam sepi,\nBintang berkelap-kelip jauh.\nHati ini penuh rindu,\nIngin kembali ke pelukmu."
      ],
      'cinta': [
        "Bunga mawar di taman indah,\nHarum semerbak di pagi hari.\nCinta sejati takkan pudar,\nSelamanya di dalam hati.",
        "Matahari terbit di timur,\nMenyinari bumi yang luas.\nCinta ini takkan surut,\nSelamanya untukmu saja."
      ],
      'takut': [
        "Malam gelap tanpa bintang,\nSuara angin menakutkan.\nHati ini penuh ketakutan,\nCemas yang sulit hilangkan.",
        "Bayangan hitam di kegelapan,\nSuara gemuruh menggelegar.\nRasa takut melanda jiwa,\nKhawatir yang tak terkira."
      ],
      'lelah': [
        "Matahari tenggelam di barat,\nSinar redup mulai padam.\nBadan ini terasa lelah,\nIngin segera beristirahat.",
        "Burung pulang ke sarangnya,\nSetelah seharian terbang.\nTubuh ini penuh kelelahan,\nIngin tidur dengan tenang."
      ],
      'default': [
        "Jalan-jalan ke kota Blitar,\nBeli onde di pinggir kali.\nKalau hati sedang bergetar,\nTandanya rindu mulai bersemi.",
        "Bunga mawar warnanya merah,\nMekar indah di taman hati.\nCintaku padamu takkan goyah,\nSampai akhir hayat ini.",
        "Ke pasar beli mangga muda,\nMangga dimakan manis terasa.\nRajin belajar sepanjang masa,\nAgar kelak hidup bahagia.",
        "Burung berkicau di pagi hari,\nSuara merdu mengisi udara.\nHati yang bersih dan suci,\nMembawa damai sepanjang masa.",
        "Matahari terbit di pagi hari,\nCahaya menyinari bumi pertiwi.\nGuru adalah pahlawan sejati,\nMenyebar ilmu demi generasi.",
        "Terbang tinggi si burung dara,\nHinggap sebentar di pohon jati.\nJangan biarkan hati terluka,\nMeski cobaan datang silih berganti.",
        "Menyusur pantai saat senja,\nOmbak tenang di tepi laut.\nMeski hidup penuh duka,\nTetaplah kuat, jangan surut.",
        "Beli baju warna biru,\nUntuk dipakai saat ke kota.\nJika mimpi besar yang kau tuju,\nRajin belajar hingga dewasa.",
        "Daun jatuh dari rantingnya,\nAngin datang menyapa ringan.\nSetiap langkah punya maknanya,\nUntuk kuatkan jiwa yang bertahan.",
        "Ke pasar beli si buah naga,\nDimasukkan ke dalam tas merah.\nJangan kau takut pada gagal,\nKarena sukses ada setelah lelah.",
        "Jalan-jalan ke pinggir empang,\nNemu katak di pinggir empang.\nHati siapa tak bimbang,\nKamu botak minta dikepang.",
        "Ke SPBU membeli bensin,\nBensin bagus di Pangandaran.\nMenahan diri agar tak bersin,\nMalah kentut tak tertahankan.",
        "Kapal berlayar di Laut Jawa,\nNakhoda mengacungkan jempol.\nAdik menangis lalu tertawa,\nMelihat kakak masih mengompol.",
        "Duduk di atap si kucing betina,\nTak hentinya mengeong-ngeong.\nKulihat wanita cantik jelita,\nMalang melanda punggungnya bolong.",
        "Emak nyapu pakai sapu lidi,\nSudah lapar makan apa pun jadi.\nTak ada kerja, nganggur pun jadi,\nTak ada gigi, ompong pun jadi.",
        "Pohon hijau daun rindang,\nEnak sekali mata memandang.\nAda uang, Abang kusayang,\nNggak ada uang, Abang kutendang.",
        "Burung terbang memakai topi,\nTerbawa ke awan seperti mimpi.\nTertawa hari karena geli,\nMelihat kuda asyik bernyanyi.",
        "Hujan rintik ada payung,\nPayung terbang entah ke mana.\nAnda bingung, saya pun bingung,\nEh, ini pantun maksudnya apa.",
        "Kue klepon bertabur kelapa,\nSungguh unik bentuknya bulat.\nSaya geli melihat papa,\nTertawa lebar kemasukan lalat.",
        "Aku ingin ke Korea Selatan,\nKamu justru ingin ke Jepang.\nWalaupun kita sudah jadi mantan,\nNamun aku masih tetap sayang.",
        "Tumbuh ilalang di semak-semak,\nSemak-semak lalu dibersihkan.\nMemang the power of emak-emak,\nSein ke kiri, belok ke kanan.",
        "Si Tono rambutnya jambul,\nSuka diam di atas genteng.\nBiar dikata kurang gaul,\nYang penting tetap ganteng.",
        "Narapidana lepas pergi kabur,\nBerliku jalan naik ke bukit.\nBadanku sudah penat ingin tidur,\nTapi dompetku kosong perlu duit.",
        "Sungguhlah besar hewan badak,\nJika berjalan terseok-seok.\nNenek tertawa terbahak-bahak,\nMelihat kakek bermain TikTok.",
        "Rambut memiliki kutu,\nIngin aku gosok pakai batu.\nAda gajah di mata aku,\nGajahnya itu ialah kamu.",
        "Masak terigu masak tumis,\nDiiris tipis sampai habis.\nMalam minggu hujan gerimis,\nDompet tipis semakin kritis.",
        "Nonton TV acara si Unyil,\nNontonnya sambil rebahan.\nKenangan indah masa kecil,\nTidak pernah terima tagihan.",
        "Anak kucing bermain tali,\nKera duduk membaca koran.\nBagaimana hati tak geli,\nKepala botak suka sisiran.",
        "Pergi ke hutan bertemu gajah,\nGajah lari dikejar kanguru.\nAku sudah siap berangkat sekolah,\nTernyata sekarang hari Minggu.",
        "Pak Tegus pergi ke Bali,\nMelihat bule sedang menari.\nAduh pantas kau bau sekali,\nKau belum mandi enam hari.",
        "Tetangga baru namanya Rahmat,\nPunya istri namanya Cua.\nKakek cerita terlalu semangat,\nGigi palsunya copot semua.",
        "Good morning,\nSelamat pagi.\nGigi kuning,\nNggak pernah gosok gigi.",
        "Buah belimbing buah manggis,\nBuah cokelat sebesar mempelam.\nSaya tertawa sambil menangis,\nMelihat Kakak dikejar ayam.",
        "Ikan gabus di rawa-rawa,\nIkan belut nyangkut di jaring.\nPerutku sakit menahan tawa,\nGigi palsu meloncat ke piring.",
        "Anak ayam turun sepuluh,\nMati satu tinggal sembilan.\nMati dua sisa tujuh,\nHidup satu jadi delapan.",
        "Bunga anggrek warna kelabu,\nDaun diramu jadi obat.\nSungguh kesal hati Ibu,\nAdik ngompol langsung disunat.",
        "Duduk santai membaca koran,\nMembacanya sambil makan petisan.\nSeenak-enaknya makan di restoran,\nLebih enak makan gratisan.",
        "Burung gelatik,\nLagi hinggap di batu.\nKamu memang cantik,\nTapi kok badannya bau.",
        "Jalan-jalan bersama putri,\nLihat kucing lagi kerokan.\nEmang nasib aku ini,\nSudah tampan jadi rebutan."
      ]
    }

    // Function to get mood-specific fallback pantun
    const getMoodFallbackPantun = (mood: string): string => {
      const normalizedMood = normalizeMood(mood)
      const fallbacks = moodFallbackPantuns[normalizedMood] || moodFallbackPantuns['default']
      return fallbacks[Math.floor(Math.random() * fallbacks.length)]
    }

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
        const syllablesValid = validateSyllables(pantun)
        const moodValid = validateMood(pantun, mood || '')
        
        console.log(`Attempt ${attempts}: Rhyme=${rhymeValid}, Words=${wordsValid}, Semantics=${semanticsValid}, Syllables=${syllablesValid}, Mood=${moodValid}`)
        
        // RHYME VALIDATION IS MANDATORY - NO EXCEPTIONS
        if (!rhymeValid) {
          console.log(`Attempt ${attempts}: RHYME VALIDATION FAILED - This is mandatory!`)
          if (attempts < maxAttempts) {
            console.log(`Retrying due to rhyme failure...`)
            continue
          } else {
            console.log('Max attempts reached, using fallback pantun')
            pantun = getMoodFallbackPantun(mood || '')
            break
          }
        }
        
        // For mood mode, require all validations. For other modes, be more lenient
        const isFullyValid = rhymeValid && wordsValid && semanticsValid && syllablesValid && moodValid
        const isPartiallyValid = rhymeValid && wordsValid && (mode !== 'mood' || moodValid)
        const isBasicValid = rhymeValid && (mode !== 'mood' || moodValid) // Just rhyme + mood for mood mode
        
        if (isFullyValid || (isPartiallyValid && attempts >= 2) || (isBasicValid && attempts >= 3)) {
          console.log('Validation passed!')
          break
        } else if (attempts < maxAttempts) {
          console.log(`Attempt ${attempts}: Other validation failed, retrying...`)
          continue
        } else {
          console.log('Max attempts reached, using fallback pantun')
          // Use mood-specific fallback pantun
          pantun = getMoodFallbackPantun(mood || '')
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
      console.log('All API attempts failed, using mood-specific fallback pantun')
      pantun = getMoodFallbackPantun(mood || '')
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

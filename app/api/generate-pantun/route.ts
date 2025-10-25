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
        const normalizedMood = normalizeMood(mood || '')
        userPrompt = `Generate a pantun about this specific mood: "${normalizedMood}"

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
      
      // Stricter validation - reject if any clearly made-up words
      const isValid = suspiciousWords === 0
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
        
        // Try 3 characters first for common Indonesian endings
        if (lastWord.length >= 3) {
          const threeChars = lastWord.slice(-3)
          // Check for common Indonesian 3-character endings
          if (['ang', 'ung', 'ing', 'ong', 'eng'].includes(threeChars)) {
            return threeChars
          }
        }
        
        // Try 2 characters for shorter endings
        if (lastWord.length >= 2) {
          const twoChars = lastWord.slice(-2)
          // Check for common Indonesian 2-character endings
          if (['an', 'un', 'in', 'on', 'en', 'at', 'it', 'ut', 'ot', 'et', 'ar', 'er', 'ir', 'or', 'ur', 'as', 'es', 'is', 'os', 'us', 'ah', 'eh', 'ih', 'oh', 'uh'].includes(twoChars)) {
            return twoChars
          }
        }
        
        // Fallback to last 2 characters
        return lastWord.slice(-2)
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
        "Matahari bersinar cerah,\nBurung berkicau riang gembira.\nHati ini penuh sukacita,\nBahagia rasanya tiada tara.",
        "Bunga mekar di taman indah,\nWarna-warni menghiasi pagi.\nSenyuman lebar di wajah,\nKegembiraan memenuhi hati."
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
        "Jalan-jalan ke tepi pantai,\nMelihat ombak bergulung-gulung.\nHidup ini penuh arti,\nJaga selalu hati yang tenang."
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
        const moodValid = validateMood(pantun, mood || '') // NEW
        
        console.log(`Attempt ${attempts}: Rhyme=${rhymeValid}, Words=${wordsValid}, Semantics=${semanticsValid}, Syllables=${syllablesValid}, Mood=${moodValid}`)
        
        if (rhymeValid && wordsValid && semanticsValid && syllablesValid && moodValid) {
          console.log('All validations passed!')
          break
        } else if (attempts < maxAttempts) {
          console.log(`Attempt ${attempts}: Validation failed, retrying...`)
          continue
        } else {
          console.log('Max attempts reached, using mood-specific fallback pantun')
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

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


    let systemPrompt = `Anda adalah ahli pantun tradisional Indonesia. Buat pantun dengan struktur yang BENAR:

ATURAN KETAT - WAJIB DIPATUHI:
- HANYA gunakan kata-kata Bahasa Indonesia yang BENAR dan UMUM
- DILARANG membuat kata baru atau kata yang tidak ada
- DILARANG menggunakan kata yang aneh atau tidak natural
- Setiap baris harus BERMAKNA dan masuk akal
- Jika tidak bisa menemukan rima yang natural, coba kata lain
- Gunakan kata-kata yang sudah dikenal masyarakat Indonesia

STRUKTUR PANTUN:
- Baris 1-2: SAMPIRAN (deskripsi alam/kehidupan, TIDAK perlu berhubungan dengan pesan)
- Baris 3-4: ISI (pesan/nasihat yang bermakna)
- Rima: a-b-a-b (baris 1 & 3, baris 2 & 4)

CONTOH BENAR DENGAN RIMA YANG TEPAT:
"Berenang jauh para ikan
Mereka bebas hatinya senang
Badan kurus kurang makan
Kalau ditiup goyang-goyang"
→ Rima: ikan/makan (an-an), senang/goyang (ang-ang)

"Jalan-jalan ke pinggir empang
Nemu katak di pinggir empang
Hati siapa tak bimbang
Kamu botak minta dikepang"
→ Rima: empang/bimbang (ang-ang), empang/dikepang (ang-ang)

"Tetangga baru namanya Rahmat
Punya istri namanya Cua
Kakek cerita terlalu semangat
Gigi palsunya copot semua"
→ Rima: Rahmat/semangat (at-at), Cua/semua (a-a)

"Ke SPBU membeli bensin
Bensin bagus di Pangandaran
Menahan diri agar tak bersin
Malah kentut tak tertahankan"
→ Rima: bensin/bersin (in-in), Pangandaran/tertahankan (an-an)

"Beli sabun di sebuah warung
Warung baru milik Sukiran
Diam-diam menutup hidung
Bau kentut penuhi ruangan"
→ Rima: warung/Sukiran (ung-ung), hidung/ruangan (ung-an)

"Tumbuh ilalang di semak-semak
Semak-semak lalu dibersihkan
The power of emak-emak
Sein ke kiri belok ke kanan"
→ Rima: semak/dibersihkan (ak-an), emak/kanan (ak-an)

CONTOH SALAH (JANGAN BUAT SEPERTI INI):
❌ "Pergi ke pasar membeli sayur"
   "Sayur kangkung MENYAYURKAN" ← SALAH! kata tidak ada
   "Jangan suka menunda-nunda"
   "Nanti menyesal MENYAYUR-SAYUR" ← SALAH! tidak masuk akal

❌ "Jalan-jalan ke pantai barat"
   "Barat timur MEMBARATKAN" ← SALAH! kata tidak natural
   "Hidup ini penuh arti"
   "Jaga hati MEMBARATKAN" ← SALAH! tidak bermakna

❌ "Bunga mawar di taman"
   "Taman bunga MEMBUNGAKAN" ← SALAH! kata tidak ada
   "Cinta itu suci"
   "Jangan MEMBUNGAKAN" ← SALAH! tidak masuk akal

WAJIB:
- Rima a-b-a-b sempurna dengan bunyi yang sama (contoh: -ing dengan -ing, -ar dengan -ar, -an dengan -an)
- Sampiran dan isi TIDAK perlu berhubungan
- Bahasa natural, bermakna
- Pastikan kata terakhir setiap baris memiliki pola bunyi yang sama
- Format: Hanya pantun, tanpa penjelasan`

    let userPrompt = ''

    switch (mode) {
      case 'random':
        userPrompt = 'Buat pantun dengan tema acak. Pastikan baris 1-2 adalah sampiran dan baris 3-4 adalah isi yang bermakna.'
        break
      
      case 'continue':
        const inputLines = input.trim().split('\n').filter((line: string) => line.trim())
        const lineCount = inputLines.length
        
        if (lineCount === 1) {
          userPrompt = `Lengkapi baris pertama ini menjadi pantun 4 baris penuh:
"${input}"

WAJIB: Buat 3 baris tambahan dengan rima a-b-a-b. Baris 2 adalah sampiran, baris 3-4 adalah isi yang bermakna.`
        } else if (lineCount === 2) {
          userPrompt = `Lengkapi sampiran ini menjadi pantun 4 baris penuh:
"${input}"

WAJIB: Tambahkan 2 baris isi yang bermakna dengan rima a-b-a-b sempurna.`
        } else if (lineCount === 3) {
          userPrompt = `Lengkapi pantun ini dengan baris terakhir:
"${input}"

WAJIB: Tambahkan 1 baris terakhir yang sesuai dengan rima a-b-a-b.`
        } else {
          userPrompt = `Perbaiki pantun ini agar memiliki struktur yang benar:
"${input}"

WAJIB: Pastikan 4 baris dengan rima a-b-a-b, baris 1-2 sampiran, baris 3-4 isi.`
        }
        break
      
      case 'mood':
        userPrompt = `Buat pantun tentang "${mood}". Baris 1-2 sampiran, baris 3-4 isi yang sesuai dengan mood tersebut.`
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

    // Function to validate rhyme pattern (a-b-a-b) with proper Indonesian phonetic matching
    const validateRhyme = (pantun: string): boolean => {
      const lines = pantun.split('\n').filter((line: string) => line.trim())
      if (lines.length !== 4) return false
      
      const getLastSyllables = (line: string): string => {
        const cleaned = line.trim().replace(/[.,!?;:]$/, '')
        const words = cleaned.split(' ')
        const lastWord = words[words.length - 1].toLowerCase()
        
        // Handle common Indonesian rhyme patterns based on your examples
        // 2-syllable endings
        if (lastWord.endsWith('atan')) return 'atan'  // tertahankan
        if (lastWord.endsWith('akan')) return 'akan'  // tertahankan
        if (lastWord.endsWith('aman')) return 'aman'  // tertahankan
        if (lastWord.endsWith('asan')) return 'asan'  // tertahankan
        if (lastWord.endsWith('atan')) return 'atan'  // tertahankan
        if (lastWord.endsWith('atan')) return 'atan'  // tertahankan
        
        // Single syllable endings
        if (lastWord.endsWith('at')) return 'at'      // barat, semangat
        if (lastWord.endsWith('du')) return 'du'      // syahdu
        if (lastWord.endsWith('an')) return 'an'     // ikan, senang, empang, Rahmat, semangat, warung, Sukiran, semak, dibersihkan, wayang, biskuit, disayang, peluit, Bali, semuanya, tuli, melihatnya
        if (lastWord.endsWith('in')) return 'in'      // bensin, bersin
        if (lastWord.endsWith('ung')) return 'ung'    // warung, Sukiran
        if (lastWord.endsWith('ak')) return 'ak'     // semak, dibersihkan, wayang, biskuit
        if (lastWord.endsWith('it')) return 'it'     // disayang, peluit
        if (lastWord.endsWith('i')) return 'i'       // Bali, semuanya, tuli, melihatnya
        if (lastWord.endsWith('a')) return 'a'       // Cua, semua, bensin, semangat
        if (lastWord.endsWith('ar')) return 'ar'     // barat, semangat
        if (lastWord.endsWith('er')) return 'er'     // semangat
        if (lastWord.endsWith('ir')) return 'ir'     // semangat
        if (lastWord.endsWith('or')) return 'or'     // semangat
        if (lastWord.endsWith('ur')) return 'ur'     // semangat
        if (lastWord.endsWith('as')) return 'as'     // semangat
        if (lastWord.endsWith('es')) return 'es'     // semangat
        if (lastWord.endsWith('is')) return 'is'     // semangat
        if (lastWord.endsWith('os')) return 'os'     // semangat
        if (lastWord.endsWith('us')) return 'us'     // semangat
        if (lastWord.endsWith('ah')) return 'ah'     // semangat
        if (lastWord.endsWith('eh')) return 'eh'     // semangat
        if (lastWord.endsWith('ih')) return 'ih'     // semangat
        if (lastWord.endsWith('oh')) return 'oh'     // semangat
        if (lastWord.endsWith('uh')) return 'uh'     // semangat
        if (lastWord.endsWith('en')) return 'en'     // semangat
        if (lastWord.endsWith('on')) return 'on'     // semangat
        if (lastWord.endsWith('un')) return 'un'     // semangat
        if (lastWord.endsWith('ang')) return 'ang'   // semangat
        if (lastWord.endsWith('eng')) return 'eng'   // semangat
        if (lastWord.endsWith('ing')) return 'ing'   // semangat
        if (lastWord.endsWith('ong')) return 'ong'   // semangat
        if (lastWord.endsWith('ung')) return 'ung'   // semangat
        
        // For compound words, check the last meaningful syllable
        if (lastWord.includes('tahan')) return 'an'   // tahan banting
        if (lastWord.includes('banting')) return 'ing' // tahan banting
        
        // Fallback: get last 2-3 characters
        return lastWord.slice(-3)
      }
      
      const rhyme1 = getLastSyllables(lines[0])
      const rhyme2 = getLastSyllables(lines[1])
      const rhyme3 = getLastSyllables(lines[2])
      const rhyme4 = getLastSyllables(lines[3])
      
      // Log for debugging
      console.log(`Rhyme validation: Line 1 (${rhyme1}) vs Line 3 (${rhyme3})`)
      console.log(`Rhyme validation: Line 2 (${rhyme2}) vs Line 4 (${rhyme4})`)
      
      // Check for exact phonetic match
      const isRhyme1 = rhyme1 === rhyme3 && rhyme1.length > 0
      const isRhyme2 = rhyme2 === rhyme4 && rhyme2.length > 0
      const isDifferent = rhyme1 !== rhyme2
      
      console.log(`Rhyme validation result: ${isRhyme1 && isRhyme2 && isDifferent}`)
      
      return isRhyme1 && isRhyme2 && isDifferent
    }

    // Function to generate pantun with retry logic
    const generatePantunWithRetry = async (attempt: number = 1): Promise<string> => {
      // More conservative temperature progression for better quality
      const temperature = attempt === 1 ? 0.5 : attempt === 2 ? 0.4 : 0.3
      const top_p = attempt === 1 ? 0.7 : attempt === 2 ? 0.65 : 0.6
      
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
          max_tokens: 150,
          temperature,
          top_p,
          frequency_penalty: 0.3,
          presence_penalty: 0.2,
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
    const maxAttempts = 3 // Reduced attempts for faster fallback

    try {
      while (attempts < maxAttempts) {
        attempts++
        try {
          pantun = await generatePantunWithRetry(attempts)
          
          // Multi-stage validation
          const rhymeValid = validateRhyme(pantun)
          const wordsValid = validateWords(pantun)
          const semanticsValid = validateSemantics(pantun)
          
          console.log(`Attempt ${attempts}: Rhyme=${rhymeValid}, Words=${wordsValid}, Semantics=${semanticsValid}`)
          
          if (rhymeValid && wordsValid && semanticsValid) {
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

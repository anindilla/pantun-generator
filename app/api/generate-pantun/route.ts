import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { mode, input, mood } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'API key tidak ditemukan. Silakan periksa konfigurasi.' }, { status: 500 })
    }

    console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length)
    console.log('GROQ_API_KEY starts with:', process.env.GROQ_API_KEY?.substring(0, 10))


    let systemPrompt = `Anda adalah ahli pantun tradisional Indonesia. Buat pantun dengan struktur yang BENAR:

STRUKTUR PANTUN:
- Baris 1-2: SAMPIRAN (deskripsi alam/kehidupan, TIDAK perlu berhubungan dengan pesan)
- Baris 3-4: ISI (pesan/nasihat yang bermakna)
- Rima: a-b-a-b (baris 1 & 3, baris 2 & 4)

CONTOH BENAR DENGAN RIMA YANG TEPAT:
"Jalan-jalan ke kota Blitar
Jangan lupa beli sukun
Jika kamu ingin pintar
Belajarlah dengan tekun"
→ Rima: Blitar/pintar (ar-ar), sukun/tekun (un-un)

"Pisang emas dibawa berlayar
Masak sebiji di atas peti
Hutang emas boleh dibayar
Hutang budi dibawa mati"
→ Rima: berlayar/dibayar (ar-ar), peti/mati (i-i)

"Ada ubi ada talas
Ada budi ada balas
Sebab pulut santan binasa
Sebab mulut badan merana"
→ Rima: talas/binasa (as-a), balas/merana (as-a)

"Tumbuh merata pohon tebu
Pergi ke pasar membeli daging
Banyak harta miskin ilmu
Bagai rumah tidak berdinding"
→ Rima: tebu/ilmu (u-u), daging/berdinding (ing-ing)

WAJIB:
- Rima a-b-a-b sempurna dengan bunyi yang sama
- Sampiran dan isi TIDAK perlu berhubungan
- Bahasa natural, bermakna
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

    // Function to validate rhyme pattern (a-b-a-b) with phonetic matching
    const validateRhyme = (pantun: string): boolean => {
      const lines = pantun.split('\n').filter((line: string) => line.trim())
      if (lines.length !== 4) return false
      
      const getLastSyllable = (line: string): string => {
        const cleaned = line.trim().replace(/[.,!?;:]$/, '')
        const words = cleaned.split(' ')
        const lastWord = words[words.length - 1].toLowerCase()
        
        // Remove common suffixes that don't affect rhyme
        const withoutSuffix = lastWord
          .replace(/nya$/, '')
          .replace(/lah$/, '')
          .replace(/kah$/, '')
          .replace(/kan$/, '')
          .replace(/an$/, '')
        
        // Extract last syllable (consonant + vowel pattern)
        const syllableMatch = withoutSuffix.match(/[^aiueo]*[aiueo]+[^aiueo]*$/)
        return syllableMatch ? syllableMatch[0] : withoutSuffix.slice(-3)
      }
      
      const rhyme1 = getLastSyllable(lines[0])
      const rhyme2 = getLastSyllable(lines[1])
      const rhyme3 = getLastSyllable(lines[2])
      const rhyme4 = getLastSyllable(lines[3])
      
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
      // More conservative temperature progression for better structure
      const temperature = attempt === 1 ? 0.7 : attempt === 2 ? 0.6 : 0.5
      const top_p = attempt === 1 ? 0.85 : attempt === 2 ? 0.8 : 0.75
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 150,
          temperature,
          top_p,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        }),
      })

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
      }

      const completion = await response.json()
      const pantun = completion.choices[0]?.message?.content?.trim()

      if (!pantun) {
        throw new Error('Gagal menghasilkan pantun')
      }

      return pantun
    }

    // Try to generate pantun with validation and retry
    let pantun = ''
    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
      attempts++
      try {
        pantun = await generatePantunWithRetry(attempts)
        
        // Validate rhyme pattern
        if (validateRhyme(pantun)) {
          break
        } else if (attempts < maxAttempts) {
          console.log(`Attempt ${attempts}: Rhyme validation failed, retrying...`)
          continue
        } else {
          console.log('Max attempts reached, returning best result')
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          throw error
        }
        console.log(`Attempt ${attempts} failed, retrying...`)
      }
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

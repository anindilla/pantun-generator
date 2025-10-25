import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { mode, input, mood } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'API key tidak ditemukan. Silakan periksa konfigurasi.' }, { status: 500 })
    }

    console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length)
    console.log('GROQ_API_KEY starts with:', process.env.GROQ_API_KEY?.substring(0, 10))


    let systemPrompt = `Buat pantun tradisional Indonesia dengan struktur yang BENAR:

PENTING: Pantun memiliki 2 bagian terpisah:
- BARIS 1-2: SAMPIRAN (deskripsi alam/kehidupan, TIDAK perlu berhubungan dengan pesan)
- BARIS 3-4: ISI (pesan/nasihat yang bermakna)

CONTOH STRUKTUR YANG BENAR:

"Jalan-jalan ke kota Blitar
Jangan lupa beli sukun
Jika kamu ingin pintar
Belajarlah dengan tekun"
→ Sampiran: tentang perjalanan ke Blitar
→ Isi: nasihat tentang belajar

"Hati-hati menyeberang
Jangan sampai titian patah
Hati-hati di rantau orang
Jangan sampai berbuat salah"
→ Sampiran: tentang menyeberang
→ Isi: nasihat tentang berhati-hati

"Pisang emas dibawa berlayar
Masak sebiji di atas peti
Hutang emas boleh dibayar
Hutang budi dibawa mati"
→ Sampiran: tentang pisang
→ Isi: nasihat tentang hutang budi

"Ada ubi ada talas
Ada budi ada balas
Sebab pulut santan binasa
Sebab mulut badan merana"
→ Sampiran: tentang ubi dan talas
→ Isi: nasihat tentang budi dan mulut

"Tumbuh merata pohon tebu
Pergi ke pasar membeli daging
Banyak harta miskin ilmu
Bagai rumah tidak berdinding"
→ Sampiran: tentang pohon tebu dan pasar
→ Isi: nasihat tentang ilmu

"Dalam semak ada duri
Ayam kuning buat sarang
Orang tamak selalu rugi
Macam anjing dengan bayang"
→ Sampiran: tentang semak dan ayam
→ Isi: nasihat tentang tamak

"Kayu bakar dibuat orang
Arang dibakar memanaskan diri
Jangan mudah menyalahkan orang
Cermin muka lihat sendiri"
→ Sampiran: tentang kayu bakar
→ Isi: nasihat tentang menyalahkan orang

"Rusa kecil diam terkurung
Kurang makan kurang minum
Cari ilmu jangan murung
Cerialah selalu banyak tersenyum"
→ Sampiran: tentang rusa
→ Isi: nasihat tentang ilmu dan senyum

WAJIB: 
- Rima a-b-a-b sempurna
- Sampiran (baris 1-2) dan Isi (baris 3-4) TIDAK perlu berhubungan
- Bahasa natural, bermakna
- Jangan lanjutkan pola sampiran di baris 3-4

Format: Hanya pantun, tanpa penjelasan.`

    let userPrompt = ''

    switch (mode) {
      case 'random':
        userPrompt = 'Buat pantun dengan tema acak. Pastikan baris 1-2 adalah sampiran dan baris 3-4 adalah isi yang bermakna.'
        break
      
      case 'continue':
        userPrompt = `Lengkapi pantun ini menjadi 4 baris penuh:
${input}

WAJIB: Jika yang diberikan adalah sampiran (baris 1-2), buat isi (baris 3-4) yang bermakna. Jika yang diberikan adalah isi (baris 3-4), buat sampiran (baris 1-2) yang sesuai. Rima a-b-a-b sempurna.`
        break
      
      case 'mood':
        userPrompt = `Buat pantun tentang "${mood}". Baris 1-2 sampiran, baris 3-4 isi yang sesuai dengan mood tersebut.`
        break
      
      default:
        return NextResponse.json({ error: 'Mode tidak valid' }, { status: 400 })
    }

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
        max_tokens: 200,
        temperature: 0.6,
        top_p: 0.9,
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

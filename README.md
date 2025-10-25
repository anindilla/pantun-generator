# Generator Pantun

Website untuk membuat pantun kreatif dengan bantuan AI. Dibuat dengan Next.js, TypeScript, dan OpenAI API.

## Fitur

- **Mode Acak**: Buat pantun dengan tema acak yang menarik
- **Mode Lanjutkan**: Lanjutkan pantun dari baris yang sudah Anda tulis
- **Mode Suasana Hati**: Buat pantun sesuai suasana hati Anda
- **Desain Kampung**: Tampilan tradisional Indonesia dengan UI/UX modern
- **Responsive**: Bekerja dengan baik di desktop, tablet, dan mobile

## Teknologi

- **Framework**: Next.js 14 dengan App Router
- **Styling**: Tailwind CSS
- **AI**: Groq API (Llama 3.1 70B)
- **Deployment**: Vercel
- **Bahasa**: TypeScript

## Setup Lokal

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd pantun-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` dan masukkan Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

   **Cara mendapatkan Groq API key (GRATIS):**
   1. Kunjungi [console.groq.com](https://console.groq.com)
   2. Daftar akun (gratis)
   3. Klik "Create API Key"
   4. Copy API key dan masukkan ke `.env.local`

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser**
   ```
   http://localhost:3000
   ```

## Deployment ke Vercel

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Import project dari GitHub
   - Tambahkan environment variable `GROQ_API_KEY`
   - Deploy

## Struktur Project

```
├── app/
│   ├── api/generate-pantun/
│   │   └── route.ts          # API endpoint untuk generate pantun
│   ├── components/
│   │   ├── Button.tsx        # Komponen button reusable
│   │   ├── Card.tsx          # Komponen card
│   │   ├── ModeSelector.tsx  # Pemilih mode pantun
│   │   ├── PantunDisplay.tsx # Tampilan hasil pantun
│   │   ├── PantunGenerator.tsx # Komponen utama
│   │   └── TextArea.tsx      # Komponen textarea
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Halaman utama
├── tailwind.config.ts        # Konfigurasi Tailwind
├── tsconfig.json            # Konfigurasi TypeScript
└── package.json             # Dependencies
```

## Cara Menggunakan

1. **Pilih Mode**: Klik salah satu dari tiga mode yang tersedia
2. **Input Data**: 
   - **Acak**: Langsung klik "Buat Pantun"
   - **Lanjutkan**: Masukkan 1-3 baris pantun yang sudah ada
   - **Suasana Hati**: Deskripsikan suasana hati Anda
3. **Generate**: Klik tombol "Buat Pantun"
4. **Hasil**: Pantun akan ditampilkan dengan opsi salin dan buat lagi

## Struktur Pantun

Pantun yang dihasilkan mengikuti aturan tradisional:
- 4 baris per pantun
- 8-12 suku kata per baris
- Pola rima a-b-a-b
- Baris 1-2: Sampiran (pembuka)
- Baris 3-4: Isi (pesan utama)

## Lisensi

MIT License

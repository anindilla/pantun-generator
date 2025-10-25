# Pantun Generator

A simple web app to make pantun with AI. Made with Next.js, TypeScript, and Groq API
Access here: https://pantun-generator.vercel.app/

## Features
- **Acak**: Make completely random pantun, just whatever, really
- **Lanjutkan**: Continue pantun from the first few phrases you already write down before
- **Suasana Hati**: Generate pantun based on your mood of the day (e.g. hungry, sad, whatever)

## What we use
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI**: Groq API (Llama 3.1 70B)
- **Deployment**: Vercel
- **Language**: TypeScript

## Setup

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
   
   Edit `.env.local` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import project from GitHub
   - Add environment variable `GROQ_API_KEY`
   - Deploy

## Project Structure

```
├── app/
│   ├── api/generate-pantun/
│   │   └── route.ts          # API endpoint for generating pantun
│   ├── components/
│   │   ├── Button.tsx        # Reusable button component
│   │   ├── Card.tsx          # Card component
│   │   ├── ModeSelector.tsx  # Mode selector (Random / Continue / Mood)
│   │   ├── PantunDisplay.tsx # Display component for generated pantun
│   │   ├── PantunGenerator.tsx # Main generator component
│   │   └── TextArea.tsx      # Text area component
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## How to use
1. **Choose Mode**: Click from one of the 3 options
2. **Generate**: After adding prompts, click "Buat Pantun"
4. **Hasil**: Pantun will be shown and you can share it

## License
MIT License

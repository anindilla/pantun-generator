module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}),
"[project]/app/api/generate-pantun/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/groq-sdk/index.mjs [app-route] (ecmascript) <locals>");
;
;
const groq = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]({
    apiKey: process.env.GROQ_API_KEY
});
async function POST(request) {
    try {
        const { mode, input, mood } = await request.json();
        if (!process.env.GROQ_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'API key tidak ditemukan. Silakan periksa konfigurasi.'
            }, {
                status: 500
            });
        }
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

Format: Hanya pantun, tanpa penjelasan.`;
        let userPrompt = '';
        switch(mode){
            case 'random':
                userPrompt = 'Buat pantun dengan tema acak. Pastikan baris 1-2 adalah sampiran dan baris 3-4 adalah isi yang bermakna.';
                break;
            case 'continue':
                userPrompt = `Lengkapi pantun ini menjadi 4 baris penuh:
${input}

WAJIB: Jika yang diberikan adalah sampiran (baris 1-2), buat isi (baris 3-4) yang bermakna. Jika yang diberikan adalah isi (baris 3-4), buat sampiran (baris 1-2) yang sesuai. Rima a-b-a-b sempurna.`;
                break;
            case 'mood':
                userPrompt = `Buat pantun tentang "${mood}". Baris 1-2 sampiran, baris 3-4 isi yang sesuai dengan mood tersebut.`;
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Mode tidak valid'
                }, {
                    status: 400
                });
        }
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            max_tokens: 200,
            temperature: 0.6,
            top_p: 0.9
        });
        const pantun = completion.choices[0]?.message?.content?.trim();
        if (!pantun) {
            throw new Error('Gagal menghasilkan pantun');
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            pantun
        });
    } catch (error) {
        console.error('Error generating pantun:', error);
        if (error.code === 'insufficient_quota') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Kuota API Groq habis. Silakan periksa billing Anda atau gunakan API key yang berbeda.'
            }, {
                status: 402
            });
        }
        if (error.code === 'model_not_found') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Model tidak tersedia. Silakan periksa konfigurasi API.'
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Terjadi kesalahan saat menghasilkan pantun. Silakan coba lagi.'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7459ef4a._.js.map
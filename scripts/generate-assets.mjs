import fs from 'fs'
import path from 'path'

const sizes = [16, 32, 64, 128, 256, 512]
const formats = ['png', 'svg']
const outDir = path.resolve(process.cwd(), 'public', 'brand')

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true })
}

function svgLogo({ size = 512, primary = '#e11d48', secondary = '#ec4899' }) {
  const s = size
  const r = Math.floor(s * 0.18)
  const cx1 = Math.floor(s * 0.38)
  const cy = Math.floor(s * 0.55)
  const cx2 = Math.floor(s * 0.62)
  const stemW = Math.max(2, Math.floor(s * 0.03))
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${primary}"/>
      <stop offset="100%" stop-color="${secondary}"/>
    </linearGradient>
  </defs>
  <rect width="${s}" height="${s}" rx="${Math.floor(s*0.2)}" fill="#fff"/>
  <path d="M ${Math.floor(s*0.5)} ${Math.floor(s*0.18)} C ${Math.floor(s*0.42)} ${Math.floor(s*0.10)}, ${Math.floor(s*0.30)} ${Math.floor(s*0.16)}, ${Math.floor(s*0.26)} ${Math.floor(s*0.28)}" stroke="#0f172a" stroke-width="${stemW}" fill="none" stroke-linecap="round"/>
  <path d="M ${Math.floor(s*0.5)} ${Math.floor(s*0.18)} C ${Math.floor(s*0.58)} ${Math.floor(s*0.10)}, ${Math.floor(s*0.70)} ${Math.floor(s*0.16)}, ${Math.floor(s*0.74)} ${Math.floor(s*0.28)}" stroke="#0f172a" stroke-width="${stemW}" fill="none" stroke-linecap="round"/>
  <circle cx="${cx1}" cy="${cy}" r="${r}" fill="url(#g)" stroke="#0f172a" stroke-width="${Math.max(2, Math.floor(s*0.015))}"/>
  <circle cx="${cx2}" cy="${cy}" r="${r}" fill="url(#g)" stroke="#0f172a" stroke-width="${Math.max(2, Math.floor(s*0.015))}"/>
  <circle cx="${Math.floor(cx1 - r*0.35)}" cy="${Math.floor(cy - r*0.35)}" r="${Math.max(2, Math.floor(r*0.18))}" fill="#fff" opacity="0.85"/>
  <circle cx="${Math.floor(cx2 - r*0.35)}" cy="${Math.floor(cy - r*0.35)}" r="${Math.max(2, Math.floor(r*0.18))}" fill="#fff" opacity="0.85"/>
  <text x="50%" y="${Math.floor(s*0.92)}" dominant-baseline="middle" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Arial" font-size="${Math.floor(s*0.12)}" fill="#0f172a">CherryBot</text>
</svg>`
}

async function writeSvgAssets() {
  await ensureDir(outDir)
  for (const size of sizes) {
    const svg = svgLogo({ size })
    const file = path.join(outDir, `logo-${size}.svg`)
    await fs.promises.writeFile(file, svg, 'utf8')
  }
}

async function tryImport(pkg) {
  try {
    return await import(pkg)
  } catch (e) {
    return null
  }
}

async function generatePngWithFal() {
  const fal = await tryImport('@fal-ai/client')
  if (!fal) return false
  const key = process.env.FAL_KEY || process.env.FAL_API_KEY || process.env.FALAI_KEY
  if (!key) return false
  fal.fal.config({ credentials: key })
  const prompt = 'Minimal modern cherry logo and wordmark for CherryBot, clean, flat, brand-ready, vector-like, high contrast, cherry red and pink palette, on white background'
  const result = await fal.fal.subscribe('fal-ai/nano-banana-pro', {
    input: { prompt, num_images: 1, aspect_ratio: '1:1', output_format: 'png', resolution: '2K' },
    logs: false
  })
  const img = result?.data?.images?.[0]?.url
  if (!img) return false
  await ensureDir(outDir)
  const res = await fetch(img)
  const buf = Buffer.from(await res.arrayBuffer())
  const sharp = await tryImport('sharp')
  if (!sharp) {
    const file = path.join(outDir, 'logo-2048.png')
    await fs.promises.writeFile(file, buf)
    return true
  }
  for (const size of sizes) {
    const out = path.join(outDir, `logo-${size}.png`)
    await sharp.default(buf).resize(size, size).toFile(out)
  }
  return true
}

async function main() {
  const didFal = await generatePngWithFal()
  if (!didFal) {
    console.log('Skipping FAL generation. Ensure @fal-ai/client is installed and FAL_KEY is set.')
  }
  if (formats.includes('svg')) {
    await writeSvgAssets()
  }
  console.log('Brand assets prepared at', outDir)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * Generates the PWA icons (public/icons/icon-{192,512}.png) with zero
 * dependencies: raw RGBA pixels -> zlib -> PNG chunks.
 * Design: indigo rounded square, white study card with two text lines.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

// ---------- minimal PNG writer ----------
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c
})

function crc32(buf) {
  let c = -1
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  data.copy(out, 8)
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length)
  return out
}

function png(width, height, pixels) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------- drawing ----------
function inRoundedRect(x, y, cx, cy, w, h, r) {
  const dx = Math.max(Math.abs(x - cx) - (w / 2 - r), 0)
  const dy = Math.max(Math.abs(y - cy) - (h / 2 - r), 0)
  return dx * dx + dy * dy <= r * r
}

function drawIcon(size) {
  const px = Buffer.alloc(size * size * 4)
  const INDIGO = [0x25, 0x63, 0xeb]
  const WHITE = [0xff, 0xff, 0xff]
  const c = (size - 1) / 2

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      if (!inRoundedRect(x, y, c, c, size, size, size * 0.22)) {
        px[i + 3] = 0 // transparent outside
        continue
      }
      let color = INDIGO
      // white card in the middle
      if (inRoundedRect(x, y, c, c, size * 0.5, size * 0.62, size * 0.08)) {
        color = WHITE
        // two indigo "text lines" inside the card
        const ly = y - (c - size * 0.31) // 0 at card top
        const inLine =
          (ly > size * 0.13 && ly < size * 0.185 || ly > size * 0.23 && ly < size * 0.285) &&
          x > c - size * 0.16 && x < c + (ly > size * 0.2 ? size * 0.02 : size * 0.16)
        if (inLine) color = INDIGO
      }
      px[i] = color[0]
      px[i + 1] = color[1]
      px[i + 2] = color[2]
      px[i + 3] = 255
    }
  }
  return png(size, size, px)
}

mkdirSync(OUT_DIR, { recursive: true })
for (const size of [192, 512]) {
  writeFileSync(join(OUT_DIR, `icon-${size}.png`), drawIcon(size))
  console.log(`wrote public/icons/icon-${size}.png`)
}

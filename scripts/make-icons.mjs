#!/usr/bin/env node
/**
 * Generates the PWA icons (public/icons/icon-{192,512}.png plus the
 * -maskable variants) with zero dependencies: raw RGBA pixels -> zlib -> PNG
 * chunks. Design: blue rounded square, flat white closed book (upright cover,
 * spine crease, two title lines).
 * Maskable variants are full bleed with the art inside the 80% safe zone so
 * Android can crop them to any shape without clipping.
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

function inRect(x, y, x0, y0, x1, y1) {
  return x >= x0 && x <= x1 && y >= y0 && y <= y1
}

function drawIcon(size, maskable = false) {
  const px = Buffer.alloc(size * size * 4)
  const BLUE = [0x25, 0x63, 0xeb]
  const WHITE = [0xff, 0xff, 0xff]
  const c = (size - 1) / 2
  // artwork unit: maskable keeps the art inside the 80% safe circle
  const u = maskable ? size * 0.8 : size
  const bgRadius = maskable ? 0 : size * 0.22 // maskable = full bleed background

  // closed book: upright cover, spine crease on the left, title lines
  const hw = u * 0.21 // cover half width
  const hh = u * 0.3 // cover half height
  const br = u * 0.03 // cover corner radius

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      if (!inRoundedRect(x, y, c, c, size, size, bgRadius)) {
        px[i + 3] = 0 // transparent outside
        continue
      }
      const lx = x - c
      const ly = y - c
      let color = BLUE
      if (inRoundedRect(lx, ly, 0, 0, hw * 2, hh * 2, br)) {
        color = WHITE
        if (inRect(lx, ly, -hw + u * 0.075, -hh, -hw + u * 0.1, hh)) color = BLUE // spine crease
        else if (inRect(lx, ly, -hw + u * 0.14, -u * 0.11, hw - u * 0.05, -u * 0.075)) color = BLUE // title
        else if (inRect(lx, ly, -hw + u * 0.14, -u * 0.02, hw - u * 0.14, u * 0.015)) color = BLUE // subtitle
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
  writeFileSync(join(OUT_DIR, `icon-${size}-maskable.png`), drawIcon(size, true))
  console.log(`wrote public/icons/icon-${size}-maskable.png`)
}

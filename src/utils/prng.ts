// Mulberry32 seeded PRNG
export function mulberry32(seed: number) {
  let t = seed >>> 0
  return function() {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
export function seedFromStrings(...parts: string[]) {
  let seed = 0x811C9DC5
  for (const s of parts.join('|')) seed = Math.imul(seed ^ s.charCodeAt(0), 0x1000193)
  return Math.abs(seed)
}
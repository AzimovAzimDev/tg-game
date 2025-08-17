// Simple CRC32 (not crypto, good enough for client checksum)
const table = new Uint32Array(256).map((_,n)=>{
  let c=n
  for(let k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1
  return c>>>0
})

export function crc32(str: string) {
  let c = ~0
  for (let i=0;i<str.length;i++) c = table[(c ^ str.charCodeAt(i)) & 0xFF] ^ (c >>> 8)
  return (~c >>> 0).toString(16)
}
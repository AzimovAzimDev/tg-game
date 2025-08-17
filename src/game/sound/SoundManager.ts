export class SoundManager {
  private ctx?: AudioContext
  private buffers: Record<string, AudioBuffer> = {}
  private muted = false
  private loaded = false

  setMuted(v: boolean) { this.muted = v }
  isMuted() { return this.muted }

  async ensureLoaded() {
    if (this.loaded) return
    try {
      this.ctx = this.ctx || new (window.AudioContext || (window as any).webkitAudioContext)()
      const files: Record<string,string> = {
        tap: '/sfx/tap.wav',
        error: '/sfx/error.wav',
        success: '/sfx/success.wav',
      }
      await Promise.all(Object.entries(files).map(async ([k, url])=>{
        const res = await fetch(url)
        const arr = await res.arrayBuffer()
        this.buffers[k] = await this.ctx!.decodeAudioData(arr)
      }))
      this.loaded = true
    } catch {}
  }

  play(name: 'tap'|'error'|'success') {
    if (this.muted) return
    const b = this.buffers[name]; if (!b || !this.ctx) return
    const src = this.ctx.createBufferSource()
    src.buffer = b
    src.connect(this.ctx.destination)
    src.start()
  }
}

export const sound = new SoundManager()
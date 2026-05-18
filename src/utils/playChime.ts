/** C4 → F4: ascending scale for the four tomatoes (P-m-d-r). */
const TOMATO_NOTES = [261.63, 293.66, 329.63, 349.23] as const

export type TomatoNoteIndex = 0 | 1 | 2 | 3

export function playChime(noteIndex: TomatoNoteIndex = 0) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = TOMATO_NOTES[noteIndex]
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    // Audio not available
  }
}

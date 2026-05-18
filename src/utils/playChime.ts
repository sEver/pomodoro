/** C4 → F4: ascending scale for the four tomatoes (P-m-d-r). */
const TOMATO_NOTES = [261.63, 293.66, 329.63, 349.23] as const

export type TomatoNoteIndex = 0 | 1 | 2 | 3

/** C D E F E D C F — up, down, then a little lift at the end. */
const FINAL_MELODY: TomatoNoteIndex[] = [0, 1, 2, 3, 2, 1, 0, 3]

const NOTE_GAP_SEC = 0.2
const NOTE_LENGTH_SEC = 0.4

function scheduleNote(
  ctx: AudioContext,
  noteIndex: TomatoNoteIndex,
  startTime: number,
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = TOMATO_NOTES[noteIndex]
  gain.gain.setValueAtTime(0.15, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + NOTE_LENGTH_SEC)
  osc.start(startTime)
  osc.stop(startTime + NOTE_LENGTH_SEC)
}

export function playChime(noteIndex: TomatoNoteIndex = 0) {
  try {
    const ctx = new AudioContext()
    scheduleNote(ctx, noteIndex, ctx.currentTime)
  } catch {
    // Audio not available
  }
}

export function playFinalChime() {
  try {
    const ctx = new AudioContext()
    const t0 = ctx.currentTime
    FINAL_MELODY.forEach((noteIndex, i) => {
      scheduleNote(ctx, noteIndex, t0 + i * NOTE_GAP_SEC)
    })
  } catch {
    // Audio not available
  }
}

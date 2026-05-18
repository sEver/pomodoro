/** C4 → F4: ascending scale for the four tomatoes (P-m-d-r). */
const TOMATO_NOTES = [261.63, 293.66, 329.63, 349.23] as const

export type TomatoNoteIndex = 0 | 1 | 2 | 3

/** Reset + focus complete: up, down, lift. */
const FOCUS_END_MELODY: TomatoNoteIndex[] = [3, 2, 1, 0, 3, 2, 1, 0]

/** Short break complete: gentle descent. */
const SHORT_BREAK_END_MELODY: TomatoNoteIndex[] = [0, 1, 2, 3, 0, 1, 2, 3]

/** Long break complete: brighter “back to work” phrase. */
const LONG_BREAK_END_MELODY: TomatoNoteIndex[] = [0, 0, 1, 1, 2, 2, 3, 3]

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

function playMelody(melody: readonly TomatoNoteIndex[]) {
  try {
    const ctx = new AudioContext()
    const t0 = ctx.currentTime
    melody.forEach((noteIndex, i) => {
      scheduleNote(ctx, noteIndex, t0 + i * NOTE_GAP_SEC)
    })
  } catch {
    // Audio not available
  }
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
  playMelody(FOCUS_END_MELODY)
}

export function playFocusEndChime() {
  playMelody(FOCUS_END_MELODY)
}

export function playShortBreakEndChime() {
  playMelody(SHORT_BREAK_END_MELODY)
}

export function playLongBreakEndChime() {
  playMelody(LONG_BREAK_END_MELODY)
}

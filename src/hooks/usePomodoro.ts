import { useCallback, useEffect, useRef, useState } from 'react'

const MODE_DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
} as const

export type PomodoroMode = keyof typeof MODE_DURATIONS

const POMODOROS_BEFORE_LONG = 4

function playChime() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    // Audio not available
  }
}

export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODE_DURATIONS.focus)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const endTimeRef = useRef<number | null>(null)

  const totalSeconds = MODE_DURATIONS[mode]
  const progress = 1 - secondsLeft / totalSeconds

  const switchMode = useCallback((next: PomodoroMode) => {
    setMode(next)
    setSecondsLeft(MODE_DURATIONS[next])
    setIsRunning(false)
    endTimeRef.current = null
  }, [])

  const handleSessionEnd = useCallback(() => {
    playChime()
    setIsRunning(false)
    endTimeRef.current = null

    if (mode === 'focus') {
      const nextCount = completedPomodoros + 1
      setCompletedPomodoros(nextCount)
      const nextMode =
        nextCount % POMODOROS_BEFORE_LONG === 0 ? 'longBreak' : 'shortBreak'
      setMode(nextMode)
      setSecondsLeft(MODE_DURATIONS[nextMode])
    } else {
      setMode('focus')
      setSecondsLeft(MODE_DURATIONS.focus)
    }
  }, [mode, completedPomodoros])

  useEffect(() => {
    if (!isRunning) return

    const tick = () => {
      if (endTimeRef.current === null) return
      const remaining = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000),
      )
      setSecondsLeft(remaining)
      if (remaining === 0) handleSessionEnd()
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [isRunning, handleSessionEnd])

  const start = useCallback(() => {
    endTimeRef.current = Date.now() + secondsLeft * 1000
    setIsRunning(true)
  }, [secondsLeft])

  const pause = useCallback(() => {
    setIsRunning(false)
    endTimeRef.current = null
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    endTimeRef.current = null
    setSecondsLeft(MODE_DURATIONS[mode])
  }, [mode])

  const selectMode = useCallback(
    (next: PomodoroMode) => {
      switchMode(next)
    },
    [switchMode],
  )

  return {
    mode,
    secondsLeft,
    totalSeconds,
    progress,
    isRunning,
    completedPomodoros,
    start,
    pause,
    reset,
    selectMode,
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

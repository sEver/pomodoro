import { useCallback, useEffect, useRef, useState } from 'react'
import {
  playFocusEndChime,
  playLongBreakEndChime,
  playShortBreakEndChime,
} from '../utils/playChime'

const MINUTE = 60
const MODE_DURATIONS = {
  focus: 25 * MINUTE,
  shortBreak: 5 * MINUTE,
  longBreak: 15 * MINUTE,
} as const

export type PomodoroMode = keyof typeof MODE_DURATIONS

const POMODOROS_BEFORE_LONG = 4

export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODE_DURATIONS.focus)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const endTimeRef = useRef<number | null>(null)

  const totalSeconds = MODE_DURATIONS[mode]
  const progress = 1 - secondsLeft / totalSeconds

  const switchMode = useCallback((next: PomodoroMode) => {
    setMode(next)
    setSecondsLeft(MODE_DURATIONS[next])
    setIsRunning(false)
    setIsSessionComplete(false)
    endTimeRef.current = null
  }, [])

  const handleSessionEnd = useCallback(() => {
    if (mode === 'focus') {
      playFocusEndChime()
    } else if (mode === 'shortBreak') {
      playShortBreakEndChime()
    } else {
      playLongBreakEndChime()
    }

    setIsRunning(false)
    setIsSessionComplete(true)
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
    setIsSessionComplete(false)
    setIsRunning(true)
  }, [secondsLeft])

  const pause = useCallback(() => {
    setIsRunning(false)
    endTimeRef.current = null
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsSessionComplete(false)
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
    isSessionComplete,
    completedPomodoros,
    start,
    pause,
    reset,
    selectMode,
  }
}

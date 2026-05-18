import { formatTime } from '../hooks/usePomodoro'
import './TimerRing.css'

const RADIUS = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type TimerRingProps = {
  secondsLeft: number
  progress: number
  label: string
}

export function TimerRing({ secondsLeft, progress, label }: TimerRingProps) {
  const strokeOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="timer-ring" aria-live="polite" aria-atomic="true">
      <svg viewBox="0 0 260 260" className="ring-svg" role="img" aria-hidden="true">
        <circle className="ring-bg" cx="130" cy="130" r={RADIUS} />
        <circle
          className="ring-progress"
          cx="130"
          cy="130"
          r={RADIUS}
          style={{
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: strokeOffset,
          }}
        />
      </svg>
      <div className="timer-display">
        <span className="time">{formatTime(secondsLeft)}</span>
        <span className="mode-label">{label}</span>
      </div>
    </div>
  )
}

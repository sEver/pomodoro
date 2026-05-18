import { formatTime } from '../utils/formatTime'
import './TimerBar.css'

type TimerBarProps = {
  progress: number
  secondsLeft: number
  label: string
  width: string
  height: string
}

export function TimerBar({
  progress,
  secondsLeft,
  label,
  width,
  height,
}: TimerBarProps) {
  const percent = Math.round(progress * 100)

  return (
    <div
      className="timer-bar"
      style={{ width, height }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label} progress`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="timer-bar-track" aria-hidden="true">
        <div className="timer-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="timer-bar-display">
        <span className="time">{formatTime(secondsLeft)}</span>
        <span className="mode-label">{label}</span>
      </div>
    </div>
  )
}

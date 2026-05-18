import { TimerRing } from './components/TimerRing'
import { usePomodoro, type PomodoroMode } from './hooks/usePomodoro'
import './App.css'

const MODE_LABELS = {
  focus: 'Focus',
  shortBreak: 'Short break',
  longBreak: 'Long break',
} satisfies Record<PomodoroMode, string>

function App() {
  const {
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
  } = usePomodoro()

  return (
    <div className="app" data-mode={mode}>
      <header className="header">
        <h1>Pomodoro</h1>
        <p className="subtitle">
          {completedPomodoros === 0
            ? 'Stay focused, take breaks'
            : `${completedPomodoros} session${completedPomodoros === 1 ? '' : 's'} completed`}
        </p>
      </header>

      <nav className="modes" aria-label="Timer mode">
        {(Object.keys(MODE_LABELS) as PomodoroMode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={`mode-btn${mode === m ? ' active' : ''}`}
            onClick={() => selectMode(m)}
            disabled={isRunning}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </nav>

      <TimerRing
        secondsLeft={secondsLeft}
        progress={progress}
        label={MODE_LABELS[mode]}
      />

      <div className="controls">
        <button
          type="button"
          className="btn btn-primary"
          onClick={isRunning ? pause : start}
        >
          {isRunning ? 'Pause' : secondsLeft < totalSeconds ? 'Resume' : 'Start'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>

      <footer className="hint">
        {mode === 'focus'
          ? '25 min focus → 5 min break (15 min after 4 sessions)'
          : mode === 'shortBreak'
            ? 'Short break — stretch, hydrate, rest your eyes'
            : 'Long break — you earned it'}
      </footer>
    </div>
  )
}

export default App

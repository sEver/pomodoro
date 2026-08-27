import { Fragment, useEffect } from 'react'
import { TimerBar } from './components/TimerBar'
// import { TimerRing } from './components/TimerRing'
import { usePomodoro, type PomodoroMode } from './hooks/usePomodoro'
import {
  playChime,
  playResetChime,
  type TomatoNoteIndex,
} from './utils/playChime'
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
    isSessionComplete,
    completedPomodoros,
    start,
    pause,
    reset,
    selectMode,
  } = usePomodoro()

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('#favicon')
    if (!favicon) return

    const emoji = isSessionComplete ? '✅' : '🍅'
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`

    favicon.href = `data:image/svg+xml,${icon}`
  }, [isSessionComplete])

  return (
    <div className="app" data-mode={mode}>
      <header className="header">
        <h1 className="title">
          {(['P', 'm', 'd', 'r'] as const).map((letter, index) => (
            <Fragment key={letter}>
              {letter}
              <button
                type="button"
                className="tomato-btn"
                style={{ animationDelay: `${index * 0.50}s` }}
                onClick={() => playChime(index as TomatoNoteIndex)}
                aria-label="Play chime"
              >
                🍅
              </button>
            </Fragment>
          ))}
        </h1>
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
      <footer className="hint">
        {mode === 'focus'
          ? '25 min focus, then 5 min break (15 min after 4 sessions)'
          : mode === 'shortBreak'
            ? 'Short break - stretch, hydrate, rest your eyes'
            : 'Long break - take a walk'}
      </footer>

      <div className="controls">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (isRunning) {
              playChime(0)
              pause()
            } else {
              playChime(3)
              start()
            }
          }}
        >
          {isRunning ? 'Pause' : secondsLeft < totalSeconds ? 'Resume' : 'Start'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            reset()
            playResetChime()
          }}
        >
          Reset
        </button>
      </div>

      <div className="timer-displays">
        {/* <TimerRing
          secondsLeft={secondsLeft}
          progress={progress}
          label={MODE_LABELS[mode]}
        /> */}
        <TimerBar
          progress={progress}
          secondsLeft={secondsLeft}
          label={MODE_LABELS[mode]}
          width="95%"
          height="100px"
        />
      </div>

      <label className="layout-toggle" title="Align to bottom">
        <input type="checkbox" />
        <span role="img" aria-label="weight">⬇️</span>
      </label>

      <a
        className="github-link"
        href="https://github.com/sEver/pomodoro"
        target="_blank"
        rel="noreferrer"
        aria-label="View pomodoro on GitHub"
        title="View on GitHub"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
        </svg>
      </a>
    </div>
  )
}

export default App

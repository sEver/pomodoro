import { Fragment } from 'react'
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
    completedPomodoros,
    start,
    pause,
    reset,
    selectMode,
  } = usePomodoro()

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
    </div>
  )
}

export default App

import { useEffect } from 'react';
import './DeployGame.css';

export default function DeployGame() {
  useEffect(() => {
    const CHECKLIST = [
      { key: 'install', label: 'Install dependencies 📦', emoji: '📦' },
      { key: 'fix', label: 'Fix bug 🐛', emoji: '🐛' },
      { key: 'merge', label: 'Merge PR 🔀', emoji: '🔀' },
      { key: 'deploy', label: 'Push to prod 🚀', emoji: '🚀' },
    ];

      const GAME_SECONDS = 60;
      const SPAWN_MAX_MS = 1400;
    const WRONG_PENALTY = 5;
    const CORRECT_POINTS = 100;
    const CYCLE_BONUS = 500;

    const gameEl = document.getElementById('game') as HTMLDivElement;
    const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    const howBtn = document.getElementById('howBtn') as HTMLButtonElement;
    const scoreEl = document.getElementById('score') as HTMLElement;
    const timeEl = document.getElementById('time') as HTMLElement;
    const hudTime = document.getElementById('hudTime') as HTMLElement;
    const timeFill = document.getElementById('timeFill') as HTMLDivElement;
    const nextLabel = document.getElementById('nextLabel') as HTMLElement;
    const hudNext = document.getElementById('hudNext') as HTMLElement;
    const comboEl = document.getElementById('combo') as HTMLElement;
    const toast = document.getElementById('toast') as HTMLDivElement;
    const finish = document.getElementById('finish') as HTMLDivElement;
    const endTitle = document.getElementById('endTitle') as HTMLElement;
    const finalScore = document.getElementById('finalScore') as HTMLElement;
    const playAgain = document.getElementById('playAgain') as HTMLButtonElement;
    const shareBtn = document.getElementById('shareBtn') as HTMLButtonElement;
    const nextBox = document.getElementById('nextBox') as HTMLDivElement;

    let audioCtx: AudioContext | undefined;
    const beep = (freq = 440, dur = 0.08, type: OscillatorType = 'sine', gain = 0.03) => {
      try {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = audioCtx || new AudioContextClass();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.value = gain;
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start();
        setTimeout(() => {
          o.stop();
        }, dur * 1000);
      } catch {
        // ignore audio errors
      }
    };
    const chord = (freqs = [440, 660, 880], dur = 0.25) => freqs.forEach((f, i) => setTimeout(() => beep(f, dur, 'triangle', 0.02), i * 0));
    const errorBuzz = () => {
      beep(200, 0.08, 'square', 0.025);
      setTimeout(() => beep(160, 0.12, 'square', 0.025), 90);
    };

    interface GameState {
      running: boolean;
      score: number;
      combo: number;
      cycleStep: number;
      t0: number;
      timeLeft: number;
      spawnTimer: ReturnType<typeof setTimeout> | null;
      speedLevel: number;
    }

    let state: GameState;
    const resetState = () => {
      state = {
        running: false,
        score: 0,
        combo: 1,
        cycleStep: 0,
        t0: 0,
        timeLeft: GAME_SECONDS,
        spawnTimer: null,
        speedLevel: 0,
      };
      updateUI();
      clearTasks();
    };

    const fmt = (s: number) => s.toFixed(1).replace(/\.0$/, '');
    function updateUI() {
      scoreEl.textContent = String(state.score);
      timeEl.textContent = String(Math.max(0, Math.ceil(state.timeLeft)));
      hudTime.textContent = `${fmt(Math.max(0, state.timeLeft))}s`;
      timeFill.style.width = `${((1 - state.timeLeft / GAME_SECONDS) * 100).toFixed(2)}%`;
      const next = CHECKLIST[state.cycleStep];
      nextLabel.textContent = next.label;
      hudNext.textContent = next.label;
      comboEl.textContent = `x${state.combo}`;
    }

    function showToast(msg: string) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 800);
    }

    function randomBetween(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function spawnTask() {
      if (!state.running) return;
      const { spawnMs, fallSec } = currentDifficulty();
      const t = CHECKLIST[Math.floor(Math.random() * CHECKLIST.length)];
      const el = document.createElement('button');
      el.className = 'task';
      el.style.left = `${randomBetween(14, gameEl.clientWidth - 14)}px`;
      el.style.animationDuration = `${fallSec}s`;
      el.innerHTML = `<div class="emoji">${t.emoji}</div><div class="title">${t.label}</div>`;
      el.dataset.key = t.key;

      let clicked = false;
      el.addEventListener(
        'click',
        e => {
          e.stopPropagation();
          if (clicked || !state.running) return;
          clicked = true;
          const needed = CHECKLIST[state.cycleStep].key;
          if (t.key === needed) {
            el.classList.add('correct');
            state.score += Math.floor(CORRECT_POINTS * state.combo);
            state.combo = Math.min(5, state.combo + 0.15);
            beep(520, 0.06, 'sine', 0.03);
            setTimeout(() => el.remove(), 120);
            state.cycleStep++;
            if (state.cycleStep >= CHECKLIST.length) {
              state.score += CYCLE_BONUS + Math.floor(state.timeLeft * 10);
              state.cycleStep = 0;
              state.combo = Math.min(5, state.combo + 0.5);
              state.speedLevel++;
              chord([660, 880, 1320], 0.25);
              showToast(randMeme());
            }
          } else {
            el.classList.add('wrong');
            errorBuzz();
            state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY);
            state.combo = 1;
          }
          updateUI();
        },
        { once: true },
      );

      el.addEventListener('animationend', () => el.remove());
      gameEl.appendChild(el);

      const nextMs = randomBetween(spawnMs * 0.6, spawnMs * 1.4);
      state.spawnTimer = setTimeout(spawnTask, nextMs);
    }

    function currentDifficulty() {
      const lvl = state.speedLevel;
      const spawnBase = Math.max(350, SPAWN_MAX_MS - lvl * 90);
      const fallSec = Math.max(2.0, 5.0 - lvl * 0.35);
      return { spawnMs: spawnBase, fallSec };
    }

    function clearTasks() {
      [...gameEl.querySelectorAll('.task')].forEach(n => n.remove());
    }

    function endGame() {
      state.running = false;
      if (state.spawnTimer) clearTimeout(state.spawnTimer);
      finalScore.textContent = String(state.score);
      // update stats in localStorage
      const raw = localStorage.getItem('deployGameStats');
      const stats = raw
        ? JSON.parse(raw)
        : { gamesPlayed: 0, bestScore: 0, lastScore: 0 };
      stats.gamesPlayed += 1;
      stats.lastScore = state.score;
      stats.bestScore = Math.max(stats.bestScore, state.score);
      localStorage.setItem('deployGameStats', JSON.stringify(stats));
      finish.classList.add('show');
      endTitle.textContent = endTitlePhrases[Math.floor(Math.random() * endTitlePhrases.length)];
      nextBox.style.opacity = '0.75';
    }

    function tick() {
      if (!state.running) return;
      const now = performance.now();
      const elapsed = (now - state.t0) / 1000;
      state.t0 = now;
      state.timeLeft -= elapsed;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        updateUI();
        return endGame();
      }
      updateUI();
      requestAnimationFrame(tick);
    }

    function startGame() {
      resetState();
      finish.classList.remove('show');
      nextBox.style.opacity = '1';
      state.running = true;
      state.t0 = performance.now();
      requestAnimationFrame(tick);
      setTimeout(spawnTask, 350);
      beep(440, 0.08, 'sine', 0.03);
      setTimeout(() => beep(660, 0.08, 'sine', 0.03), 110);
    }

    function randMeme() {
      return memes[Math.floor(Math.random() * memes.length)];
    }

    const endTitlePhrases = [
      '⏰ Time! Deploy window closed',
      '💥 Server held… barely',
      '🧯 PagerDuty can rest (for now)',
    ];
    const memes = [
      'You deployed without a rollback! 💪',
      'Whoever deploys on Friday is a hero! 🦸',
      'You saved production, but QA is still unhappy. 😅',
      'All green! Ship it! ✅',
      'Monolith trembled, microservices cheered.',
    ];

    startBtn.addEventListener('click', startGame);
    howBtn.addEventListener('click', () => {
      alert('Click falling tasks in this exact order:\n\n1) Install dependencies 📦\n2) Fix bug 🐛\n3) Merge PR 🔀\n4) Push to prod 🚀\n\nWrong click = −5 seconds. Finish as many deploy cycles as you can in 60 seconds!');
    });
    playAgain.addEventListener('click', startGame);
    shareBtn.addEventListener('click', async () => {
      const text = `Deploy or Die — I scored ${state.score} points in 60s! Next up: ${CHECKLIST[state.cycleStep].label}`;
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard');
      } catch {
        showToast(text);
      }
    });

    const keydown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!state.running) startGame();
      }
    };
    window.addEventListener('keydown', keydown);

    resetState();

    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  return (
    <div className="wrap">
      <header>
        <h1>🚀 Deploy or Die — 60‑second DevOps Dash</h1>
        <span className="badge">Standalone • HTML + CSS + JS • WebAudio</span>
      </header>

      <aside className="sidebar">
        <div className="panel">
          <div className="stat">
            <div>
              <strong>Score</strong>
              <br />
              <small>Total points</small>
            </div>
            <div id="score">0</div>
          </div>
          <div className="stat">
            <div>
              <strong>Time</strong>
              <br />
              <small>Seconds left</small>
            </div>
            <div id="time">60</div>
          </div>
          <div className="next" id="nextBox">
            Next: <strong id="nextLabel">Install dependencies 📦</strong>
          </div>
          <div className="legend" style={{ marginTop: '8px' }}>
            <div>
              <span className="dot ok" /> correct click = +points
            </div>
            <div>
              <span className="dot bad" /> wrong click = −5s
            </div>
          </div>
          <div className="controls" style={{ marginTop: '10px' }}>
            <button className="primary" id="startBtn">
              Start (or press <span className="kbd">Space</span>)
            </button>
            <button className="secondary" id="howBtn">
              How to play
            </button>
          </div>
        </div>

        <div className="panel footnote">
          Checklist order:
          <ol style={{ margin: '6px 0 0 20px' }}>
            <li>Install dependencies 📦</li>
            <li>Fix bug 🐛</li>
            <li>Merge PR 🔀</li>
            <li>Push to prod 🚀</li>
          </ol>
          Tips: Click only the <em>next</em> required step. Tasks fall constantly. Wrong clicks cost time.
        </div>
      </aside>

      <main className="panel game" id="game">
        <div className="hud">
          <div className="chip">
            ⏱️ <span id="hudTime">60.0s</span>
          </div>
          <div className="chip">
            🔥 Combo: <span id="combo">x1</span>
          </div>
          <div className="chip">
            ➡️ Next: <strong id="hudNext">Install dependencies 📦</strong>
          </div>
        </div>
        <div className="toast" id="toast">
          Nice!
        </div>
        <div className="finish" id="finish">
          <div className="card">
            <h2 id="endTitle">Time!</h2>
            <div className="memes" id="memeLine" />
            <div>
              Final score: <strong id="finalScore">0</strong>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="primary" id="playAgain">
                Play again
              </button>
              <button className="secondary" id="shareBtn">
                Copy result
              </button>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: '12px', right: '12px', bottom: '12px', zIndex: 2 }}>
          <div className="timerbar">
            <div className="fill" id="timeFill" />
          </div>
        </div>
      </main>
    </div>
  );
}


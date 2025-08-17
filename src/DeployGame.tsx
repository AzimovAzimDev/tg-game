import { useEffect } from 'react';
import './DeployGame.css';

export default function DeployGame() {
  useEffect(() => {
    const CHECKLIST = [
      { key: 'requirements', label: 'Get requirements 📝', emoji: '📝' },
      { key: 'branch', label: 'Create branch 🌿', emoji: '🌿' },
      { key: 'code', label: 'Write code 💻', emoji: '💻' },
      { key: 'tests', label: 'Write tests 🧪', emoji: '🧪' },
      { key: 'fix', label: 'Fix bugs 🐛', emoji: '🐛' },
      { key: 'conflicts', label: 'Resolve conflicts ⚔️', emoji: '⚔️' },
      { key: 'approve', label: 'Get MR approvals ✅', emoji: '✅' },
      { key: 'merge', label: 'Merge to main 🔀', emoji: '🔀' },
      { key: 'deploy', label: 'Deploy to prod 🚀', emoji: '🚀' },
    ];

      const GAME_SECONDS = 60;
      const SPAWN_MAX_MS = 1400;
    const WRONG_PENALTY = 5;
    const CORRECT_POINTS = 100;
    const CYCLE_BONUS = 500;

    const gameEl = document.getElementById('game') as HTMLDivElement;
    const hudTime = document.getElementById('hudTime') as HTMLElement;
    const timeFill = document.getElementById('timeFill') as HTMLDivElement;
    const hudNext = document.getElementById('hudNext') as HTMLElement;
    const comboEl = document.getElementById('combo') as HTMLElement;
    const toast = document.getElementById('toast') as HTMLDivElement;
    const finish = document.getElementById('finish') as HTMLDivElement;
    const endTitle = document.getElementById('endTitle') as HTMLElement;
    const finalScore = document.getElementById('finalScore') as HTMLElement;
    const playAgain = document.getElementById('playAgain') as HTMLButtonElement;
    const shareBtn = document.getElementById('shareBtn') as HTMLButtonElement;

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
    // Counts how many consecutive spawns happened without spawning the required task
    let sinceRequired = 0;
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
      sinceRequired = 0;
      updateUI();
      clearTasks();
    };

    function updateUI() {
      // Show time as whole seconds to avoid flickering from milliseconds
      hudTime.textContent = `${Math.max(0, Math.ceil(state.timeLeft))}s`;
      timeFill.style.width = `${((1 - state.timeLeft / GAME_SECONDS) * 100).toFixed(2)}%`;
      const next = CHECKLIST[state.cycleStep];
      hudNext.textContent = next.label;
      // Show combo rounded to 1 decimal place
      comboEl.textContent = `x${state.combo.toFixed(1)}`;
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

      // Ensure that at least each third spawned task is the required one
      const needed = CHECKLIST[state.cycleStep];
      let t = CHECKLIST[Math.floor(Math.random() * CHECKLIST.length)];
      if (sinceRequired >= 2) {
        // Force required task if we haven't seen it in the last two spawns
        t = needed;
        sinceRequired = 0;
      } else {
        if (t.key === needed.key) {
          sinceRequired = 0;
        } else {
          sinceRequired += 1;
        }
      }

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

    // Start immediately without alerts; steps are shown on the Rules screen
    startGame();

    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  return (
    <div className="wrap">

      <main className="panel game" id="game">
        <div className="hud">
          <div className="chip">
            ⏱️ <span id="hudTime">60.0s</span>
          </div>
          <div className="chip">
            🔥 Combo: <span id="combo">x1</span>
          </div>
          <div className="chip">
            ➡️ Next: <strong id="hudNext">Get requirements 📝</strong>
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


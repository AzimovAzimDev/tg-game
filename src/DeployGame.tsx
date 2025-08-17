import { useEffect } from 'react';
import './DeployGame.css';

// Deploy or Die — Tower Bloxx–style paddle catch implementation
// Single-file implementation with canvas rendering and DOM HUD

export default function DeployGame() {
  useEffect(() => {
    // Types from the spec
    type StepId =
      | 'requirements'
      | 'branch'
      | 'code'
      | 'tests'
      | 'fix-bugs'
      | 'resolve-conflicts'
      | 'mr-approvals'
      | 'merge-main'
      | 'deploy-prod';

    type BlockKind =
      | { type: 'step'; step: StepId }
      | { type: 'bad'; name: 'bug' | 'infra' }
      | { type: 'heal'; name: 'fix-bug' | 'fix-infra' };

    type FallingBlock = {
      id: string;
      kind: BlockKind;
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
    };

    // Suggested parameters
    const params = {
      durationMs: 120_000,
      maxDurationMs: 180_000,
      spawnIntervalStart: 1000,
      spawnIntervalMin: 600,
      rampEverySec: 20,
      fallSpeedStart: 180,
      fallSpeedMax: 300,
      fallRampPct: 0.06,
      blockSize: { w: 132, h: 72, stackCompression: 0.65 },
      platformWidth: 240,
      badEverySecMin: 12,
      maxActiveBlocks: 12,
      timeBonus: { correct: 1000, heal: 2000 },
      timePenalty: { wrong: 5000, bad: 8000 },
      points: { base: 100, speedWindowMs: 1000, speedBonus: 20, finishPerSec: 5 },
      comboTiers: [2, 4, 6, 8],
      comboMult: [1.2, 1.5, 1.8, 2.0],
      healBiasWhenBlocked: 0.85,
    } as const;

    const STEPS: { id: StepId; label: string; emoji: string }[] = [
      { id: 'requirements', label: 'Get requirements', emoji: '📝' },
      { id: 'branch', label: 'Create branch', emoji: '🌿' },
      { id: 'code', label: 'Write code', emoji: '💻' },
      { id: 'tests', label: 'Write tests', emoji: '🧪' },
      { id: 'fix-bugs', label: 'Fix bugs', emoji: '🐛' },
      { id: 'resolve-conflicts', label: 'Resolve conflicts', emoji: '⚔️' },
      { id: 'mr-approvals', label: 'Get MR approvals', emoji: '✅' },
      { id: 'merge-main', label: 'Merge to main', emoji: '🔀' },
      { id: 'deploy-prod', label: 'Deploy to prod', emoji: '🚀' },
    ];

    // DOM refs
    const gameEl = document.getElementById('game') as HTMLDivElement;
    // Create canvas for playfield
    let canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'gameCanvas';
      canvas.style.position = 'absolute';
      canvas.style.left = '0';
      canvas.style.top = '56px'; // below HUD area
      canvas.style.right = '0';
      canvas.style.bottom = '0';
      canvas.style.width = '100%';
      canvas.style.height = 'calc(100% - 56px)';
      gameEl.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d')!;

    // HUD elements (reuse existing timerbar and a few chips, repurpose combo->score)
    const hudTime = document.getElementById('hudTime') as HTMLElement;
    const timeFill = document.getElementById('timeFill') as HTMLDivElement;
    const hudNext = document.getElementById('hudNext') as HTMLElement;
    // Add a score span inside the HUD if not present
    let scoreChip = document.getElementById('scoreChip') as HTMLDivElement | null;
    if (!scoreChip) {
      scoreChip = document.createElement('div');
      scoreChip.className = 'chip';
      scoreChip.id = 'scoreChip';
      scoreChip.innerHTML = '★ Score: <strong id="hudScore">0</strong> <span id="scoreDelta" style="margin-left:6px;color:#2ecc71;"></span>';
      const hud = gameEl.querySelector('.hud');
      hud?.appendChild(scoreChip);
    }
    const hudScore = document.getElementById('hudScore') as HTMLElement;
    const scoreDelta = document.getElementById('scoreDelta') as HTMLElement;

    const toast = document.getElementById('toast') as HTMLDivElement;
    const finish = document.getElementById('finish') as HTMLDivElement;
    const endTitle = document.getElementById('endTitle') as HTMLElement;
    const finalScore = document.getElementById('finalScore') as HTMLElement;
    const playAgain = document.getElementById('playAgain') as HTMLButtonElement;
    const shareBtn = document.getElementById('shareBtn') as HTMLButtonElement;

    // Audio helpers
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
        setTimeout(() => o.stop(), dur * 1000);
      } catch {
        /* ignore */
      }
    };
    const chord = (freqs = [440, 660, 880], dur = 0.25) => freqs.forEach(f => beep(f, dur, 'triangle', 0.02));
    const errorBuzz = () => {
      beep(220, 0.08, 'square', 0.025);
      setTimeout(() => beep(180, 0.12, 'square', 0.025), 90);
    };

    // Game state
    interface Platform { x: number; w: number; y: number; targetX: number }
    interface Stacked { kind: BlockKind; w: number; h: number }
    type Blocked = null | 'bug' | 'infra';

    interface GameState {
      running: boolean;
      timeLeftMs: number;
      elapsedMs: number;
      score: number;
      combo: number; // numeric combo multiplier base
      blocks: FallingBlock[];
      stacked: Stacked[];
      goalIndex: number; // index in STEPS
      blocked: Blocked;
      lastBadAtMs: number;
      spawnTimerMs: number; // countdown
      fallSpeed: number; // vy
      spawnIntervalMs: number;
      platform: Platform;
      t0: number; // last frame timestamp
      playW: number;
      playH: number;
    }

    let state: GameState;

    function resizeCanvas() {
      const rect = gameEl.getBoundingClientRect();
      // Keep HUD height ~56px
      const headerH = 56;
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height - headerH);
      canvas!.width = w;
      canvas!.height = h;
      state.playW = w;
      state.playH = h;
      // Place platform 24px from bottom
      state.platform.y = h - 24;
      state.platform.w = params.platformWidth;
    }

    function resetState() {
      state = {
        running: false,
        timeLeftMs: params.durationMs,
        elapsedMs: 0,
        score: 0,
        combo: 1,
        blocks: [],
        stacked: [],
        goalIndex: 0,
        blocked: null,
        lastBadAtMs: -999999,
        spawnTimerMs: params.spawnIntervalStart,
        fallSpeed: params.fallSpeedStart,
        spawnIntervalMs: params.spawnIntervalStart,
        platform: { x: 0, y: 0, w: params.platformWidth, targetX: 0 },
        t0: performance.now(),
        playW: 0,
        playH: 0,
      };
      resizeCanvas();
      // center platform
      state.platform.x = state.playW / 2;
      state.platform.targetX = state.platform.x;
      updateUI();
      draw();
    }

    function showToast(msg: string) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 800);
    }

    function updateUI(deltaText?: string, deltaColor?: string) {
      // Time label
      const secs = Math.max(0, Math.ceil(state.timeLeftMs / 1000));
      hudTime.textContent = `${secs.toString().padStart(2, '0')}s`;
      if (secs <= 15) hudTime.style.color = '#e74c3c'; else hudTime.style.color = '';
      // Timer bar fill (consumed)
      const consumed = 1 - state.timeLeftMs / params.durationMs;
      timeFill.style.width = `${Math.max(0, Math.min(1, consumed)) * 100}%`;
      // Score
      hudScore.textContent = String(state.score);
      if (deltaText) {
        scoreDelta.textContent = deltaText;
        scoreDelta.style.color = deltaColor || '#2ecc71';
        scoreDelta.style.opacity = '1';
        setTimeout(() => (scoreDelta.style.opacity = '0'), 600);
      }
      // Goal pill
      const goal = STEPS[state.goalIndex];
      hudNext.textContent = `Goal: ${goal.label} ${goal.emoji}`;
    }

    function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
    function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

    function spawnBlock() {
      if (!state.running) return;
      if (state.blocks.length >= params.maxActiveBlocks) return;

      // Choose kind with weights
      const goal = STEPS[state.goalIndex].id;

      const push = (arr: BlockKind[], kind: BlockKind, weight: number) => {
        for (let i = 0; i < weight; i++) arr.push(kind);
      };
      const bag: BlockKind[] = [];

      if (state.blocked) {
        // heavily bias matching heal
        const healKind: BlockKind = { type: 'heal', name: state.blocked === 'bug' ? 'fix-bug' : 'fix-infra' };
        push(bag, healKind, Math.floor(params.healBiasWhenBlocked * 100));
        // small chance for others
        push(bag, { type: 'bad', name: 'bug' }, 5);
        push(bag, { type: 'bad', name: 'infra' }, 5);
        // allow some decoy steps
        for (const s of STEPS) push(bag, { type: 'step', step: s.id }, 2);
      } else {
        // Not blocked: bias goal and next ones
        push(bag, { type: 'step', step: goal }, 50);
        const next1 = STEPS[(state.goalIndex + 1) % STEPS.length].id;
        const next2 = STEPS[(state.goalIndex + 2) % STEPS.length].id;
        push(bag, { type: 'step', step: next1 }, 12);
        push(bag, { type: 'step', step: next2 }, 8);
        // Some random decoys
        for (const s of STEPS) if (s.id !== goal && s.id !== next1 && s.id !== next2) push(bag, { type: 'step', step: s.id }, 4);
        // Occasionally bad
        const nowMs = state.elapsedMs;
        if (nowMs - state.lastBadAtMs >= params.badEverySecMin * 1000) {
          push(bag, { type: 'bad', name: 'bug' }, 12);
          push(bag, { type: 'bad', name: 'infra' }, 12);
        } else {
          push(bag, { type: 'bad', name: 'bug' }, 3);
          push(bag, { type: 'bad', name: 'infra' }, 3);
        }
      }

      const kind = bag[Math.floor(Math.random() * bag.length)];
      if (kind.type === 'bad') state.lastBadAtMs = state.elapsedMs;

      const w = params.blockSize.w;
      const h = params.blockSize.h;
      const x = rand(w / 2, state.playW - w / 2);
      const y = -h - 4;
      const vx = rand(-20, 20);
      const vy = state.fallSpeed;
      const block: FallingBlock = { id: Math.random().toString(36).slice(2), kind, x, y, vx, vy, w, h };
      state.blocks.push(block);
    }

    function easePlatform() {
      const p = state.platform;
      const ease = 0.25;
      p.x += (p.targetX - p.x) * ease;
      p.x = clamp(p.x, p.w / 2, state.playW - p.w / 2);
    }

    function intersectsPlatform(b: FallingBlock) {
      const p = state.platform;
      const blockBottom = b.y + b.h / 2;
      const platformTop = p.y;
      const centerX = b.x;
      const caught = blockBottom >= platformTop && Math.abs(centerX - p.x) <= p.w / 2;
      return caught;
    }

    function handleCatch(b: FallingBlock) {
      // Snap to platform center and stack
      const kind = b.kind;
      // Remove from active blocks
      state.blocks = state.blocks.filter(x => x.id !== b.id);

      if (kind.type === 'bad') {
        state.blocked = kind.name === 'bug' ? 'bug' : 'infra';
        state.combo = 1;
        state.timeLeftMs = Math.max(0, state.timeLeftMs - params.timePenalty.bad);
        errorBuzz();
        updateUI('−8s', '#e74c3c');
        return;
      }

      if (state.blocked) {
        if (kind.type === 'heal' && ((state.blocked === 'bug' && kind.name === 'fix-bug') || (state.blocked === 'infra' && kind.name === 'fix-infra'))) {
          // Clear blocked
          state.blocked = null;
          state.timeLeftMs = Math.min(params.maxDurationMs, state.timeLeftMs + params.timeBonus.heal);
          beep(600, 0.08, 'sine', 0.03);
          updateUI('+2s', '#2ecc71');
        } else {
          // Wrong during blocked
          state.combo = 1;
          state.timeLeftMs = Math.max(0, state.timeLeftMs - params.timePenalty.wrong);
          errorBuzz();
          updateUI('−5s', '#e74c3c');
        }
        return;
      }

      if (kind.type === 'step') {
        const goal = STEPS[state.goalIndex].id;
        if (kind.step === goal) {
          // Correct catch
          // Place to stack; compress previous visuals
          for (let i = 0; i < state.stacked.length; i++) state.stacked[i].h = Math.round(params.blockSize.h * params.blockSize.stackCompression);
          state.stacked.push({ kind, w: params.blockSize.w, h: params.blockSize.h });
          // Score: base * combo multiplier
          const mult = comboMultiplier(state.combo);
          const add = Math.floor(params.points.base * mult);
          state.score += add;
          state.combo = Math.min(10, state.combo + 1);
          state.timeLeftMs = Math.min(params.maxDurationMs, state.timeLeftMs + params.timeBonus.correct);
          beep(520, 0.06, 'sine', 0.03);
          updateUI(`+${add}`, '#2ecc71');
          // advance goal
          state.goalIndex = (state.goalIndex + 1) % STEPS.length;
          // on sequence finish give bonus and ramp
          if (state.goalIndex === 0) {
            const bonus = Math.floor((state.timeLeftMs / 1000) * params.points.finishPerSec);
            state.score += bonus;
            chord([660, 880, 1320], 0.22);
            showToast('Cycle complete!');
            // Slightly increase difficulty by reducing spawn interval a bit
            state.spawnIntervalMs = Math.max(params.spawnIntervalMin, state.spawnIntervalMs - 60);
            updateUI(`+${bonus}`, '#2ecc71');
          }
        } else {
          // Wrong step
          state.combo = 1;
          state.timeLeftMs = Math.max(0, state.timeLeftMs - params.timePenalty.wrong);
          errorBuzz();
          updateUI('−5s', '#e74c3c');
        }
      } else if (kind.type === 'heal') {
        // Heal caught while not blocked => wrong
        state.combo = 1;
        state.timeLeftMs = Math.max(0, state.timeLeftMs - params.timePenalty.wrong);
        errorBuzz();
        updateUI('−5s', '#e74c3c');
      }
    }

    function comboMultiplier(combo: number) {
      // Map combo count to multiplier tiers
      const tiers = params.comboTiers;
      const mults = params.comboMult;
      let m = 1;
      for (let i = 0; i < tiers.length; i++) if (combo >= tiers[i]) m = mults[i];
      return m;
    }

    function endFail(reason: 'timeout' | 'off-platform') {
      state.running = false;
      finalScore.textContent = String(state.score);
      // Save simple stats
      const raw = localStorage.getItem('deployGameStats');
      const stats = raw ? JSON.parse(raw) : { gamesPlayed: 0, bestScore: 0, lastScore: 0 };
      stats.gamesPlayed += 1;
      stats.lastScore = state.score;
      stats.bestScore = Math.max(stats.bestScore, state.score);
      localStorage.setItem('deployGameStats', JSON.stringify(stats));
      finish.classList.add('show');
      endTitle.textContent = reason === 'timeout' ? '⏰ Time! Deploy window closed' : '😵 Dropped off platform!';
    }

    function maybeRampDifficulty() {
      // Every rampEverySec, increase fall speed up to max and shorten spawn interval toward min
      const t = state.elapsedMs / 1000;
      const steps = Math.floor(t / params.rampEverySec);
      const targetVy = Math.min(params.fallSpeedMax, params.fallSpeedStart * Math.pow(1 + params.fallRampPct, steps));
      state.fallSpeed = targetVy;
      const targetSpawn = Math.max(params.spawnIntervalMin, params.spawnIntervalStart - steps * 40);
      state.spawnIntervalMs = Math.max(params.spawnIntervalMin, Math.min(state.spawnIntervalMs, targetSpawn));
    }

    function draw() {
      const w = state.playW; const h = state.playH;
      ctx.clearRect(0, 0, w, h);
      // Background grid light
      ctx.fillStyle = '#0b0f1a';
      ctx.fillRect(0, 0, w, h);

      // Draw stack from bottom up aligned to platform center
      let stackY = state.platform.y;
      for (let i = 0; i < state.stacked.length; i++) {
        const s = state.stacked[i];
        stackY -= s.h;
        drawBlock(state.platform.x, stackY + s.h / 2, s.w, s.h, s.kind, 0.85);
      }

      // Draw platform
      ctx.fillStyle = state.blocked ? (state.blocked === 'bug' ? '#c0392b' : '#8e44ad') : '#2c3e50';
      const p = state.platform;
      const ph = 14; // platform height for drawing
      roundRect(ctx, p.x - p.w / 2, p.y - ph, p.w, ph, 6, true, false);

      // Draw falling blocks
      for (const b of state.blocks) {
        drawBlock(b.x, b.y, b.w, b.h, b.kind, 1);
      }

      // HUD overlay: blocked icon
      if (state.blocked) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Blocked: ${state.blocked === 'bug' ? '🐛 Bug' : '⚠️ Infra'}`, 8, 18);
      }
    }

    function drawBlock(cx: number, cy: number, w: number, h: number, kind: BlockKind, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const x = cx - w / 2;
      const y = cy - h / 2;
      // Body
      ctx.fillStyle = '#1e2a44';
      roundRect(ctx, x, y, w, h, 8, true, false);
      // Label and emoji
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const label = blockLabel(kind);
      ctx.fillText(label.text, x + 12, y + h / 2);
      ctx.textAlign = 'right';
      ctx.fillText(label.emoji, x + w - 10, y + h / 2);
      ctx.restore();
    }

    function blockLabel(kind: BlockKind): { text: string; emoji: string } {
      if (kind.type === 'step') {
        const step = STEPS.find(s => s.id === kind.step)!;
        return { text: step.label, emoji: step.emoji };
      }
      if (kind.type === 'bad') return { text: kind.name === 'bug' ? 'Bug' : 'Infra outage', emoji: kind.name === 'bug' ? '🐛' : '⚠️' };
      return { text: kind.name === 'fix-bug' ? 'Fix bug' : 'Fix infra', emoji: kind.name === 'fix-bug' ? '✅' : '🛠' };
    }

    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    function tick() {
      if (!state.running) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - state.t0) / 1000); // clamp dt
      state.t0 = now;
      state.elapsedMs += dt * 1000;
      state.timeLeftMs -= dt * 1000;

      if (state.timeLeftMs <= 0) {
        state.timeLeftMs = 0;
        updateUI();
        return endFail('timeout');
      }

      maybeRampDifficulty();

      // Spawn logic
      state.spawnTimerMs -= dt * 1000;
      if (state.spawnTimerMs <= 0) {
        spawnBlock();
        // randomize next spawn around current interval
        const base = state.spawnIntervalMs;
        const next = rand(base * 0.7, base * 1.3);
        state.spawnTimerMs = next;
      }

      // Move blocks
      for (let i = state.blocks.length - 1; i >= 0; i--) {
        const b = state.blocks[i];
        b.x = clamp(b.x + b.vx * dt, b.w / 2, state.playW - b.w / 2);
        b.y += b.vy * dt;

        const caught = intersectsPlatform(b);
        const missed = b.y - b.h / 2 > state.playH; // passed bottom

        if (caught) {
          handleCatch(b);
          continue;
        }
        if (missed) {
          // Off-platform failure if center outside bounds
          const p = state.platform;
          if (Math.abs(b.x - p.x) > p.w / 2) return endFail('off-platform');
          // otherwise, it slipped down inside platform bounds: just remove
          state.blocks.splice(i, 1);
        }
      }

      easePlatform();
      updateUI();
      draw();
      requestAnimationFrame(tick);
    }

    function startGame() {
      finish.classList.remove('show');
      resetState();
      state.running = true;
      state.t0 = performance.now();
      requestAnimationFrame(tick);
      beep(440, 0.08, 'sine', 0.03);
      setTimeout(() => beep(660, 0.08, 'sine', 0.03), 110);
    }

    function onPointerMove(e: PointerEvent | MouseEvent | TouchEvent) {
      let clientX: number | null = null;
      if (e instanceof PointerEvent || e instanceof MouseEvent) clientX = (e as PointerEvent).clientX;
      else if ('touches' in e && e.touches.length > 0) clientX = e.touches[0].clientX;
      if (clientX == null) return;
      const rect = canvas!.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      state.platform.targetX = x;
    }

    // Listeners
    window.addEventListener('resize', resizeCanvas);
    gameEl.addEventListener('pointermove', onPointerMove as any);
    gameEl.addEventListener('touchmove', onPointerMove as any, { passive: true });

    const keydown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!state.running) startGame();
      }
      if (e.code === 'ArrowLeft') state.platform.targetX -= 40;
      if (e.code === 'ArrowRight') state.platform.targetX += 40;
    };
    window.addEventListener('keydown', keydown);

    playAgain.addEventListener('click', startGame);
    shareBtn.addEventListener('click', async () => {
      const goal = STEPS[state.goalIndex];
      const text = `Deploy or Die — I scored ${state.score} pts. Next: ${goal.label} ${goal.emoji}`;
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard');
      } catch {
        showToast(text);
      }
    });

    // Start immediately
    startGame();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', keydown);
      gameEl.removeEventListener('pointermove', onPointerMove as any);
      gameEl.removeEventListener('touchmove', onPointerMove as any);
    };
  }, []);

  return (
    <div className="wrap">
      <main className="panel game" id="game" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hud" style={{ height: '56px', display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 8px 0' }}>
          <div className="chip">⏱️ <span id="hudTime">120s</span></div>
          <div className="chip">➡️ <strong id="hudNext">Goal: Get requirements 📝</strong></div>
        </div>
        <div className="toast" id="toast">Nice!</div>
        <div className="finish" id="finish">
          <div className="card">
            <h2 id="endTitle">Time!</h2>
            <div>
              Final score: <strong id="finalScore">0</strong>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="primary" id="playAgain">Play again</button>
              <button className="secondary" id="shareBtn">Copy result</button>
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


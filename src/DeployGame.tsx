import { useEffect, useState } from 'react';
import './DeployGame.css';
import { useNavigate } from 'react-router-dom';
import i18n from './i18n';
import SuccessModal from './components/SuccessModal';
import UnsuccessModal from './components/UnsuccessModal';

// Deploy or Die — Tower Bloxx–style paddle catch implementation
// Single-file implementation with canvas rendering and DOM HUD

export default function DeployGame() {
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  const [finalScoreNum, setFinalScoreNum] = useState(0);

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
      | { type: 'heal'; name: 'fix-bug' | 'fix-infra' }
      | { type: 'time' };

    type FallingBlock = {
      id: string;
      kind: BlockKind;
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      displayEmoji?: string; // preselected emoji for this block (used for bad/heal variety)
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
      blockSize: { w: 60, h: 60, stackCompression: 0.65 },
      platformWidth: 240,
      badEverySecMin: 12,
      maxActiveBlocks: 12,
      timeBonus: { correct: 1000, heal: 2000, time: 10000 },
      timePenalty: { wrong: 5000, bad: 8000 },
      points: { base: 100, speedWindowMs: 1000, speedBonus: 20, finishPerSec: 5 },
      comboTiers: [2, 4, 6, 8],
      comboMult: [1.2, 1.5, 1.8, 2.0],
      healBiasWhenBlocked: 0.85,
    } as const;

    const STEPS: { id: StepId; label: string; emoji: string }[] = Object.keys(i18n.t('steps', { returnObjects: true })).map((key) => ({
      id: key as StepId,
      label: i18n.t(`steps.${key}`),
      emoji: i18n.t(`steps.${key}`).split(' ').pop() || '',
    }));

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
      scoreChip.innerHTML = `★ ${i18n.t('game.score')}: <strong id="hudScore">0</strong> <span id="scoreDelta" style="margin-left:6px;color:#2ecc71;"></span>`;
      const hud = gameEl.querySelector('.hud');
      hud?.appendChild(scoreChip);
    }
    const hudScore = document.getElementById('hudScore') as HTMLElement;
    const scoreDelta = document.getElementById('scoreDelta') as HTMLElement;

    const toast = document.getElementById('toast') as HTMLDivElement;
    const finish = document.getElementById('finish') as HTMLDivElement;
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
    interface Stacked { kind: BlockKind; w: number; h: number; dx: number }
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
      timeDropCounter: number; // counts normal spawns to drop a time power-up every 12
      deploys: number; // completed full sequences (finished deploy)
      cycleStartMs: number;
    }

    let state: GameState;
    const keys = { left: false, right: false };

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
      // Place platform 48px from bottom
      state.platform.y = h - 48;
      // Platform should be 1.5x the block width
      state.platform.w = Math.round(params.blockSize.w * 1.5);
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
        platform: { x: 0, y: 0, w: Math.round(params.blockSize.w * 1.5), targetX: 0 },
        t0: performance.now(),
        playW: 0,
        playH: 0,
        timeDropCounter: 0,
        deploys: 0,
        cycleStartMs: 0,
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
      hudNext.textContent = `${i18n.t('game.goal')}: ${goal.label}`;
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

      // Not using blocked mechanic for spawn bias anymore; always mix types
      // Bias goal and a bit of neighbors
      push(bag, { type: 'step', step: goal }, 50);
      const next1 = STEPS[(state.goalIndex + 1) % STEPS.length].id;
      const next2 = STEPS[(state.goalIndex + 2) % STEPS.length].id;
      push(bag, { type: 'step', step: next1 }, 12);
      push(bag, { type: 'step', step: next2 }, 8);
      // Some random decoys
      for (const s of STEPS) if (s.id !== goal && s.id !== next1 && s.id !== next2) push(bag, { type: 'step', step: s.id }, 4);
      // Mix in heals occasionally
      push(bag, { type: 'heal', name: 'fix-bug' }, 6);
      push(bag, { type: 'heal', name: 'fix-infra' }, 6);
      // Occasionally bad (a bit dynamic by timing)
      const nowMs = state.elapsedMs;
      if (nowMs - state.lastBadAtMs >= params.badEverySecMin * 1000) {
        push(bag, { type: 'bad', name: 'bug' }, 12);
        push(bag, { type: 'bad', name: 'infra' }, 12);
      } else {
        push(bag, { type: 'bad', name: 'bug' }, 5);
        push(bag, { type: 'bad', name: 'infra' }, 5);
      }

      const kind = bag[Math.floor(Math.random() * bag.length)];
      if (kind.type === 'bad') state.lastBadAtMs = state.elapsedMs;

      const w = params.blockSize.w;
      const h = params.blockSize.h;
      const x = rand(w / 2, state.playW - w / 2);
      const y = -h - 4;
      const vx = rand(-20, 20);
      const vy = state.fallSpeed;

      // Preselect emoji per block
      const failEmojis = ['💩','🤡','🦀','🍄','💥','🔥','🚧','⚠️'];
      const healEmojis = ['🧠','👀','🍓','🔨','💊','🎁','❤️'];
      let displayEmoji: string | undefined;
      if (kind.type === 'step') {
        const step = STEPS.find(s => s.id === kind.step)!;
        displayEmoji = step.emoji; // used for consistency even though we can derive it later
      } else if (kind.type === 'bad') {
        displayEmoji = failEmojis[Math.floor(Math.random() * failEmojis.length)];
      } else if (kind.type === 'heal') {
        displayEmoji = healEmojis[Math.floor(Math.random() * healEmojis.length)];
      } else if (kind.type === 'time') {
        displayEmoji = '⏳';
      }

      const block: FallingBlock = { id: Math.random().toString(36).slice(2), kind, x, y, vx, vy, w, h, displayEmoji };
      state.blocks.push(block);
      // Count normal spawns and drop an additional time power-up every 12 blocks
      state.timeDropCounter++;
      if (state.timeDropCounter >= 12) {
        state.timeDropCounter = 0;
        if (state.blocks.length < params.maxActiveBlocks) {
          const timeKind: BlockKind = { type: 'time' };
          const w2 = w; const h2 = h;
          const x2 = rand(w2 / 2, state.playW - w2 / 2);
          const y2 = y - h2 - 8;
          const vx2 = rand(-20, 20);
          const vy2 = state.fallSpeed;
          const timeBlock: FallingBlock = {
            id: Math.random().toString(36).slice(2),
            kind: timeKind,
            x: x2,
            y: y2,
            vx: vx2,
            vy: vy2,
            w: w2,
            h: h2,
            displayEmoji: '⏳',
          };
          state.blocks.push(timeBlock);
        }
      }
    }

    function easePlatform() {
      const p = state.platform;
      const ease = 0.25;
      p.x += (p.targetX - p.x) * ease;
      p.x = clamp(p.x, p.w / 2, state.playW - p.w / 2);
    }

    function intersectsCatchSurface(b: FallingBlock) {
      const p = state.platform;
      const blockBottom = b.y + b.h / 2;
      // Determine catch surface: top of last stacked block if any, otherwise platform top
      let surfaceY = p.y;
      let halfWidth: number;
      let supportCenterX: number = p.x; // horizontal center of support surface
      if (state.stacked.length > 0) {
        // Compute current top of stack (platform.y minus sum of stacked heights)
        let totalH = 0;
        for (let i = 0; i < state.stacked.length; i++) totalH += state.stacked[i].h;
        surfaceY = p.y - totalH;
        const top = state.stacked[state.stacked.length - 1];
        halfWidth = top.w / 2; // use last block width as catch width
        supportCenterX = p.x + top.dx; // top block center including its offset
      } else {
        halfWidth = p.w / 2; // no stack yet: use platform width
        supportCenterX = p.x;
      }
      // A catch occurs when the block bottom reaches the surface Y and its center is horizontally within support bounds
      const caught = blockBottom >= surfaceY && Math.abs(b.x - supportCenterX) <= halfWidth;
      return caught;
    }

    function handleCatch(b: FallingBlock) {
      // Snap to platform center and stack
      const kind = b.kind;
      // Remove from active blocks
      state.blocks = state.blocks.filter(x => x.id !== b.id);

      if (kind.type === 'bad') {
        // Bad catch: no longer blocks the player; just score penalty
        state.combo = 1;
        state.score -= 10;
        errorBuzz();
        updateUI('−10', '#e74c3c');
        return;
      }

      // Blocked mechanic removed. Heal always helps regardless of state.
      if (kind.type === 'heal') {
        state.score += 10;
        state.timeLeftMs = Math.min(params.maxDurationMs, state.timeLeftMs + params.timeBonus.heal);
        beep(600, 0.08, 'sine', 0.03);
        const healSec = Math.round(params.timeBonus.heal / 1000);
        updateUI(`+10 +${healSec}s`, '#2ecc71');
        return;
      }

      if (kind.type === 'time') {
        state.timeLeftMs = Math.min(params.maxDurationMs, state.timeLeftMs + params.timeBonus.time);
        beep(700, 0.08, 'sine', 0.03);
        const addSec = Math.round(params.timeBonus.time / 1000);
        updateUI(`+${addSec}s`, '#2ecc71');
        return;
      }

      if (kind.type === 'step') {
        const goal = STEPS[state.goalIndex].id;
        if (kind.step === goal) {
          // Correct catch
          // Place to stack near where it was caught; preserve original size of previous blocks (no compression)

          // Determine support center and half width
          const p = state.platform;
          let supportCenterX = p.x;
          let supportHalf = p.w / 2;
          if (state.stacked.length > 0) {
            const top = state.stacked[state.stacked.length - 1];
            supportCenterX = p.x + top.dx;
            supportHalf = top.w / 2;
          }

          // Desired center based on current falling block position, clamped to support with slight jitter
          const desiredX = b.x;
          const margin = 4; // keep a small margin so it looks supported
          const clampedX = clamp(desiredX, supportCenterX - (supportHalf - margin), supportCenterX + (supportHalf - margin));
          const jitter = rand(-3, 3); // subtle inaccuracy to preserve scatter
          const finalX = clamp(clampedX + jitter, supportCenterX - (supportHalf - margin), supportCenterX + (supportHalf - margin));
          const dx = finalX - p.x;

          state.stacked.push({ kind, w: params.blockSize.w, h: params.blockSize.h, dx });
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
          // on sequence finish, end game
          if (state.goalIndex === 0) {
            const cycleTimeSec = (state.elapsedMs - state.cycleStartMs) / 1000;
            let bonus = 0;
            if (cycleTimeSec <= 10) {
              bonus = 40;
            } else if (cycleTimeSec <= 15) {
              bonus = 25;
            } else if (cycleTimeSec <= 20) {
              bonus = 10;
            }
            state.score += bonus;
            state.deploys += 1; // To show success modal
            endFail();
          }
        } else {
          // Wrong step
          state.combo = 1;
          state.timeLeftMs = Math.max(0, state.timeLeftMs - params.timePenalty.wrong);
          errorBuzz();
          updateUI('−5s', '#e74c3c');
        }
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

    function endFail() {
      state.running = false;
      finalScore.textContent = String(state.score);
      // Save simple stats
      const raw = localStorage.getItem('deployGameStats');
      const stats = raw ? JSON.parse(raw) : { gamesPlayed: 0, bestScore: 0, lastScore: 0 };
      stats.gamesPlayed += 1;
      stats.lastScore = state.score;
      stats.bestScore = Math.max(stats.bestScore, state.score);
      localStorage.setItem('deployGameStats', JSON.stringify(stats));

      // Save detailed result entry for personal leaderboard
      try {
        const key = 'myResults';
        const rawList = localStorage.getItem(key);
        const list = rawList ? JSON.parse(rawList) : [];
        const now = new Date();
        const entry = {
          id: String(now.getTime()),
          name: i18n.t('game.me'),
          initials: i18n.t('game.me'),
          score: state.score,
          ts: now.toISOString(),
        };
        const next = [entry, ...Array.isArray(list) ? list : []].slice(0, 100); // keep up to 100
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore localStorage errors (e.g., private mode)
      }
      // Open appropriate modal based on completed deploys
      setFinalScoreNum(state.score);
      if (state.deploys >= 1) {
        setSuccessOpen(true);
      } else {
        setFailOpen(true);
      }
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

      // Draw stack from bottom up using each block's offset from platform center
      let stackY = state.platform.y;
      for (let i = 0; i < state.stacked.length; i++) {
        const s = state.stacked[i];
        stackY -= s.h;
        const cx = state.platform.x + s.dx;
        drawBlock(cx, stackY + s.h / 2, s.w, s.h, s.kind, 0.85);
      }

      // Draw platform
      ctx.fillStyle = state.blocked ? (state.blocked === 'bug' ? '#c0392b' : '#8e44ad') : '#2c3e50';
      const p = state.platform;
      const ph = 14; // platform height for drawing
      roundRect(ctx, p.x - p.w / 2, p.y - ph, p.w, ph, 6, true, false);

      // Draw falling blocks
      for (const b of state.blocks) {
        drawBlock(b.x, b.y, b.w, b.h, b.kind, 1, b.displayEmoji);
      }

      // HUD overlay: blocked icon
      if (state.blocked) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${i18n.t('game.blocked')}: ${state.blocked === 'bug' ? `🐛 ${i18n.t('game.bug')}` : `⚠️ ${i18n.t('game.infra')}`}`, 8, 18);
      }
    }

    function drawBlock(cx: number, cy: number, w: number, h: number, kind: BlockKind, alpha = 1, emojiOverride?: string) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const x = cx - w / 2;
      const y = cy - h / 2;
      // Body
      ctx.fillStyle = '#1e2a44';
      roundRect(ctx, x, y, w, h, 8, true, false);

      // Borders and effects by kind
      if (kind.type === 'step') {
        // Blue bordered for steps
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3498db';
        roundRect(ctx, x, y, w, h, 8, false, true);
      } else if (kind.type === 'bad') {
        // Red pulsing glow for bad
        const t = performance.now() / 1000;
        const pulse = (Math.sin(t * 6) + 1) / 2; // 0..1
        ctx.shadowColor = 'rgba(231, 76, 60, 0.9)';
        ctx.shadowBlur = 8 + 12 * pulse;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.9)';
        roundRect(ctx, x, y, w, h, 8, false, true);
        ctx.shadowBlur = 0;
      } else if (kind.type === 'heal') {
        // Green border with gentle glow for good (heal) blocks
        const t = performance.now() / 1000;
        const pulse = (Math.sin(t * 4) + 1) / 2; // softer pulse
        ctx.shadowColor = 'rgba(46, 204, 113, 0.7)';
        ctx.shadowBlur = 6 + 8 * pulse;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#2ecc71';
        roundRect(ctx, x, y, w, h, 8, false, true);
        ctx.shadowBlur = 0;
      } else if (kind.type === 'time') {
        // Cyan border/glow for time bonus
        const t = performance.now() / 1000;
        const pulse = (Math.sin(t * 4) + 1) / 2;
        ctx.shadowColor = 'rgba(0, 209, 255, 0.7)';
        ctx.shadowBlur = 6 + 8 * pulse;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00d1ff';
        roundRect(ctx, x, y, w, h, 8, false, true);
        ctx.shadowBlur = 0;
      }

      // Icon only (no text description)
      const label = blockLabel(kind);
      const emoji = emojiOverride || label.emoji;
      ctx.fillStyle = '#ffffff';
      // Choose font size proportional to block size for clear emoji rendering
      const fontSize = Math.floor(Math.min(w, h) * 0.5);
      ctx.font = `bold ${fontSize}px system-ui, apple color emoji, segoe ui emoji, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, cx, cy);
      ctx.restore();
    }

    function blockLabel(kind: BlockKind): { text: string; emoji: string } {
      if (kind.type === 'step') {
        const step = STEPS.find(s => s.id === kind.step)!;
        return { text: step.label, emoji: step.emoji };
      }
      if (kind.type === 'bad') return { text: kind.name === 'bug' ? i18n.t('game.bug') : i18n.t('game.infra'), emoji: kind.name === 'bug' ? '🐛' : '⚠️' };
      if (kind.type === 'heal') return { text: kind.name === 'fix-bug' ? i18n.t('game.fixBug') : i18n.t('game.fixInfra'), emoji: kind.name === 'fix-bug' ? '✅' : '🛠' };
      // time bonus
      return { text: i18n.t('game.time'), emoji: '⏳' };
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
        return endFail();
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

        const caught = intersectsCatchSurface(b);
        const missed = b.y - b.h / 2 > state.playH; // passed bottom

        if (caught) {
          handleCatch(b);
          continue;
        }
        if (missed) {
          // Dropped out: just remove the block. No penalties or state changes.
          state.blocks.splice(i, 1);
          continue;
        }
      }
      const moveSpeed = 400;
      if (keys.left) state.platform.targetX -= moveSpeed * dt;
      if (keys.right) state.platform.targetX += moveSpeed * dt;
      state.platform.targetX = clamp(state.platform.targetX, state.platform.w / 2, state.playW - state.platform.w / 2);

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
    gameEl.addEventListener('pointermove', onPointerMove as EventListener);
    gameEl.addEventListener('touchmove', onPointerMove as EventListener, { passive: true });

    const keydown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!state.running) startGame();
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        keys.left = true;
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        keys.right = true;
      }
    };

    const keyup = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'ArrowRight') keys.right = false;
    };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);

    function onDeviceOrientation(e: DeviceOrientationEvent) {
      if (e.gamma == null) return;
      const maxTilt = 30; // degrees
      const fraction = clamp(e.gamma, -maxTilt, maxTilt) / maxTilt;
      const half = state.playW / 2;
      state.platform.targetX = clamp(half + fraction * half, state.platform.w / 2, state.playW - state.platform.w / 2);
    }
    window.addEventListener('deviceorientation', onDeviceOrientation);

    playAgain.addEventListener('click', startGame);
    shareBtn.addEventListener('click', async () => {
      const goal = STEPS[state.goalIndex];
      const text = i18n.t('game.shareText', { score: state.score, goal: goal.label, emoji: goal.emoji });
      try {
        await navigator.clipboard.writeText(text);
        showToast(i18n.t('game.copied'));
      } catch {
        showToast(text);
      }
    });

    // Start immediately
    startGame();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      gameEl.removeEventListener('pointermove', onPointerMove as EventListener);
      gameEl.removeEventListener('touchmove', onPointerMove as EventListener);
    };
  }, []);

  return (
    <div className="wrap">
      <main className="panel game" id="game" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hud" style={{ height: '56px', display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 8px 0' }}>
          <div className="chip">⏱️ <span id="hudTime">120s</span></div>
          <div className="chip">➡️ <strong id="hudNext">{i18n.t('game.goal')}: Get requirements 📝</strong></div>
        </div>
        <div className="toast" id="toast">{i18n.t('game.nice')}</div>
        <div className="finish" id="finish">
          <div className="card">
            <h2 id="endTitle">{i18n.t('game.endTitle')}</h2>
            <div>
              {i18n.t('game.finalScore')}: <strong id="finalScore">0</strong>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="primary" id="playAgain">{i18n.t('game.playAgain')}</button>
              <button className="secondary" id="shareBtn">{i18n.t('game.copyResult')}</button>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: '12px', right: '12px', top: '44px', zIndex: 2 }}>
          <div className="timerbar">
            <div className="fill" id="timeFill" />
          </div>
        </div>
      </main>
      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        score={finalScoreNum}
        onSubmitScore={() => { setSuccessOpen(false); navigate('/leaders'); }}
        onPlayAgain={() => { setSuccessOpen(false); navigate('/rules'); }}
      />
      <UnsuccessModal
        isOpen={failOpen}
        onClose={() => setFailOpen(false)}
        onPlayAgain={() => { setFailOpen(false); navigate('/rules'); }}
      />
    </div>
  );
}


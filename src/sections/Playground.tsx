import { useEffect, useRef, useState, useCallback } from 'react';
import { createReveal } from '../utils/animations';
import {
  Zap,
  Grid3X3,
  Lightbulb,
  Trophy,
  RotateCcw,
  Heart,
  Star,
  Target,
  Volume2,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────
   Demo 1 — Reaction Blitz
   Click the targets as fast as they appear. Addictive speed game.
   ──────────────────────────────────────────────────────────── */

function ReactionBlitz() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; size: number; hit: boolean }[]>([]);
  const [combo, setCombo] = useState(0);
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
  }, []);

  const startGame = useCallback(() => {
    cleanup();
    setScore(0);
    setCombo(0);
    setTimeLeft(15);
    setTargets([]);
    setPops([]);
    setPhase('playing');

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          cleanup();
          setHighScore(prev => Math.max(prev, scoreRef.current));
          setPhase('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawn = () => {
      const id = nextId.current++;
      const size = 36 + Math.random() * 20;
      setTargets(prev => {
        const alive = prev.filter(t => !t.hit);
        // max 4 targets at once
        if (alive.length >= 4) return prev;
        return [...prev, {
          id,
          x: 8 + Math.random() * 72,
          y: 8 + Math.random() * 72,
          size,
          hit: false,
        }];
      });
      // remove unhit targets after 2s
      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== id || t.hit));
      }, 2000);
    };

    spawn();
    spawnRef.current = setInterval(spawn, 650);
  }, [cleanup]);

  // Keep scoreRef in sync for timer callback
  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => cleanup, [cleanup]);

  const hitTarget = (id: number, x: number, y: number) => {
    // Reset combo timer — combo breaks if no hit within 800ms
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setCombo(0), 800);

    setCombo(c => c + 1);
    const points = combo >= 4 ? 3 : combo >= 2 ? 2 : 1;
    setScore(s => s + points);

    setTargets(prev => prev.map(t => t.id === id ? { ...t, hit: true } : t));
    setPops(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id));
      setPops(prev => prev.filter(p => p.id !== id));
    }, 300);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="badge-mono flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> {score}
          </span>
          {combo >= 3 && (
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white"
              style={{ animation: 'popIn 0.3s var(--ease-brutal)' }}
            >
              {combo}x COMBO!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {phase === 'playing' && (
            <span className={`font-mono text-sm font-bold ${timeLeft <= 5 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
              {timeLeft}s
            </span>
          )}
          {highScore > 0 && (
            <span className="badge-mono flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> {highScore}
            </span>
          )}
        </div>
      </div>

      {/* Game field */}
      <div
        ref={fieldRef}
        className="relative w-full rounded-[var(--radius-lg)] border-[length:var(--border-width-base)] border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden select-none"
        style={{ aspectRatio: '1', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {/* Grid dots background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(var(--color-text) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center" style={{ boxShadow: 'var(--shadow-solid-md)' }}>
              <Zap className="w-7 h-7 text-white" />
            </div>
            <p className="font-display font-bold text-[var(--color-text)] text-base">Click targets as fast as you can</p>
            <button onClick={startGame} className="btn-primary !px-6 !py-2.5 text-sm">
              Start Game
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-[var(--color-surface)]/95">
            <div className="text-center">
              <p className="font-mono text-sm text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Final Score</p>
              <p className="text-5xl font-display font-black text-[var(--color-primary)]">{score}</p>
              {score >= highScore && score > 0 && (
                <p className="font-mono text-xs text-[var(--color-secondary)] font-bold mt-2 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5" /> NEW HIGH SCORE!
                </p>
              )}
            </div>
            <button onClick={startGame} className="btn-primary !px-6 !py-2.5 text-sm gap-2">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}

        {/* Targets */}
        {targets.map(t => !t.hit && (
          <button
            key={t.id}
            onClick={() => hitTarget(t.id, t.x, t.y)}
            className="absolute rounded-full cursor-pointer border-[length:var(--border-width-base)] border-[var(--color-border)] hover:scale-110 active:scale-90"
            style={{
              width: t.size,
              height: t.size,
              left: `${t.x}%`,
              top: `${t.y}%`,
              backgroundColor: 'var(--color-primary)',
              boxShadow: 'var(--shadow-solid-sm)',
              animation: 'targetPop 0.25s var(--ease-brutal)',
              transition: 'transform 0.1s',
            }}
          >
            <span className="absolute inset-0 rounded-full bg-white/20" />
          </button>
        ))}

        {/* Hit pops */}
        {pops.map(p => (
          <div
            key={`pop-${p.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: 'hitBurst 0.3s var(--ease-brutal) forwards',
            }}
          >
            <span className="block w-3 h-3 rounded-full bg-[var(--color-secondary)]" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes targetPop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes hitBurst {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Demo 2 — Memory Match
   Classic card-flip memory game with SLP icons.
   ──────────────────────────────────────────────────────────── */

const CARD_ICONS = [
  { emoji: '🧠', label: 'Brain' },
  { emoji: '👂', label: 'Ear' },
  { emoji: '🗣️', label: 'Speech' },
  { emoji: '📖', label: 'Reading' },
  { emoji: '✍️', label: 'Writing' },
  { emoji: '💬', label: 'Language' },
  { emoji: '🎯', label: 'Target' },
  { emoji: '🔬', label: 'Research' },
];

interface MemoryCard {
  id: number;
  pairId: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function MemoryMatch() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won'>('idle');
  const [bestMoves, setBestMoves] = useState(0);
  const lockRef = useRef(false);

  const initGame = useCallback(() => {
    const pairs = CARD_ICONS.slice(0, 6);
    const deck: MemoryCard[] = [];
    pairs.forEach((icon, i) => {
      deck.push({ id: i * 2, pairId: i, emoji: icon.emoji, flipped: false, matched: false });
      deck.push({ id: i * 2 + 1, pairId: i, emoji: icon.emoji, flipped: false, matched: false });
    });
    // shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i]!;
      deck[i] = deck[j]!;
      deck[j] = temp;
    }
    setCards(deck);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setPhase('playing');
    lockRef.current = false;
  }, []);

  const flipCard = (id: number) => {
    if (lockRef.current) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      lockRef.current = true;
      setMoves(m => m + 1);

      const first = cards.find(c => c.id === newFlipped[0]);
      const second = cards.find(c => c.id === newFlipped[1]);

      if (first && second && first.pairId === second.pairId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === first.pairId ? { ...c, matched: true } : c
          ));
          setMatches(m => {
            const newM = m + 1;
            if (newM === 6) {
              setPhase('won');
              setBestMoves(prev => prev === 0 ? moves + 1 : Math.min(prev, moves + 1));
            }
            return newM;
          });
          setFlippedIds([]);
          lockRef.current = false;
        }, 500);
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  const starRating = phase === 'won' ? (moves <= 8 ? 3 : moves <= 12 ? 2 : 1) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="badge-mono flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" /> {matches}/6
          </span>
          <span className="font-mono text-sm text-[var(--color-text-muted)]">{moves} moves</span>
        </div>
        {bestMoves > 0 && (
          <span className="badge-mono flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> {bestMoves}
          </span>
        )}
      </div>

      {phase === 'idle' ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="w-14 h-14 rounded-full bg-[var(--color-secondary)] flex items-center justify-center" style={{ boxShadow: 'var(--shadow-solid-md)' }}>
            <Grid3X3 className="w-7 h-7 text-white" />
          </div>
          <p className="font-display font-bold text-[var(--color-text)] text-base">Find all matching pairs</p>
          <button onClick={initGame} className="btn-primary !px-6 !py-2.5 text-sm">
            Start Game
          </button>
        </div>
      ) : phase === 'won' ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3].map(s => (
              <Star
                key={s}
                className="w-7 h-7 transition-all"
                style={{
                  color: s <= starRating ? 'var(--color-primary)' : 'var(--color-text)',
                  opacity: s <= starRating ? 1 : 0.15,
                  fill: s <= starRating ? 'var(--color-primary)' : 'none',
                  animation: s <= starRating ? `popIn 0.3s ${s * 0.15}s var(--ease-brutal) both` : undefined,
                }}
              />
            ))}
          </div>
          <p className="font-display font-bold text-lg text-[var(--color-text)]">
            Completed in {moves} moves!
          </p>
          <button onClick={initGame} className="btn-primary !px-6 !py-2.5 text-sm gap-2">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => flipCard(card.id)}
              className="relative aspect-square rounded-[var(--radius-md)] border-[length:var(--border-width-base)] border-[var(--color-border)] cursor-pointer select-none overflow-hidden"
              style={{
                perspective: '600px',
                boxShadow: card.matched ? 'none' : 'var(--shadow-solid-sm)',
                opacity: card.matched ? 0.4 : 1,
                transition: 'opacity 0.4s, box-shadow 0.3s',
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <span className="text-2xl">{card.emoji}</span>
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: card.flipped || card.matched ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                  backfaceVisibility: 'hidden',
                  backgroundColor: 'var(--color-text)',
                }}
              >
                <span className="text-lg font-display font-bold text-[var(--color-primary)]">?</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Demo 3 — Simon Says (Color Pattern)
   Repeat the growing sequence. Classic addictive gameplay.
   ──────────────────────────────────────────────────────────── */

const SIMON_COLORS = [
  { bg: '#d05e41', glow: '#d05e41', label: 'Red' },     // terracotta
  { bg: '#8fa596', glow: '#8fa596', label: 'Green' },    // sage
  { bg: '#2d2a26', glow: '#6b665c', label: 'Dark' },     // near black
  { bg: '#d4a853', glow: '#d4a853', label: 'Gold' },     // warm gold
];

function SimonSays() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'fail'>('idle');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [flashPlayer, setFlashPlayer] = useState<number | null>(null);
  const showingRef = useRef(false);

  const playSequence = useCallback((seq: number[]) => {
    showingRef.current = true;
    setPhase('showing');
    let i = 0;
    const show = () => {
      if (i >= seq.length) {
        setActiveIdx(null);
        showingRef.current = false;
        setPhase('input');
        return;
      }
      setActiveIdx(seq[i]!);
      setTimeout(() => {
        setActiveIdx(null);
        i++;
        setTimeout(show, 200);
      }, 400);
    };
    setTimeout(show, 500);
  }, []);

  const startGame = useCallback(() => {
    const first = Math.floor(Math.random() * 4);
    const seq = [first];
    setSequence(seq);
    setPlayerInput([]);
    setScore(0);
    playSequence(seq);
  }, [playSequence]);

  const nextRound = useCallback(() => {
    const next = Math.floor(Math.random() * 4);
    setSequence(prev => {
      const newSeq = [...prev, next];
      setPlayerInput([]);
      playSequence(newSeq);
      return newSeq;
    });
  }, [playSequence]);

  const handlePress = (idx: number) => {
    if (phase !== 'input' || showingRef.current) return;

    setFlashPlayer(idx);
    setTimeout(() => setFlashPlayer(null), 200);

    const newInput = [...playerInput, idx];
    setPlayerInput(newInput);

    const stepIdx = newInput.length - 1;
    if (sequence[stepIdx] !== idx) {
      // Wrong!
      setPhase('fail');
      setHighScore(prev => Math.max(prev, score));
      return;
    }

    if (newInput.length === sequence.length) {
      // Correct full sequence!
      setScore(s => s + 1);
      setTimeout(nextRound, 600);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="badge-mono flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" /> Round {score + 1}
          </span>
          {phase === 'showing' && (
            <span className="font-mono text-xs text-[var(--color-primary)] font-bold animate-pulse">WATCH...</span>
          )}
          {phase === 'input' && (
            <span className="font-mono text-xs text-[var(--color-secondary)] font-bold">YOUR TURN</span>
          )}
        </div>
        {highScore > 0 && (
          <span className="badge-mono flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> {highScore}
          </span>
        )}
      </div>

      {phase === 'idle' ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="w-14 h-14 rounded-full bg-[var(--color-text)] flex items-center justify-center" style={{ boxShadow: 'var(--shadow-solid-md)' }}>
            <Volume2 className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <p className="font-display font-bold text-[var(--color-text)] text-base">Repeat the color pattern</p>
          <button onClick={startGame} className="btn-primary !px-6 !py-2.5 text-sm">
            Start Game
          </button>
        </div>
      ) : phase === 'fail' ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <p className="font-mono text-sm text-[var(--color-text-muted)] uppercase tracking-widest">Game Over</p>
          <p className="text-4xl font-display font-black text-[var(--color-primary)]">
            {score} {score === 1 ? 'round' : 'rounds'}
          </p>
          {score >= highScore && score > 0 && (
            <p className="font-mono text-xs text-[var(--color-secondary)] font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5" /> NEW HIGH SCORE!
            </p>
          )}
          <button onClick={startGame} className="btn-primary !px-6 !py-2.5 text-sm gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Simon board */}
          <div className="grid grid-cols-2 gap-3">
            {SIMON_COLORS.map((color, idx) => {
              const isLit = activeIdx === idx || flashPlayer === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handlePress(idx)}
                  className="relative aspect-square rounded-[var(--radius-lg)] border-[length:var(--border-width-base)] border-[var(--color-border)] cursor-pointer select-none overflow-hidden"
                  style={{
                    backgroundColor: color.bg,
                    opacity: isLit ? 1 : 0.55,
                    transform: isLit ? 'scale(0.95)' : 'scale(1)',
                    boxShadow: isLit
                      ? `0 0 20px ${color.glow}80, 0 0 40px ${color.glow}40, var(--shadow-solid-sm)`
                      : 'var(--shadow-solid-sm)',
                    transition: 'all 0.15s ease-out',
                  }}
                  disabled={phase !== 'input'}
                >
                  {isLit && (
                    <div className="absolute inset-0 bg-white/30 rounded-[var(--radius-lg)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5">
            {sequence.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full border border-[var(--color-border)]"
                style={{
                  backgroundColor: i < playerInput.length
                    ? 'var(--color-secondary)'
                    : 'var(--color-bg)',
                  transition: 'background-color 0.2s',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main section
   ──────────────────────────────────────────────────────────── */

export default function Playground() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) createReveal(headerRef.current, 'up', 0.1);

    if (gridRef.current) {
      const cards = gridRef.current.children;
      Array.from(cards).forEach((card, index) => {
        createReveal(card, 'up', 0.2 + index * 0.15);
      });
    }
  }, []);

  const demos: {
    title: string;
    description: string;
    proof: string;
    icon: React.ReactNode;
    component: React.ReactNode;
  }[] = [
    {
      title: 'Reaction Blitz',
      description: 'Tap the targets before they vanish. Build combos for bonus points. How fast are you?',
      proof: 'Shows tight feedback loops, large tap targets, and game feel that can translate into home practice and patient engagement tools.',
      icon: <Zap className="w-5 h-5" />,
      component: <ReactionBlitz />,
    },
    {
      title: 'Memory Match',
      description: 'Flip cards to find matching pairs. Fewer moves = more stars. Can you get a perfect 3?',
      proof: 'Shows how repetition, streak logic, and low-friction scoring can support learning modules or clinician training experiences.',
      icon: <Grid3X3 className="w-5 h-5" />,
      component: <MemoryMatch />,
    },
    {
      title: 'Simon Says',
      description: 'Watch the pattern, then repeat it. Each round adds one more. How far can you go?',
      proof: 'Shows audiovisual pacing, progressive difficulty, and error recovery patterns that work well in guided digital exercises.',
      icon: <Lightbulb className="w-5 h-5" />,
      component: <SimonSays />,
    },
  ];

  return (
    <section id="playground" className="section-padding bg-[var(--color-surface)]">
      <div className="container-wide">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-[2px] bg-[var(--color-primary)]" />
            <span className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)]">Interactive Demos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text)] tracking-tight mb-6">
            TRY IT YOURSELF
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] font-body leading-relaxed">
            These are lightweight interaction studies that show the feedback, pacing, and motivation patterns I use when building patient-facing or learning-focused products.
          </p>
        </div>

        {/* Demo grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {demos.map((demo) => (
            <div key={demo.title} className="card-solid p-6 sm:p-8 flex flex-col">
              {/* Card header */}
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] border-[length:var(--border-width-base)] border-[var(--color-border)] bg-[var(--color-primary)] text-white">
                  {demo.icon}
                </span>
                <h3 className="text-lg font-display font-bold text-[var(--color-text)]">
                  {demo.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] font-body mb-6">
                {demo.description}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] font-body border-l-2 border-[var(--color-secondary)]/40 pl-3 mb-6">
                {demo.proof}
              </p>

              {/* Demo body */}
              <div className="flex-1">{demo.component}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

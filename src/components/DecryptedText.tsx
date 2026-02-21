import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

const styles: { wrapper: React.CSSProperties; srOnly: React.CSSProperties } = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0,
  },
};

type RevealDirection = 'start' | 'end' | 'center';

interface DecryptedTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: RevealDirection;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'hover' | 'view' | 'both';
  /** Repeat the decrypt animation every N ms (e.g. 6000 = every 6s). Ignores hover/view when set. */
  repeatInterval?: number;
  /** When using repeatInterval: keep the fully revealed text visible for N ms before showing scrambled again (e.g. 9000 = 9s). */
  stayRevealedMs?: number;
  /** When using repeatInterval + stayRevealedMs: show scrambled text for N ms before starting the next reveal (e.g. 800 = 0.8s). */
  scrambleDisplayMs?: number;
}

function getNextIndex(
  revealedSet: Set<number>,
  textLength: number,
  revealDirection: RevealDirection
): number {
  switch (revealDirection) {
    case 'start':
      return revealedSet.size;
    case 'end':
      return textLength - 1 - revealedSet.size;
    case 'center': {
      const middle = Math.floor(textLength / 2);
      const offset = Math.floor(revealedSet.size / 2);
      const nextIndex =
        revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

      if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
        return nextIndex;
      }
      for (let i = 0; i < textLength; i++) {
        if (!revealedSet.has(i)) return i;
      }
      return 0;
    }
    default:
      return revealedSet.size;
  }
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+[]{}',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  repeatInterval,
  stayRevealedMs = 0,
  scrambleDisplayMs = 600,
  ..._rest
}: DecryptedTextProps) {
  void _rest;
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  /** When repeatInterval is set: true during the wait between two decrypt cycles */
  const [showScrambledBetweenCycles, setShowScrambledBetweenCycles] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stayRevealedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrambleDisplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationCompleteRef = useRef(false);
  const shuffleTextRef = useRef<(orig: string, revealed: Set<number>) => string>(() => text);

  const availableChars = useMemo(
    () =>
      useOriginalCharsOnly
        ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
        : characters.split(''),
    [useOriginalCharsOnly, text, characters]
  );

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>): string => {
      if (useOriginalCharsOnly) {
        const positions = originalText.split('').map((char, i) => ({
          char,
          isSpace: char === ' ',
          index: i,
          isRevealed: currentRevealed.has(i),
        }));

        const nonSpaceChars = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map((p) => {
            if (p.isSpace) return ' ';
            if (p.isRevealed) return originalText[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join('');
      }
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [useOriginalCharsOnly, availableChars]
  );

  shuffleTextRef.current = shuffleText;

  // Main scramble / reveal effect
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let currentIteration = 0;

    if (isHovering) {
      setIsScrambling(true);
      animationCompleteRef.current = false;

      intervalId = setInterval(() => {
        setRevealedIndices((prevRevealed) => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(
                prevRevealed,
                text.length,
                revealDirection
              );
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(intervalId);
              setIsScrambling(false);
              animationCompleteRef.current = true;
              return prevRevealed;
            }
          } else {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(intervalId);
              setIsScrambling(false);
              setDisplayText(text);
              animationCompleteRef.current = true;
            }
            return prevRevealed;
          }
        });
      }, speed);
    } else {
      if (repeatInterval != null && showScrambledBetweenCycles) {
        setDisplayText(shuffleText(text, new Set()));
      } else {
        setDisplayText(text);
      }
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => {
      if (intervalId != null) clearInterval(intervalId);
    };
  }, [
    isHovering,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    shuffleText,
    repeatInterval,
    showScrambledBetweenCycles,
  ]);

  // Repeat interval: trigger decrypt every N ms (deps stabilisés pour ne pas annuler le premier cycle)
  useEffect(() => {
    if (repeatInterval == null || repeatInterval <= 0) return;

    const startReveal = () => {
      setShowScrambledBetweenCycles(false);
      setRevealedIndices(new Set());
      setDisplayText(shuffleTextRef.current(text, new Set()));
      setIsHovering(true);
    };

    const scheduleNext = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(startReveal, repeatInterval);
    };

    // Afficher le texte brouillé puis lancer le déchiffrement (phase "régénération" visible)
    const showScrambledThenReveal = () => {
      setShowScrambledBetweenCycles(true);
      setIsHovering(false);
      setRevealedIndices(new Set());
      setDisplayText(shuffleTextRef.current(text, new Set()));
      scrambleDisplayTimeoutRef.current = setTimeout(startReveal, scrambleDisplayMs);
    };

    // Premier cycle après un court délai
    const t0 = setTimeout(showScrambledThenReveal, 300);

    const goToScrambledAndScheduleNext = () => {
      setShowScrambledBetweenCycles(true);
      setIsHovering(false);
      setRevealedIndices(new Set());
      setDisplayText(shuffleTextRef.current(text, new Set()));
      scheduleNext();
    };

    // Fin d'animation : garder le texte lisible N ms puis phase brouillé puis relancer le déchiffrement
    const checkComplete = setInterval(() => {
      if (animationCompleteRef.current) {
        animationCompleteRef.current = false;
        const delay = stayRevealedMs > 0 ? stayRevealedMs : 0;
        if (delay > 0) {
          stayRevealedTimeoutRef.current = setTimeout(showScrambledThenReveal, delay);
        } else {
          goToScrambledAndScheduleNext();
        }
      }
    }, 80);

    return () => {
      clearTimeout(t0);
      clearInterval(checkComplete);
      if (stayRevealedTimeoutRef.current) {
        clearTimeout(stayRevealedTimeoutRef.current);
        stayRevealedTimeoutRef.current = null;
      }
      if (scrambleDisplayTimeoutRef.current) {
        clearTimeout(scrambleDisplayTimeoutRef.current);
        scrambleDisplayTimeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [repeatInterval, text, stayRevealedMs, scrambleDisplayMs]);

  // View observer for animateOn="view"
  useEffect(() => {
    if (repeatInterval != null || (animateOn !== 'view' && animateOn !== 'both')) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [animateOn, hasAnimated, repeatInterval]);

  const hoverProps =
    repeatInterval == null && (animateOn === 'hover' || animateOn === 'both')
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        }
      : {};

  return (
    <motion.span
      className={parentClassName}
      ref={containerRef}
      style={styles.wrapper}
      {...hoverProps}
    >
      <span style={styles.srOnly} aria-hidden>
        {text}
      </span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone =
            revealedIndices.has(index) || !isScrambling || !isHovering;

          return (
            <span
              key={index}
              className={isRevealedOrDone ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

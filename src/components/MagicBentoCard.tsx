import { useRef, useState, useEffect, type FC } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './MagicBentoCard.css';

interface MagicBentoCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  particleCount?: number;
  spotlightRadius?: number;
}

const DEFAULT_GLOW_COLOR = '0, 255, 65'; // Vert Matrix

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'magic-particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const MagicBentoCard: FC<MagicBentoCardProps> = ({
  children,
  className = '',
  glowColor = DEFAULT_GLOW_COLOR,
  enableStars = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = true,
  clickEffect = true,
  particleCount = 8,
  spotlightRadius = 300,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowIntensity = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });
  const smoothX = useSpring(x, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 });
  const smoothGlowX = useSpring(glowX, { stiffness: 200, damping: 25 });
  const smoothGlowY = useSpring(glowY, { stiffness: 200, damping: 25 });
  const smoothGlowIntensity = useSpring(glowIntensity, { stiffness: 200, damping: 25 });

  useTransform(smoothGlowX, (v) => `${v}%`);
  useTransform(smoothGlowY, (v) => `${v}%`);
  useTransform(smoothGlowIntensity, (intensity) => `${spotlightRadius * intensity}px`);

  // Mettre à jour les CSS variables
  useEffect(() => {
    if (!cardRef.current) return;

    const unsubscribeX = smoothGlowX.on('change', (latest) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--glow-x', `${latest}%`);
      }
    });
    const unsubscribeY = smoothGlowY.on('change', (latest) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--glow-y', `${latest}%`);
      }
    });
    const unsubscribeIntensity = smoothGlowIntensity.on('change', (latest) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--glow-intensity', latest.toString());
        cardRef.current.style.setProperty('--glow-radius', `${spotlightRadius * latest}px`);
      }
    });

    if (cardRef.current) {
      cardRef.current.style.setProperty('--glow-color', glowColor);
    }

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeIntensity();
    };
  }, [smoothGlowX, smoothGlowY, smoothGlowIntensity, spotlightRadius, glowColor]);

  useEffect(() => {
    if (!enableStars || !isHovered || !cardRef.current) return;

    const card = cardRef.current;
    const { width, height } = card.getBoundingClientRect();

    const particles: HTMLElement[] = [];
    for (let i = 0; i < particleCount; i++) {
      const particle = createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      );
      const particleX = (Math.random() - 0.5) * 60;
      const particleY = (Math.random() - 0.5) * 60;
      particle.style.setProperty('--particle-x', `${particleX}px`);
      particle.style.setProperty('--particle-y', `${particleY}px`);
      card.appendChild(particle);
      particles.push(particle);

      // Animation des particules
      particle.style.animation = `particle-float ${2 + Math.random() * 2}s ease-in-out infinite`;
      particle.style.animationDelay = `${i * 0.1}s`;
    }

    particlesRef.current = particles;

    return () => {
      particles.forEach((p) => p.remove());
      particlesRef.current = [];
    };
  }, [isHovered, enableStars, particleCount, glowColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Glow position
    const relativeX = (mouseX / rect.width) * 100;
    const relativeY = (mouseY / rect.height) * 100;
    glowX.set(relativeX);
    glowY.set(relativeY);

    // Calculate distance from center for glow intensity
    const distance = Math.hypot(mouseX - centerX, mouseY - centerY);
    const maxDistance = Math.hypot(centerX, centerY);
    const intensity = Math.max(0, 1 - distance / (maxDistance * 0.8));
    glowIntensity.set(intensity);

    // Tilt effect
    if (enableTilt) {
      rotateX.set(((mouseY - centerY) / centerY) * -10);
      rotateY.set(((mouseX - centerX) / centerX) * 10);
    }

    // Magnetism effect
    if (enableMagnetism) {
      x.set((mouseX - centerX) * 0.05);
      y.set((mouseY - centerY) * 0.05);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
    glowIntensity.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickEffect || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(clickX, clickY),
      Math.hypot(clickX - rect.width, clickY),
      Math.hypot(clickX, clickY - rect.height),
      Math.hypot(clickX - rect.width, clickY - rect.height)
    );

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${maxDistance * 2}px;
      height: ${maxDistance * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
      left: ${clickX - maxDistance}px;
      top: ${clickY - maxDistance}px;
      pointer-events: none;
      z-index: 1000;
    `;

    cardRef.current.appendChild(ripple);

    const animation = ripple.animate(
      [
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1)', opacity: 0 },
      ],
      {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    );

    animation.onfinish = () => ripple.remove();
  };

  return (
    <motion.div
      ref={cardRef}
      className={`magic-bento-card ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{
        rotateX: enableTilt ? smoothRotateX : 0,
        rotateY: enableTilt ? smoothRotateY : 0,
        x: enableMagnetism ? smoothX : 0,
        y: enableMagnetism ? smoothY : 0,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
};

export default MagicBentoCard;

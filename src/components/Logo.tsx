import type { FC } from 'react';
import ShinyText from './ShinyText';

interface LogoProps {
  /** Taille du logo (taille de police). */
  size?: number;
  className?: string;
}

/**
 * Logo WE-HILL avec effet ShinyText.
 * Texte élargi horizontalement avec effet de brillance animé.
 */
const Logo: FC<LogoProps> = ({ size = 64, className = '' }) => {
  return (
    <h1
      className={`font-bold uppercase tracking-[0.3em] ${className}`}
      style={{
        fontSize: `${size}px`,
        letterSpacing: '0.3em',
        fontStretch: 'expanded',
      }}
    >
      <ShinyText
        text="We Hill"
        speed={3.2}
        delay={0}
        color="#b5b5b5"
        shineColor="#ffffff"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
      />
    </h1>
  );
};

export default Logo;

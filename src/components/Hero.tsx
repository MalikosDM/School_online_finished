import { motion } from 'framer-motion';
import DecryptedText from './DecryptedText';

const Hero: React.FC = () => {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center relative px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="z-10 w-full max-w-5xl"
            >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-matrix-dim">
                    LA FORMATION QUI CHANGE LES RÈGLES.<br />
                    <span className="text-matrix-green/90 animate-pulse">RÉSERVÉE À CEUX QUI AGISSENT.</span>
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-sm md:text-base text-matrix-text/70 max-w-lg mx-auto leading-relaxed tracking-widest uppercase"
                >
                    <DecryptedText
                        text="[ Système en cours de déploiement — Accès sur invitation ]"
                        speed={45}
                        maxIterations={12}
                        sequential
                        revealDirection="start"
                        repeatInterval={6000}
                        stayRevealedMs={9000}
                        className="text-matrix-text/70"
                        encryptedClassName="text-matrix-green/60"
                    />
                </motion.p>
            </motion.div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-matrix-green">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;

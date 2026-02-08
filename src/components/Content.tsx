import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, Brain } from 'lucide-react';
import MagicBentoCard from './MagicBentoCard';
import './MagicBentoCard.css';

const Content: React.FC = () => {
    const features = [
        {
            icon: <Terminal className="w-6 h-6 text-matrix-green" />,
            title: "Automatisation",
            text: "Sortez de la boucle. Automatisez ce qui peut l’être et reprenez le contrôle de votre temps."
        },
        {
            icon: <Zap className="w-6 h-6 text-matrix-green" />,
            title: "IA & Systèmes",
            text: "Apprenez à piloter l’intelligence artificielle et à faire scaler vos projets sans plafond."
        },
        {
            icon: <Shield className="w-6 h-6 text-matrix-green" />,
            title: "Terrain, pas théorie",
            text: "Des méthodes éprouvées, des cas concrets et des résultats mesurables."
        },
        {
            icon: <Brain className="w-6 h-6 text-matrix-green" />,
            title: "Les bases de l'IA",
            text: "Comprendre avec des schémas comment fonctionne une IA et ce qui se cache derrière ce terme."
        }
    ];

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-transparent to-matrix-darkGreen/20">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-stretch">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                        className="h-full"
                    >
                        <MagicBentoCard
                            enableStars
                            enableBorderGlow
                            enableMagnetism
                            clickEffect
                            glowColor="0, 255, 65"
                            particleCount={8}
                            spotlightRadius={300}
                            className="flex flex-col items-center text-center space-y-4 p-6 border border-matrix-dim/20 bg-matrix-black/50 backdrop-blur-sm rounded h-full"
                        >
                            <div className="p-3 bg-matrix-darkGreen/50 rounded-full transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold font-mono tracking-wider text-white">
                                {feature.title}
                            </h3>
                            <p className="text-matrix-text/60 text-sm leading-relaxed flex-grow">
                                {feature.text}
                            </p>
                        </MagicBentoCard>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 1 }}
                className="mt-24 text-center max-w-2xl mx-auto"
            >
                <p className="text-lg md:text-xl text-matrix-text font-light italic border-l-2 border-matrix-green pl-6 py-2 text-left bg-gradient-to-r from-matrix-green/5 to-transparent">
                    "Elle n’est pas faite pour tout le monde. Seulement pour ceux qui sont prêts à comprendre comment le système fonctionne — et à l’utiliser en leur faveur."
                </p>
            </motion.div>
        </section>
    );
};

export default Content;

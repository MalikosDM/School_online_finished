import { motion, useScroll, useTransform } from 'framer-motion';
import MatrixBackground from './components/Background';
import Logo from './components/Logo';
import Hero from './components/Hero';
import Content from './components/Content';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="relative min-h-screen font-sans text-matrix-text selection:bg-matrix-green selection:text-black">
      <MatrixBackground />

      {/* Logo We Hill en haut, centré */}
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-6 pointer-events-none">
        <Logo size={48} />
      </header>

      <main className="relative z-10">
        <motion.div style={{ opacity, scale }} className="sticky top-0 w-full">
          {/* Wrapper to allow sticky hero effect if desired, or just normal flow */}
        </motion.div>

        <div className="relative">
          <Hero />
        </div>

        <div className="bg-matrix-black/80 backdrop-blur-sm border-t border-matrix-green/10">
          <Content />
          <Newsletter />
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;

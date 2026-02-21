import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

const WEBHOOK_URL = 'https://n8n.srv1271485.hstgr.cloud/webhook/get-email';

const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (!res.ok) throw new Error('Erreur lors de l’envoi');
            setSubmitted(true);
        } catch {
            setError('Un problème est survenu. Réessayez dans un instant.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 px-4 text-center">
            <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 font-mono tracking-widest uppercase">
                    Soyez prévenu en premier
                </h2>
                <p className="text-matrix-text/60 text-sm mb-6 max-w-md mx-auto">
                    Ouverture des places limitées. Un email, zéro spam : vous serez alerté au lancement.
                </p>

                {submitted ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center space-y-4 text-matrix-green bg-matrix-darkGreen/30 p-8 rounded border border-matrix-green/30"
                    >
                        <Check className="w-12 h-12" />
                        <p className="font-mono text-lg">C’est enregistré. Vous serez prévenu en priorité au lancement.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="flex-1 bg-transparent border-b-2 border-matrix-text/30 focus:border-matrix-green outline-none py-3 px-2 font-mono text-lg transition-colors placeholder-matrix-text/30 disabled:opacity-60"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="group bg-matrix-green/10 hover:bg-matrix-green/20 text-matrix-green border border-matrix-green/50 hover:border-matrix-green px-8 py-3 rounded uppercase font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Envoi…' : 'Réserver ma place'}
                            {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}
                {!submitted && error && (
                    <p className="mt-4 text-red-400 text-sm font-mono" role="alert">
                        {error}
                    </p>
                )}

                <p className="mt-8 text-xs text-matrix-text/40 font-mono">
                    Un seul envoi au lancement. Pas de newsletter hebdo, pas de spam.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;

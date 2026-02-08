import type { FC } from 'react';

const Footer: FC = () => {
    return (
        <footer className="py-8 text-center text-matrix-text/20 text-xs font-mono uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} WE-HILL</p>
            <p className="mt-1 opacity-70">Formation exclusive — Déploiement en cours</p>
        </footer>
    );
};

export default Footer;

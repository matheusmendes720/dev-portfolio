import { useEffect, useState, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useTextScramble from '../hooks/useTextScramble';

const Hero = () => {
    const { t } = useTranslation();
    const phrases = useMemo(() => t('hero.phrases', { returnObjects: true }) || ['Agentic Systems Architecture', 'Production AI Engineer', 'Data Pipeline Architect'], [t]);
    const { text, scramble } = useTextScramble();
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const next = () => {
            scramble(phrases[counter]).then(() => {
                if (!isMounted) return;
                setTimeout(() => {
                    if (isMounted) {
                        setCounter((prev) => (prev + 1) % phrases.length);
                    }
                }, 3000);
            });
        };
        next();
        return () => { isMounted = false; };
    }, [counter, scramble, phrases]);

    // Pulsing neon line effect
    useEffect(() => {
        const neonLine = document.getElementById('neon-line');
        let time = 0;
        let animationId;

        const animatePulse = () => {
            time += 0.005;
            const pulse = (Math.sin(time * 2) + 1) / 2;
            const width = 10 + (pulse * 90);
            if (neonLine) {
                neonLine.style.width = `${width}%`;
            }
            animationId = requestAnimationFrame(animatePulse);
        };

        animatePulse();
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <header>
            <div className="hero-meta">{t('hero.clearance')}</div>
            <div className="hero-content-wrapper">
                <h1 id="hero-headline" dangerouslySetInnerHTML={{ __html: text || phrases[0] }}></h1>
                <div className="neon-accent-line" id="neon-line"></div>
                <div className="hero-sub">
                    <Trans
                        i18nKey="hero.sub"
                        components={{ 1: <span style={{ color: 'var(--accent-primary)' }} /> }}
                    />
                </div>
            </div>

            <div className="hero-meta scroll-meta">
                <span className="scroll-line"></span>
                {t('hero.scroll')}
            </div>

            <style jsx>{`
                header {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding-top: 4rem;
                }

                .hero-meta {
                    font-family: var(--font-mono);
                    color: var(--accent-secondary);
                    margin-bottom: 1rem;
                    font-size: 0.8rem;
                    letter-spacing: 2px;
                    opacity: 0.8;
                    text-transform: uppercase;
                }

                .scroll-meta {
                    position: absolute;
                    bottom: 3rem;
                    right: 0;
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }

                .scroll-line {
                    width: 40px;
                    height: 1px;
                    background: var(--accent-primary);
                }

                h1 {
                    font-family: var(--font-display);
                    font-size: clamp(3.5rem, 10vw, 9rem);
                    line-height: 0.85;
                    text-transform: uppercase;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 1.5rem;
                    position: relative;
                    text-shadow: 0 0 30px rgba(112, 0, 255, 0.3);
                    min-height: 2em;
                }

                h1:hover {
                    animation: glitch-anim 0.3s infinite;
                    text-shadow: 2px 0 var(--accent-primary), -2px 0 var(--accent-secondary);
                }

                @keyframes glitch-anim {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }

                .neon-accent-line {
                    height: 2px;
                    width: 0%;
                    background: linear-gradient(90deg, var(--accent-secondary), var(--accent-primary));
                    box-shadow: 0 0 15px var(--accent-primary);
                    margin-bottom: 2rem;
                    transition: width 0.1s;
                }

                .hero-sub {
                    font-size: 1.1rem;
                    max-width: 650px;
                    line-height: 1.6;
                    color: #ccc;
                    border-left: 2px solid var(--accent-primary);
                    padding-left: 1.5rem;
                    background: linear-gradient(90deg, rgba(0, 0, 0, 0.6), transparent);
                    padding: 1.5rem;
                    backdrop-filter: blur(5px);
                    font-family: var(--font-body);
                    font-weight: 300;
                }

                @media (max-width: 768px) {
                    h1 { font-size: 14vw; }
                }
            `}</style>
        </header>
    );
};

export default Hero;

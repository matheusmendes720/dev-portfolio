import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navRef = useRef(null);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        const magnets = document.querySelectorAll('.magnetic-area');

        const handleMouseMove = (e, magnet, content) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            content.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        };

        const handleMouseLeave = (content) => {
            content.style.transform = 'translate(0px, 0px)';
        };

        magnets.forEach((magnet) => {
            const content = magnet.querySelector('.magnetic-wrap');
            if (content) {
                magnet.addEventListener('mousemove', (e) => handleMouseMove(e, magnet, content));
                magnet.addEventListener('mouseleave', () => handleMouseLeave(content));
            }
        });

        return () => {
            magnets.forEach((magnet) => {
                const content = magnet.querySelector('.magnetic-wrap');
                if (content) {
                    magnet.removeEventListener('mousemove', (e) => handleMouseMove(e, magnet, content));
                    magnet.removeEventListener('mouseleave', () => handleMouseLeave(content));
                }
            });
        };
    }, []);

    return (
        <nav ref={navRef}>
            <div className="nav-left">
                <div className="logo magnetic-area">
                    <div className="magnetic-wrap">
                        MATHEUS<span style={{ color: 'var(--accent-primary)' }}>.DEV</span>
                    </div>
                </div>
                <div className="system-status">
                    <div className="status-dot"></div>
                    {t('nav.status')}
                </div>
            </div>
            <ul className="nav-links">
                <li className="nav-item magnetic-area">
                    <a href="#projects" className="nav-link magnetic-wrap">{t('nav.projects')}</a>
                </li>
                <li className="nav-item magnetic-area">
                    <a href="#specs" className="nav-link magnetic-wrap">{t('nav.specs')}</a>
                </li>
                <li className="nav-item magnetic-area">
                    <a href="#terminal-interface" className="nav-link magnetic-wrap">{t('nav.terminal')}</a>
                </li>
                <li className="nav-item magnetic-area">
                    <a href="#contact" className="nav-link magnetic-wrap">{t('nav.contact')}</a>
                </li>
                <li className="nav-item">
                    <button onClick={toggleLanguage} className="lang-toggle">
                        {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
                    </button>
                </li>
            </ul>

            <style jsx>{`
                nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    padding: 1.5rem 5%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 100;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(3, 3, 8, 0.85);
                    backdrop-filter: blur(12px);
                }

                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .logo {
                    font-family: var(--font-display);
                    font-weight: 700;
                    font-size: 1.2rem;
                    color: #fff;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }

                .system-status {
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    color: var(--accent-primary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    background-color: var(--accent-primary);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--accent-primary);
                    animation: blink 2s infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                .nav-links {
                    display: flex;
                    gap: 3rem;
                    list-style: none;
                }

                .nav-link {
                    text-decoration: none;
                    color: #888;
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    transition: color 0.3s;
                    position: relative;
                    display: inline-block;
                }

                .nav-link::before {
                    content: '[';
                    margin-right: 5px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    color: var(--accent-secondary);
                }

                .nav-link::after {
                    content: ']';
                    margin-left: 5px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    color: var(--accent-secondary);
                }

                .nav-link:hover {
                    color: var(--accent-primary);
                }

                .nav-link:hover::before,
                .nav-link:hover::after {
                    opacity: 1;
                }

                .lang-toggle {
                    background: transparent;
                    border: 1px solid var(--accent-primary);
                    color: var(--accent-primary);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-left: 1rem;
                }

                .lang-toggle:hover {
                    background: var(--accent-primary);
                    color: var(--bg-color);
                    box-shadow: 0 0 10px var(--accent-primary);
                }

                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;

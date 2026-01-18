import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const [time, setTime] = useState('00:00:00 UTC');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(now.toISOString().split('T')[1].split('.')[0] + " UTC");
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer id="contact">
            <div className="footer-cta">
                <h2>{t('footer.cta')}</h2>
                <a href="mailto:email@example.com" className="magnetic-link">{t('footer.protocol')}</a>
            </div>
            <div className="footer-info">
                {t('footer.loc')}<br />
                TIME: <span id="clock">{time}</span><br />
                {t('footer.status')}
            </div>

            <style jsx>{`
                footer {
                    border-top: 1px solid var(--border-color);
                    padding: 6rem 0 2rem 0;
                    margin-top: 5rem;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                }

                .footer-cta h2 {
                    font-family: var(--font-display);
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    color: #fff;
                }

                .footer-cta a {
                    color: var(--text-color);
                    text-decoration: none;
                    border-bottom: 1px solid var(--accent-primary);
                    padding-bottom: 5px;
                    font-family: var(--font-mono);
                }

                .footer-info {
                    text-align: right;
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                    color: #666;
                    line-height: 2;
                }

                @media (max-width: 768px) {
                    footer {
                        flex-direction: column;
                        gap: 3rem;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;

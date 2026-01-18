import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useTextScramble from '../hooks/useTextScramble';

const Specs = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const { text: titleText, scramble: scrambleTitle } = useTextScramble();
    const sectionTitle = t('specs.title');

    useEffect(() => {
        const observerOptions = { threshold: 0.5 };
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.stat-fill');
                    bars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = '0%';
                        setTimeout(() => { bar.style.width = targetWidth; }, 100);
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (sectionRef.current) {
            const cards = sectionRef.current.querySelectorAll('.spec-card');
            cards.forEach(card => skillObserver.observe(card));

            return () => {
                cards.forEach(card => skillObserver.unobserve(card));
            };
        }
    }, []);

    const skillGroups = [
        [
            { label: "PYTHON / PANDAS", value: "98%" },
            { label: "SQL / NO-SQL", value: "92%" },
            { label: "AIRFLOW / DAGS", value: "88%" }
        ],
        [
            { label: "PYTORCH / TENSORFLOW", value: "90%" },
            { label: "LLM ORCHESTRATION", value: "95%" },
            { label: "VECTOR DATABASES", value: "89%" }
        ],
        [
            { label: "REACT / THREE.JS", value: "85%" },
            { label: "NODE.JS / FASTAPI", value: "93%" },
            { label: "DOCKER / K8S", value: "90%" }
        ]
    ];

    return (
        <section id="specs" className="specs-section" ref={sectionRef}>
            <div className="section-header">
                <div>
                    <div className="hero-meta">{t('specs.report')}</div>
                    <div className="section-title"
                        onMouseEnter={() => scrambleTitle(sectionTitle)}
                        dangerouslySetInnerHTML={{ __html: titleText || sectionTitle }}>
                    </div>
                </div>
            </div>

            <div className="specs-grid">
                {skillGroups.map((group, i) => (
                    <div key={i} className="spec-card">
                        {group.map((skill, j) => (
                            <div key={j} className="stat-bar-container">
                                <div className="stat-label">
                                    <span>{skill.label}</span>
                                    <span>{skill.value}</span>
                                </div>
                                <div className="stat-bar">
                                    <div
                                        className="stat-fill"
                                        data-width={skill.value}
                                        style={{ width: '0%' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .specs-section {
                    margin: 6rem 0;
                }
                .section-header {
                    margin-bottom: 2rem;
                }
                .section-title {
                    font-family: var(--font-display);
                    font-size: 2.5rem;
                    text-transform: uppercase;
                    line-height: 1;
                    color: #fff;
                    min-height: 1em;
                }
                .specs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .spec-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-color);
                    padding: 2rem;
                    position: relative;
                }
                .spec-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 2px;
                    height: 100%;
                    background: var(--accent-secondary);
                }
                .stat-bar-container {
                    margin-bottom: 1.5rem;
                }
                .stat-label {
                    display: flex;
                    justify-content: space-between;
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                    color: #aaa;
                }
                .stat-bar {
                    height: 4px;
                    background: #111;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                }
                .stat-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-secondary), var(--accent-primary));
                    width: 0%;
                    transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
                }
                @media (max-width: 768px) {
                    .specs-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
};

export default Specs;

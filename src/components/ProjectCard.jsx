import { useRef, useEffect } from 'react';
import useTextScramble from '../hooks/useTextScramble';

const ProjectCard = ({ title, category, desc, stack, metric, metricLabel, img, categoryClass }) => {
    const cardRef = useRef(null);
    const glareRef = useRef(null);
    const { text, scramble } = useTextScramble();

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const glare = glareRef.current;
        if (!card || !glare) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 210, 255, 0.2), transparent 60%)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        const glare = glareRef.current;
        if (!card || !glare) return;

        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        glare.style.opacity = '0';
    };

    const handleMouseEnter = () => {
        scramble(title);
    };

    return (
        <article
            className="project-card tilt-card"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            <div className="card-hud-tl"></div>
            <div className="card-hud-br"></div>
            <img src={img} alt={title} className="card-bg-img" />
            <div className="card-glare" ref={glareRef}></div>
            <div className="card-content">
                <span className={`card-category ${categoryClass}`}>[{category}]</span>
                <h3 className="card-title" dangerouslySetInnerHTML={{ __html: text || title }}></h3>
                <p className="card-desc">{desc}</p>
                <div className="stack-container">
                    {stack.map((item, i) => (
                        <span key={i} className="stack-badge">{item}</span>
                    ))}
                </div>
                <div className="metric-pill">
                    <div className="metric-icon"></div>
                    {metricLabel}: {metric}
                </div>
            </div>

            <style jsx>{`
                .project-card {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    height: 500px;
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.1s linear, border-color 0.3s;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }

                .project-card:hover {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 30px rgba(0, 210, 255, 0.1);
                }

                .card-hud-tl {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    width: 20px;
                    height: 20px;
                    border-top: 2px solid var(--accent-primary);
                    border-left: 2px solid var(--accent-primary);
                    z-index: 10;
                }

                .card-hud-br {
                    position: absolute;
                    bottom: 15px;
                    right: 15px;
                    width: 20px;
                    height: 20px;
                    border-bottom: 2px solid var(--accent-primary);
                    border-right: 2px solid var(--accent-primary);
                    z-index: 10;
                }

                .card-bg-img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.4;
                    transition: opacity 0.4s, transform 0.5s;
                    z-index: 1;
                    filter: grayscale(100%) contrast(130%) brightness(0.5);
                }

                .project-card:hover .card-bg-img {
                    opacity: 0.7;
                    transform: scale(1.05);
                    filter: grayscale(0%) contrast(100%);
                }

                .card-glare {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    pointer-events: none;
                    z-index: 2;
                    mix-blend-mode: screen;
                }

                .card-content {
                    position: relative;
                    z-index: 5;
                    padding: 2rem;
                    background: linear-gradient(to top, #030308, transparent);
                    transform: translateZ(30px);
                }

                .card-category {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0.5rem;
                    display: block;
                }

                .card-title {
                    font-family: var(--font-display);
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                    color: #fff;
                    min-height: 1.2em;
                }

                .card-desc {
                    font-family: var(--font-mono);
                    font-size: 0.85rem;
                    color: #999;
                    line-height: 1.4;
                }

                .stack-container {
                    margin-top: 1rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .stack-badge {
                    font-family: var(--font-mono);
                    font-size: 0.65rem;
                    padding: 3px 8px;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #bbb;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: all 0.3s;
                }

                .stack-badge:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border-color: var(--accent-primary);
                }

                .metric-pill {
                    margin-top: 1.5rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(0, 210, 255, 0.1);
                    border: 1px solid var(--accent-primary);
                    color: var(--accent-primary);
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 4px 10px;
                    border-radius: 2px;
                    box-shadow: 0 0 10px rgba(0, 210, 255, 0.1);
                }

                .metric-icon {
                    width: 6px;
                    height: 6px;
                    background: currentColor;
                    border-radius: 50%;
                }

                .cat-agentic { color: #c084fc; }
                .cat-data { color: #00d2ff; }
                .cat-analytics { color: #fb923c; }
                .cat-devops { color: #e5e7eb; }
            `}</style>
        </article>
    );
};

export default ProjectCard;

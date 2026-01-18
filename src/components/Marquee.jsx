const Marquee = () => {
    const techStack = [
        "LangChain", "RAG Systems", "PyTorch", "MLflow", "FastAPI", "Docker", "Kubernetes", "Redis", "Airflow", "Three.js", "Spark", "Kafka", "Postgres", "dbt", "Grafana", "Prometheus"
    ];

    const marqueeText = techStack.map((tech, i) => (
        <span key={i} className="marquee-text">
            {tech} <span>//</span>
        </span>
    ));

    return (
        <section className="marquee-section">
            <div className="marquee-content">
                {marqueeText}
                {marqueeText}
            </div>
            <style jsx>{`
                .marquee-section {
                    padding: 2.5rem 0;
                    background: rgba(255, 255, 255, 0.02);
                    border-top: 1px solid var(--accent-secondary);
                    border-bottom: 1px solid var(--accent-secondary);
                    overflow: hidden;
                    white-space: nowrap;
                    margin: 4rem 0;
                    position: relative;
                    transform: rotate(-1deg) scale(1.02);
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
                }

                .marquee-content {
                    display: inline-block;
                    animation: marquee 30s linear infinite;
                }

                .marquee-text {
                    font-family: var(--font-mono);
                    font-size: 1rem;
                    text-transform: uppercase;
                    margin-right: 4rem;
                    color: #aaa;
                    font-weight: 500;
                }

                .marquee-text span {
                    color: var(--accent-primary);
                    margin: 0 10px;
                }

                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
};

export default Marquee;

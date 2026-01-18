import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectCard from './ProjectCard';
import useTextScramble from '../hooks/useTextScramble';

const Projects = () => {
    const { t } = useTranslation();
    const { text: titleText, scramble: scrambleTitle } = useTextScramble();
    const sectionTitle = t('projects.title');

    const projectData = [
        { id: "research_agent", category: "AGENTIC AI", categoryClass: "cat-agentic", stack: ["LangChain", "React", "OpenAI"], metric: "200ms", metricKey: "latency", img: "https://picsum.photos/seed/ai_agent/600/800" },
        { id: "data_quality", category: "AGENTIC AI", categoryClass: "cat-agentic", stack: ["LangGraph", "Postgres+pgvector", "dbt"], metric: "<0.1%", metricKey: "anomaly_rate", img: "https://picsum.photos/seed/agent_mesh/600/800" },
        { id: "bi_copilot", category: "AGENTIC AI", categoryClass: "cat-agentic", stack: ["LangChain ReAct", "DuckDB", "Vega-Lite"], metric: "98%", metricKey: "accuracy", img: "https://picsum.photos/seed/bi_copilot/600/800" },
        { id: "self_healing", category: "AGENTIC AI", categoryClass: "cat-agentic", stack: ["Airflow", "Prometheus", "LLM Tools"], metric: "95%", metricKey: "auto_resolve", img: "https://picsum.photos/seed/healing/600/800" },
        { id: "fraud_stream", category: "DATA ENGINEERING", categoryClass: "cat-data", stack: ["Kafka", "Spark", "PyTorch"], metric: "10k/s", metricKey: "throughput", img: "https://picsum.photos/seed/data_pipe/600/800" },
        { id: "customer_360", category: "DATA ENGINEERING", categoryClass: "cat-data", stack: ["Redpanda", "Airflow", "BigQuery"], metric: "5s", metricKey: "latency", img: "https://picsum.photos/seed/cust360/600/800" },
        { id: "mlops", category: "DATA ENGINEERING", categoryClass: "cat-data", stack: ["Spark", "MLflow", "Docker"], metric: "4h", metricKey: "cycle_time", img: "https://picsum.photos/seed/mlops/600/800" },
        { id: "kpi_storyteller", category: "BUSINESS ANALYTICS", categoryClass: "cat-analytics", stack: ["TimescaleDB", "dbt", "Next.js"], metric: "-80%", metricKey: "report_time", img: "https://picsum.photos/seed/kpi/600/800" },
        { id: "churn_simulator", category: "BUSINESS ANALYTICS", categoryClass: "cat-analytics", stack: ["FastAPI", "React", "Stochastic"], metric: "10k+", metricKey: "scenarios", img: "https://picsum.photos/seed/sim/600/800" },
        { id: "devops_assistant", category: "DEVOPS", categoryClass: "cat-devops", stack: ["GitHub API", "Docker", "K8s"], metric: "15m", metricKey: "pr_time", img: "https://picsum.photos/seed/devops/600/800" },
        { id: "obs_as_code", category: "DEVOPS", categoryClass: "cat-devops", stack: ["Prometheus", "Grafana", "Terraform"], metric: "50+", metricKey: "monitors", img: "https://picsum.photos/seed/obs/600/800" },
        { id: "data_product", category: "DEVOPS", categoryClass: "cat-devops", stack: ["Terraform", "Docker", "FastAPI"], metric: "<10m", metricKey: "setup", img: "https://picsum.photos/seed/template/600/800" },
        { id: "knowledge_base", category: "INFRASTRUCTURE", categoryClass: "cat-data", stack: ["Pinecone", "FastAPI", "OpenAI"], metric: "50M+", metricKey: "docs", img: "https://picsum.photos/seed/rag_sys/600/800" }
    ];

    const projects = projectData.map(p => ({
        ...p,
        title: t(`projects.items.${p.id}.title`),
        desc: t(`projects.items.${p.id}.desc`),
        metricLabel: t(`projects.metrics.${p.metricKey}`)
    }));

    return (
        <section id="projects">
            <div className="section-header">
                <div>
                    <div className="hero-meta">{t('projects.directory')}</div>
                    <div className="section-title"
                        onMouseEnter={() => scrambleTitle(sectionTitle)}
                        dangerouslySetInnerHTML={{ __html: titleText || sectionTitle }}>
                    </div>
                </div>
                <div className="hero-meta" style={{ textAlign: 'right' }}>{projects.length} {t('projects.found')}</div>
            </div>

            <div className="projects-grid">
                {projects.map((project, i) => (
                    <ProjectCard key={i} {...project} />
                ))}
            </div>

            <style jsx>{`
                #projects {
                    padding: 4rem 0;
                }
                .section-header {
                    margin-bottom: 4rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .section-title {
                    font-family: var(--font-display);
                    font-size: 2.5rem;
                    text-transform: uppercase;
                    line-height: 1;
                    color: #fff;
                    min-height: 1em;
                }
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 3rem;
                    padding-bottom: 6rem;
                    perspective: 1000px;
                }
                @media (max-width: 768px) {
                    .projects-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
};

export default Projects;

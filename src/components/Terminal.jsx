import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Terminal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [history, setHistory] = useState([
        { type: 'output', content: t('terminal.welcome') },
        { type: 'output', content: t('terminal.help_msg') },
        { type: 'output', content: "----------------------------------------" }
    ]);
    const [input, setInput] = useState('');
    const bodyRef = useRef(null);
    const inputRef = useRef(null);

    const commands = {
        'help': t('terminal.commands.help'),
        'about': t('terminal.commands.about'),
        'projects': t('terminal.commands.projects'),
        'contact': t('terminal.commands.contact'),
        'clear': 'CLEAR'
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            const newHistory = [...history, { type: 'command', content: input }];

            if (cmd === 'clear') {
                setHistory([]);
            } else if (cmd === 'intel') {
                // Secret command — authenticate and redirect
                newHistory.push({ type: 'success', content: '🔓 Access granted. Redirecting to classified area...' });
                setHistory(newHistory);
                sessionStorage.setItem('__sg_auth', 'true');
                setTimeout(() => navigate('/contest_calendar'), 800);
            } else if (commands[cmd]) {
                newHistory.push({ type: 'success', content: commands[cmd] });
                setHistory(newHistory);
            } else if (cmd !== '') {
                newHistory.push({ type: 'error', content: t('terminal.commands.notFound', { cmd }) });
                setHistory(newHistory);
            } else {
                setHistory(newHistory);
            }

            setInput('');
        }
    };

    return (
        <section id="terminal-interface">
            <div className="hero-meta" style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('terminal.connection')}</div>
            <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
                <div className="terminal-header">
                    <div className="terminal-buttons">
                        <div className="t-btn red"></div>
                        <div className="t-btn yellow"></div>
                        <div className="t-btn green"></div>
                    </div>
                    <div className="terminal-title">guest@ai-portfolio:~</div>
                </div>
                <div className="terminal-body" ref={bodyRef}>
                    {history.map((line, i) => (
                        <div key={i} className={`output-line ${line.type}`}>
                            {line.type === 'command' && <span className="command-prefix">guest@ai-portfolio:~$</span>}
                            <span dangerouslySetInnerHTML={{ __html: line.content }}></span>
                        </div>
                    ))}
                    <div className="input-area">
                        <span className="command-prefix">guest@ai-portfolio:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            className="term-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                            spellCheck="false"
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .terminal-window {
                    background: #050508;
                    border: 1px solid #333;
                    border-radius: 4px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                    font-family: 'Fira Code', monospace;
                    max-width: 900px;
                    margin: 0 auto 6rem auto;
                    overflow: hidden;
                }
                .terminal-header {
                    background: #111;
                    padding: 0.5rem 1rem;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #222;
                }
                .terminal-buttons {
                    display: flex;
                    gap: 6px;
                }
                .t-btn {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }
                .red { background: #ff5f56; }
                .yellow { background: #ffbd2e; }
                .green { background: #27c93f; }
                .terminal-title {
                    margin-left: 1rem;
                    font-size: 0.75rem;
                    color: #555;
                }
                .terminal-body {
                    padding: 1.5rem;
                    height: 320px;
                    overflow-y: auto;
                    color: #ccc;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
                .output-line {
                    margin-bottom: 0.5rem;
                }
                .command-prefix {
                    color: var(--accent-primary);
                    margin-right: 0.8rem;
                    user-select: none;
                }
                .success { color: var(--accent-primary); }
                .error { color: #ff5555; }
                .info { color: var(--accent-secondary); }
                .input-area {
                    display: flex;
                    align-items: center;
                    margin-top: 1rem;
                }
                .term-input {
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.9rem;
                    width: 100%;
                    outline: none;
                }
            `}</style>
        </section>
    );
};

export default Terminal;

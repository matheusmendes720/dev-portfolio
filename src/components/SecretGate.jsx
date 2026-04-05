import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isFeatureEnabled } from '../utils/featureFlags';

const SECRET_KEY = 'intel';
const SESSION_KEY = '__sg_auth';

const SecretGate = ({ children }) => {
    const isGateEnabled = isFeatureEnabled('SECRET_GATE');
    const [authenticated, setAuthenticated] = useState(
        () => !isGateEnabled || sessionStorage.getItem(SESSION_KEY) === 'true'
    );
    const [input, setInput] = useState('');
    const [attempts, setAttempts] = useState([]);
    const [shake, setShake] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();

        if (cmd === SECRET_KEY) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setAuthenticated(true);
            setAttempts(prev => [...prev, { text: cmd, success: true }]);
        } else if (cmd === 'back' || cmd === 'exit') {
            navigate('/');
        } else {
            setAttempts(prev => [...prev, { text: cmd, success: false }]);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
        setInput('');
    };

    if (authenticated) return children;

    return (
        <section id="secret-gate">
            <div className="gate-container">
                <div className={`gate-terminal ${shake ? 'shake' : ''}`}>
                    <div className="gate-header">
                        <div className="gate-dots">
                            <span className="dot r" />
                            <span className="dot y" />
                            <span className="dot g" />
                        </div>
                        <span className="gate-title">RESTRICTED ACCESS</span>
                    </div>

                    <div className="gate-body">
                        <div className="ascii-lock">
                            {`
  ┌─────────────────────────┐
  │    ╔═══════════════╗    │
  │    ║   ◉  LOCKED   ║    │
  │    ║   ▓▓▓▓▓▓▓▓▓   ║    │
  │    ╚═══════════════╝    │
  └─────────────────────────┘
`}
                        </div>

                        <p className="gate-msg">
                            <span className="blink">▶</span> Authorization required to access this area.
                        </p>
                        <p className="gate-hint">
                            Enter access key to proceed. Type <span className="cmd">"back"</span> to return.
                        </p>

                        <div className="gate-history">
                            {attempts.map((a, i) => (
                                <div key={i} className={`attempt ${a.success ? 'ok' : 'fail'}`}>
                                    <span className="prompt">access@gate:~$</span> {a.text}
                                    {!a.success && <span className="deny"> ✖ ACCESS DENIED</span>}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="gate-form">
                            <span className="prompt">access@gate:~$</span>
                            <input
                                ref={inputRef}
                                type="password"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="enter access key..."
                                autoComplete="off"
                                spellCheck="false"
                                className="gate-input"
                            />
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                #secret-gate {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .gate-container {
                    width: 100%;
                    max-width: 600px;
                }
                .gate-terminal {
                    background: rgba(5, 5, 10, 0.95);
                    border: 1px solid rgba(0, 210, 255, 0.2);
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow:
                        0 0 40px rgba(0, 210, 255, 0.08),
                        0 0 80px rgba(112, 0, 255, 0.05),
                        inset 0 1px 0 rgba(255,255,255,0.03);
                    transition: transform 0.1s;
                }
                .gate-terminal.shake {
                    animation: shakeGate 0.5s ease;
                }
                @keyframes shakeGate {
                    0%, 100% { transform: translateX(0); }
                    15% { transform: translateX(-8px); }
                    30% { transform: translateX(8px); }
                    45% { transform: translateX(-6px); }
                    60% { transform: translateX(6px); }
                    75% { transform: translateX(-3px); }
                }
                .gate-header {
                    background: rgba(15, 15, 25, 0.9);
                    padding: 0.6rem 1rem;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .gate-dots {
                    display: flex;
                    gap: 6px;
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                }
                .dot.r { background: #ff5f56; }
                .dot.y { background: #ffbd2e; }
                .dot.g { background: #27c93f; }
                .gate-title {
                    margin-left: 1rem;
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    color: #ff5555;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                .gate-body {
                    padding: 2rem;
                    font-family: var(--font-mono);
                }
                .ascii-lock {
                    color: var(--accent-primary);
                    font-size: 0.75rem;
                    line-height: 1.4;
                    text-align: center;
                    white-space: pre;
                    margin-bottom: 1.5rem;
                    opacity: 0.7;
                }
                .gate-msg {
                    color: #e0e6ed;
                    font-size: 0.85rem;
                    margin-bottom: 0.5rem;
                }
                .gate-hint {
                    color: #555;
                    font-size: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                .cmd {
                    color: var(--accent-primary);
                }
                .blink {
                    animation: blinkAnim 1.2s infinite;
                    color: var(--accent-primary);
                }
                @keyframes blinkAnim {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .gate-history {
                    margin-bottom: 1rem;
                    max-height: 120px;
                    overflow-y: auto;
                }
                .attempt {
                    font-size: 0.8rem;
                    margin-bottom: 0.3rem;
                }
                .attempt.fail { color: #666; }
                .attempt.ok { color: #27c93f; }
                .deny {
                    color: #ff5555;
                    margin-left: 0.5rem;
                    font-size: 0.7rem;
                }
                .prompt {
                    color: var(--accent-primary);
                    margin-right: 0.6rem;
                    user-select: none;
                }
                .gate-form {
                    display: flex;
                    align-items: center;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    padding-top: 1rem;
                }
                .gate-input {
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-family: var(--font-mono);
                    font-size: 0.85rem;
                    width: 100%;
                    outline: none;
                    caret-color: var(--accent-primary);
                }
                .gate-input::placeholder {
                    color: #333;
                }
            `}</style>
        </section>
    );
};

export default SecretGate;

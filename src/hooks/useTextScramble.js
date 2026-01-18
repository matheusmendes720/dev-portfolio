import { useState, useCallback, useRef } from 'react';

const useTextScramble = (phrases, waitTime = 3000) => {
    const [text, setText] = useState('');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const frameRequestRef = useRef();
    const frameRef = useRef(0);
    const queueRef = useRef([]);
    const resolveRef = useRef();

    const randomChar = useCallback(() => {
        return chars[Math.floor(Math.random() * chars.length)];
    }, [chars]);

    const lastTextRef = useRef('');

    const update = useCallback(() => {
        let output = '';
        let complete = 0;
        for (let i = 0, n = queueRef.current.length; i < n; i++) {
            let { from, to, start, end, char } = queueRef.current[i];
            if (frameRef.current >= end) {
                complete++;
                output += to;
            } else if (frameRef.current >= start) {
                if (!char || Math.random() < 0.28) {
                    char = randomChar();
                    queueRef.current[i].char = char;
                }
                output += `<span style="color:var(--accent-primary)">${char}</span>`;
            } else {
                output += from;
            }
        }

        setText(output);

        if (complete === queueRef.current.length) {
            lastTextRef.current = output.replace(/<[^>]*>?/gm, '');
            resolveRef.current();
        } else {
            frameRequestRef.current = requestAnimationFrame(update);
            frameRef.current++;
        }
    }, [randomChar]);

    const scramble = useCallback((newText) => {
        const oldText = lastTextRef.current;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (resolveRef.current = resolve));

        const queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            queue.push({ from, to, start, end });
        }

        queueRef.current = queue;
        cancelAnimationFrame(frameRequestRef.current);
        frameRef.current = 0;
        update();
        return promise;
    }, [update]);

    return { text, scramble };
};

export default useTextScramble;

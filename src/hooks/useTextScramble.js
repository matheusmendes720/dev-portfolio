import { useState, useCallback, useRef, useEffect } from 'react';

const useTextScramble = () => {
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

    // Use a ref to store the update function to avoid circular dependencies in the callback
    const updateRef = useRef();

    const update = useCallback(() => {
        let output = '';
        let complete = 0;

        // Check if queue has initialized
        if (!queueRef.current.length) return;

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
            if (resolveRef.current) resolveRef.current();
        } else {
            frameRef.current++;
            // Use the ref to call the function recursively
            frameRequestRef.current = requestAnimationFrame(() => updateRef.current && updateRef.current());
        }
    }, [randomChar]);

    // Keep the ref updated with the latest version of the function
    useEffect(() => {
        updateRef.current = update;
    }, [update]);

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
        if (frameRequestRef.current) cancelAnimationFrame(frameRequestRef.current);
        frameRef.current = 0;
        // Call the ref instead of the function directly to be safe, though direct call here is also fine
        if (updateRef.current) updateRef.current();
        return promise;
    }, []); // Removed update dependency since we use the ref or call it via closure (though ref is safer)

    return { text, scramble };
};

export default useTextScramble;

import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);

    useEffect(() => {
        const dot = dotRef.current;
        const outline = outlineRef.current;

        const moveCursor = (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            if (dot) {
                dot.style.left = `${posX}px`;
                dot.style.top = `${posY}px`;
            }

            if (outline) {
                outline.animate(
                    { left: `${posX}px`, top: `${posY}px` },
                    { duration: 500, fill: "forwards" }
                );
            }
        };

        const handleHoverStart = () => {
            if (outline) {
                outline.classList.add('hovered');
                outline.style.borderRadius = '4px';
            }
        };

        const handleHoverEnd = () => {
            if (outline) {
                outline.classList.remove('hovered');
                outline.style.borderRadius = '50%';
            }
        };

        window.addEventListener('mousemove', moveCursor);

        // Selective listener approach for performance
        const interactiveElements = document.querySelectorAll('a, .project-card, .magnetic-area, button');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
            });
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" style={cursorDotStyle}></div>
            <div ref={outlineRef} className="cursor-outline" style={cursorOutlineStyle}></div>
            <style jsx>{`
                .cursor-dot, .cursor-outline {
                    position: fixed;
                    top: 0;
                    left: 0;
                    transform: translate(-50%, -50%);
                    z-index: 9999;
                    pointer-events: none;
                    border-radius: 50%;
                }
                .cursor-dot {
                    width: 5px;
                    height: 5px;
                    background-color: var(--accent-primary);
                }
                .cursor-outline {
                    width: 25px;
                    height: 25px;
                    border: 1px solid var(--accent-primary);
                    transition: width 0.2s, height 0.2s, background-color 0.2s;
                    mix-blend-mode: screen;
                }
                .cursor-outline.hovered {
                    width: 60px;
                    height: 60px;
                    background-color: rgba(0, 210, 255, 0.1);
                    border: 1px solid var(--accent-secondary);
                }
            `}</style>
        </>
    );
};

const cursorDotStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    pointerEvents: 'none',
    borderRadius: '50%',
};

const cursorOutlineStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    pointerEvents: 'none',
    borderRadius: '50%',
};

export default CustomCursor;

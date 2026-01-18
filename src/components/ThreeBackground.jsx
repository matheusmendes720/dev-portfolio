import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
    const containerRef = useRef();

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.PlaneGeometry(2, 2);
        const uniforms = {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { value: new THREE.Vector2(0, 0) }
        };

        const fragmentShader = `
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;

            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.y, u_resolution.x);
                
                // Add mouse interaction influence 
                uv += (u_mouse - 0.5) * 0.2;

                float time = u_time * 0.5;
                
                // Plasma calculations
                float v1 = sin(uv.x * 10.0 + time);
                float v2 = sin(10.0 * (uv.x * sin(time / 2.0) + uv.y * cos(time / 3.0)) + time);
                float cx = uv.x + 0.5 * sin(time / 5.0);
                float cy = uv.y + 0.5 * cos(time / 3.0);
                float v3 = sin(sqrt(100.0 * (cx * cx + cy * cy) + 1.0) + time);
                float v = v1 + v2 + v3;

                // Color mapping
                vec3 col;
                col.r = sin(v * 3.14159);
                col.g = sin(v * 3.14159 + 2.0 * 3.14159 / 3.0);
                col.b = sin(v * 3.14159 + 4.0 * 3.14159 / 3.0);
                
                // Adjust colors for the "agentic" theme (indigo/teal/neon)
                col = mix(col, vec3(0.05, 0.0, 0.15), 0.5); // Blend with deep indigo
                col *= vec3(0.4, 0.8, 1.0); // Tint towards teal/cyan
                
                // Darken the background and add contrast
                float intensity = pow(0.5 + 0.5 * sin(v), 2.0);
                vec3 finalColor = col * intensity * 0.25;

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const vertexShader = `
            void main() {
                gl_Position = vec4( position, 1.0 );
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        const handleMouseMove = (e) => {
            uniforms.u_mouse.value.x = e.clientX / window.innerWidth;
            uniforms.u_mouse.value.y = 1.0 - (e.clientY / window.innerHeight);
        };

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.u_resolution.value.x = window.innerWidth;
            uniforms.u_resolution.value.y = window.innerHeight;
        };

        document.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        const animate = () => {
            uniforms.u_time.value += 0.005;

            // Animation for neon line width pulse is handled in Hero.jsx 
            // but we could also expose it here if needed.
            // In the original script it also updated neonLine.style.width.
            // We'll keep that logic in Hero.jsx for better React pattern.

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            id="canvas-container"
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -2,
                opacity: 0.8,
                pointerEvents: 'none'
            }}
        />
    );
};

export default ThreeBackground;

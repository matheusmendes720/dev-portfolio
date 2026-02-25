import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
    const containerRef = useRef();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

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

            vec3 palette( float t ) {
                // Deep Indigo to Teal shifts
                vec3 a = vec3(0.5, 0.5, 0.5); 
                vec3 b = vec3(0.5, 0.5, 0.5); 
                vec3 c = vec3(1.0, 1.0, 1.0); 
                vec3 d = vec3(0.50, 0.20, 0.25); 
                return a + b*cos( 6.28318*(c*t+d) );
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
                vec2 uv0 = uv;
                vec3 finalColor = vec3(0.0);
                
                uv += (u_mouse * 0.04);
                
                for (float i = 0.0; i < 3.0; i++) {
                    uv = fract(uv * 1.5) - 0.5;
                    float d = length(uv) * exp(-length(uv0));
                    vec3 col = palette(length(uv0) + i*.4 + u_time*.4);
                    d = sin(d*8. + u_time)/8.0;
                    d = abs(d);
                    d = pow(0.01 / d, 1.2);
                    finalColor += col * d;
                }
                
                gl_FragColor = vec4(finalColor * 0.06, 1.0);
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
            if (container) {
                container.removeChild(renderer.domElement);
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
                opacity: 0.4,
                pointerEvents: 'none'
            }}
        />
    );
};

export default ThreeBackground;

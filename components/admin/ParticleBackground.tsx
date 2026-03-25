"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    colorIndex: number;
}

const COLORS = [
    [23, 208, 255],   // cyan
    [51, 136, 255],   // blue
    [168, 85, 247],   // purple
    [34, 197, 94],    // green (subtle)
];

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Initialize 100 particles
        particlesRef.current = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            colorIndex: Math.floor(Math.random() * COLORS.length),
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particlesRef.current) {
                p.x += p.vx;
                p.y += p.vy;

                // Edge wrapping
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const [r, g, b] = COLORS[p.colorIndex];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
                ctx.fill();
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: "transparent" }}
        />
    );
}

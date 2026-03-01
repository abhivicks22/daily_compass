import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function AnimatedBackground() {
    // Generate 25 falling elements with random positions, delays, and durations
    const drops = useMemo(() => {
        return Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * -20}s`, // Negative delay to start mid-animation
            duration: `${12 + Math.random() * 15}s`,
            size: `${4 + Math.random() * 8}px`,
            opacity: 0.15 + Math.random() * 0.4
        }))
    }, [])

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--color-bg-base)] transition-colors duration-1000">
            {/* Ambient Sunrays */}
            <div
                className="absolute top-[-20%] right-[-10%] w-[120%] h-[80%] opacity-30 mix-blend-overlay pointer-events-none"
                style={{
                    background: 'linear-gradient(195deg, rgba(255,255,255,0.8) 0%, rgba(227, 196, 148, 0.4) 30%, transparent 60%)',
                    transform: 'rotate(-15deg)'
                }}
            />
            {/* SVG Filter for deep, organic blurring */}
            <svg className="hidden">
                <defs>
                    <filter id="organic-blur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="100" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            <div
                className="absolute inset-0 w-full h-full opacity-80"
                style={{ filter: 'url(#organic-blur)' }}
            >
                {/* Blob 1: Lush Sage / Green */}
                <motion.div
                    animate={{
                        x: ['-5%', '15%', '-5%'],
                        y: ['-10%', '10%', '-10%'],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply"
                    style={{ background: 'radial-gradient(circle, var(--color-green) 0%, transparent 60%)', opacity: 0.35 }}
                />

                {/* Blob 2: Deep Ocean Blue */}
                <motion.div
                    animate={{
                        x: ['10%', '-20%', '10%'],
                        y: ['15%', '-5%', '15%'],
                        scale: [1.15, 1, 1.15],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-[20%] right-[-10%] w-[55vw] h-[55vw] rounded-full mix-blend-multiply"
                    style={{ background: 'radial-gradient(circle, var(--color-blue) 0%, transparent 60%)', opacity: 0.3 }}
                />

                {/* Blob 3: Vibrant Sun / Sand */}
                <motion.div
                    animate={{
                        x: ['-15%', '5%', '-15%'],
                        y: ['20%', '-10%', '20%'],
                        scale: [1, 1.25, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply"
                    style={{ background: 'radial-gradient(circle, var(--color-amber) 0%, transparent 60%)', opacity: 0.25 }}
                />
            </div>

            {/* Falling Drops / Petals */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {drops.map(drop => (
                    <div
                        key={drop.id}
                        className="animate-fall bg-[var(--color-green)]"
                        style={{
                            left: drop.left,
                            width: drop.size,
                            height: drop.size,
                            opacity: drop.opacity,
                            animationDelay: drop.delay,
                            animationDuration: drop.duration,
                            filter: 'blur(1px)'
                        }}
                    />
                ))}
            </div>

            {/* Grass / Earth Foundation */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[40vh] w-full pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgba(144, 184, 155, 0.4) 0%, rgba(144, 184, 155, 0.1) 40%, transparent 100%)',
                    mixBlendMode: 'multiply'
                }}
            />
        </div>
    )
}

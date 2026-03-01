import { motion } from 'framer-motion'

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--color-bg-base)] transition-colors duration-1000">
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
        </div>
    )
}

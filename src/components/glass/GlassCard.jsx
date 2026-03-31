import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const variants = {
    default: 'bg-glass-100 border-glass-200 backdrop-blur-md shadow-lg',
    neon: 'bg-black/40 border-neon-purple/30 backdrop-blur-xl shadow-[0_0_15px_rgba(139,92,246,0.15)]',
    acrylic: 'bg-white/5 border-white/10 backdrop-blur-3xl shadow-2xl',
};

const GlassCard = ({ children, className, variant = 'default', hoverEffect = false, ...props }) => {
    return (
        <motion.div
            className={twMerge(
                'rounded-xl border p-6 transition-all duration-300',
                variants[variant],
                hoverEffect && 'hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] hover:border-neon-purple/50 cursor-pointer',
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;

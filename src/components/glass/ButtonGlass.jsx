import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const variants = {
    primary: 'bg-neon-purple/20 border-neon-purple/50 text-white hover:bg-neon-purple/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    aurora: 'bg-gradient-to-r from-neon-purple/20 via-neon-green/20 to-neon-purple/20 bg-[length:200%_100%] animate-aurora border-white/20 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    ghost: 'bg-transparent border-transparent text-gray-300 hover:text-white hover:bg-white/5',
};

const ButtonGlass = ({ children, className, variant = 'primary', icon: Icon, onClick, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={twMerge(
                'relative flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 font-mono text-sm font-medium transition-all duration-300',
                variants[variant],
                className
            )}
            onClick={onClick}
            {...props}
        >
            {Icon && <Icon size={16} className="relative z-10" />}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default ButtonGlass;

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const defaultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const defaultItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.8, 0.2, 1], // similar to standard 'slide' presets
    },
  },
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  preset = 'slide',
  className,
  delay = 0,
}) {
  const Component = motion[as] || motion.p;
  
  // Choose standard or delayed stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: per === 'char' ? 0.03 : 0.05,
        delayChildren: delay,
      },
    },
  };

  const words = typeof children === 'string' ? children.split(' ') : [];
  
  // Render based on 'per' ('word' or 'char')
  return (
    <Component
      className={cn('inline-block whitespace-pre-wrap', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {per === 'word' ? (
        words.map((word, i) => (
          <span key={i} className="inline-block whitespace-pre">
            <motion.span variants={defaultItemVariants} className="inline-block">
              {word}
            </motion.span>
            {i !== words.length - 1 && <span> </span>}
          </span>
        ))
      ) : (
        words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-pre">
            {word.split('').map((char, charIndex) => (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                variants={defaultItemVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {wordIndex !== words.length - 1 && <span> </span>}
          </span>
        ))
      )}
    </Component>
  );
}

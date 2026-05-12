import { motion } from 'motion/react';

interface LuxuryTitleProps {
  text: string;
  isActive: boolean;
  className?: string;
  delay?: number;
}

/**
 * LuxuryTitle replicates the sophisticated word-level reveal animation 
 * found on Project pages.
 */
export default function LuxuryTitle({ text, isActive, className = '', delay = 0 }: LuxuryTitleProps) {
  return (
    <span className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-flex mr-[0.25em] last:mr-0">
          <span style={{ 
            display: 'inline-flex', 
            overflow: 'hidden', 
            verticalAlign: 'bottom', 
            padding: '0.15em 0.1em',
            margin: '-0.15em -0.1em'
          }}>
            <motion.span
              style={{ display: 'inline-flex' }}
              initial={{ y: '120%' }}
              animate={isActive ? { y: 0 } : { y: '120%' }}
              transition={{
                duration: 1.5,
                ease: [0.075, 0.82, 0.165, 1],
                delay: delay + i * 0.12,
              }}
            >
              {word}
            </motion.span>
          </span>
        </span>
      ))}
    </span>
  );
}

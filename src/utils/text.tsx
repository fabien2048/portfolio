// src/utils/text.tsx
import React from 'react';

/**
 * Splits a string into characters, wrapping each character in a span 
 * with a container for masking (overflow: hidden).
 */
export function SplitText({ text, className = '' }: { text: string, className?: string }) {
  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((char, i) => {
        if (char === ' ') {
          return <React.Fragment key={i}>{"\u00A0"}</React.Fragment>;
        }
        return (
          <span key={i} className="word">
            <span 
              className="char" 
              style={{ '--char-index': i } as React.CSSProperties}
            >
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
}

import React, { useState, useEffect } from 'react';

const CHAR_SET = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

interface TextScrambleProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  speed = 80,
  delay = 300,
  className = '',
  style,
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');

    const startTimestamp = Date.now();
    let charIndex = 0;
    let cycleCount = 0;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimestamp;
      if (elapsed < delay) return;

      if (charIndex < text.length) {
        if (cycleCount < 2) {
          // Scramble characters ahead of current index
          const scrambled = text
            .split('')
            .map((origChar, i) => {
              if (i < charIndex) return text[i];
              if (origChar === ' ') return ' ';
              return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
            })
            .join('');
          setDisplayText(scrambled);
          cycleCount++;
        } else {
          // Lock in the next character
          const lockedPrefix = text.substring(0, charIndex + 1);
          const remainingScramble = text
            .substring(charIndex + 1)
            .split('')
            .map((c) => (c === ' ' ? ' ' : CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]))
            .join('');
          setDisplayText(lockedPrefix + remainingScramble);
          charIndex++;
          cycleCount = 0;
        }
      } else {
        setDisplayText(text);
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={className} style={style}>
      {displayText || text.split('').map(() => CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]).join('')}
    </span>
  );
};

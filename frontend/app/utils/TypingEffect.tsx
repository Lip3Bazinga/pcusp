import React, { useEffect, useState } from "react";

interface TypingEffectProps {
  text: string;
  typingSpeed?: number; // Velocidade da digitação em milissegundos
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, typingSpeed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index)); // Adiciona o caractere atual
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [text]);

  useEffect(() => {
    const cursorBlinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500); // Piscar a cada 500ms

    return () => clearInterval(cursorBlinkInterval);
  }, []);

  return (
    <h2 className="dark:text-white text-[#000000C7] text-[24px] sm:text-[30px] px-3 w-full font-bold py-2 leading-tight">
      {displayedText}
      {cursorVisible && <span className="text-[#8C52FF]">|</span>} {/* Cursor */}
    </h2>
  );
};

export default TypingEffect;
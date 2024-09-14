import React, { useState, useEffect } from "react";

// Define the type for the component props
interface TypewriterProps {
  text: string;
  delay: number;
}

// Typewriter component
const Typewriter: React.FC<TypewriterProps> = ({ text, delay }) => {
  const [currentText, setCurrentText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    let timeout: number; // Use number for browser environment

    if (currentIndex <= text.length) {
      timeout = window.setTimeout(() => {
        if (text[currentIndex]) {
          setCurrentText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

export default Typewriter;

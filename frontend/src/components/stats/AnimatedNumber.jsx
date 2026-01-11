import React, { useEffect, useState } from "react";

export default function AnimatedNumber({ value, duration = 800, style }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    let end = Number(value) || 0;
    let increment = end / (duration / 16); // ~60 FPS

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setDisplay(current.toFixed(0));
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span style={style}>{display}</span>;
}

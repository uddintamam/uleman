import { useRef, useState, useEffect } from 'react';

// Custom hook for animating each step on scroll (staggered)
export default function useStepAnimation(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let timeout;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeout = setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [delay]);

  return [ref, visible];
}

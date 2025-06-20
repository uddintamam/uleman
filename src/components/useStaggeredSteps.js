import { useRef, useState, useEffect } from 'react';

// Custom hook for staggered animation: only show step if previous step sudah tampil
export default function useStaggeredSteps(totalSteps) {
  const [visibleSteps, setVisibleSteps] = useState(Array(totalSteps).fill(false));
  const refs = Array.from({ length: totalSteps }, () => useRef(null));

  useEffect(() => {
    const observers = [];
    refs.forEach((ref, idx) => {
      observers[idx] = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !visibleSteps[idx]) {
            setTimeout(() => {
              setVisibleSteps(prev => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 250); // Staggered delay
            observers[idx].disconnect();
          }
        },
        { threshold: 0.2 }
      );
      if (ref.current) observers[idx].observe(ref.current);
    });
    return () => observers.forEach(obs => obs.disconnect());
    // eslint-disable-next-line
  }, []);

  return [refs, visibleSteps];
}

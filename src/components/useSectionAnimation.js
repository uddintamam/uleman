import { useEffect, useRef, useState } from 'react';

export default function useSectionAnimation({
  delay = 0,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'blur' | 'zoom' | 'none'
  opacity = true,
  once = true,
} = {}) {
  const ref = useRef(null);
  const [hasAppeared, setHasAppeared] = useState(false);

  const baseTransition = `transition-all duration-700 ease-out`;

  const getInitialClass = () => {
    let classes = [];
    if (opacity) classes.push('opacity-0');

    switch (direction) {
      case 'up':
        classes.push('translate-y-6');
        break;
      case 'down':
        classes.push('-translate-y-6');
        break;
      case 'left':
        classes.push('translate-x-6');
        break;
      case 'right':
        classes.push('-translate-x-6');
        break;
      case 'blur':
        classes.push('blur-sm');
        break;
      case 'zoom':
        classes.push('scale-50');
        break;
      default:
        break;
    }

    classes.push(baseTransition);
    return classes.join(' ');
  };

  const getVisibleClass = () => {
    let classes = [];
    if (opacity) classes.push('opacity-100');

    if (['up', 'down'].includes(direction)) {
      classes.push('translate-y-0');
    }
    if (['left', 'right'].includes(direction)) {
      classes.push('translate-x-0');
    }
    if (direction === 'blur') {
      classes.push('blur-0');
    }
    if (direction === 'zoom') {
      classes.push('scale-100');
    }

    classes.push(baseTransition);
    return classes.join(' ');
  };

  const [animClass, setAnimClass] = useState(getInitialClass());

  useEffect(() => {
    const node = ref.current;
    if (!node || (once && hasAppeared)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setAnimClass(getVisibleClass());
            setHasAppeared(true);
          }, delay);
          if (!once) observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAppeared]);

  return [ref, animClass, hasAppeared];
}

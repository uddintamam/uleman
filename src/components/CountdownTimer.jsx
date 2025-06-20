// src/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import useSectionAnimation from './useSectionAnimation';

const CountdownTimer = ({ targetDate }) => {
  const [ref, animClass] = useSectionAnimation({
      delay: 0,
      direction: 'up',
    });
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className={`countdown-section ${animClass} `}
        style={{ transitionDuration: '1000ms' }}
    >
    <h2>Menuju Hari Bahagia</h2>
    <div className="countdown-timer mb-2 relative z-50'">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="countdown-item">
          <p>{value}</p>
          <span>{unit}</span>
        </div>
      ))}
    </div>
  </section>
  );
};

export default CountdownTimer;
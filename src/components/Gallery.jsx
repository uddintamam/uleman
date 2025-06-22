import React, { useEffect, useRef, useState } from 'react';
import useSectionAnimation from './useSectionAnimation';

const StoryBoard = ({ storyBoards }) => {
  const [activeStep, setActiveStep] = useState(-1);
  const stepRefs = useRef([]);
  
  const [refTitle, animTitle] = useSectionAnimation({
    delay: 0,
    direction: 'up',
  });

  const stories = storyBoards.map((story) => ({
    title: story.title,
    desc: story.message,
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setActiveStep((prev) => (index > prev ? index : prev));
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      stepRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [stories.length]);

  return (
    <section className="storyboard-section">
      <h2 ref={refTitle} className={`storyboard-title ${animTitle}`}
        style={{ transitionDuration: '1000ms' }}
      >Our Journey</h2>

      <div className="storyboard-timeline">
        {stories.map((story, idx) => (
          <div
            key={idx}
            ref={(el) => (stepRefs.current[idx] = el)}
            data-index={idx}
            className={`storyboard-step ${
              idx <= activeStep ? 'storyboard-step-visible blur-in' : ''
            }`}
          >
            <div className="storyboard-step-icon">❤️</div>
            <div className="storyboard-content">
              <h3 className="storyboard-step-title">{story.title}</h3>
              <p className="storyboard-step-desc">{story.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoryBoard;

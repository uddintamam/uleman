import React from 'react';
import useSectionAnimation from './useSectionAnimation';

const BlessingText = () => {
  
  const [refBlessing, animBlessing] = useSectionAnimation({
    delay: 0,
    direction: 'up',
  });

  const [refNames, animNames] = useSectionAnimation({
    delay: 1000,
    direction: 'blur',
  });
  return (
    <section className="blessing-section animate-fadeInUp">
      <div className="blessing-container">
        <h2 ref={refBlessing} className={`blessing-title p-4 ${animBlessing}`}
          style={{ transitionDuration: '1000ms' }}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk memberikan do'a restu kepada kami
        </h2>
        <h2 ref={refNames} className={`blessing-names ${animNames}`}
          style={{ transitionDuration: '1000ms' }}>
          Rafli &amp; Haifa
        </h2>
      </div>
    </section>
  );
};

export default BlessingText;

import React from 'react';
import useSectionAnimation from './useSectionAnimation';
import { generateCloudinaryUrl } from '../api';

const VerseSection = () => {
  
  const bgRightUrl = generateCloudinaryUrl('hero-bg-left-C9B78PQK_tmppjp', {
  effect: 'grayscale',
  colorize: 100,
  color: 'white',
});
  const bgLeftUrl = generateCloudinaryUrl('hero-bg-right-B2cD6PeK_cjrt7h', {
  effect: 'grayscale',
  colorize: 100,
  color: 'white',
});

  // const bgFrame = generateCloudinaryUrl('frame-verse2_riy3gb');

  const [refbgLeft, animBgLeft, showWavingLeft] = useSectionAnimation({
    delay: 0,
    direction: 'left',
  });

  const [refbgRight, animBgRight, showWavingRight] = useSectionAnimation({
    delay: 0,
    direction: 'right',
  });

  const [refbgSection, animBgSection] = useSectionAnimation({
    delay: 1000,
    direction: 'up',
  });

  const [refAyat, animAyat] = useSectionAnimation({
    delay: 2000,
    direction: 'blur',
  });

  const [refNoAyat, animNoAyat] = useSectionAnimation({
    delay: 2500,
    direction: 'up',
  });
  
  return (
  <section className={`verse-section`}>
  <div className="verse-overlay" />
  <div className="verse-frame-wrapper">
  <div
    ref={refbgSection}
    className={`verse-content-frame ${animBgSection}`}
        style={{ transitionDuration: '1000ms' }}
  >
    <div className="verse-inner">
      <h2
        ref={refAyat}
        className={`verse-text ${animAyat}`}
        style={{ transitionDuration: '1500ms' }}
      >
        Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan
        untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya,
        dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian
        itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.
      </h2>
      <h3
        ref={refNoAyat}
        className={`verse-source ${animNoAyat}`}
        style={{ transitionDuration: '1000ms' }}
      >
        QS. Ar-Rum Ayat 21
      </h3>
    </div>
  </div>


  </div>
  
  <img
    ref={refbgLeft}
    src={bgRightUrl}
    alt="left decoration"
    className={`event-detail-bg event-detail-bg-left ${animBgRight} `}
    loading="lazy"
    style={{ transitionDuration: '1500ms' ,
    opacity: 0.5}}
  />
  <img 
    ref={refbgRight}
    src={bgLeftUrl} 
    alt="right decoration" 
    className={`event-detail-bg event-detail-bg-right ${animBgLeft} `} 
    style={{ transitionDuration: '1500ms' ,
    opacity: 0.5}}
    />
</section>
  );
};

export default VerseSection;

import React from 'react';
import useSectionAnimation from './useSectionAnimation';
import { generateCloudinaryUrl } from '../api';

const HeroSection = ({ weddingInfo, guest }) => {
  const [refbgLeft, animBgLeft, showWavingLeft] = useSectionAnimation({
    delay: 0,
    direction: 'left',
  });

  const [refbgRight, animBgRight, showWavingRight] = useSectionAnimation({
    delay: 0,
    direction: 'right',
  });

  const [refSubtitle, animSubtitle] = useSectionAnimation({
    delay: 400,
    direction: 'up',
  });

  const [refNames, animNames] = useSectionAnimation({
    delay: 800,
    direction: 'blur',
  });

  const [refDate, animDate] = useSectionAnimation({
    delay: 1000,
    direction: 'up',
    opacity: true,
  });

  const bgRightUrl = generateCloudinaryUrl('hero-bg-left-C9B78PQK_tmppjp');
  const bgLeftUrl = generateCloudinaryUrl('hero-bg-right-B2cD6PeK_cjrt7h');

  return (
    <section className="hero-section relative overflow-hidden">
      <img
        ref={refbgLeft}
        src={bgRightUrl}
        alt="left decoration"
        className={`hero-bg hero-bg-left ${animBgRight} ${showWavingRight ? 'waving-leaf waving-delay-1' : ''}`}
        loading="lazy"
        style={{ transitionDuration: '1500ms' }}
      />
      <img
        ref={refbgRight}
        src={bgLeftUrl}
        alt="right decoration"
        className={`hero-bg hero-bg-right ${animBgLeft} ${showWavingLeft ? 'waving-leaf waving-delay-2' : ''}`}
        style={{ transitionDuration: '1000ms' }}
      />
      <div className="hero-content text-center z-10 relative">
        <h3
          ref={refSubtitle}
          className={`hero-subtitle mb-2 text-[48px] font-semibold ${animSubtitle}`}
          style={{ transitionDuration: '1000ms' }}
        >
          Walimatul 'urs
        </h3>
        <h2 ref={refNames} className={`mt-0 ${animNames}`}
        style={{ transitionDuration: '1500ms' }}>
          <span className="block font-semibold">{weddingInfo?.groomNickName}</span>
          <span className="block text-7xl my-2">&</span>
          <span className="block font-semibold">{weddingInfo?.brideNickName}</span>
        </h2>
        <p ref={refDate} className={`mt-4 mb-4 ${animDate}`}
        style={{ transitionDuration: '1000ms' }}>
          {weddingInfo?.date
            ? (() => {
                const date = new Date(weddingInfo.date);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
              })()
            : ''}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;

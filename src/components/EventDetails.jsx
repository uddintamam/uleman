// src/components/EventDetails.jsx
import React, { useEffect } from 'react';
import useSectionAnimation from './useSectionAnimation';
import { generateCloudinaryUrl } from '../api';
import CountdownTimer from './CountdownTimer';

const EventDetails = ({ weddingInfo, targetDate }) => {

    const [refbgLeft, animBgLeft, showWavingLeft] = useSectionAnimation({
      delay: 0,
      direction: 'left',
    });

    const [refbgRight, animBgRight, showWavingRight] = useSectionAnimation({
      delay: 0,
      direction: 'right',
    });
    const [refTitle, animTitle, hasAppeared] = useSectionAnimation({
      delay: 500,
      direction: 'up',
    });
      const [refEventLeft, animEvenLeft] = useSectionAnimation({
      delay: 1000,
      direction: 'left',
    });
      const [refEventRight, animEvenRight] = useSectionAnimation({
      delay: 1000,
      direction: 'right',
    });
    const bgRightUrl = generateCloudinaryUrl('hero-bg-left-C9B78PQK_tmppjp');
    const bgLeftUrl = generateCloudinaryUrl('hero-bg-right-B2cD6PeK_cjrt7h');

  return (
<section className={`event-section`}>
    <CountdownTimer className={`mb-2 relative z-50 `} targetDate={targetDate} />
  <div className="event-overlay"></div>
  <div className="event-container flex items-center justify-center">
    <h2 ref={refTitle} className={`event-main-title ${animTitle}`}
        style={{ transitionDuration: '1000ms' }}
    >Rangkaian Acara</h2>
    <div className="event-inner-section">
      <div ref={refEventLeft} className={`event-column-left ${animEvenLeft}`}
        style={{ transitionDuration: '1000ms' }}>
        <h2>{weddingInfo?.date ? new Date(weddingInfo.date).toLocaleDateString('id-ID', { weekday: 'long' }) : 'Hari'}</h2>
        <div className="event-counter">{weddingInfo?.date ? new Date(weddingInfo.date).getDate() : ''}</div>
        <h3>{weddingInfo?.date ? new Date(weddingInfo.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : ''}</h3>
      </div>
      <div ref={refEventRight} className={`event-column-right ${animEvenRight}`}
        style={{ transitionDuration: '1000ms' }}>
        <h2>Akad</h2>
        <h3>{weddingInfo?.akadTime || '08.00 WIB - selesai'}</h3>
        <hr />
        <h2>Resepsi</h2>
        <h3>{weddingInfo?.receptionTime || '09.30 - 12.15 WIB'}</h3>
      </div>
    </div>
  </div>
  <img
    ref={refbgLeft}
    src={bgRightUrl}
    alt="left decoration"
    className={`event-detail-bg event-detail-bg-left ${animBgRight} ${showWavingRight ? 'waving-leaf waving-delay-1' : ''}`}
    loading="lazy"
    style={{ transitionDuration: '1500ms' }}
  />
  <img 
    ref={refbgRight}
    src={bgLeftUrl} 
    alt="right decoration" 
    className={`event-detail-bg event-detail-bg-right ${animBgLeft} ${showWavingLeft ? 'waving-leaf waving-delay-2' : ''}`} 
    style={{ transitionDuration: '1500ms' }}
    />

</section>

  );
};

export default EventDetails;
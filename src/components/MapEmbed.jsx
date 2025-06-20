import React from 'react';
import useSectionAnimation from './useSectionAnimation';

const MapEmbed = ({ weddingInfo }) => {
  const [refTitle, animTitle] = useSectionAnimation({
    delay: 0,
    direction: 'up',
  });
  const [refMap, animMap] = useSectionAnimation({
    delay: 500,
    direction: 'up',
  });
  const [refVanue, animVanue] = useSectionAnimation({
    delay: 1000,
    direction: 'up',
  });
  const [refAddress, animAddress] = useSectionAnimation({
    delay: 1500,
    direction: 'up',
  });

  return (
    <section
      className={`location-section py-10 px-4 max-w-4xl mx-auto text-center`}
    >
      <h2 
          ref={refTitle}
      className={`text-3xl font-bold text-green-800 mb-2 font-serif ${animTitle}`}
          style={{ transitionDuration: '1000ms' }}
          >
        Lokasi Acara
      </h2>

      <div 
          ref={refMap}
          className={`location-container flex items-center justify-center ${animMap}`}
          style={{ transitionDuration: '1000ms' }}>
        {weddingInfo?.mapUrl && (
          <div
            className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200"
            dangerouslySetInnerHTML={{ __html: weddingInfo.mapUrl }}
          />
        )}
      </div>
      
      <h3 
          ref={refVanue}
          className={`text-lg text-gray-700 font-medium mt-4 ${animVanue}`}
          style={{ transitionDuration: '1000ms' }}>
        <b>{weddingInfo?.venue}</b>
      </h3>
      <p 
      ref={refAddress}
      className={`text-sm text-gray-600 mb-6 ${animAddress}`}
          style={{ transitionDuration: '1000ms' }}>{weddingInfo?.address}</p>
    </section>
  );
};

export default MapEmbed;

import React from 'react';
import useSectionAnimation from './useSectionAnimation';


const MapEmbed = ({ weddingInfo }) => {
  const [refTitle, animTitle] = useSectionAnimation({
    delay: 0,
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
          ref={refTitle}
      className={`location-section py-10 px-4 max-w-4xl mx-auto text-center ${animTitle}`}
          style={{ transitionDuration: '1000ms' }}
    >
      <h2 
      className={`text-3xl font-bold text-green-800 mb-2 font-serif `}
          >
        Lokasi Acara
      </h2>

      <div 
          className={`location-container-map flex items-center justify-center`}>
        {weddingInfo?.mapUrl && (
          <div
            className="max-w-3xl aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200"
            dangerouslySetInnerHTML={{ __html: weddingInfo.mapUrl }}
          />
        )}
      </div>
      
      <h3 
          className={`text-lg text-gray-700 font-medium mt-4`}>
        <b>{weddingInfo?.venue}</b>
      </h3>
      <p 
      className={`text-sm text-gray-600 mb-6`}>{weddingInfo?.address}</p>

    </section>
  );
};

export default MapEmbed;

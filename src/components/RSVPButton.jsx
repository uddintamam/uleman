// src/components/RSVPButton.jsx
import React from 'react';
import useSectionAnimation from './useSectionAnimation';

const RSVPButton = ({ onGiftClick, guest, weddingInfo }) => {
  const [ref, animClass] = useSectionAnimation({
    delay: 2000,
    direction: 'up',
  });
  const message = encodeURIComponent(`Assalamu'alaikum, saya (${guest?.name || '-'}) ingin mengonfirmasi kehadiran untuk acara ${weddingInfo?.groomName || ''} & ${weddingInfo?.brideName || ''}.`);
  const phone = weddingInfo?.contactPerson || '6281234567890';
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <div ref={ref} className={`rsvp-button-container ${animClass}`}
          style={{ transitionDuration: '1000ms' }}>
      {/* <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rsvp-button"
      >
        Konfirmasi Kehadiran via WhatsApp
      </a> */}
      <button
        className="gift-button"
        type="button"
        onClick={onGiftClick}
        style={{ marginLeft: 16 }}
      >
        🎁 Kirim Hadiah
      </button>
    </div>
  );
};

export default RSVPButton;

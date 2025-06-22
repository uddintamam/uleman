// src/components/RSVPButton.jsx
import React from 'react';
import useSectionAnimation from './useSectionAnimation';

const RSVPButton = ({guest, weddingInfo, gifts }) => {
  const [ref, animClass] = useSectionAnimation({
    delay: 2000,
    direction: 'up',
  });
  
  console.log(gifts);
  

  const [isGiftShow , setIsGiftShow] = React.useState(false);
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
        onClick={() => setIsGiftShow(!isGiftShow)}
        style={{ marginLeft: 16 }}
      >
        Kirim Hadiah
      </button>
      {
        isGiftShow && (
            <div className="gift-card-list">
              {gifts?.map((gift, index) => (
                <div key={index} className="gift-card">
                  <div className="gift-bank">{gift.bankName}</div>
                  <div className="gift-norek">{gift.accountNumber}</div>
                  <div className="gift-name">a.n {gift.accountName}</div>
                </div>
              ))}
            </div>
        )
      }
    </div>
  );
};

export default RSVPButton;

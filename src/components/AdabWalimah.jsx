import React from 'react';
import useSectionAnimation from './useSectionAnimation';
import RSVPButton from './RSVPButton';

const adabList = [
  {
    img: 'https://diinvait.com/wp-content/uploads/2022/01/icon-masjid1.png',
    alt: 'Waktu Shalat',
    desc: 'Perhatikan Waktu Shalat',
  },
  {
    img: 'https://diinvait.com/wp-content/uploads/2022/01/icon-busana1.png',
    alt: 'Busana Sopan',
    desc: 'Berpakaian Sopan & Menutup Aurat',
  },
  {
    img: 'https://diinvait.com/wp-content/uploads/2022/01/icon-makan1.png',
    alt: 'Adab Makan',
    desc: 'Perhatikan Adab Makan & Minum',
  },
  {
    img: 'https://diinvait.com/wp-content/uploads/2022/01/icon-kamera1.png',
    alt: 'Foto Izin',
    desc: 'Tidak Mengambil Foto Tanpa Izin',
  },
  {
    img: 'https://diinvait.com/wp-content/uploads/2022/02/Adab-walimah-1.png',
    alt: 'Ikhtilat',
    desc: 'Hindari Ikhtilat',
  },
  {
    img: 'https://diinvait.com/wp-content/uploads/2022/01/icon-doa1.png',
    alt: 'Doa Mempelai',
    desc: "Mendo'akan Kedua Mempelai",
  },
];

const AdabWalimah = ({ onGiftClick, guest, weddingInfo }) => {
  const [refDescription, animDescription] = useSectionAnimation({
    delay: 0,
    direction: 'up',
  });

  // Buat animasi terpisah untuk tiap profile
  const adabs = adabList.map((_, idx) =>
    useSectionAnimation({
      delay: 150 + idx * 400, // animasi berurutan
      direction: 'up',
    })
  );

  return (
    <section className={`adab-walimah-section`}>
      <div className="adab-container">
        <h2 ref={refDescription} className={`adab-title ${animDescription}`}
          style={{ transitionDuration: '1000ms' }}>Adab Menghadiri Walimah</h2>
        <div className="adab-grid">
          {adabList.map((item, index) => {
            const [ref, anim] = adabs[index];
            return(
            <div 
                ref={ref}
                key={index} className={`adab-item ${anim}`}
                style={{ transitionDuration: '1500ms' }}>
              <img src={item.img} alt={item.alt} className="adab-icon" />
              <p className="adab-desc">{item.desc}</p>
            </div>
          )})}
        </div>

        <RSVPButton onGiftClick={onGiftClick} guest={guest} weddingInfo={weddingInfo}/>
      </div>
    </section>
  );
};

export default AdabWalimah;

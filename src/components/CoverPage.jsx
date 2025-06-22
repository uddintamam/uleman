import React, { useState } from 'react';
import { generateCloudinaryUrl } from '../api';


const CoverPage = ({ onOpen, guest, weddingInfo }) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleOpen = () => {
    setFadeOut(true);
    setTimeout(() => {
      onOpen();
    }, 700); // durasi animasi fadeOut
  };

  
  const bgUrl = generateCloudinaryUrl('cover-BG-DG78Gr88_fsyjoq');
  const bgflowerUrl = generateCloudinaryUrl('flower-Cos0fPk-_cjwgua');
  return (
    <section className={`cover-page cover-page-bg${fadeOut ? ' cover-page-fadeout' : ''}`}
      style={{
        backgroundImage: `url(${bgUrl})`,
      }}>

      <div className="cover-page-overlay" />
      <div className="cover-page-content">
        <div className='cover-vertical-layout'>
        <div>
          <h3 className="cover-subtitle" style={{ fontSize: 36 }}>Walimatul 'urs</h3>
          <div className="cover-names-row">
            <span className="cover-names">{weddingInfo?.groomNickName + ' & ' + weddingInfo?.brideNickName}</span>
          </div>
        </div>
        <div>
          <div className="cover-page-content-tag">
            <p className="cover-to">Kepada <br/>
              Yth Bapak/Ibu/Saudara/i
            </p>
              <h3 className="cover-recipient" style={{ fontSize: 20, fontWeight: 600 }} id="kpd">{guest ? (guest.greeting ? guest.greeting + ' ' + guest.name : guest.name) : 'Tamu Undangan'}</h3>
          
            <p className="cover-message">di {guest?.address ?? 'Tempat'}
            </p>
          </div>
          <button className="cover-button" onClick={handleOpen} disabled={fadeOut}>
            <i className="fa fa-envelope"></i> Terima Undangan
          </button>
        </div>

        </div>
       
      </div>
    </section>
  );
};

export default CoverPage;

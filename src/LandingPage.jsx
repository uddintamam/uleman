import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import EventDetails from './components/EventDetails';
import MapEmbed from './components/MapEmbed';
import GuestBook from './components/GuestBook';
import Gallery from './components/Gallery';
import MusicPlayer from './components/MusicPlayer';
import VerseSection from './components/VerseSection';
import GreetingSection from './components/GreetingSection';
import AdabWalimah from './components/AdabWalimah';
import CoverPage from './components/CoverPage';
import BlessingText from './components/BlessingText';
import Footer from './components/Footer';
import QRCodeSection from './components/QRCodeSection';
import './LandingPage.css';
import { getWeddingInfos, getGuestByQrCode, getGuestComments, getStoryBoards, getGifts, generateCloudinaryUrl } from './api';

const LandingPage = () => {
  const [opened, setOpened] = useState(false);
  const [autoPlayMusic, setAutoPlayMusic] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [weddingInfo, setWeddingInfo] = useState(null);
  const [guest, setGuest] = useState(null);
  const [guestComments, setGuestComments] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [storyBoards, setStoryBoards] = useState([]);
  const mainContentRef = useRef(null);
  const footerRef = useRef(null);
  const location = useLocation();
  const [infoPerson, setInfoPerson] = useState([]);
  const [showMusicBtn, setShowMusicBtn] = useState(false);

  const priaPic = generateCloudinaryUrl('pria-pic-CIBPuATV_jbpljg');
  const wanitaPic = generateCloudinaryUrl('wanita-pic-BMF6Psn4_douomg');

  // Cek qrCode di query
  const params = new URLSearchParams(location.search);
  const qrCode = Array.from(params.keys())[0];
  const [notFound, setNotFound] = useState(false);

  // Helper: get all section refs
  const sectionRefs = [
    useRef(null), // HeroSection
    useRef(null), // VerseSection
    useRef(null), // GreetingSection
    useRef(null), // CountdownTimer
    useRef(null), // EventDetails
    useRef(null), // MapEmbed
    useRef(null), // Gallery
    useRef(null), // AdabWalimah
    useRef(null), // RSVPButton
    footerRef     // Footer
  ];

  useEffect(() => {
    let stop = false;
    let animationId;
    function stopScroll() {
      stop = true;
      window.removeEventListener('wheel', stopScroll);
      window.removeEventListener('touchstart', stopScroll);
      window.removeEventListener('mousedown', stopScroll);
      window.removeEventListener('keydown', stopScroll);
    }
    async function scrollSections() {
      for (let i = 0; i < sectionRefs.length; i++) {
        if (stop) break;
        const ref = sectionRefs[i];
        if (ref.current) {
          await new Promise(resolve => {
            const targetY = ref.current.getBoundingClientRect().top + window.scrollY - 20;
            const startY = window.scrollY;
            const distance = targetY - startY;
            const duration = 4200;
            let start;
            function step(timestamp) {
              if (!start) start = timestamp;
              const progress = Math.min((timestamp - start) / duration, 1);
              if (!stop) {
                window.scrollTo(0, startY + distance * progress);
                if (progress < 1) {
                  animationId = window.requestAnimationFrame(step);
                } else {
                  setTimeout(resolve, 800); // jeda antar section diperpanjang
                }
              } else {
                resolve();
              }
            }
            animationId = window.requestAnimationFrame(step);
          });
        }
      }
    }
    if (opened) {
      window.addEventListener('wheel', stopScroll, { passive: true });
      window.addEventListener('touchstart', stopScroll, { passive: true });
      window.addEventListener('mousedown', stopScroll, { passive: true });
      window.addEventListener('keydown', stopScroll, { passive: true });
      setTimeout(scrollSections, 700);
    }
    return () => {
      window.removeEventListener('wheel', stopScroll);
      window.removeEventListener('touchstart', stopScroll);
      window.removeEventListener('mousedown', stopScroll);
      window.removeEventListener('keydown', stopScroll);
      if (animationId) window.cancelAnimationFrame(animationId);
    };
  }, [opened]);

  useEffect(() => {
    // Ambil wedding info
    if (qrCode) {
      getGuestByQrCode(qrCode).then(g => {
        setGuest(g);
        // Ambil komentar berdasarkan userId dari guest
        if (g?.userId) {
          getGuestComments(g.userId).then(setGuestComments);
          getStoryBoards(g.userId).then(data => {
            setStoryBoards(data);
          });
          getGifts(g.userId).then(setGifts);
          getWeddingInfos(g.userId).then(data => {setWeddingInfo(data[0] || null)
          setInfoPerson([{
                pic: priaPic,
                name: data[0]?.groomName,
                order: data[0]?.groomBirthOrder,
                father: data[0]?.fatherGroomName,
                mother: data[0]?.motherGroomName
              }, {
                pic: wanitaPic,
                name: data[0]?.brideName,
                order: data[0]?.brideBirthOrder,
                father: data[0]?.fatherBrideName,
                mother: data[0]?.motherBrideName
              }]);


          });
        } else {
          setGuestComments([]);
          setWeddingInfo(null);
          setStoryBoards([]);
          getGifts([]);
        }
        
      }).catch(() => setNotFound(true));
    } else {
      setNotFound(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (weddingInfo?.groomNickName && weddingInfo?.brideNickName) {
      document.title = `Undangan pernikahan ${weddingInfo.groomNickName} & ${weddingInfo.brideNickName}`;
    } else {
      document.title = 'Undangan Pernikahan';
    }
  }, [weddingInfo]);

  if (notFound) {
    return (
      <div style={{textAlign:'center',marginTop:80}}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>QR Code tidak ditemukan atau tidak valid.</p>
      </div>
    );
  }

  const LoadingPage = () => {
    return (
      <div className="loading-wrapper">
        <img src="/modeen.png" alt="Loading" className="loading-icon" />
        <p className="loading-text">Memuat undangan...</p>
      </div>
    );
  };
 const PageReady = () => {
    return (
      <div className="app-container">
        {!opened ? (
          <CoverPage onOpen={() => { setOpened(true); setAutoPlayMusic(true); }} guest={guest} weddingInfo={weddingInfo} />
        ) : (
          <>
            <div ref={mainContentRef}>
              <section ref={sectionRefs[0]}><HeroSection weddingInfo={weddingInfo} guest={guest} /></section>
              <section ref={sectionRefs[1]}><VerseSection weddingInfo={weddingInfo} /></section>
              <section ref={sectionRefs[2]}><GreetingSection guest={guest} infoPerson={infoPerson}/></section>
              <section ref={sectionRefs[3]}><EventDetails weddingInfo={weddingInfo} targetDate={weddingInfo?.date} /></section>
              <section ref={sectionRefs[4]}><MapEmbed weddingInfo={weddingInfo} /></section>
              <section><QRCodeSection value={guest?.qrCode || ""} /></section>
              <section ref={sectionRefs[5]}><Gallery storyBoards={storyBoards} /></section>
              <section ref={sectionRefs[6]}><AdabWalimah onGiftClick={() => setShowGiftModal(true)} guest={guest} /></section>
              <section ref={sectionRefs[7]}><GuestBook guest={guest} guestComments={guestComments} /></section>
              <section ref={sectionRefs[8]}><BlessingText weddingInfo={weddingInfo} /></section>
              <section ref={footerRef}><Footer weddingInfo={weddingInfo} /></section>
            </div>
            
            {showGiftModal && (
              <div
                className="gift-modal-overlay"
                style={{ zIndex: 2147483647, position: 'fixed' }}
                onClick={() => setShowGiftModal(false)}
              >
                <div
                  className="gift-modal"
                  style={{ zIndex: 2147483647, position: 'relative' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="gift-modal-close"
                    onClick={() => setShowGiftModal(false)}
                    aria-label="Tutup"
                  >
                    &times;
                  </button>

                  <h3 className="gift-modal-title">Kirim Hadiah</h3>

                  <div className="gift-card-list">
                    {gifts?.map((gift, index) => (
                      <div key={index} className="gift-card">
                        <div className="gift-bank">{gift.bankName}</div>
                        <div className="gift-norek">{gift.accountNumber}</div>
                        <div className="gift-name">a.n {gift.accountName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
          <MusicPlayer
            autoPlay={autoPlayMusic}
            style={{ display: opened ? 'block' : 'none' }}
          />
      </div>
    );
  };

  return (
    <>
      {
        weddingInfo ? (<PageReady/>) : (<LoadingPage/>)
      }
    </>
  )
};

export default LandingPage;

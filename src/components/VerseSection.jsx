import React from 'react';
import useSectionAnimation from './useSectionAnimation';

const VerseSection = () => {
  const [refAyat, animAyat] = useSectionAnimation({
    delay: 0,
    direction: 'blur',
  });

  const [refNoAyat, animNoAyat] = useSectionAnimation({
    delay: 1000,
    direction: 'up',
  });
  return (
  <section className={`verse-section`}>
  <div className="verse-overlay" />
  <div className="verse-content">
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
    <h3 ref={refNoAyat} className={`verse-source ${animNoAyat}`}
        style={{ transitionDuration: '1000ms' }} >QS. Ar-Rum Ayat 21</h3>
  </div>
</section>
  );
};

export default VerseSection;

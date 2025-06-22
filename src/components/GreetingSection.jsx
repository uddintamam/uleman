import { generateCloudinaryUrl } from "../api";
import useSectionAnimation from "./useSectionAnimation";

const GreetingSection = ({ guest, infoPerson }) => {
    const bgRightUrl = generateCloudinaryUrl('hero-bg-left-C9B78PQK_tmppjp', {
    effect: 'grayscale',
    colorize: 100,
    color: 'brown',
  });
    const bgLeftUrl = generateCloudinaryUrl('hero-bg-right-B2cD6PeK_cjrt7h', {
    effect: 'grayscale',
    colorize: 100,
    color: 'brown',
  });

  
  
  const [refbgLeft, animBgLeft, showWavingLeft] = useSectionAnimation({
    delay: 0,
    direction: 'left',
  });

  const [refbgRight, animBgRight, showWavingRight] = useSectionAnimation({
    delay: 0,
    direction: 'right',
  });

  const [refBismillah, animBismillah] = useSectionAnimation({
    delay: 0,
    direction: 'up',
  });

  const [refSalam, animSalam] = useSectionAnimation({
    delay: 500,
    direction: 'up',
  });

  const [refDescription, animDescription] = useSectionAnimation({
    delay: 1000,
    direction: 'up',
  });

  // Buat animasi terpisah untuk tiap profile
  const greetingProfiles = infoPerson.map((_, idx) =>
    useSectionAnimation({
      delay: 150 + idx * 400, // animasi berurutan
      direction: 'blur',
    })
  );

  return (
    <section className={`greeting-section`}>
      <div className="greeting-container">
        <img
          ref={refBismillah}
          src="https://diinvait.com/wp-content/uploads/2021/10/png-bismillah-1024x374.png"
          alt="Bismillah"
          className={`greeting-bismillah ${animBismillah}`}
          style={{ transitionDuration: '1000ms' }}
        />
        <div
          ref={refSalam}
          className={`greeting-title ${animSalam}`}
          style={{ transitionDuration: '1000ms' }}
        >
          Assalamu'alaikum <br /> Warahmatullahi Wabarakatuh
        </div>

        <div
          ref={refDescription}
          className={`greeting-description ${animDescription}`}
          style={{ transitionDuration: '1000ms' }}
        >
          Tanpa mengurangi rasa hormat. Kami mengundang{' '}
          {guest ? (guest.greeting ? guest.greeting + ' ' + guest.name : guest.name) : 'Bapak/Ibu/Saudara/i'} serta kerabat sekalian untuk menghadiri acara pernikahan kami:
        </div>

        <div className="greeting-profile-wrapper">
          {infoPerson.map((story, idx) => {
            const [ref, anim] = greetingProfiles[idx];
            return (
              <div
                key={idx}
                ref={ref}
                className={`greeting-profile ${anim}`}
                style={{ transitionDuration: '1500ms' }}
              >
                <img
                  src={story.pic}
                  alt={story.name || 'Mempelai Pria'}
                  className="greeting-profile-image"
                />
                <div className="greeting-family">
                  <h3 className="greeting-family-name">{story.name}</h3>
                  <p className="greeting-family-desc">
                    <b>Anak ke-{story.order || ''} dari</b>
                    <br />
                    {story.father}
                    <br />
                    dan
                    <br />
                    {story.mother}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    <img
      ref={refbgLeft}
      src={bgRightUrl}
      alt="left decoration"
      className={`event-detail-bg event-detail-bg-left ${animBgRight} `}
      loading="lazy"
      style={{ transitionDuration: '1500ms' }}
    />
    <img 
      ref={refbgRight}
      src={bgLeftUrl} 
      alt="right decoration" 
      className={`event-detail-bg event-detail-bg-right ${animBgLeft} `} 
      style={{ transitionDuration: '1500ms' }}
      />
    </section>
  );
};



export default GreetingSection;
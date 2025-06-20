import useSectionAnimation from "./useSectionAnimation";

const GreetingSection = ({ guest, infoPerson }) => {
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
    </section>
  );
};



export default GreetingSection;
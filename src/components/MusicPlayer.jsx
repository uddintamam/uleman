// src/components/MusicPlayer.jsx
import React, { useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { generateCloudinaryUrl } from '../api';
// import Naseed from '../music/Nasheed.mp3';

const MusicPlayer = ({ autoPlay = false }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = React.useState(false);

  const Naseed = 'https://res.cloudinary.com/dpysdqing/video/upload/v1750306370/Nasheed-DD2DhXj5_yjjf2x.mp3';
  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
    }
  }, [autoPlay]);

  return (
    <div className="music-player-container">
      <audio ref={audioRef} loop src={Naseed} />
      <button
        onClick={togglePlay}
        className="music-player-button"
      >
        {playing ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  );
};

export default MusicPlayer;
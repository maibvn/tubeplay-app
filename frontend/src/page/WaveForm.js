// Waveform.js
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveForm = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "violet",
      progressColor: "purple",
      height: 128,
    });

    wavesurferRef.current.load(audioUrl);

    return () => {
      wavesurferRef.current.destroy();
    };
  }, [audioUrl]);

  const play = () => {
    wavesurferRef.current.play();
  };

  const pause = () => {
    wavesurferRef.current.pause();
  };

  return (
    <div>
      <div ref={waveformRef}></div>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
};

export default WaveForm;

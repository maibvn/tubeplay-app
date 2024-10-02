// // // Waveform.js
// // import React, { useEffect, useRef } from "react";
// // import WaveSurfer from "wavesurfer.js";

// // const WaveForm = ({ audioUrl }) => {
// //   const waveformRef = useRef(null);
// //   const wavesurferRef = useRef(null);

// //   useEffect(() => {
// //     wavesurferRef.current = WaveSurfer.create({
// //       container: waveformRef.current,
// //       waveColor: "violet",
// //       progressColor: "purple",
// //       height: 128,
// //     });

// //     wavesurferRef.current.load(audioUrl);

// //     return () => {
// //       wavesurferRef.current.destroy();
// //     };
// //   }, [audioUrl]);

// //   const play = () => {
// //     wavesurferRef.current.play();
// //   };

// //   const pause = () => {
// //     wavesurferRef.current.pause();
// //   };

// //   return (
// //     <div>
// //       <div ref={waveformRef}></div>
// //       <button onClick={play}>Play</button>
// //       <button onClick={pause}>Pause</button>
// //     </div>
// //   );
// // };

// // export default WaveForm;

// import React, { useEffect, useRef, useState } from 'react';
// import WaveSurfer from 'wavesurfer.js';

// const SimpleWaveSurfer = () => {
//   const wavesurferRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     // Initialize Wavesurfer instance
//     wavesurferRef.current = WaveSurfer.create({
//       container: '#waveform', // ID of the element to contain the waveform
//       waveColor: '#D9DCFF',
//       progressColor: '#4353FF',
//       barWidth: 2,
//       cursorWidth: 1,
//       height: 100,
//       normalize: true,
//     });

//     // Load the audio file into Wavesurfer
//     wavesurferRef.current.load('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // You can replace this with your own audio file URL

//     return () => {
//       // Cleanup the Wavesurfer instance when component is unmounted
//       if (wavesurferRef.current) {
//         wavesurferRef.current.destroy();
//       }
//     };
//   }, []);

//   const handlePlayPause = () => {
//     if (wavesurferRef.current) {
//       wavesurferRef.current.playPause(); // Play or pause the audio
//       setIsPlaying(!isPlaying); // Toggle the state
//     }
//   };

//   return (
//     <div>
//       <div id="waveform"></div> {/* This is where the waveform will render */}
//       <button onClick={handlePlayPause} className="btn btn-primary mt-3">
//         {isPlaying ? 'Pause' : 'Play'}
//       </button>
//     </div>
//   );
// };

// export default SimpleWaveSurfer;

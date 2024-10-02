// import React, { useEffect, useState } from 'react';

// const AudioPlayer = () => {
// // const AudioPlayer = ({songs}) => {
//   const [audioList, setAudioList] = useState([
//     {
//         title: "Ida Corr - Let Me Think About It (Radio Edit)",
//         ytUrl: "https://www.youtube.com/watch?v=X5SIQkVlB4Q",
//         dropboxUrl: "https://www.dropbox.com/scl/fi/e0jr9blol25irilx06p9n/123-Ida-Corr-Let-Me-Think-About-It-Radio-Edit.mp3?rlkey=6s4ctl5n1mls2bm55zoq4qhps&dl=1",
//         thumbnail: {
//             "url": "https://i.ytimg.com/vi/X5SIQkVlB4Q/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAH4ReLrHn6t10jG2TJufNyLEqPzw",
//             "width": 336,
//             "height": 188
//         },
//         playing: false,
//       },
//       {
//         title: "Who Da Funk - Shiny Disco Balls (Main Mix - Tony Mendes Video Re Edit)",
//         ytUrl: "https://www.youtube.com/watch?v=7FWur2zMjFo",
//         dropboxUrl: "https://www.dropbox.com/scl/fi/7szekmas2wwm9o64idhxs/123-Who-Da-Funk-Shiny-Disco-Balls-Main-Mix-Tony-Mendes-Video-Re-Edit.mp3?rlkey=lq84fz68m24d0egxxn8eyr6pr&dl=1",
//         thumbnail: {
//           "url": "https://i.ytimg.com/vi/7FWur2zMjFo/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDkPye4DYuy7jILRbS-e-RJPUqvzA",
//           "width": 336,
//           "height": 188
//         },
//         playing: false,
//     }
//   ]);



//   const togglePlay = (index) => {
//     setAudioList((prevList) =>
//       prevList.map((audio, idx) =>
//         idx === index ? { ...audio, playing: !audio.playing } : audio
//       )
//     );
//   };

//   return (
//     <div>
//       {audioList.map((audio, index) => (
//         <div key={audio.title}>
//           <audio
//             src={audio.dropboxUrl}
//             controls
//             autoPlay={audio.playing}
//             onEnded={() => togglePlay(index)} // Automatically toggle play status on end
//           />
//           {/* <button onClick={() => togglePlay(audio.id)}>
//             {audio.playing ? 'Pause' : 'Play'}
//           </button> */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AudioPlayer;

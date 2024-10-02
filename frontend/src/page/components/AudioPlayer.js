// import React, { useState, useRef } from "react";
// import ReactHowler from "react-howler";

// const temp =
//   "https://dl.dropboxusercontent.com/s/p9xs2zmvg2rtqo2/DMPAuth%20-%208-Bit%20-%201UP%20-%209%20-%20G.mp3";

// // const AudioPlayer = ({ playlist }) => {
// const AudioPlayer = ({ songs }) => {
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const playerRef = useRef(null);
//   const playlist = [
//     {
//       title: "Ida Corr - Let Me Think About It (Radio Edit)",
//       ytUrl: "https://www.youtube.com/watch?v=X5SIQkVlB4Q",
//       dropboxUrl:
//         "https://www.dropbox.com/scl/fi/e0jr9blol25irilx06p9n/123-Ida-Corr-Let-Me-Think-About-It-Radio-Edit.mp3?rlkey=6s4ctl5n1mls2bm55zoq4qhps&dl=1",
//       thumbnail: {
//         url: "https://i.ytimg.com/vi/X5SIQkVlB4Q/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAH4ReLrHn6t10jG2TJufNyLEqPzw",
//         width: 336,
//         height: 188,
//       },
//     },
//     {
//       title:
//         "Who Da Funk - Shiny Disco Balls (Main Mix - Tony Mendes Video Re Edit)",
//       ytUrl: "https://www.youtube.com/watch?v=7FWur2zMjFo",
//       dropboxUrl:
//         "https://www.dropbox.com/scl/fi/7szekmas2wwm9o64idhxs/123-Who-Da-Funk-Shiny-Disco-Balls-Main-Mix-Tony-Mendes-Video-Re-Edit.mp3?rlkey=lq84fz68m24d0egxxn8eyr6pr&dl=1",
//       thumbnail: {
//         url: "https://i.ytimg.com/vi/7FWur2zMjFo/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDkPye4DYuy7jILRbS-e-RJPUqvzA",
//         width: 336,
//         height: 188,
//       },
//     },
//   ];
//   const handleEnd = () => {
//     setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
//   };
//   // const dropboxUrl = `${
//   //   process.env.REACT_APP_API_DOMAIN
//   // }/proxy?url=${encodeURIComponent(playlist[currentTrackIndex].dropboxUrl)}`;

//   const url = playlist[currentTrackIndex].dropboxUrl;
//   // const dropboxUrl = `${
//   //   process.env.REACT_APP_API_DOMAIN
//   // }/proxy?url=${encodeURIComponent(url)}`;
//   console.log(url);
//   return (
//     <div>
//       <ReactHowler
//         // src="https://www.dropbox.com/scl/fi/yg1ski9dfpzlaek6igam5/Ida-Corr-Let-Me-Think-About-It-Radio-Edit.mp3?dl=1"
//         // src={url}
//         src="https://www.dropbox.com/scl/fi/e0jr9blol25irilx06p9n/123-Ida-Corr-Let-Me-Think-About-It-Radio-Edit.mp3?rlkey=6s4ctl5n1mls2bm55zoq4qhps&dl=1"
//         html5={true}
//         playing={true}
//         onEnd={handleEnd}
//         ref={playerRef}
//         onError={(id, msg) => console.log("Error loading audio:", id, msg)}
//       />
//       <div>
//         <img
//           src={playlist[currentTrackIndex].thumbnail.url}
//           alt={playlist[currentTrackIndex].title}
//           width={playlist[currentTrackIndex].thumbnail.width}
//           height={playlist[currentTrackIndex].thumbnail.height}
//         />
//         <h3>{playlist[currentTrackIndex].title}</h3>
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;

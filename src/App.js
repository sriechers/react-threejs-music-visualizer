import { useState } from 'react'
import ThreeCanvas from "./components/ThreeCanvas"
import FiberCanvas from "./components/FiberCanvas"
import Player from "./components/Player"
import TracklistData from './tracklistData.json'
import TestAudio from "./music/test.wav"

function App() {  
  const [ playing, setPlaying ] = useState(false)
  return (
    <div className="App">
      <Player currentTrack={TracklistData} currentSongUrl={TestAudio}/>
      {/* <ThreeCanvas playing={playing} audioFile={TestAudio}/> */}
      <FiberCanvas/>
    </div> 
  );
}

export default App;

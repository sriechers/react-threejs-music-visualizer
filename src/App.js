import FiberCanvas from "./components/FiberCanvas"
import Player from "./components/Player"
import AudioContextProvider from "./contexts/AudioContext"

function App() {  
  return (
    <div className="App">
      <AudioContextProvider>     
        <Player/>
        <FiberCanvas/>
      </AudioContextProvider>
    </div> 
  );
}

export default App;

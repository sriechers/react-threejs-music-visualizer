import Player from "./Player"
import TracklistData from '../tracklistData.json'

function Controls() {
  return (
    <div>
      <Player currentTrack={TracklistData}/>
    </div>
  )
}

export default Controls

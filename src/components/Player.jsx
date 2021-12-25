import { useContext, useEffect } from 'react'
import { PlayIcon, PauseIcon, FastForwardIcon } from '@heroicons/react/solid'
import { audioContext } from '../contexts/AudioContext'

function Player() {
  const { currentTrack, tracklist, setCurrentTrack, playing, setPlaying } = useContext(audioContext)
  console.log(currentTrack)
  const playSong = () => {
    setPlaying(!playing)
    // typeof onPlay === 'function' && onPlay();
  }

  const prevSong = () => {
    setPlaying(false)
    const currId = tracklist.indexOf(currentTrack);
    // loop around if first track
    const newTrackId = currId - 1 >= 0 ? currId - 1 : tracklist.length - 1
    setCurrentTrack(tracklist[newTrackId])
  }

  const nextSong = () => {
    setPlaying(false)
    const currId = tracklist.indexOf(currentTrack);
    // loop around if last track
    const newTrackId = currId + 1 <= tracklist.length - 1 ? currId + 1 : 0
    setCurrentTrack(tracklist[newTrackId])
  }

  return (
    <div className="fixed bottom-0 left-0 w-full py-6 px-8 z-50 bg-black text-gray-100 border-t-2 border-dark-gray flex justify-between items-center">
      <div className="flex justify-between items-center">
        <figure className="h-12 w-12 relative"> 
          <img className="object-cover absolute" src={process.env.PUBLIC_URL+currentTrack.img.src}  alt={`${currentTrack.title}`}/>
          <figcaption className="sr-only">
            {`Cover of ${currentTrack.title} by ${currentTrack.artist}`}
          </figcaption>
        </figure>
        <div className="pl-5">
          <p className="text-white font-bold tracking-wide lg:text-lg text-base">{currentTrack.title}</p>
          <p className="text-white font-light tracking-wide lg:text-sm text-xs mt-1">{currentTrack.artist}</p>
        </div>
      </div>
      <div className="flex justify-between items-center w-38">
        <button title="previous song" className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-full bg-black" onClick={()=>prevSong()}>
          <FastForwardIcon className="h-3/5 w-3/5 text-white transform rotate-180"/> 
        </button>
        <button title="play song" className="cursor-pointer group flex justify-center items-center h-10 w-10 rounded-full bg-black" onClick={()=>playSong()}>
          {playing ? 
          <PauseIcon className="group-hover:scale-105 transform scale-100 transition duration-150 ease-out h-full w-full text-white"/>
          :
          <PlayIcon className="group-hover:scale-105 transform scale-100 transition duration-150 ease-out h-full w-full text-white"/> 
          }
          
        </button>
        <button title="next song" className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-full bg-black" onClick={()=>nextSong()}>
          <FastForwardIcon className="h-3/5 w-3/5 text-white"/> 
        </button>
      </div>
    </div>
  ) 
}

export default Player

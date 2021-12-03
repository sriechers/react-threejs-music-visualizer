import { PlayIcon, FastForwardIcon } from '@heroicons/react/solid'
function Player({ currentTrack }) {
  const playSong = () => {
    console.log("play")
  }

  const prevSong = () => {

  }

  const nextSong = () => {

  }

  return (
    <div className="fixed bottom-0 left-0 w-full py-6 px-8 z-50 bg-black text-gray-100 border-t-2 border-dark-gray flex justify-between items-center">
      <div className="flex justify-between items-center">
        <figure className="h-12 w-12 relative"> 
          <img className="h-full w-full object-cover absolute" src={currentTrack[0].img.src}  alt={`${currentTrack[0].title}`}/>
          <figcaption className="sr-only">
            {`Cover of ${currentTrack[0].title} by ${currentTrack[0].artist}`}
          </figcaption>
        </figure>
        <div className="pl-5">
          <p className="text-white font-bold tracking-wide text-lg">{currentTrack[0].title}</p>
          <p className="text-white tracking-wide text-sm">{currentTrack[0].artist}</p>
        </div>
      </div>
      <div className="flex justify-between items-center w-38">
        <button title="previous song" className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-full bg-black" onClick={()=>prevSong()}>
          <FastForwardIcon className="h-3/5 w-3/5 text-white transform rotate-180"/> 
        </button>
        <button title="play song" className="cursor-pointer group flex justify-center items-center h-10 w-10 rounded-full bg-black" onClick={()=>playSong()}>
          <PlayIcon className="group-hover:scale-105 transform scale-100 transition duration-150 ease-out h-full w-full text-white"/> 
        </button>
        <button title="next song" className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-full bg-black" onClick={()=>nextSong()}>
          <FastForwardIcon className="h-3/5 w-3/5 text-white"/> 
        </button>
      </div>
    </div>
  ) 
}

export default Player

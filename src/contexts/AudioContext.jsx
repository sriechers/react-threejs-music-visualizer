import React, { useState, useEffect, useCallback, useContext  } from 'react'
import tracklistData from '../tracklistData.json'

export const audioContext = React.createContext({
  tracklist: tracklistData,
  currentTrack: tracklistData[0],
  playing: false,
  setPlaying: () => {},
  setCurrentTrack: () => {}
})

export const useAudio = ({
  url = false,
  fftSize = 2048,
  smoothingTimeConstant = 0.75,
  loop = false,
  volume = 1,
}) => {
  const { playing, setPlaying, currentTrack } = useContext(audioContext)
  const [ audioUrl, setUrl ] = useState(url || currentTrack.songUrl)
  const [ audio, setAudio ] = useState();
  const [ audioCtx, setAudioCtx ] = useState(null);
  const [ data, setData ] = useState(null);
  const [ $analyser, setAnalyser ] = useState(null);

  const initAudioCtx = useCallback(() => {
    const audioFile = new Audio(process.env.PUBLIC_URL+audioUrl);
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioFile);
    const _analyser = audioContext.createAnalyser();
    _analyser.fftSize = fftSize;
    _analyser.smoothingTimeConstant = smoothingTimeConstant;
    // _analyser.minDecibels = minDecibel;
    // _analyser.maxDecibels = maxDecibel;
    // audioFile.src = url;
    audioFile.loop = loop;
    audioFile.volume = volume;
    source.connect(audioContext.destination);
    source.connect(_analyser);

    setAudio(audioFile);
    setAudioCtx(audioContext);
    setAnalyser(_analyser);

    return { audioFile, _analyser };
  }, [audioUrl]);

  useEffect(() => {
    setPlaying(false)
    setUrl(() => currentTrack.songUrl)
  }, [currentTrack])

  const getFrequencyData = (analyser) => {
    const bufferLength = analyser.frequencyBinCount;
    const amplitudeArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(amplitudeArray);
    return amplitudeArray;
  };

  useEffect(() => {
    return () => audioCtx?.close();
  }, []);

  const toggle = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    if (playing) {
      const { audioFile, _analyser } = initAudioCtx()
      audioFile.play();
      setData(getFrequencyData(_analyser));
    } else {
      audio?.pause();
    }
  }, [playing])

  useEffect(() => {
    if (!audio) return;
    audio.addEventListener("ended", toggle);
    return () => {
      audioCtx?.close()
      audio.removeEventListener("ended", toggle);
    };
  }, [audio]);

  return { playing, setUrl, data, analyser: $analyser, toggle };
};



function AudioContextProvider({children}) {
  const { setUrl } = useAudio({ url: tracklistData[0].songUrl })
  const setPlaying = (playing) => setState({...state, playing: playing})
  const setCurrentTrack = (currentTrack) => {
    setState({...state, currentTrack: currentTrack})
    setUrl(currentTrack.songUrl)
  }
  
  const [ state, setState ] = useState({
    tracklist: tracklistData,
    currentTrack: tracklistData[0],
    playing: false
  });
  
  // memorize State to avoid useless rerendering of child components
  const value = React.useMemo(
    () => ({
      ...state,
      setPlaying,
      setCurrentTrack
    }),
    [state]
  );

  return (
    <audioContext.Provider value={value}>
      {children}
    </audioContext.Provider>
  )
}

export default AudioContextProvider


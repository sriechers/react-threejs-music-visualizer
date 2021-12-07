import { useState, useEffect, useCallback } from "react";

const useAudio = (url, loop = false, fftSize = 2048) => {
  const [ audio ] = useState(new Audio(url));
  const [ playing, setPlaying ] = useState(false);
  const [ analyser, setAnalyser ] = useState(null);
  const [ dataArray, setDataArray] = useState(null);

  const createAnalyser = useCallback(() => {
    const audioCtx = new AudioContext();
    setAnalyser(audioCtx.createAnalyser());
    analyser.fftSize = fftSize;
    audio.loop = loop;
    audio.volume = 1;

    let source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    setDataArray(new Uint8Array(analyser.frequencyBinCount))
  }, [])

  // useEffect(() => {
  //   setDataArray(new Uint8Array(analyser.frequencyBinCount))
  // }, [analyser?.frequencyBinCount])

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    let interval;
    const getAudioBuffer = () => setDataArray(new Uint8Array(analyser.frequencyBinCount))
    
    if(playing){
      audio.play()
      interval = setInterval(getAudioBuffer, 50);
    } else {
      audio.pause()
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [playing, audio] );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return { playing, dataArray, toggle };
};

export default useAudio;
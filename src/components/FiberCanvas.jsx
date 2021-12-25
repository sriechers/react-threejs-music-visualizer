import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import glowingNoiseShaderMaterial from '../shaders/glowingNoiseShaderMaterial'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
// import { useAudioPlayer } from "react-use-audio-player"
import { useAudio } from '../contexts/AudioContext'

extend({ UnrealBloomPass, FilmPass, FXAAShader, RenderPass, ShaderPass })

function AudioSphere({ audioData, analyser, playing }) {
  const ref = useRef()
  const { size } = useThree()
  const frequencyBandArray = [...Array(100).keys()]

  useFrame((state, delta) => {
    let time = state.clock.elapsedTime;
    ref.current.material.uniforms.u_time.value = time;
    ref.current.material.uniforms.u_mouse.value = new THREE.Vector2(state.mouse.x + delta, state.mouse.y + delta);
    ref.current.material.uniforms.u_resolution.value = new THREE.Vector2(size.width, size.height);
    ref.current.rotation.y = time / 20;
    ref.current.rotation.z = time / 45;

    if(playing && audioData) {
      analyser.getByteFrequencyData(audioData)
      ref.current.rotation.x = time / 10;
      ref.current.rotation.y = time / 5;
      ref.current.rotation.z = time / 15;
      for(let i = 0; i < frequencyBandArray.length; i++){
        let num = frequencyBandArray[i]
        let freq = audioData[num];
        ref.current.material.uniforms.u_freq.value = freq;
      }
    }

  })

  return (
    <>
      <mesh 
      ref={ref} 
      >
        <sphereBufferGeometry attach="geometry" args={[100, 200, 200]}/>
        <glowingNoiseShaderMaterial attach="material" color="#203050"/>
        {/* <meshStandardMaterial attach="material" color={'#00ff00'} /> */}
      </mesh>
    </>
  )
}

function Postprocessing({ bloomOptions = [2, 1.0, 1.5, 0], grainOptions = [1, 0, 0, 0]}){
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  useEffect(() => {
    composer.current.setSize(size.width, size.height)
  }, [size])

  useFrame(() => composer.current.render(), 1)

  return (
    <effectComposer ref={composer} args={[gl]}> 
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass attachArray="passes" args={[FXAAShader]} material-uniforms-resolution-value={[1 / size.width, 1 / size.height]} />
      <filmPass attachArray="passes" args={grainOptions}/>
      <unrealBloomPass attachArray="passes" args={bloomOptions}/>
    </effectComposer> 
  )
}

function FiberCanvas() {
    const { playing, analyser, data } = useAudio({url: false})
    return ( 
      <>
      <div className="webgl-canvas">
        <Canvas
        dpr={window.devicePixelRatio}
        colorManagement
        // args={[null, null, 1000]}
        camera={{ position: [0, 230, 0] }}
        onCreated={({gl})=> {
          gl.setClearColor('#000000')
        }}
        >
          <ambientLight intensity={1} />
          {/* <pointLight color="white" intensity={1000} position={[window.innerWidth / 2, window.innerHeight / 2, 230]} /> */}
          <AudioSphere audioData={data} playing={playing} analyser={analyser}/>
          <OrbitControls enableZoom={false} enablePan={false}/>
          <Postprocessing bloomOptions={[2, 1.0, 1.5, 0]}/>
        </Canvas>
      </div>
      </>
    )
}

export default FiberCanvas

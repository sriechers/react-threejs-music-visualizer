import { useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, SMAA, DepthOfField, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction, Resizer, BlurPass, KernelSize } from 'postprocessing'
import glowingNoiseShaderMaterial from '../shaders/glowingNoiseShaderMaterial'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import useAudio from '../hooks/useAudio'

extend({ UnrealBloomPass, FilmPass, FXAAShader, RenderPass, ShaderPass })

function AudioSphere() {
  const ref = useRef()
  const { size } = useThree()
  // const { dataArray } = useAudio();

  useFrame((state, delta) => {
    let time = state.clock.elapsedTime;
    ref.current.material.uniforms.u_time.value = time;
    ref.current.material.uniforms.u_mouse.value = new THREE.Vector2(state.mouse.x + delta, state.mouse.y + delta);
    ref.current.material.uniforms.u_resolution.value = new THREE.Vector2(size.width, size.height);
    ref.current.rotation.y = time / 20;
    ref.current.rotation.z = time / 45;

  })

  return (
    <mesh 
    ref={ref} 
    >
      <sphereBufferGeometry attach="geometry" args={[100, 200, 200]}/>
      <glowingNoiseShaderMaterial attach="material" color="#203050"/>
      {/* <meshStandardMaterial attach="material" color={'#00ff00'} /> */}
    </mesh>
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
    return ( 
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
          {/* <Suspense fallback={null}>
            <EffectComposer>
              <Noise 
                opacity={0.05} 
              />
              <Bloom
                intensity={0.5} // The bloom intensity.
                kernelSize={KernelSize.HUGE} // blur kernel size
                // blurPass={new BlurPass({ height: Resizer.AUTO_SIZE * window.devicePixelRatio, width: Resizer.AUTO_SIZE * window.devicePixelRatio })}
                width={Resizer.AUTO_SIZE} // render width
                height={Resizer.AUTO_SIZE} // render height
                luminanceThreshold={0.01} // luminance threshold. Raise this value to mask out darker elements in the scene.
                luminanceSmoothing={0}
              />
              <ChromaticAberration
                blendFunction={BlendFunction.AVERAGE} // blend mode
                offset={[0.002, 0.002]} // color offset
              />
            </EffectComposer>
          </Suspense> */}
          <ambientLight intensity={1} />
          {/* <pointLight color="white" intensity={1000} position={[window.innerWidth / 2, window.innerHeight / 2, 230]} /> */}
          <AudioSphere />
          <OrbitControls enableZoom={false} enablePan={false}/>
          <Postprocessing bloomOptions={[2, 1.0, 1.5, 0]}/>
        </Canvas>
      </div>
    )
}

export default FiberCanvas

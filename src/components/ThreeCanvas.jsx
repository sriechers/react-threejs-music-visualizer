import { useEffect, useRef } from 'react'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { fragmentShader } from '../shaders/fragmentShader.js' 
import { vertexShader } from '../shaders/vertexShader.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ChromaticAbberationShader } from '../shaders/ChromaticAbberationShader.js';

class ThreeJS_Scene {
    constructor(options){  
        this.time = 0; 
        this.container = options.domEl;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.mouse = new THREE.Vector2();

        this.cameraDistance = 600;
        this.camera = new THREE.PerspectiveCamera( 70, this.width/this.height, 100, 2000 );
        this.camera.position.z = this.cameraDistance;

        // Set Camera FOV (Damit Objekte die korrekte Größe haben => 100px on Screen = 100px in THREE)
        this.camera.fov = 2*Math.atan( (this.height/2) / this.cameraDistance ) * (180/Math.PI);

        this.raycaster = new THREE.Raycaster();

        this.renderer = new THREE.WebGLRenderer( { 
            antialias: true,
            // alpha: true
        } );

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        // this.renderer.getContext().getExtension('OES_standard_derivatives');
        
        this.container.appendChild( this.renderer.domElement );

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        this.composerPass();
        this.addObjects();
        this.resize();
        this.render();

        this.mouseMovement();
        
    }


    composerPass(){
        this.composer = new EffectComposer(this.renderer);
        this.composer.setSize(this.width, this.height);
        this.composer.setPixelRatio( window.devicePixelRatio );
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);

        this.filmPass = new FilmPass(1, 0, 0, 0);
        this.composer.addPass( this.filmPass );

        this.unrealBloomPass = new UnrealBloomPass( this.width / this.height, 1.0, 1.5, 0);
        this.composer.addPass( this.unrealBloomPass );

        this.distortPass = new ShaderPass( ChromaticAbberationShader );
        this.distortPass.material.defines.CHROMA_SAMPLES = 2;
        this.distortPass.material.defines.BAND_MODE = 0;
        this.distortPass.material.needsUpdate = true;
        this.composer.addPass( this.distortPass );

    }


    mouseMovement(){
        window.addEventListener( 'mousemove', (event) => {
            this.mouse.x = ( event.pageX / this.width ) * 2 - 1;
            this.mouse.y = - ( event.pageY / this.height ) * 2 + 1;

            this.uniforms.u_mouse.value = this.mouse;

        }, false );
    }

    setupResize(){
        window.addEventListener('resize',this.resize.bind(this));
    }

    resize(){
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.uniforms.u_resolution.value.x = this.width;
        this.uniforms.u_resolution.value.y = this.height;

        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    addObjects(){
        this.geometry = new THREE.IcosahedronBufferGeometry( 200, 100 )
        this.material = new THREE.MeshNormalMaterial();

        this.uniforms = {
            u_time: { value:0 },
            u_resolution: { value: new THREE.Vector2(this.width, this.height) },
            u_mouse: { value: new THREE.Vector2(0,0) }
        }

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            side: THREE.DoubleSide,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader
        })

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    }

    destroy(){ 
      window.cancelAnimationFrame(this.raf)
      window.removeEventListener('resize', this.resize)

    }

    render(){
        this.time+=0.05;      
        
        this.mesh.rotation.y = this.time / 40;
        this.mesh.rotation.z = this.time / 65;

        this.material.uniforms.u_time.value = this.time;

        this.distortPass.material.uniforms.baseIor.value = 0.9;
        this.distortPass.material.uniforms.bandOffset.value = 0.003;
        this.distortPass.material.uniforms.jitterOffset.value += 0.1;
        this.distortPass.material.uniforms.jitterIntensity.value = 0.2;

        this.composer.render();
        
        this.raf = window.requestAnimationFrame(this.render.bind(this));
    }
}


function ThreeCanvas() {
  // Container ref
  const containerRef = useRef();

  useEffect(()=> {
    let THREE_INSTANCE = new ThreeJS_Scene({
      domEl: containerRef.current,
      vertexShader,
      fragmentShader
    })

    return () => {
      THREE_INSTANCE.destroy()
      THREE_INSTANCE = null;
    }
  }, [])

  return (
    <div ref={containerRef} className="h-screen w-screen"></div>
  )
}

export default ThreeCanvas

import '../css/secPage.css';
import React from 'react';
import * as THREE from 'three';
 
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 
import dna from '../glb/dna.glb';

 

 
let width, height, composer;
let scene,camera,dnaMesh,renderer,canvas,controls,pointlight,wrapper,tanFOV,windowHeight;
let geometry, ctx, material;

var clock = new THREE.Clock();
let time = 0;
let settings = {
  progress:0
}


// var scrollTime = 0.7;			//Scroll time
// var scrollDistance = 170;	


class secondPage extends React.Component {

  
  componentDidMount() {
   let self = this;

  //  document.querySelector('.sec_wrap_cont').addEventListener('wheel', (e) => this.secScroll(e));

  window.addEventListener('resize', () => this.resize());

  
    function init() {
      // let canvas = wrapper.getElementsByTagName('canvas')[0];
      // let canvBound = wrapper.getBoundingClientRect()
      
      //  let canvBound = wrapper.getBoundingClientRect();
      
      // canvas.width = 100;
      // canvas.height = 100;
      // canvas.style.display = 'block';
      // canvas.style.width = window.innerWidth;
      // canvas.style.height = window.innerHeight;
      
      
      
      // Create scene
        scene = new THREE.Scene();
      
        renderer = new THREE.WebGLRenderer();

        wrapper = document.querySelector('.secwr_cont_canvas');
        width = wrapper.offsetWidth;
        height = wrapper.offsetHeight;

        renderer.setPixelRatio(window.devicePixelRadio, 2); // set extra quality
        renderer.setSize(width ,height);
        // For better quality
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMappingExposure = 1.25;
        renderer.physicallyCorrectLights = true;
        renderer.setClearColor(0x000, 1);
        

        let loader = new GLTFLoader();
        let dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
        loader.setDRACOLoader(dracoLoader);
        

        wrapper.appendChild(renderer.domElement);
 
        // Set camera
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(0,0,10);
       

        // Controlling the object
        // controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableZoom = false;
        // controls.enablePan = false;
        // controls.autoRotate = false;
        // controls.autoRotateSpeed = 1.5;
        // controls.enableDamping = false;

        // GUI

        loader.load(dna, (glb) => {
           geometry = glb.scene.children[0].geometry;
           geometry.center();
           
          addObjects();
 
          animate();
          self.resize();
        
        })
         
        
      }
 

      function addObjects() {
     

        material = new THREE.ShaderMaterial( {
          extensions: {
            derivatives: "#extension GL_0ES_standard_derivatives : enable"
          },
          side: THREE.DoubleSide,
         uniforms: {
           time: {value: 0},
           progress: {value: 15},
           uColor1: { value: new THREE.Color('rgba(74, 128, 209, 0.89)') },
          //  uColor2: { value: new THREE.Color('rgb(29, 49, 93)') },
           uColor3: { value: new THREE.Color('rgb(16, 71, 85)')},
           resolution: { value : new THREE.Vector4()}
         },
         transparent: true,
         vertexShader: document.getElementById('vertexShader').textContent,
         fragmentShader: document.getElementById('fragmentShader').textContent,

         depthTest: false, 
         depthWrite: false,
         blending: THREE.AdditiveBlending
       });

        self.number = geometry.attributes.position.array.length;
        
        let positions = new Float32Array(self.number);
        let randoms = new Float32Array(self.number/3);
        let colorRandoms = new Float32Array(self.number/3);
        let dnaOffset = new Float32Array(self.number/3);

        for(let i=0; i<self.number/3; i++) {
          randoms.set([Math.random()],i);
          colorRandoms.set([Math.random()],i);
          dnaOffset.set([Math.random()],i);

          let theta = 0.002*Math.PI*2*(Math.floor(1/100));
          let radius = 0.03*((1%100) - 50);

          let x = radius*Math.cos(theta);
          let y = 0.01*(Math.floor(1/100)) - 2;
          let z = radius*Math.sin(theta);

          positions.set([x,y,z],i*3);
        }

        geometry.setAttribute('randoms', new THREE.BufferAttribute(randoms,1));
        geometry.setAttribute('colorRandoms', new THREE.BufferAttribute(colorRandoms,1));
        geometry.setAttribute('offset', new THREE.BufferAttribute(dnaOffset,1));

        dnaMesh = new THREE.Points( geometry, material );
    
        dnaMesh.position.y = -3;
        dnaMesh.position.x = -2;
     
        scene.add(dnaMesh);

  
      }

 
      
      function animate() {
 
       time += 0.05;
        dnaMesh.rotation.y = time/25;
        material.uniforms.time.value = time;
        material.uniforms.progress.value = settings.time;
        // Update time uniform
        requestAnimationFrame(animate);
        renderer.render(scene,camera);
        // controls.update();
        //composer.render();
       
      }

     

      init();

   
}
 

resize() {
  width = wrapper.offsetWidth;
  height = wrapper.offsetHeight;
  renderer.setSize(width, height);
 
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}


  render() {

    
    return (
        <div>
          <div className='sec_wrap_cont'>
            <div className='secwr_cont_canvas'>
              <span className='scwrcc_topbg'></span>
            </div>
            <div className='secwrcont_wraphalf'>
              <div className='secwrc_wrh_mainh scrc_wrh_mainh_one'>
                
              </div>
              <div className='secwrc_wrh_mainh scrc_wrh_mainh_two'>
                <div className='secwrc_wmt_wrtxt_one' tabIndex='0' role='about me'> 
                  <span tabIndex='0'><span >Hi! </span>My name is <span className='bftxt_fth Ionut'>Ionut</span>.</span>
                  <span className='swmwrtone_abtxt' tabIndex='0'>I'm a <span className='bftxt_fth self-taught'>self-taught</span> <span className='bftxt_fth web'>web</span> <span className='bftxt_fth developer'>developer</span> based in <span className='bftxt_fth Bucharest'>Bucharest</span>.</span>
                  <span tabIndex='0'>I love to create things from scratch, beautiful, responsive and functional websites.</span>
                  <span tabIndex='0'>Involved in creating ecommerce websites, database connections and successful landing pages.</span>
                </div>
                {/* Skills */}
                <div className='secwrc_wmt_wrtxt_two swrtxt_two_fst'> 
                    <span className='secwrc_ab_sktit' tabIndex='0' role='skills'>Skills</span>
                    <div className='secwrc_wmttxt_two_skills'>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='Javascript'>Javascript</span>
                        <span tabIndex='0' role='HTML'>HTML</span>
                        <span tabIndex='0' role='SCSS'>SCSS</span>
                      </div>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='Bootstrap'>Bootstrap</span>
                        <span tabIndex='0' role='ReactJs'>React.js</span>
                        <span tabIndex='0' role='Redux'>Redux</span>
                      </div>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='Webpack'>Webpack</span>
                        <span tabIndex='0' role='Firebase'>Firebase</span>
                        <span tabIndex='0' role='FaunaDB'>FaunaDB</span>
                      </div>
                    </div>
                </div>
                {/* Familiar with */}
                <div className='secwrc_wmt_wrtxt_two'> 
                    <span className='secwrc_ab_sktit sabs_famwith' tabIndex='0' role='familiar with'>Familiar with</span>
                    <div className='secwrc_wmttxt_two_skills'>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='three js'>Three.js</span>
                      </div>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='wordpress'>Wordpress</span>
                      </div>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='photoshop'>Photoshop</span>
                      </div>
                    </div>
                </div>
                {/* Languages */}
                <div className='secwrc_wmt_wrtxt_two'> 
                    <span className='secwrc_ab_sktit sabs_lang' tabIndex='0' role='languages'>Languages</span>
                    <div className='secwrc_wmttxt_two_skills'>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='english'>English</span>
                      </div>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='italian'>Italian</span>
                      </div>
                      <div className='swt_two_skills_col'>
                        <span tabIndex='0' role='romanian native language'>Romanian</span>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
      
        </div>
      )
  }
}


export default secondPage;
 
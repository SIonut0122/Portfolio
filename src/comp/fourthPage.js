import '../css/fourthPage.css';
import React from 'react';
import * as THREE from 'three';
import baffle from 'baffle';
 
 

 
let width, height, composer;
let scene,camera,meshGeo,renderer,canvas,controls,pointlight,wrapper,tanFOV,windowHeight,particlesMaterial,partPlane;
let geometry, ctx, material;

var clock = new THREE.Clock();
let time = 0;


class FourthPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      followX: 0,
      x: 0,
      friction: 1 /50,
      followY: 0,
      y: 0,
    }
  }
  
  componentDidMount() {
   let self = this;

  window.addEventListener('resize', () => this.resize());
  window.addEventListener('scroll DOMMouseScroll', (e) => this.fthScroll(e));

  
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
      
        renderer = new THREE.WebGLRenderer({ antialias: true});

        wrapper = document.querySelector('.fth_wrapper_canvas');
        width = wrapper.offsetWidth;
        height = wrapper.offsetHeight;

        renderer.setPixelRatio(window.devicePixelRadio, 2); // set extra quality
        renderer.setSize(width ,height);
        // For better quality
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMappingExposure = 1.25;
        renderer.physicallyCorrectLights = true;
        renderer.setClearColor(0x000, 1);
   
 
        wrapper.appendChild(renderer.domElement);
 
        // Set camera
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(0,0,50);
  
        
        addObjects();
        addParticles();
        animate();
      }
 

      function addObjects() {
     

        material = new THREE.ShaderMaterial( {
          extensions: {
            derivatives: "#extension GL_0ES_standard_derivatives : enable"
          },
          side: THREE.DoubleSide,
         uniforms: {
           time: {value: 0},
           resolution: { value : new THREE.Vector4()},
           uvRate1: {
             value: new THREE.Vector2(1, 1)
           }
         },
         
         vertexShader: document.getElementById('fthVertexShader').textContent,
         fragmentShader: document.getElementById('fthFragmentShader').textContent,
       });
       
      

        geometry = new THREE.SphereBufferGeometry( 15, 462, 462 );
        const sphere = new THREE.Mesh( geometry, material );
        
        sphere.position.y = 0;
        sphere.position.x = 0;
  
        //  scene.add( sphere );
      }

      // PARTICLES //

      function addParticles() {
     

        particlesMaterial = new THREE.ShaderMaterial( {
          extensions: {
            derivatives: "#extension GL_0ES_standard_derivatives : enable"
          },
          side: THREE.DoubleSide,
         uniforms: {
           time: {value: 0},
           resolution: { value : new THREE.Vector4()},
           uvRate1: {
             value: new THREE.Vector2(1, 1)
           }
         },
         transparent: true,
         vertexShader: document.getElementById('fthVertexShaderParticles').textContent,
         fragmentShader: document.getElementById('fthFragmentShaderParticles').textContent,
       });
       
       let N = 8000;
       let positions = new Float32Array( N * 3 );
       let particlesGeometry = new THREE.BufferGeometry();

       let inc = Math.PI*(3 - Math.sqrt(5));
       let off = 2/N;
       let rad = 20;

       
       for(let i=0; i < N; i++) {

        let y = i * off - 1 + (off / 2);
        let r = Math.sqrt(1 - y*y);
        let phi = i * inc;

         positions[3*i] = rad * Math.cos(phi)*r;
         positions[3*i+1] = rad * y;
         positions[3*i+2] = rad * Math.sin(phi) * r;
       }

       particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // const particlesGeometry = new THREE.SphereBufferGeometry(2., 162, 162);
        partPlane = new THREE.Points(particlesGeometry, particlesMaterial);
         
        scene.add( partPlane );
      }


 
      
      function animate() {
      time += 0.05;

      material.uniforms.time.value = time;
      particlesMaterial.uniforms.time.value = time * 0.4;
      partPlane.rotation.y = time / 10;
      requestAnimationFrame(animate);
      renderer.render(scene,camera);
  
      }

      // Set listeners for baffle text
     let baffTxt = document.querySelectorAll('.bftxt_fth');
     for(let i=0; i < baffTxt.length; i++) {
        baffTxt[i].addEventListener('mouseover', (e) => this.hoverTxtActIn(e));
        baffTxt[i].addEventListener('mouseout', (e) => this.hoverTxtActOut());
     }

      init();

}
 

resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
 
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

fthMouseMove(e) {
  var lMouseX = Math.max(-100, Math.min(100, document.querySelector('.fth_wrapper_canvas').offsetWidth / 2 - e.clientX));
    let followX = this.state.followX = (50 * lMouseX) / 200; // here might be the problem with directly state change

    var lMouseY = Math.max(-100, Math.min(100, document.querySelector('.fth_wrapper_canvas').offsetHeight/ 2 - e.clientY));
    let followY = this.state.followY = (50 * lMouseY) / 200; // here might be the problem with directly state change

    let y = this.state.y;
    let x = this.state.x;
    let translate;

    // Animate backend background
    x += (followX - x) * this.state.friction;
    y += (followY - y) * this.state.friction;
    translate = 'translate(' + x + '%,'+ y + '%)';
    let underBg = document.querySelector('.fth_wrapper_canvas');
        underBg.style.transform = translate;
}


hoverTxtActIn(e) {
	let c = baffle(e.target);
	let value = e.target.innerHTML;
 let clsName = e.target.classList[1];
 
  if(this.state.obfsCls !== clsName) {
    this.setState({ obfsCls: clsName})
  }
      c.set({
      characters: 'Tfz^thDenzYVLoprR96zJkstTezioPpeqKjbzHiFEnD',
      speed:100
 
  })
	
    c.start();
    c.reveal(1300);
  
  setTimeout(() => {
   let hovTxt = document.querySelectorAll('.bftxt_fth');

   for(let i=0; i<hovTxt.length; i++) {
    if(hovTxt[i].classList[1] !== hovTxt[i]) {
      hovTxt[i].innerHTML = hovTxt[i].classList[1];
    } 
   }
  },1310);

  let fthBg = document.querySelector('.fth_wrapper_canvas');

  if(!fthBg.classList.contains('fth_shkeff')) {
    fthBg.classList.add('fth_shkeff');
    // Remove shake effect after 500ms
    setTimeout( () => {
      document.querySelector('.fth_wrapper_canvas').removeAttribute('style');
    },500);
  }
}

hoverTxtActOut() {
  // Remove shake effect
  document.querySelector('.fth_wrapper_canvas').classList.remove('fth_shkeff');
}

scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 100,
    behavior: 'smooth'
  });
}


  render() {

    
    return (
        <div>
          <div className='wrap_fth_cont' tabIndex='0' role='contact'>
            <div className='fth_wrapper_canvas'></div>
            <div className='fth_wrp_ct' onMouseMove={(e) => this.fthMouseMove(e)}>
              <div className='fth_wrpct_sect_one fthwrp_ct_sect'>
                <h2 tabIndex='0' role='get in touch'>Get in <span className='bftxt_fth touch'>touch</span></h2>
                <span></span>
              </div>
              <div className='fth_wrpct_sect_two fthwrp_ct_sect'>
                <div className='fth_stwo_wrptxt'>
                <h2 tabIndex='0' role='just say hi'>Just say <span>hi.</span></h2>
                <div className='fth_stwo_wrptxt_nac'>
                  <span tabIndex='0' role='ionut stan'>Ionut Stan</span>
                  <span tabIndex='0' role='frontend developer'>Front-End Developer</span>
                  <span tabIndex='0' role='bucharest romania'>Bucharest, Romania</span>
                </div>
                <div className='fth_stwo_wremail'>
                 
                  <a href='mailto:sionut0122@yahoo.com' tabIndex='0' role='sionut0122@yahoo.com'>sionut0122@yahoo.com</a>
                </div>
                <div className='fth_ct_socialmenu' >
                  <span tabIndex='0' role='social'>Social</span>
                  <span className='fth_wrpsocial_icons' tabIndex='0' role='social icons'>
                    <a href='https://www.linkedin.com/in/stan-ionut-1193a0159/' tabIndex='0' role='linkedin'><i className='fab fa-linkedin'></i></a>
                    <a href='https://github.com/SIonut0122' tabIndex='0' role='github'><i className='fab fa-github'></i></a>
                  </span>
                </div>

                </div>
              </div>
            </div>
            <div className='fth_goup_btn' tabIndex='0' role='go up button'>
              <span></span>
              <span>go</span>
              <span>up</span>
            </div>
          </div>
      
        </div>
      )
  }
}


export default FourthPage;
 
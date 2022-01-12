import '../css/firstPage.css';
import React from 'react';
import * as THREE from 'three';
import gsap from "gsap";
import TWEEN, { Tween } from "tween";
import sp1 from '../img/sp1.png';

import Scrollbar from 'smooth-scrollbar';
 
 
 
 


 



const noise = `
 

  vec3 mod289(vec3 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep)
  {
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }
`;

const rotation = `
  mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }
  
  vec3 rotateY(vec3 v, float angle) {
    return rotation3dY(angle) * v;
  }  
`;

const vertexShader = `  
  varying vec2 vUv;
  varying float vDistort;
  
  uniform float uTime;
  uniform float uSpeed;
  uniform float uNoiseDensity;
  uniform float uNoiseStrength;
  uniform float uFrequency;
  uniform float uAmplitude;
  
  ${noise}
  
  ${rotation}
  
  void main() {
    vUv = uv;
    
    float t = uTime * uSpeed;
    float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;

    vec3 pos = position + (normal * distortion);
    float angle = sin(uv.y * uFrequency + t) * uAmplitude;
    pos = rotateY(pos, angle);    
    
    vDistort = distortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  }  
`;
// -1.5555
// vec3 phase = vec3(0.9, 0.6, 0.5);
const fragmentShader = `
  varying vec2 vUv;
  varying float vDistort;
  
  uniform float uTime;
  uniform float uIntensity;
  
  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    // return a + a * sin(3.8 * (c * t + d));
    return a + a * sin(-1.5555 * (c * t + d));
  }     
  
  void main() {
    float distort = vDistort * uIntensity;
    
    vec3 brightness = vec3(1, 1, 1);
    vec3 contrast = vec3(1, 1, 1);
    vec3 oscilation = vec3(1.0, 1.0, 1.0);
    vec3 phase = vec3(0.8, 0.6, 0.5);
  
    vec3 color = cosPalette(distort, brightness, contrast, oscilation, phase);
    
    gl_FragColor = vec4(color, 2.0);
  }  
`;

let devBlottxtMat, fEBlottxtMat, frontEndTxt, devText, blotter_dev;
let scene,camera,renderer,canvas,controls,pointlight,mesh,tween,material,bigMaterial,sCmaterial,thMaterial,canvBound,raycaster,wrapper,tanFOV,windowHeight;
let renderer2, scene2, camera2,wrapper2, bigMesh,scMesh,thMesh;
const pointer = new THREE.Vector2();
 
let smoothScroll;
let lastScrollVal = 0;
let incrScrollValNo = 0;

let topPos = 0;
let timer = null;

let yPos = 0;
let scrolling = false;
let relXPos = 0;


class FirstPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        devTxtHover: false,
        feTxtHover: false,
        openMobMenu: false,
        scrollActive: false
    }

    
  }
 
 componentDidMount() {  

  smoothScroll = Scrollbar.init(document.querySelector('#ins_main_c'));
  smoothScroll.addListener(data => this.secScroll(data));

			let theta = 0;
			const radius = 100;

  
      const big_settings = {
        speed: 0.08,
        density: 2.55,
        strength: 0.05,
        frequency:0.6,
        amplitude: 2.9,
        intensity: 9.6,
      };

  


      const settings = {
        speed: 0.2,
        density: 2.25,
        strength: 0.08,
        frequency:0.6,
        amplitude: 2.9,
        intensity: 4.6,
      };



      const sCsettings = {
        speed: 0.2,
        density: 2.25,
        strength: 0.15,
        frequency:0.6,
        amplitude: 2.9,
        intensity: 1.6,
      };
      const tHsettings = {
        speed: 0.5,
        density: 1,
        strength: 0.45,
        frequency:0.6,
        amplitude: 0.9,
        intensity: 2,
      };

      // already binded on fpage container
      // document.addEventListener( 'mousemove', (e) => this.onPointerMove(e));

      // Set mousdown and mouseup listeners for container
      document.querySelector('.container').classList.add('md-mu');
      document.querySelector('.container').addEventListener('mousedown', mainPMouseDown);
      document.querySelector('.container').addEventListener('mouseup', mainPMouseUp);
      // restore default anim if mouse is leaving with mouse down
      document.querySelector('.wrap_fp_cont').addEventListener('mouseleave', mainPMouseUp);

      function init() {
        wrapper = document.querySelector('.wrapper');
        canvas = wrapper.getElementsByTagName('canvas')[0];
        canvBound = wrapper.getBoundingClientRect();
        
        renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha: true}); // smooth edge
        raycaster = new THREE.Raycaster();
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.width = canvBound.width;
        canvas.style.height = canvBound.height;
        canvas.style.maxHeight = '700px';
    
  

        // Create scene
        scene = new THREE.Scene();
         
     
      

        renderer.setSize(canvBound.width,canvBound.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // set extra quality
        
       
        // For better quality
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;

 
        // Set camera
        camera = new THREE.PerspectiveCamera(4,window.innerWidth/window.innerHeight,1,1000);
        camera.position.set(0,0,40);
        camera.lookAt(scene.position);

        // Used for resizing calc
        tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );
        windowHeight = canvBound.height;
        
  
        // Setting the light scene

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
 
        // Point light
        pointlight = new THREE.PointLight(0xff9000,0.5,3);
        pointlight.position.set(1,-0.5,1);
        scene.add(pointlight,ambientLight);

         // Big geo mesh
         const bigGeometry = new THREE.IcosahedronBufferGeometry(1, 64);
         bigMaterial = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: big_settings.speed },
            uNoiseDensity: { value: big_settings.density },
            uNoiseStrength: { value: big_settings.strength },
            uFrequency: { value: big_settings.frequency },
            uAmplitude: { value: big_settings.amplitude },
            uIntensity: { value: big_settings.intensity },
          },
          depthTest: false
          // wireframe: true,
        });

        bigMesh = new THREE.Mesh(bigGeometry, bigMaterial);
        bigMesh.scale.set(1.5,1.5,1.5);
        bigMesh.position.y = 3.5;
        bigMesh.position.x = 3.2;
        bigMesh.renderOrder =  999;

        // Middle geometry mesh
        const geometry = new THREE.IcosahedronBufferGeometry(1, 64);
         material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: settings.speed },
            uNoiseDensity: { value: big_settings.density },
            uNoiseStrength: { value: settings.strength },
            uFrequency: { value: settings.frequency },
            uAmplitude: { value: settings.amplitude },
            uIntensity: { value: settings.intensity },
          },
          depthTest: false
          // wireframe: true,
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0,0,0);
        mesh.position.x = 1;
        mesh.renderOrder =  999;
        
        

        // Second geo mesh
        const sCgeometry = new THREE.IcosahedronBufferGeometry(1, 64);
        sCmaterial = new THREE.ShaderMaterial({
         vertexShader,
         fragmentShader,
         uniforms: {
           uTime: { value: 0 },
           uSpeed: { value: sCsettings.speed },
           uNoiseDensity: { value: sCsettings.density },
           uNoiseStrength: { value: sCsettings.strength },
           uFrequency: { value: sCsettings.frequency },
           uAmplitude: { value: sCsettings.amplitude },
           uIntensity: { value: sCsettings.intensity },
         },
         depthTest: false
         // wireframe: true,
       });

        scMesh = new THREE.Mesh(sCgeometry, sCmaterial);
        scMesh.renderOrder =  999;
        scMesh.scale.set(0, 0, 0);
        scMesh.position.x = 1.8;
        scMesh.position.y = 0.5;

        // Third geo mesh

        const thGeometry = new THREE.IcosahedronBufferGeometry(1, 64);
        thMaterial = new THREE.ShaderMaterial({
         vertexShader,
         fragmentShader,
         uniforms: {
           uTime: { value: 0 },
           uSpeed: { value: tHsettings.speed },
           uNoiseDensity: { value: tHsettings.density },
           uNoiseStrength: { value: tHsettings.strength },
           uFrequency: { value: tHsettings.frequency },
           uAmplitude: { value: tHsettings.amplitude },
           uIntensity: { value: tHsettings.intensity },
         },
         depthTest: false
         // wireframe: true,
       });

        thMesh = new THREE.Mesh(thGeometry, thMaterial);
        thMesh.renderOrder =  999;
        thMesh.scale.set(0,0,0);
        thMesh.position.x = 1.1;
        thMesh.position.y = -0.9;


        scene.add(mesh,scMesh,thMesh,bigMesh);
        
        // Floating animation for middle mesh
        setTimeout(() => {
          gsap.to(
            mesh.scale,
            1,
            {
             x: '0.6',
              y: "0.6",
              z: '0.6',
              ease: "expo",
              yoyo: true,
              onComplete: function() {
                //
                gsap.to(
                    mesh.position,
                    2,
                    {
                      y: "0.2",
                      ease: "power1.inOut",
                      yoyo: true,
                      repeat: -1,
                      delay: 1
                    }
                  ); 
              }
            }
          ); 
          gsap.to(
            scMesh.scale,
            1.2,
            {
             x: '0.1',
              y: "0.1",
              z: '0.1',
              ease: "expo",
              yoyo: true,
              delay: 0.3
            }
          ); 
          gsap.to(
            thMesh.scale,
            1,
            {
             x: '0.2',
              y: "0.2",
              z: '0.2',
              ease: "expo",
              yoyo: true,
              delay: 0.5
            }
          ); 
          gsap.to(
            bigMesh.position,
            1,
            {
              y: "1.5",
              ease: "expo",
              yoyo: true,
              delay: 0.5,
              yoyo: true,
            }
          );
        },1000);

        
     
  

        // Animate globe into scene
        // setTimeout(() => {
        //   gsap.fromTo(mesh.position, {x: 2, duration: 3, ease: 'elastic'}, {x: 1, duration: 3, ease: 'elastic'});
        // },1000)


         // ---------- Scene two - stars ----------
        wrapper2 = document.querySelector('.wrapper2');
        
        renderer2 = new THREE.WebGLRenderer({alpha: true,antialias: true}); // smooth edge
        renderer2.setClearColor(new THREE.Color("#000"));
        renderer2.setSize(canvBound.width, canvBound.height + 150);

        // For better quality
        renderer2.outputEncoding = THREE.sRGBEncoding;
        renderer2.toneMapping = THREE.ACESFilmicToneMapping;
        renderer2.toneMappingExposure = 1.25;

        scene2 = new THREE.Scene();  



        camera2 = new THREE.PerspectiveCamera(4, window.innerWidth / window.innerHeight, 1, 10000);
        camera2.position.set(0,0,40);
        camera2.lookAt(scene2.position);
   
        scene2.add(camera2);

        // Ambient light
        const ambientLight2 = new THREE.AmbientLight(0xffffff,0.5)

        // Point light
        const pointlight2 = new THREE.PointLight(0xff9000,0.5,3);
        pointlight2.position.set(1,-0.5,1);
        scene2.add(pointlight2,ambientLight2);

    
        wrapper2.appendChild(renderer2.domElement);

        // Set camera viewport on mount
        let width = window.innerWidth;
        let height = window.innerHeight;
        // Object background
        camera.aspect = width / height;
        renderer.setSize(width, height);
        camera.updateProjectionMatrix(); 
        
        animate();
        
          
          


          // ------------ STARS ----------- //
          
          const getRandomParticelPos = (particleCount) => {
            const arr = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
              arr[i] = (Math.random() - 0.5) * 11;
            }
            return arr;
          };
          
          // Geometry
          const geometrys = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];
          
          
          geometrys[0].setAttribute(
            "position",
            new THREE.BufferAttribute(getRandomParticelPos(350), 3)
            );
            geometrys[1].setAttribute(
              "position",
              new THREE.BufferAttribute(getRandomParticelPos(1500), 3)
              );
              
              const loader = new THREE.TextureLoader();
              
              // material
              const materials = [
                new THREE.PointsMaterial({
                  size: 0.6,
                  map: loader.load(sp1),
                  transparent: false,
           color: "#7d160b"
          }),
          new THREE.PointsMaterial({
            size: 0.6,
          map: loader.load("https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png"),
          transparent: false,
          
          color: "rgba(74, 128, 209, 0.89)"
        }),

      ];
      
      
      const starsT1 = new THREE.Points(geometrys[0], materials[0]);
      const starsT2 = new THREE.Points(geometrys[1], materials[1]);
      scene2.add(starsT1);
      scene2.add(starsT2);
      
      detectMobile();


      }
      
      
      const detectMobile = () => {
        let isMobileDevice = window.matchMedia("only screen and (max-width: 500px)").matches;
        if(isMobileDevice){
         console.log('mobile');
          mesh.position.x = 0;
          scMesh.position.x = 0.5;
          thMesh.position.x = 0.2;
   

          if(document.querySelector('.container').classList.contains('md-mu')) {
            document.querySelector('.container').classList.remove('md-mu');
            document.querySelector('.container').removeEventListener('mousedown', mainPMouseDown);
            document.querySelector('.container').removeEventListener('mouseup', mainPMouseUp);
          }
        } 
      }

  
     // ---------- RESIZE ----------- //

      window.addEventListener('resize', (e) => {
        
     
    
        // Resize objects depending on device size
        if(window.innerWidth < 500) {
          mesh.position.x = 0;
          scMesh.position.x = 0.5;
          thMesh.position.x = 0.2;

          // On resize, remove click listeners on mobile size
          if(document.querySelector('.container').classList.contains('md-mu')) {
            document.querySelector('.container').classList.remove('md-mu');
            document.querySelector('.container').removeEventListener('mousedown', mainPMouseDown);
            document.querySelector('.container').removeEventListener('mouseup', mainPMouseUp);
          }
         

        } else {
          mesh.position.x = 1;
          scMesh.position.x = 1.8;
          thMesh.position.x = 1.1;

           // On resize, add click listeners on desktop size
          if(!document.querySelector('.container').classList.contains('md-mu')) {
            document.querySelector('.container').classList.add('md-mu');
            document.querySelector('.container').addEventListener('mousedown', mainPMouseDown);
            document.querySelector('.container').addEventListener('mouseup', mainPMouseUp);
          }

          if(window.innerWidth > 800 && this.state.openMobMenu) {
            this.openHambMenu();
          }
        }


        let width = window.innerWidth;
        let height = window.innerHeight;

        // Object background
        
        camera.aspect = width / height;
        renderer.setSize(width, height);
        camera.updateProjectionMatrix();

        // // Scene background

        camera2.aspect = width / height;
        renderer2.setSize(width, height + 150);
        camera2.updateProjectionMatrix();

      })




      
      let clock = new THREE.Clock();
 
     

      // ---------- ANIMATE ----------- //

      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update();

        // Middle globe mesh
        bigMesh.material.uniforms.uTime.value = clock.getElapsedTime();
        bigMesh.material.uniforms.uSpeed.value = big_settings.speed;    
        bigMesh.material.uniforms.uNoiseDensity.value = big_settings.density;
        bigMesh.material.uniforms.uNoiseStrength.value = big_settings.strength;
        bigMesh.material.uniforms.uFrequency.value = big_settings.frequency;
        bigMesh.material.uniforms.uAmplitude.value = big_settings.amplitude;
        bigMesh.material.uniforms.uIntensity.value = big_settings.intensity;

        // Middle globe mesh
        mesh.material.uniforms.uTime.value = clock.getElapsedTime();
        mesh.material.uniforms.uSpeed.value = settings.speed;    
        mesh.material.uniforms.uNoiseDensity.value = settings.density;
        mesh.material.uniforms.uNoiseStrength.value = settings.strength;
        mesh.material.uniforms.uFrequency.value = settings.frequency;
        mesh.material.uniforms.uAmplitude.value = settings.amplitude;
        mesh.material.uniforms.uIntensity.value = settings.intensity;

        // Second globe mesh
       
        scMesh.material.uniforms.uTime.value = clock.getElapsedTime();
        scMesh.material.uniforms.uSpeed.value = sCsettings.speed;    
        scMesh.material.uniforms.uNoiseDensity.value = sCsettings.density;
        scMesh.material.uniforms.uNoiseStrength.value = sCsettings.strength;
        scMesh.material.uniforms.uFrequency.value = sCsettings.frequency;
        scMesh.material.uniforms.uAmplitude.value = sCsettings.amplitude;
        scMesh.material.uniforms.uIntensity.value = sCsettings.intensity;

        // Third globe mesh
        thMesh.material.uniforms.uTime.value = clock.getElapsedTime();
        thMesh.material.uniforms.uSpeed.value = tHsettings.speed;    
        thMesh.material.uniforms.uNoiseDensity.value = tHsettings.density;
        thMesh.material.uniforms.uNoiseStrength.value = tHsettings.strength;
        thMesh.material.uniforms.uFrequency.value = tHsettings.frequency;
        thMesh.material.uniforms.uAmplitude.value = tHsettings.amplitude;
        thMesh.material.uniforms.uIntensity.value = tHsettings.intensity;
    
        theta += 0.1;

				camera2.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
				camera2.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
				camera2.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );

        
				camera2.lookAt( scene2.position );
        

				camera2.updateMatrixWorld();
 
      

				// find intersections

				// raycaster.setFromCamera( pointer, camera );
				// const intersects = raycaster.intersectObjects( scene.children, false );
        // let material;
        

				// if ( intersects.length > 0 ) {
        //   if (INTERSECTED != intersects[0].object) {
        //     if (INTERSECTED){
        //         material = INTERSECTED.material;
        //         if(material.emissive){
        //           console.log('HOVER IN');
      

        //         }
        //         else{
        //             // console.log('Slowing down');
        //         }
        //     }   
        //     INTERSECTED = intersects[0].object;
        //     material = INTERSECTED.material;   
        //     console.log('Hovering ...');
        // }
				// } else {
				// 	INTERSECTED = null;
				// }

          
        
        renderer.render(scene,camera);
        renderer2.render(scene2,camera2);
      }

  
      init();

      // Detect bg click
      
      
      let mouseIsDown = false;
      let idTimeout = null;

      /* ------ MOUSE DOWN ------- */

      function mainPMouseDown() {
          mouseIsDown = true;
          idTimeout = setTimeout(function() {
            if(mouseIsDown) {
              
            }
          }, 1000);

          // Big globe anim
          const bg_anim = {
            speed: 0.4,
            density: 1.25,
            strength: 0.15,
            frequency: 2.4,
            amplitude: 3,
            intensity: 5.7,
          };
          
          
  

          gsap.to(big_settings, {duration: 0.5, ease: 'power2.out', onStart: function() {
            Object.assign(big_settings, bg_anim);
            gsap.to(
              bigMesh.position,
              0.7,
              {
                y: "1.6",
                x: "3.5",
                ease: "elastic"
              }
            );
          }})
          

          // Middle globe anim
          const mid_anim = {
            speed: 0.4,
            density: 1.25,
            strength: 0.3,
            frequency: 2.4,
            amplitude: 2,
            intensity: 4.7,
          };
          
          gsap.to(mesh.scale, {duration: .3, ease: 'elastic', x: 0.65, y:0.65,z: 0.65});
          gsap.to(settings, {duration: 0.5, ease: 'power2.out', onStart: function() {
            Object.assign(settings,mid_anim);
          }})
          
          // Second right globe anim
          const scGl_anim = {
            speed: 0.4,
            density: 1.25,
            strength: 0.45,
            frequency: 2.4,
            amplitude: 2,
            intensity: 7.7,
          };

          gsap.to(sCsettings, {duration: 0.5, ease: 'power2.out', onStart: function() {
            Object.assign(sCsettings, scGl_anim);
          }})

          gsap.to(
            scMesh.position,
            0.7,
            {
              y: "0.7",
              x: "2",
              ease: "elastic"
            }
          );
          
          // Third bottom globe anim

          const thGl_anim = {
            speed: 1,
            density: 1.25,
            strength: 0.55,
            frequency: 2.4,
            amplitude: 2,
            intensity: 7.7,
          };
    
          gsap.to(tHsettings, {duration: 0.5, ease: 'power2.out', onStart: function() {
            Object.assign(tHsettings,thGl_anim);
          }})


          gsap.to(
            thMesh.position,
            0.7,
            {
              y: "-1.1",
              x: "1.1",
              ease: "elastic"
            }
          );


      };

      /* ------ MOUSE UP ------- */

      function mainPMouseUp() {
        clearTimeout(idTimeout);
        mouseIsDown = false;
        
        // Big globe anim

        const bigSettings_def = {
          speed: 0.05,
          density: 2.25,
          strength: 0.08,
          frequency:0.6,
          amplitude: 2.9,
          intensity: 4.6,
        };
        
        
        gsap.to(big_settings, {duration: 0.5, ease: 'power2.out', onStart: function() {
          Object.assign(big_settings, bigSettings_def);

          gsap.to(
            bigMesh.position,
            0.7,
            {
              y: "1.5",
              x: "3.2",
              ease: "power1.inOut"
            }
          );

        }})

        // Middle globe anim

        const settings_deff = {
          speed: 0.2,
          density: 2.25,
          strength: 0.08,
          frequency:0.6,
          amplitude: 2.9,
          intensity: 4.6,
          };

        gsap.to(mesh.scale, {duration: .4, x: 0.6, y:0.6,z: 0.6});
        gsap.to(settings, {duration: 0.5, ease: 'power2.out', onStart: function() {
          Object.assign(settings,settings_deff);
        }})
        
        // Second right globe anim
        gsap.to(
          scMesh.position,
          0.7,
          {
            y: "0.5",
            x: "1.8",
            ease: "power1.inOut"
          }
        );
        
        const sCsettings_deff = {
          speed: 0.2,
          density: 2.25,
          strength: 0.15,
          frequency:0.6,
          amplitude: 2.9,
          intensity: 1.6,
        };
        
        gsap.to(sCsettings, {duration: 0.4, ease: 'power2.out', onStart: function() {
          Object.assign(sCsettings, sCsettings_deff);
        }})

        // Third globe mesh

        const tHsettings_def = {
          speed: 0.5,
          density: 1,
          strength: 0.45,
          frequency:0.6,
          amplitude: 0.9,
          intensity: 2,
        };

        gsap.to(tHsettings, {duration: 0.5, ease: 'power2.out', onStart: function() {
          Object.assign(tHsettings,tHsettings_def);
        }})

        gsap.to(
          thMesh.position,
          0.7,
          {
            y: "-0.9",
            x: "1.1",
            ease: "power1.inOut"
          }
        );

      };

      // Bind function to first page navigation links
      if(document.querySelector('.lf_nmwm_link') !== null) {
        let fpNavLink = document.querySelectorAll('.lf_nmwm_link');
        fpNavLink.forEach(nav => nav.addEventListener('click', (e) => this.selectMobNav(e)));
      }


       // Add click listener to fourth page backtotop btn
      document.querySelector('.fth_goup_btn').addEventListener('click', () => {
        smoothScroll.scrollIntoView(document.querySelector('.wrap_fp_cont'));
      })
}



onPointerMove(e) {
    let followX = 0;
    let x = 0;
    let friction = 1 / 200;

        pointer.x = ( e.clientX / canvBound.width ) * 2 - 1;
        pointer.y = - ( e.clientY / canvBound.height ) * 2 + 1;
    // document.querySelector('.wrapper').style.transform = "translate(-" + (20 * (event.pageX / (canvBound.width / 25))) + "px, -" + (20 * (event.pageY / (canvBound.height / 25))) + "px)";

    // Animate meteors
    let translate;
        mesh.rotation.y = (e.clientX / canvBound.width ) * 2 - 1;

        // unusefull / delete after
        // bigMesh.rotation.y =  ( e.clientX / canvBound.height ) * 0.05 + 1;
        // bigMesh.rotation.x =  (e.clientY / canvBound.width ) * 0.05 + 1;
    
    // Stars background parallax
    // If wrapper 2 is mounted, proceed 
    if(document.querySelector('.wrapper2') !== null) {
        var lMouseX = Math.max(-100, Math.min(100, document.querySelector('.wrapper2').offsetWidth / 2 - e.clientX));
        followX = followX = (100 * lMouseX) / 100; // here might be the problem with directly state change
        // Animate backend stars background
        x += (followX - x) * friction;
        translate = 'translate(' + x + '%)';
        document.querySelector('.wrapper2').style.transform = translate;
    }
  }

      
 
openHambMenu() {
    if(!this.state.openMobMenu) {
      this.setState({ openMobMenu: true })

      // Open mobile menu
      setTimeout(() => {
        if(this.state.openMobMenu) {
        // Open hamb menu on mobile size
        document.getElementById('hamb_btn').classList.add('open');
        document.querySelector('.fp_overlay_menu').classList.add('fp_opmen');
        }
      }, 300);
    } else {
      // Close mobile menu
      document.getElementById('hamb_btn').classList.remove('open');
      document.querySelector('.fp_overlay_menu').classList.remove('fp_opmen');
      
      setTimeout(() => {
        // Close hamb menu on mobile size
        this.setState({ openMobMenu: false })
      }, 500);
    }
}



secScroll(data) {
//   scrolling = true;
//   var circle = document.querySelector(".circle");

//   if(timer !== null) {
//     clearTimeout(timer);        
//   }
//   timer = setTimeout(function() {
//     // scroll stop
// }, 100);

  // Check if is view
  const DivIsInView = el => {
      if(document.querySelector('.sec_wrap_cont') !== null) {
      const scroll = window.scrollY || window.pageYOffset
      const boundsTop = el.getBoundingClientRect().top + scroll
      
      const viewport = {
        top: scroll,
        bottom: scroll + window.innerHeight,
      }
        const bounds = {
        top: boundsTop,
        bottom: boundsTop + el.clientHeight,
      }
  
      return ( bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom ) 
        || ( bounds.top <= viewport.bottom && bounds.top >= viewport.top );
    }
  }

    // Check if sec section first tewxt is in view
    let translate;
    let secFirstTxt = document.querySelector('.secwrc_wmt_wrtxt_one');
    let secSecInView = DivIsInView(secFirstTxt);
      
    if(secSecInView) {
      // If new scroll value is higher than the last scrollval,increase
      if(data.offset.y > lastScrollVal) {
        incrScrollValNo++;
        // Parallax about text
        if(incrScrollValNo <= 200) {
          translate = 'translateY(' + incrScrollValNo  + 'px)';
          secFirstTxt.style.transform = translate;
        }

        if(incrScrollValNo > 200) {
          incrScrollValNo = 0;
          lastScrollVal = 0;
        }
      } else {
        // Prevent deacreasing if value is 0
        if(incrScrollValNo > 0) {
          incrScrollValNo--;
          translate = 'translateY(' + incrScrollValNo + 'px)';
          secFirstTxt.style.transform = translate;
        }
      }
      lastScrollVal = data.offset.y;
    }  else {
      secFirstTxt.style.transform = 'translateY(0)';
    }
    

    // Check if sec section second text is in view
    let secSecTxt = document.querySelector('.secwrc_wmt_wrtxt_two');
    let secSecTxtInView = DivIsInView(secSecTxt);

    if(secSecTxtInView) {
      if(!document.querySelector('.secwrc_ab_sktit').classList.contains('swrcabsk_def')) {
          // animate border width
          document.querySelectorAll('.secwrc_ab_sktit').forEach(el => el.classList.add('swrcabsk_def'));
          // display skills
          document.querySelectorAll('.secwrc_wmttxt_two_skills').forEach(el => el.classList.add('swtsk_txt_anim'));
        }  
    }

    // Hide / reaveal scroll down text from first page
    let firstSiTxt = document.querySelector('.fpcg_htxt_si');
    let firstScrollDTxtInView = DivIsInView(firstSiTxt);
    let firstSDownTxt = document.querySelector('.lf_nm_wscrolldown');

    if(firstScrollDTxtInView) {
      firstSDownTxt.style.opacity = '1';
      firstSDownTxt.style.marginLeft = '0';
    } else {
      firstSDownTxt.style.opacity = '0';
      firstSDownTxt.style.marginLeft = '-10px';
    }
}


selectMobNav(e) {
  let val = e.target.innerHTML;
  // Get button click value and proceed
  switch(val) {
    case 'Home':
    smoothScroll.scrollIntoView(document.querySelector('.wrap_fp_cont'));
    break;
    case 'About':
    smoothScroll.scrollIntoView(document.querySelector('.sec_wrap_cont'));
    break;
    case 'Projects':
    smoothScroll.scrollIntoView(document.querySelector('.third_main_container'));
    break;
    case 'Contact':
    smoothScroll.scrollIntoView(document.querySelector('.wrap_fth_cont'));
    break;
    default:
    return;
  }
  if(this.state.openMobMenu) {
    // Close hamb menu
    this.openHambMenu();
  }

}


  render() {

    return (
        <div className='wrap_fp_cont'>
          <div className='container'>

            <div className='wrapper2'></div>

          
            <div className='wrapper'>
              <canvas className="c"></canvas>
            </div>
         
           
            <div className='fPage_container' onMouseMove={(e) => this.onPointerMove(e)}>
                <div className='fp_c_first'>
                <div className='fpc_g_htxt fpcg_htxt_si'  tabIndex='0' role='Stan Ionut'><div>Stan Ionut</div><span className='fpcg_htxtsi_lthr'></span></div>
                <div className='fpc_g_htxt' tabIndex='0' role='frontend'><div className='fpghtxt_fe'>Front-End</div><span></span></div> 
                <div className='fpc_g_htxt' tabIndex='0' role='developer'><div className='fpghtxt_dev'>Developer</div><span></span></div> 
                </div>

                {/* Social container */}
               <div className='right_socialmenu' tabIndex='0' role='social media menu'>
                  <a href='https://www.linkedin.com/in/stan-ionut-1193a0159/' tabIndex='0' role='linkedin'><i className='fab fa-linkedin'></i></a>
                  <a href='https://github.com/SIonut0122' tabIndex='0' role='github'><i className='fab fa-github'></i></a>
                  <a href='mailto:sionut0122@yahoo.com' tabIndex='0' role='email'><i className='fas fa-envelope'></i></a>
              </div>
            </div>

            <div className='lf_nm_wscrolldown'>
                <span className='lf_nm_sc_ftxt'><span>s</span><span>c</span><span>r</span><span>o</span><span>l</span><span>l</span></span>
                <span className='lf_nm_sc_fimg'><span></span></span>
            </div>

            <div className='fp_wraphambmenu'>
              <div id='hamb_btn' tabIndex='0' role='open menu' onClick={() => this.openHambMenu()}>
              <div></div>
              </div>
            </div>

            {this.state.openMobMenu && (
            <div className='fp_overlay_menu'>
              <div className='fpover_mobmenu_wrapnav' tabIndex='0' role='mobile menu'>
                <span className='fmobwr_navlnk' onClick={(e) => this.selectMobNav(e)} tabIndex='0' role='home'>Home</span>
                <span className='fmobwr_navlnk' onClick={(e) => this.selectMobNav(e)} tabIndex='0' role='about'>About</span>
                <span className='fmobwr_navlnk' onClick={(e) => this.selectMobNav(e)} tabIndex='0' role='projects'>Projects</span>
                <span className='fmobwr_navlnk' onClick={(e) => this.selectMobNav(e)} tabIndex='0' role='contact'>Contact</span>
              </div>

              <div className='fpover_mobm_wrsocial' tabIndex='0' role='social media menu'>
                <div className='fpover_mb_socialmenu' tabIndex='0' role='social media menu'>
                    <a href='https://www.linkedin.com/in/stan-ionut-1193a0159/'><i className='fab fa-linkedin' tabIndex='0' role='linkedin'></i></a>
                    <a href='https://github.com/SIonut0122'><i className='fab fa-github' tabIndex='0' role='github'></i></a>
                    <a href='mailto:sionut0122@yahoo.com'><i className='fas fa-envelope' tabIndex='0' role='email'></i></a>
                </div>
              </div>
            </div>
            )}
          </div>          
        </div>
      )
  }
}


export default FirstPage;
 
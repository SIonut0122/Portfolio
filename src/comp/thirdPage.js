import React from 'react';
import SimplexNoise from 'simplex-noise';
import ScrollBooster from "scrollbooster";
 
import { render } from '@testing-library/react';
import '../css/thirdPage.css';
import * as THREE from 'three';

import ecommtdesign from '../img/projimg/ecommtdesign.png';
import pizzadel from '../img/projimg/pizzadel.jpg';
import livechat2 from '../img/projimg/livechat_vtwo.png';
import fooddel from '../img/projimg/fooddel.jpg';
import musicplayer from '../img/projimg/musicplayer.png';
import ecommtv from '../img/projimg/ecommtv.jpg';
import imgfbhost from '../img/projimg/imgfbhost.png';
import businesstheme from '../img/projimg/businesstheme.jpg';
import ecommobile from '../img/projimg/ecommobile.jpg';
import livechat from '../img/projimg/livechat_vone.jpg';


const projectsData = [
    {
      title: 'eCommerceTDesign',
      tech: 'JS / React.js / Redux / Scss / Bootstrap / Webpack / Firebase / FaunaDB',
      viewProjLink: 'https://sionut0122.github.io/ecommercetdesign/#/',
      viewSCLink: 'https://github.com/SIonut0122/ecommercetdesign/tree/gh-pages/Source%20code',
      projImg: ecommtdesign
    },
    {
      title: 'Pizza delivery',
      tech: 'JS / React.js / Redux / Scss / Bootstrap / Webpack / Firebase',
      viewProjLink: 'https://sionut0122.github.io/pizzaDelivery/#/',
      viewSCLink: 'https://github.com/SIonut0122/pizzaDelivery/tree/gh-pages/Source%20code',
      projImg: pizzadel
    },
    {
      title: 'LiveChat v2.0',
      tech: 'JS / React.js / Redux / Scss / Bootstrap / Firebase',
      viewProjLink: 'https://sionut0122.github.io/LiveChatV2.0/',
      viewSCLink: 'https://github.com/SIonut0122/LiveChatV2.0/tree/gh-pages/LiveChatV2.0%20source%20code',
      projImg: livechat2
    },
    {
      title: 'foodDelivery',
      tech: 'JS / React.js / Redux / Router / Scss / Materialize',
      viewProjLink: 'https://sionut0122.github.io/fooddelivery/',
      viewSCLink: 'https://github.com/SIonut0122/fooddelivery/tree/gh-pages/foodDelivery',
      projImg: fooddel
    },
    {
      title: 'Music Player',
      tech: 'JS / React.js / Scss / Materialize',
      viewProjLink: 'https://sionut0122.github.io/musicplayer/',
      viewSCLink: 'https://github.com/SIonut0122/musicplayer/tree/gh-pages/musicPlayer',
      projImg: musicplayer
    },
    {
      title: 'eCommerceTv',
      tech: 'JS / React.js / Redux / Scss / Bootstrap / Firebase',
      viewProjLink: 'https://sionut0122.github.io/ecommercetv/',
      viewSCLink: 'https://github.com/SIonut0122/ecommercetv/tree/gh-pages/ecommercetv',
      projImg: ecommtv
    },
    {
      title: 'imgFBHost',
      tech: 'JS / React.js / Router / Scss / Bootstrap / Firebase',
      viewProjLink: 'https://sionut0122.github.io/imgfbhost/',
      viewSCLink: 'https://github.com/SIonut0122/imgfbhost/tree/gh-pages/imgFBHost',
      projImg: imgfbhost
    },
    {
      title: 'businessTheme',
      tech: 'JS / React.js / Router / Redux / Scss / Materialize',
      viewProjLink: 'https://sionut0122.github.io/businesstemplate/',
      viewSCLink: 'https://github.com/SIonut0122/businesstemplate/tree/gh-pages/businessTemplate',
      projImg: businesstheme
    },
    {
      title: 'eCommerceMobile',
      tech: 'JS / React.js / Scss / Bootstrap',
      viewProjLink: 'https://sionut0122.github.io/eCommerceMobile/',
      viewSCLink: 'https://github.com/SIonut0122/eCommerceMobile/tree/gh-pages/eCommerceMobile',
      projImg: ecommobile
    },
    {
      title: 'LiveChat v1.0',
      tech: 'JS / CSS / Bootstrap / Firebase',
      viewProjLink: 'https://sionut0122.github.io/livechat/',
      viewSCLink: 'https://github.com/SIonut0122/livechat/tree/gh-pages/livechat',
      projImg: livechat
    }
]


let width, height;
let scene,scene1, camera,renderer,wrapper;
let material, materialTubes;
let raycaster,raycastPlane,intersects;
let yRotation, xRotation;
let time = 0;
const simplex = new SimplexNoise(Math.random);



class ThirdPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      followX: 0,
      x: 0,
      friction: 1 / 30
    }
  }
  
  componentDidMount() {

    // Horizontal drag projects
    const setupExample4 = () => {
      new ScrollBooster({
        viewport: document.querySelector(".thmc_wrapscroll_content .thmc_wrscroll_cincont"),
        content: document.querySelector(".thmc_wrapscroll_content .thmc_wrc_cintcont_proj"),
        direction: "horizontal",
        scrollMode: "transform",
        onUpdate: (data) => {
          let xPos = data.position.x;
          let dragFMore = document.querySelector('.thrd_bott_drgmore_arrow');
          if(xPos > 370) {
           if(!dragFMore.classList.contains('drgfmactv')) {
             dragFMore.classList.add('drgfmactv');
           }
          } else {
            if(dragFMore.classList.contains('drgfmactv')) {
              dragFMore.classList.remove('drgfmactv');
            } 
          }
        }
      });
    };


    setupExample4();
    function computeCurl(x, y, z){
      var eps = 0.0001;
    
      var curl = new THREE.Vector3();
    
      //Find rate of change in YZ plane
      var n1 = simplex.noise3D(x, y + eps, z); 
      var n2 = simplex.noise3D(x, y - eps, z); 
      //Average to find approximate derivative
      var a = (n1 - n2)/(2 * eps);
      var n1 = simplex.noise3D(x, y, z + eps); 
      var n2 = simplex.noise3D(x, y, z - eps); 
      //Average to find approximate derivative
      var b = (n1 - n2)/(2 * eps);
      curl.x = a - b;
    
      //Find rate of change in XZ plane
      n1 = simplex.noise3D(x, y, z + eps); 
      n2 = simplex.noise3D(x, y, z - eps); 
      a = (n1 - n2)/(2 * eps);
      n1 = simplex.noise3D(x + eps, y, z); 
      n2 = simplex.noise3D(x - eps, y, z); 
      b = (n1 - n2)/(2 * eps);
      curl.y = a - b;
    
      //Find rate of change in XY plane
      n1 = simplex.noise3D(x + eps, y, z); 
      n2 = simplex.noise3D(x - eps, y, z); 
      a = (n1 - n2)/(2 * eps);
      n1 = simplex.noise3D(x, y + eps, z); 
      n2 = simplex.noise3D(x, y - eps, z); 
      b = (n1 - n2)/(2 * eps);
      curl.z = a - b;
    
      return curl;
    }
    
   let self = this;


  window.addEventListener('resize', () => this.resize());
    function init() {

      // Create scene
        scene = new THREE.Scene();
        scene1 = new THREE.Scene();
      
        renderer = new THREE.WebGLRenderer();

        wrapper = document.querySelector('.third_mc_wrapcanvas');
        width = wrapper.offsetWidth;
        height = wrapper.offsetHeight;

        renderer.setPixelRatio(window.devicePixelRadio, 2); // set extra quality
        renderer.setSize(width ,height);

        // For better quality
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.physicallyCorrectLights = true;
        renderer.setClearColor(0xeeeeee, 1);
        renderer.autoClear = false;
 
        // raycaster
        raycaster = new THREE.Raycaster();
        self.mouse = new THREE.Vector2();
        self.eMouse = new THREE.Vector2();
        self.elasticMouse = new THREE.Vector2(0,0);
        self.temp = new THREE.Vector2(0,0);
        self.elasticMouseVel = new THREE.Vector2(0,0);
        wrapper.appendChild(renderer.domElement);
 
        // Set camera
        camera = new THREE.PerspectiveCamera( 70, width / height, 0.1, 1000 );
        camera.position.set(0,0,3);

        addObjects();
        raycast();
        animate();
        self.resize();
    }
      


      function addObjects() {
        material = new THREE.ShaderMaterial( {
          extensions: {
            derivatives: "#extension GL_0ES_standard_derivatives : enable"
          },
          side: THREE.DoubleSide,
         uniforms: {
           time: {value: 0},
           uLight: { value: new THREE.Vector3(0,0,0)},
           resolution: { value : new THREE.Vector4()}
         },
         vertexShader: document.getElementById('thirdVertexShader').textContent,
         fragmentShader: document.getElementById('thirdFragmentShader').textContent
       });

       materialTubes = new THREE.ShaderMaterial( {
        extensions: {
          derivatives: "#extension GL_0ES_standard_derivatives : enable"
        },
        side: THREE.DoubleSide,
       uniforms: {
         time: {value: 0},
         uLight: { value: new THREE.Vector3(0,0,0)},
         resolution: { value : new THREE.Vector4()}
       },
       vertexShader: document.getElementById('thirdTubesVertexShader').textContent,
       fragmentShader: document.getElementById('thirdTubesFragmentShader').textContent
     });

      // Create curves

       for(let i=0; i<150;i++ ) {
        let path = new THREE.CatmullRomCurve3(getCurve(new THREE.Vector3(
          Math.random() - 0.3,
          Math.random() - 0.3,
          Math.random() - 0.3
        )));
        let geometry = new THREE.TubeBufferGeometry(path,500,0.005,8, false);
        const curve = new THREE.Mesh(geometry,materialTubes); 
        
        curve.position.x = -0.5;
        curve.position.y = 0;
        curve.rotation.y = 0;
        curve.scale.set(3,3,3);
        scene.add(curve);
       }
      }

      
      function getCurve(start) {
        let scale = 10;
        let points = [];

        points.push(start);
        let currentPoint = start.clone();

        for(let i=0; i < 500; i++) {
          // points.push(
          //   new THREE.Vector3(Math.sin(50*i/10),i/10,0)
          // )
          let v = computeCurl(currentPoint.x / scale, currentPoint.y / scale, currentPoint.z / scale);
          currentPoint.addScaledVector(v,0.001);
          
          points.push(currentPoint.clone());
        }
        return points;
      }
 

      // Get mouse - mesh interactions for hover effect
      function raycast() {
        raycastPlane = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(10,10),
          new THREE.MeshBasicMaterial({color: 0x000})
        )

        self.light = new THREE.Mesh(
          new THREE.SphereBufferGeometry(0.08,20,20),
          new THREE.MeshBasicMaterial({color: 0xffffff})
        )

      raycastPlane.scale.set(1,1,1);
        scene1.add(raycastPlane);
        // Add white mouse light
        // scene.add(self.light);

        window.addEventListener('mousemove', (e) => {
          self.mouse.x = ( e.clientX / width ) * 2 - 1;
        	self.mouse.y = - ( e.clientY / height ) * 2 + 1;

          raycaster.setFromCamera(self.mouse,camera);
          self.eMouse.x = e.clientX;
          self.eMouse.y = e.clientY;
          intersects = raycaster.intersectObjects([raycastPlane]);
          if(intersects.length>0) {
            let p = intersects[0].point;
          
            self.eMouse.x = p.x;
            self.eMouse.y = p.y;
          }
        })
      }


      function animate() {
      time += 0.05;
    
      self.temp.copy(self.eMouse).sub(self.elasticMouse).multiplyScalar(.30);
      self.elasticMouseVel.add(self.temp);
      self.elasticMouseVel.multiplyScalar(.8);
      self.elasticMouse.add(self.elasticMouseVel);

      self.light.position.x = self.elasticMouse.x;
      self.light.position.y = self.elasticMouse.y;
      
      material.uniforms.uLight.value = self.light.position;
      materialTubes.uniforms.uLight.value = self.light.position;
      material.uniforms.time.value = time;
      materialTubes.uniforms.time.value = time;

      requestAnimationFrame(animate);

      renderer.clear();
      renderer.render(scene1, camera);
      renderer.clearDepth();

      renderer.render(scene,camera);
      }

      // Start the magic
      init();
}
 

resize() {
  width = wrapper.offsetWidth;
  height = wrapper.offsetHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}


scrollCinCont(evt) {
  evt.preventDefault();
  document.querySelector('.thmc_wrscroll_cincont').scrollLeft += evt.deltaY;
}

projMouseMove(e) {
  const height = e.target.clientHeight;
  const width = e.target.clientWidth;

     var el = e.target,
     x = 0,
     y = 0;

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }

  let xVal = e.clientX - x;
  let yVal = e.clientY - y;

  yRotation = 5 * ((xVal - width / 2) / width);
  xRotation = -5 * ((yVal - height / 2) / height);
  
  const string = 'perspective(500px) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)';
  
  /* Apply the calculated transformation */
  e.target.style.transform = string;
    
}

projMouseOut() {
  let projectBoxes = document.querySelectorAll('.thmc_wrcccont_proj_box');
  let string = 'perspective(-500px)rotateX(0) rotateY(0)';

  for(let i=0; i < projectBoxes.length; i++) {
    projectBoxes[i].style.transform = 'perspective(0) rotateX(0) rotateY(0)'; 
  }
}




  render() {
    return (
        <div>
          <div className='third_main_container' tabIndex='0' role='my work'>
            <span className='third_mc_topsmkbg'></span>
            <div className='third_mc_wrapcanvas'></div>
            <div className='thmc_wrapscroll_content'>
              <div className='thmc_wrscroll_cinside'>
                <div className='thmc_wrscroll_cincont' tabIndex='-1'>
                  <div className='thmc_wrc_cintcont_proj'>
                      {projectsData.map((proj,ind) =>
                        <a key={ind} href={proj.viewProjLink} target='_blank' tabIndex='0' className='thmc_wrcccont_proj_box'
                        style={{"marginTop": ind % 2 === 0 ? '50px' : '0'}}>
                        <span className='projbox_title'>{proj.title}</span>
                        <span className='thmcwrc_projbox_outln'></span>
                        <span className='thmcwrc_hovshineffbox'></span>
                        <span className='thmcwrc_projbox_wrap_img'>
                        <img src={proj.projImg} alt=''/>
                        </span>
                        <span className='thmcwrc_projbox_blt'>  
                        {proj.tech}
                        <i className="fas fa-arrow-down"></i>
                        </span>
                      </a>
                      )}

                  </div>
                </div>
              </div>
            </div>
            <span className='third_mc_bottomsmkbg'></span>
            <span className='thrd_bott_drgmore_arrow'>
              <span></span>
              <span>Drag for more</span>
            </span>
            </div>
        </div>
      )
  }
}


export default ThirdPage;
 
 
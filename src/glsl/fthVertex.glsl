 precision mediump float;
 precision mediump int;

 
 uniform float time;
 uniform float progress;
 uniform sampler2D texture1;
 varying vec2 vUv;
 
 attribute vec4 color;
 attribute float randoms;
 attribute float offset;
 attribute float colorRandoms;
 
 // Passed to fragment shader
 
 varying vec3 vPosition;
 varying float vColorRandom;
 
 
 
 void main()	{
   // Assign varyings for fragment shader
  vUv = uv;
   vColorRandom = colorRandoms;

   vec3 newpos = position;
   newpos.y += clamp(0.,1.,(progress - offset));

   vec4 mvPosition = modelViewMatrix * vec4( newpos, 1. );
   gl_PointSize = (10.*randoms + 15.) * (2. / - mvPosition.z);
   gl_Position = projectionMatrix * mvPosition;
 }
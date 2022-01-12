precision mediump float;
 precision mediump int;
 
 uniform float time;
 uniform vec3 uColor1;
 uniform vec3 uColor2;
 uniform vec3 uColor3;
  
 varying vec2 vUv;
 varying vec3 vPosition;
 
 
 
 void main()	{

  float alpha = 1. - smoothstep(-0.2,0.5,length(gl_PointCoord - vec2(0.5)));
  alpha *=0.5;
  vec3 finalColor = uColor1;

  if(vColorRandom>0.33 && vColorRandom<0.66) {
    finalColor = uColor2;
  }
  if(vColorRandom>0.66) {
    finalColor = uColor3;
  }

  float gradient = smoothstep(0.4,0.6, vUv.y);
   // Set fragment color
   gl_FragColor = vec4(finalColor,alpha*gradient);
 
 }
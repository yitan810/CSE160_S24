// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
    u_NormalMatrix;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_spotLightPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;
  uniform bool u_spotLightOn;
  varying vec4 v_VertPos;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);     // Use Normal
    } else if (u_whichTexture == -2) {                         // Use color
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {                  // Use UV debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {                  // Use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {                  // Use texture1
      vec4 color0 = texture2D(u_Sampler0, v_UV);
      vec4 color1 = texture2D(u_Sampler1, v_UV);
      gl_FragColor = color0 * color1;
    }
    else {                                            // Error, put Redish
      gl_FragColor = vec4(1, 0.2, 0.2, 1.0);
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N, L), 0.0);

    vec3 R = reflect(-L, N);

    // Eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular
    float specular_exp = pow(max(dot(E, R), 0.0), 10.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    vec3 specular = vec3(gl_FragColor) * specular_exp;

    if (u_spotLightOn) {
      vec3 spotLightVector = u_spotLightPos - vec3(v_VertPos);
      float slr = length(spotLightVector);
      if (slr > 9.0 && slr<16.0 && spotLightVector[1]>13.5) {
      gl_FragColor = vec4(1,1,0.4, 1.0);
      }
      else if (u_lightOn) {
        gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
      }
    } else if (u_lightOn) {
      gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
    }
   }`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let u_lightPos;
let u_spotLightPos;
let u_cameraPos;
let u_lightOn;
let u_spotLightOn;


// get the canvas and gl context
function setupWebGL() {
  //Retrive <canvas> element
  canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  ///gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

// compile the shader programs
// attach the javascript variables to the GLSL variables
function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_spotLightPos = gl.getUniformLocation(gl.program, 'u_spotLightPos');
  if (!u_spotLightPos) {
    console.log('Failed to get the storage location of u_spotLightPos');
    return;
  }


  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_spotLightOn = gl.getUniformLocation(gl.program, 'u_spotLightOn');
  if (!u_spotLightOn) {
    console.log('Failed to get the storage location of u_spotLightOn');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0.')
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1.')
    return false;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture.')
    return false;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
}

// constant
const POINT = 0;
const TRIANGLES = 1;
const CIRCLE = 2;

let c = [0.5, 0.5, 0.5, 1.0]; // initial, by default
let s = 10;
let g_selectedType = POINT;
let seg = 10;

let g_globalAngle = 0;
let g_RArmAngle = 135;
let g_LArmAngle = 45;
let g_RLegAngle = 180;
let g_LLegAngle = 180;
let g_LFootAngle = 5;
let g_RFootAngle = 5;
let g_RHandAngle = 90;
let g_LHandAngle = 90;
let g_tailAngle = 10;
let g_BellyAngle = -35;
let g_LEarAngle = 0;
let g_REarAngle = 0;
let g_RLAnimation = false;
let g_RFAnimation = false;
let g_LLAnimation = false;
let g_LFAnimation = false;
let g_LAAnimation = false;
let g_RAAnimation = false;
let g_tailAnimation = false;
let g_BellyAnimation = false;
let pokeAnimation = false;

let g_normalON = false;
let g_lightPos = [0,0,-1];
let g_spotLightPos = [-7,-1,-7];
let g_lightOn = true;
let g_spotLightOn = false;
let g_lightMotionOn = false;

function addActionsForHtmlUI() {
  // AngleSilde

  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes()});
  document.getElementById('lightSliderX').addEventListener('mousemove', function() {g_lightPos[0] = this.value/100; renderAllShapes();});
  document.getElementById('lightSliderY').addEventListener('mousemove', function() {g_lightPos[1] = this.value/100; renderAllShapes();});
  document.getElementById('lightSliderZ').addEventListener('mousemove', function() {g_lightPos[2] = this.value/100; renderAllShapes();});

  document.getElementById('spotLightSliderX').addEventListener('mousemove', function() {g_spotLightPos[0] = this.value/100; renderAllShapes();});
  document.getElementById('spotLightSliderZ').addEventListener('mousemove', function() {g_spotLightPos[2] = this.value/100; renderAllShapes();});
  
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) {handleClicks(ev)}};


  // control join angles with sliders
  document.getElementById('RArmSlide').addEventListener('mousemove', function() {g_RArmAngle = this.value; renderAllShapes()});
  document.getElementById('LArmSlide').addEventListener('mousemove', function() {g_LArmAngle = this.value; renderAllShapes()});
  document.getElementById('RHandSlide').addEventListener('mousemove', function() {g_RHandAngle = this.value; renderAllShapes()});
  document.getElementById('LHandSlide').addEventListener('mousemove', function() {g_LHandAngle = this.value; renderAllShapes()});
  document.getElementById('RLegSlide').addEventListener('mousemove', function() {g_RLegAngle = this.value; renderAllShapes()});
  document.getElementById('LLegSlide').addEventListener('mousemove', function() {g_LLegAngle = this.value; renderAllShapes()});
  document.getElementById('LFootSlide').addEventListener('mousemove', function() {g_LFootAngle = this.value; renderAllShapes()});
  document.getElementById('RFootSlide').addEventListener('mousemove', function() {g_RFootAngle = this.value; renderAllShapes()});
  document.getElementById('BellySlide').addEventListener('mousemove', function() {g_BellyAngle = this.value; renderAllShapes()});

  // Button Event, animation
  document.getElementById('animationRLOn').onclick = function(){g_RLAnimation = true; g_RFAnimation = true; g_LLAnimation = true; g_LFAnimation = true;
    g_LLAnimation = true; g_RAAnimation = true; g_tailAnimation = true; g_BellyAnimation = true; pokeAnimation = false};
  document.getElementById('animationRLOff').onclick = function(){g_RLAnimation = false; g_RFAnimation = false; g_LLAnimation = false; g_LFAnimation = false;
    g_LAAnimation = false; g_RAAnimation = false; g_tailAnimation = false; g_BellyAnimation = false; pokeAnimation = false};
  document.getElementById('normalOn').onclick = function(){g_normalON=true};
  document.getElementById('normalOff').onclick = function(){g_normalON=false};
  document.getElementById('lightOn').onclick = function(){g_lightOn=true};
  document.getElementById('lightOff').onclick = function(){g_lightOn=false};
  document.getElementById('spotLightOn').onclick = function(){g_spotLightOn=true};
  document.getElementById('spotLightOff').onclick = function(){g_spotLightOn=false};
  document.getElementById('lightMotionOn').onclick = function(){g_lightMotionOn=true};
  document.getElementById('lightMotionOff').onclick = function(){g_lightMotionOn=false};
};



// click()
function handleClicks(ev) {
  g_globalAngle += 0.1;

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();

}

// Conver the x and y coordinates of each position that the user click on
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2); ///
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}

// Draw every shape that is supposed to be in the canvas
// based on some data structure that is holding all the information about what
// to draw, actually draw all the shapes.
function renderAllShapes() {
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Pass the light position and camera Posiotn to GLSL
  gl.uniform3f(u_cameraPos, g_eye[0], g_eye[1], g_eye[2]);
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_spotLightPos, g_spotLightPos[0], g_spotLightPos[1], g_spotLightPos[2]);


  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform1i(u_spotLightOn, g_spotLightOn);

  // Draw the light
  var light = new Cube();
  light.textureNum = -2;
  light.color=[2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1,-0.1,-0.1);
  light.matrix.translate(-0.5,-0.5,-0.5);
  light.render();

  // Draw the spotlight
  var spotlight = new Cube();
  spotlight.textureNum = -2;
  spotlight.color=[0,1,1,1];
  spotlight.matrix.translate(g_spotLightPos[0], g_spotLightPos[1], g_spotLightPos[2]);
  spotlight.matrix.scale(-0.2,-0.2,-0.2);
  spotlight.matrix.translate(-0.5,-9,-5);
  spotlight.render();



  renderScene();
}

function lightMotion() {
  g_lightPos[0] = Math.cos(g_seconds) * 1.2; ///
}

function updateAnimationAngles() {
  if (g_RLAnimation && !pokeAnimation) {
    g_RLegAngle = 70*(1 - Math.cos(3*g_seconds)) + 30;
    g_RFootAngle = 30*Math.sin(2*g_seconds);
    g_LLegAngle = 70*(1 - Math.sin(3*g_seconds)) + 30;
    g_LFootAngle = 30*Math.sin(2*g_seconds);
    g_LArmAngle = 45*Math.cos(4*g_seconds);
    g_RArmAngle = 45*(1 - Math.sin(4*g_seconds))+45;
    g_tailAngle = 10 * Math.sin(2*g_seconds);
    g_BellyAngle = 10 * (1- Math.sin(4.5*g_seconds)) - 50;
    g_LEarAngle = 0;
    g_REarAngle = 0;
  }
  else if (pokeAnimation) {
    g_LEarAngle = 45*Math.sin(g_seconds);
    g_REarAngle = 45*Math.cos(g_seconds);
  }

  if (g_lightMotionOn) {
    lightMotion();
  }
  
}

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 0, 3, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 0, 3, 3, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 5, 4, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 5, 6, 5, 4, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 5, 4, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

function drawMap() {

  var walls3 = [];
  var walls4 = [];
  var walls5 = [];
  var walls6 = [];
  for (x = 0; x < 32; x++) {
    for (y = 0; y < 32; y++) {
      if (g_map[x][y] == 1) {
        var block = new Cube(); // Use with render
        block.textureNum = -1;
        block.matrix.translate(x - 16, -5, y-16);

        block.render();
      }
      else if (g_map[x][y] == 2 || g_map[x][y] == 3 || g_map[x][y] == 4 || g_map[x][y] == 5 || g_map[x][y] == 6) {
        var block = new Cube(); // Use with render
        block.textureNum = 2;
        block.matrix.translate(x - 16, -5, y-16);
        if(g_map[x][y] == 3 || g_map[x][y] == 4 || g_map[x][y] == 5 || g_map[x][y] == 6){block.textureNum = 0;walls3.push(block);}
        if(g_map[x][y] == 4 || g_map[x][y] == 5 || g_map[x][y] == 6){block.textureNum = 0;walls4.push(block);}
        if(g_map[x][y] == 5 || g_map[x][y] == 6){block.textureNum = 0;walls5.push(block);}
        if(g_map[x][y] == 6){block.textureNum = 0;walls6.push(block);}
        block.render();
      }
    }
  }
  
  for(var i = 0; i < walls3.length; i++){
    var wall = walls3[i];
    wall.matrix.translate(0, 1, 0);
    wall.render();
  }
  for(var i = 0; i < walls4.length; i++){
    var wall = walls4[i];
    wall.matrix.translate(0, 1, 0);
    wall.render();
  }
  for(var i = 0; i < walls5.length; i++){
    var wall = walls5[i];
    wall.matrix.translate(0, 1, 0);
    wall.render();
  }
  if (!animalShowP ){
    for(var i = 0; i < walls6.length; i++){
      var wall = walls6[i];
      wall.matrix.translate(0, 1, 0);
      wall.render();
    }
  }
}

let animalShowP1 = false;
let animalShowP2 = false;

function renderScene() {
  lightWorld();

}

function lightWorld() {
  var sky = new Cube();
  sky.textureNum = -2;
  sky.color = [0.8, 0.8, 0.8, 1.0];
  if (g_normalON) sky.textureNum = -3;
  sky.matrix.scale(-32, -32, -32);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  // sky.normalMatrix.setInverseOf(sky.matrix).transpose(); ///?
  sky.render();

  var box = new Cube();
  box.textureNum = -2;
  box.color = [1,1,0.5,1];
  if (g_normalON) box.textureNum = -3;
  box.matrix.translate(0,-0.5,-2.5)
  box.render();

  var ball = new Sphere();
  ball.textureNum = -2;
  ball.color = [1,0,1,1];
  if (g_normalON) ball.textureNum = -3;
  ball.matrix.translate(-1,-1,-2)
  ball.render(); ///

  animal(); ///

}

function world() {
  // Sky
  var sky = new Cube();
  sky.textureNum = 1;
  // g_textUnit = 1;
  sky.color = [0, 0.9, 1, 1];
  sky.matrix.translate(-500, -50, -500);
  sky.matrix.scale(1000, 1000, 1000);
  sky.render();

  // Ground
  var ground = new Cube();
  ground.textureNum = -2;
  ground.color = [0.5, 0.9, 0, 1];
  ground.matrix.translate(-500, -50, -500);

  ground.matrix.scale(1000, 10, 1000);
  ground.render();


  drawMap();

  if (animalShowP1 && animalShowP2)
  {
    animal(); // the animal will only show if add and delete 10 new blocks
  }
  
}


function animal() {
  var body = new Cube();
  body.textureNum = -2;
  body.color = [0.8, 0.655, 0.227, 1.0];
  body.matrix.translate(-0.25, -0.5, -0.1);
  body.matrix.scale(0.5, 0.7, 0.7); // reverse order
  body.render();

  var body2 = new Cube();
  body2.color = [0.8, 0.655, 0.227, 1.0];
  body2.textureNum = -2;
  body2.matrix.translate(-0.33, -0.45, -0.1001);
  body2.matrix.scale(0.65, 0.68, 0.7); // reverse order
  body2.render();

  // draw the belly
  var belly = new Cube();
  belly.color = [0.8, 0.655, 0.227, 1];
  belly.textureNum = -2;
  belly.matrix.setTranslate(-0.35, g_BellyAngle/100, -0.12);
  var Belly2Mat = new Matrix4(belly.matrix);
  var RlegMat = new Matrix4(belly.matrix);
  var LlegMat = new Matrix4(belly.matrix);
  var tailMat = new Matrix4(belly.matrix);
  belly.matrix.scale(0.7, 0.4, 0.8);
  belly.render();

  var belly2 = new Cube();
  belly2.textureNum = -2;
  belly2.color = [0.988, 0.871, 0.529, 1]
  belly2.matrix = Belly2Mat;
  belly2.matrix.translate(0.15,0,-.1);
  belly2.matrix.scale(.4,.45,.1);
  belly2.render();


  // draw a left arm
  var leftArm = new Cube();
  leftArm.textureNum = -2;
  leftArm.color = [0.42, 0.329, 0.075, 1.0];
  leftArm.matrix.setTranslate(0.25, 0.2, 0.01);
  leftArm.matrix.rotate(-g_LArmAngle, 0.0, 0.0, 1.0);
  var leftUArmMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.6, 0.25, 0.5); // reverse order
  leftArm.render();

  // left upper arm
  var leftUArm = new Cube();
  leftUArm.textureNum = -2;
  leftUArm.color = [0.251, 0.196, 0.035, 1.0];
  leftUArm.matrix = leftUArmMat;
  leftUArm.matrix.translate(0.35, 0.25, -0.25);
  leftUArm.matrix.rotate(-g_LHandAngle, 0.0, 0.0, 1.0);
  leftUArm.matrix.scale(0.25, 0.25, 0.25); // reverse order
  leftUArm.render();

  // draw a right arm
  var rightArm = new Cube();
  rightArm.textureNum = -2;
  rightArm.color = [0.42, 0.329, 0.075, 1.0];
  rightArm.matrix.setTranslate(-0.25, 0.2, 0.01);
  rightArm.matrix.rotate(g_RArmAngle, 0.0, 0.0, 1.0);
  //rightArm.matrix.rotate(135*Math.sin(g_seconds), 0.0, 0.0, 1.0);
  var rightUArmMat = new Matrix4(rightArm.matrix);
  rightArm.matrix.scale(0.25, 0.6, 0.5); // reverse order
  rightArm.render();

  // right upper arm
  var rightUArm = new Cube();
  rightUArm.textureNum = -2;
  rightUArm.color = [0.251, 0.196, 0.035, 1.0];
  rightUArm.matrix = rightUArmMat;
  rightUArm.matrix.translate(0.25, 0.35, -0.25);
  rightUArm.matrix.rotate(g_RHandAngle, 0.0, 0.0, 1.0);
  rightUArm.matrix.scale(0.25, 0.25, 0.255); // reverse order
  rightUArm.render();

  // draw a right leg
  var rightLeg = new Cube();
  rightLeg.textureNum = -2;
  rightLeg.color = [0.42, 0.329, 0.075, 1.0];
  rightLeg.matrix = RlegMat;
  rightLeg.matrix.translate(-0.2, 0.08, 0.3);
  rightLeg.matrix.rotate(g_RLegAngle, g_RLegAngle, 0.0, 1.0);

  var rightFootMat = new Matrix4(rightLeg.matrix);
  rightFootMat.textureNum = -2;
  rightLeg.matrix.scale(0.3, 0.3, 0.6); // reverse order
  rightLeg.render();

  // right foot
  var rightFoot = new Cube();
  rightFoot.textureNum = -2;
  rightFoot.color = [0.251, 0.196, 0.035, 1.0];
  rightFoot.matrix = rightFootMat;
  rightFoot.matrix.translate(0.0, 0.3, 0.55);
  rightFoot.matrix.rotate(g_RFootAngle, -g_RFootAngle, 0.0, 1.0);
  rightFoot.matrix.scale(0.3, -0.35, 0.2); // reverse order
  rightFoot.render();

  // draw a left leg
  var leftLeg = new Cube();
  leftLeg.textureNum = -2;
  leftLeg.color = [0.42, 0.329, 0.075, 1.0];
  // leftLeg.matrix.setTranslate(0.2, -0.25, 0.2);
  leftLeg.matrix = LlegMat;
  leftLeg.matrix.translate(0.5, 0.08, 0.3);
  leftLeg.matrix.rotate(g_LLegAngle, g_LLegAngle, 0.0, 1.0);
  var leftFootMat = new Matrix4(leftLeg.matrix);
  leftLeg.matrix.scale(0.3, 0.3, 0.6); // reverse order
  leftLeg.render();

  // left foot
  var leftFoot = new Cube();
  leftFoot.textureNum = -2;
  leftFoot.color = [0.251, 0.196, 0.035, 1.0];
  leftFoot.matrix = leftFootMat;
  leftFoot.matrix.translate(0.0, 0.3, 0.55);
  leftFoot.matrix.rotate(g_LFootAngle, -g_LFootAngle, 0.0, 1.0);
  leftFoot.matrix.scale(0.3, -0.35, 0.2); // reverse order
  leftFoot.render();

  // draw the head cube
  var head = new Cube();
  head.textureNum = -2;
  head.color = [0.8, 0.655, 0.227, 1.0];
  var headMat = new Matrix4(head.matrix);
  head.matrix.translate(-0.25, 0.2, 0.0);
  head.matrix.scale(0.5, 0.5, 0.5); // reverse order
  head.render();

  var head2 = new Cube();
  head2.textureNum = -2;
  head2.color = [0.8, 0.655, 0.227, 1.0];
  head2.matrix = headMat;
  head2.matrix.scale(.55,.25,.5);
  head2.matrix.translate(-.5,1.5,.001);
  head2.render();

  var head3 = new Cube();
  head3.textureNum = -2;
  head3.color = [0.8, 0.655, 0.227, 1.0];
  head3.matrix = headMat;
  head3.matrix.scale(1.1,.5,.99);
  head3.matrix.translate(-0.05,.5,.0001);
  head3.render();
  
  var head4 = new Cube();
  head4.textureNum = -2;
  head4.color = [0.8, 0.655, 0.227, 1.0];
  head4.matrix = headMat;
  head4.matrix.scale(0.4,1.5,.99);
  head4.matrix.translate(.75,.6,.0001);
  head4.render();

  // front shoulder
  var frontShold = new Cube();
  frontShold.textureNum = -2;
  frontShold.color = [0.42, 0.329, 0.075, 1.0];
  frontShold.matrix.translate(-0.3, 0.2, -0.05);
  frontShold.matrix.scale(0.6, 0.1, 0.05); // reverse order
  frontShold.render();

  // back shoulder
  var backShold = new Cube();
  backShold.textureNum = -2;
  backShold.color = [0.42, 0.329, 0.075, 1.0];
  backShold.matrix.translate(-0.3, 0.2, 0.5);
  backShold.matrix.scale(0.6, 0.1, 0.05); // reverse order
  backShold.render();

  // left shoulder
  var leftShold = new Cube();
  leftShold.textureNum = -2;
  leftShold.color = [0.0, 0.0, 0.0, 1.0];
  leftShold.matrix.translate(0.25, 0.2, 0.0);
  leftShold.matrix.scale(0.05, 0.1, 0.5); // reverse order
  leftShold.render();

  // right shoulder
  var rightShold = new Cube();
  rightShold.textureNum = -2;
  rightShold.color = [0.0, 0.0, 0.0, 1.0];
  rightShold.matrix.translate(-0.3, 0.2, 0.0);
  rightShold.matrix.scale(0.05, 0.1, 0.5); // reverse order
  rightShold.render();

  // right ear
  var rightEar = new Cube();
  rightEar.textureNum = -2;
  rightEar.color = [0.251, 0.196, 0.035, 1.0];
  rightEar.matrix.translate(-0.27, 0.7, 0.2);
  rightEar.matrix.rotate(g_REarAngle, 0, 0, 1);
  rightEar.matrix.scale(0.12, 0.12, 0.09); // reverse order
  rightEar.render();

  // left ear
  var leftEar = new Cube();
  leftEar.textureNum = -2;
  leftEar.color = [0.251, 0.196, 0.035, 1.0];
  leftEar.matrix.translate(0.15, 0.7, 0.2);
  leftEar.matrix.rotate(g_LEarAngle, 0, 0, 1);
  leftEar.matrix.scale(0.12, 0.12, 0.09); // reverse order
  leftEar.render();

  // right eye
  var rightEye = new Cube();
  rightEye.textureNum = -2;
  rightEye.color = [0.251, 0.196, 0.035, 1.0];
  rightEye.matrix.translate(-0.21, 0.46, 0.0);
  rightEye.matrix.rotate(-25, 0.0, 0.0, 1.0);
  rightEye.matrix.scale(0.1, 0.17, -0.01); // reverse order
  rightEye.render();

  var rightpupil = new Cube();
  rightpupil.textureNum = -2;
  rightpupil.color = [1.0, 1.0, 1.0, 1.0];
  rightpupil.matrix.translate(-0.15, 0.52, -0.01001);
  rightpupil.matrix.scale(0.05, 0.05, -0.001); // reverse order
  rightpupil.render();

  var rightpupil2 = new Cube();
  rightpupil2.textureNum = -2;
  rightpupil2.color = [0.0, 0.0, 0.0, 1.0];
  rightpupil2.matrix.translate(-0.132, 0.53, -0.015);
  rightpupil2.matrix.scale(0.025, 0.025, -0.0001); // reverse order
  rightpupil2.render();


  // left eye
  var leftEye = new Cube();
  leftEye.textureNum = -2;
  leftEye.color = [0.251, 0.196, 0.035, 1.0];
  leftEye.matrix.translate(0.12, 0.42, 0.0);
  leftEye.matrix.rotate(25.0, 0.0, 0.0, 1.0);
  leftEye.matrix.scale(0.1, 0.17, -0.01); // reverse order
  leftEye.render();

  var leftpupil = new Cube();
  leftpupil.textureNum = -2;
  leftpupil.color = [1.0, 1.0, 1.0, 1.0];
  leftpupil.matrix.translate(0.101, 0.52, -0.01001);
  leftpupil.matrix.scale(0.05, 0.05, -0.001); // reverse order
  leftpupil.render();

  var leftpupil2 = new Cube();
  leftpupil2.textureNum = -2;
  leftpupil2.color = [0.0, 0.0, 0.0, 1.0];
  leftpupil2.matrix.translate(0.111, 0.53, -0.015);
  leftpupil2.matrix.scale(0.025, 0.025, -0.0001); // reverse order
  leftpupil2.render();

  // nose and mouth
  var nose = new Cube();
  nose.textureNum = -2;
  nose.color = [1.0, 1.0, 1.0, 1.0];
  nose.matrix.translate(-0.09, 0.30, -0.1);
  nose.matrix.scale(0.18, 0.18, 0.1); // reverse order
  nose.render();

  var nose1 = new Cube();
  nose1.textureNum = -2;
  nose1.color = [0.0, 0.0, 0.0, 1.0];
  nose1.matrix.translate(-0.045, 0.38, -0.11);
  nose1.matrix.scale(0.09, 0.09, 0.01); // reverse order
  nose1.render();

  var nose2 = new Cube();
  nose2.textureNum = -2;
  nose2.color = [0.0, 0.0, 0.0, 1.0];
  nose2.matrix.translate(-0.0019, 0.33, -0.11);
  nose2.matrix.scale(0.01, 0.05, 0.01); // reverse order
  nose2.render();

  var nose3 = new Cube();
  nose3.textureNum = -2;
  nose3.color = [0.0, 0.0, 0.0, 1.0];
  nose3.matrix.translate(-0.05, 0.33, -0.11);
  nose3.matrix.scale(0.1, 0.01, 0.01); // reverse order
  nose3.render();

  // tail
  var tail = new Cube();
  tail.textureNum = -2;
  tail.color = [0.251, 0.196, 0.035, 1.0];
  //tail.matrix.setTranslate(-0.1, -0.38, 0.6);
  tail.matrix = tailMat;
  tail.matrix.translate(0.25, 0.0, 0.8);
  tail.matrix.rotate(g_tailAngle, -g_tailAngle, 0.0, 1.0);
  tail.matrix.scale(0.2, -0.15, -0.03); // reverse order
  tail.render();

  // // trees
  // var tree1 = new Cone();
  // tree1.color = [0.251, 0.478, 0.055, 1];
  // tree1.matrix.translate(0.7, 0.5, .9);
  // tree1.matrix.rotate(-180, 0, -1, 1.0);
  // tree1.matrix.scale(0.2, 0.2, 0.5);
  // tree1.render();

  // var tree2 = new Cone();
  // tree2.color = [0.208, 0.388, 0.051, 1];
  // tree2.matrix.translate(0.7, 0.3, .9);
  // tree2.matrix.rotate(-180, 0, -1, 1.0);
  // tree2.matrix.scale(0.25, 0.25, 0.5);
  // tree2.render();

  // var tree3 = new Cube();
  // tree3.color = [0.125, 0.212, 0.051,1];
  // tree3.matrix.scale(.1,.5,.1);
  // tree3.matrix.translate(6.5, -1, 8.5);
  // tree3.render();
}


function initTextures(gl, n) {
  // Create the image object
  var image = new Image();
  var image1 = new Image();
  if (!image) {
    console.log('Failed to create the image object.')
    return false;
  }
  if (!image1) {
    console.log('Failed to create the image1 object.')
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendImageToTEXTURE0(image, 0);};  
  image1.onload = function(){ sendImageToTEXTURE0(image1, 1);}; 
  image.src = 'wallpaper.jpg'; // The size of image need to be 256x256
  image1.src = 'file0.jpg';

  return true
}

var g_textUnit0 = false;
var g_textUnit1 = false;

function sendImageToTEXTURE0(image, textUnit) {
  var texture = gl.createTexture(); // create a texture object
  var texture1 = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object.')
    return false;
  }
  if (!texture1) {
    console.log('Failed to create the texture1 object.')
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-axis

  if (textUnit == 0) {
    gl.activeTexture(gl.TEXTURE0); // Enable texture unit0, 8 texture units
    g_textUnit0 = true;
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture object to the target
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Set the texture parameters
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); // Set the texture image
    gl.uniform1i(u_Sampler0, textUnit); // Set the texture unit 0 to the sampler
  } else {
    gl.activeTexture(gl.TEXTURE1);
    g_textUnit1 = true;
    gl.bindTexture(gl.TEXTURE_2D, texture1); // Bind the texture object to the target
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Set the texture parameters
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); // Set the texture image
    gl.uniform1i(u_Sampler1, textUnit); // Set the texture unit 0 to the sampler
  }  
  console.log('Finished loadTexture');
}

var g_shapesList = []; // Global variable
var g_eye = [0,0,2];
var g_at = [0,0,-1];
var g_up = [0,1,0];
var g_fov = 100;
var g_speed = 1;
var g_alpha = 1;

// main program
function main() {
  // set up canvas and gl variables
  setupWebGL();
  // set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  // read color and shape size from sliders
  addActionsForHtmlUI();
  // register function (event handler) to be called on a mouse press
  canvas.onmousedown = handleClicks;
  canvas.onmousemove = function(ev) {if (ev.shiftKey) {pokeAnimation = true} else if (ev.buttons == 1) {handleClicks(ev)}};

  document.onkeydown = keydown;

  backGround(); // specify the color for clearing <canvas>
  initTextures(gl, 0); // load the texture // Set texture

  var cam = new Camera();
  cam.setup();

  //renderAllShapes();
  requestAnimationFrame(tick);
}

function keydown(ev) {
  if (ev.keyCode == 87) { // moveForward, W
    var cam = new Camera();
    cam.eye.elements = g_eye;
    cam.at.elements = g_at;
    cam.up.elements = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.moveForward();
    g_eye = cam.eye.elements;
    g_at = cam.at.elements;
    g_up = cam.up.elements;
  } else if (ev.keyCode == 83) { //moveBackwards, S
    var cam = new Camera();
    cam.eye.elements = g_eye;
    cam.at.elements = g_at;
    cam.up.elements = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.moveBackwards();
    g_eye = cam.eye.elements;
    g_at = cam.at.elements;
    g_up = cam.up.elements;


  } else if (ev.keyCode == 65) { // moveLeft, A
    var cam = new Camera();
    cam.eye.elements = g_eye;
    cam.at.elements = g_at;
    cam.up.elements = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.moveLeft();
    g_eye = cam.eye.elements;
    g_at = cam.at.elements;
    g_up = cam.up.elements;
  } else if (ev.keyCode == 68) { // moveRight, D
    var cam = new Camera();
    cam.eye.elements = g_eye;
    cam.at.elements = g_at;
    cam.up.elements = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.moveRight();
    g_eye = cam.eye.elements;
    g_at = cam.at.elements;
    g_up = cam.up.elements;
  } else if (ev.keyCode == 81) { // panLeft, Q
    var cam = new Camera();
    cam.eye.elements = g_eye;
    cam.at.elements = g_at;
    cam.up.elements = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.panLeft();
    g_eye = cam.eye.elements;
    g_at = cam.at.elements;
    g_up = cam.up.elements;
  } else if (ev.keyCode == 69) { // panRight, E
    var cam = new Camera();    
    cam.eye.elements = g_eye;
    cam.at.elements = g_at;
    cam.up.elements = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.panRight();
    g_eye = cam.eye.elements;
    g_at = cam.at.elements;
    g_up = cam.up.elements;
  }
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

// Called by broswer repeatedly whenever its time
function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0-g_startTime; // performance returns millesecond(ms)

  // Update animation angles
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function backGround() {
  // specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
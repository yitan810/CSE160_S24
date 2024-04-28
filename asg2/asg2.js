// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;


// get the canvas and gl context
function setupWebGL() {
  //Retrive <canvas> element
  canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
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

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotetaMatrix');
    return;
  }
}


let g_globalAngle = -30;
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

function addActionsForHtmlUI() {
  // AngleSilde

  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes()});

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
    g_LAAnimation = false; g_RAAnimation = false; g_tailAnimation = false}; g_BellyAnimation = false; pokeAnimation = false};



// click()
function handleClicks(ev) {
  g_globalAngle += 10;

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

function renderAllShapes() {

  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderScene();
  var duration = performance.now() - startTime;
    sendTexttoHTML( " ms: " + Math.floor(duration) + " FPS: " + Math.floor(10000 / duration), "htmlID");
}

function sendTexttoHTML(text, htmlID) {
  var htmlElem = document.getElementById(htmlID);
  if (!htmlElem) {
      console.log("Failed to get " + htmlID + " from HTML");
      return;
  }
  htmlElem.innerHTML = text;

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
}

function renderScene() {
  // draw the body cube
  var body = new Cube();
  body.color = [0.8, 0.655, 0.227, 1.0];
  body.matrix.translate(-0.25, -0.5, -0.1);
  body.matrix.scale(0.5, 0.7, 0.7); // reverse order
  body.render();

  var body2 = new Cube();
  body2.color = [0.8, 0.655, 0.227, 1.0];
  body2.matrix.translate(-0.33, -0.45, -0.1001);
  body2.matrix.scale(0.65, 0.68, 0.7); // reverse order
  body2.render();

  // draw the belly
  var belly = new Cube();
  belly.color = [0.8, 0.655, 0.227, 1];
  belly.matrix.setTranslate(-0.35, g_BellyAngle/100, -0.12);
  var Belly2Mat = new Matrix4(belly.matrix);
  var RlegMat = new Matrix4(belly.matrix);
  var LlegMat = new Matrix4(belly.matrix);
  var tailMat = new Matrix4(belly.matrix);
  belly.matrix.scale(0.7, 0.4, 0.8);
  belly.render();

  var belly2 = new Cube();
  belly2.color = [0.988, 0.871, 0.529, 1]
  belly2.matrix = Belly2Mat;
  belly2.matrix.translate(0.15,0,-.1);
  belly2.matrix.scale(.4,.45,.1);
  belly2.render();


  // draw a left arm
  var leftArm = new Cube();
  leftArm.color = [0.42, 0.329, 0.075, 1.0];
  leftArm.matrix.setTranslate(0.25, 0.2, 0.01);
  leftArm.matrix.rotate(-g_LArmAngle, 0.0, 0.0, 1.0);
  var leftUArmMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.6, 0.25, 0.5); // reverse order
  leftArm.render();

  // left upper arm
  var leftUArm = new Cube();
  leftUArm.color = [0.251, 0.196, 0.035, 1.0];
  leftUArm.matrix = leftUArmMat;
  leftUArm.matrix.translate(0.35, 0.25, -0.25);
  leftUArm.matrix.rotate(-g_LHandAngle, 0.0, 0.0, 1.0);
  leftUArm.matrix.scale(0.25, 0.25, 0.25); // reverse order
  leftUArm.render();

  // draw a right arm
  var rightArm = new Cube();
  rightArm.color = [0.42, 0.329, 0.075, 1.0];
  rightArm.matrix.setTranslate(-0.25, 0.2, 0.01);
  rightArm.matrix.rotate(g_RArmAngle, 0.0, 0.0, 1.0);
  //rightArm.matrix.rotate(135*Math.sin(g_seconds), 0.0, 0.0, 1.0);
  var rightUArmMat = new Matrix4(rightArm.matrix);
  rightArm.matrix.scale(0.25, 0.6, 0.5); // reverse order
  rightArm.render();

  // right upper arm
  var rightUArm = new Cube();
  rightUArm.color = [0.251, 0.196, 0.035, 1.0];
  rightUArm.matrix = rightUArmMat;
  rightUArm.matrix.translate(0.25, 0.35, -0.25);
  rightUArm.matrix.rotate(g_RHandAngle, 0.0, 0.0, 1.0);
  rightUArm.matrix.scale(0.25, 0.25, 0.255); // reverse order
  rightUArm.render();

  // draw a right leg
  var rightLeg = new Cube();
  rightLeg.color = [0.42, 0.329, 0.075, 1.0];
  rightLeg.matrix = RlegMat;
  rightLeg.matrix.translate(-0.2, 0.08, 0.3);
  rightLeg.matrix.rotate(g_RLegAngle, g_RLegAngle, 0.0, 1.0);

  var rightFootMat = new Matrix4(rightLeg.matrix);
  rightLeg.matrix.scale(0.3, 0.3, 0.6); // reverse order
  rightLeg.render();

  // right foot
  var rightFoot = new Cube();
  rightFoot.color = [0.251, 0.196, 0.035, 1.0];
  rightFoot.matrix = rightFootMat;
  rightFoot.matrix.translate(0.0, 0.3, 0.55);
  rightFoot.matrix.rotate(g_RFootAngle, -g_RFootAngle, 0.0, 1.0);
  rightFoot.matrix.scale(0.3, -0.35, 0.2); // reverse order
  rightFoot.render();

  // draw a left leg
  var leftLeg = new Cube();
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
  leftFoot.color = [0.251, 0.196, 0.035, 1.0];
  leftFoot.matrix = leftFootMat;
  leftFoot.matrix.translate(0.0, 0.3, 0.55);
  leftFoot.matrix.rotate(g_LFootAngle, -g_LFootAngle, 0.0, 1.0);
  leftFoot.matrix.scale(0.3, -0.35, 0.2); // reverse order
  leftFoot.render();

  // draw the head cube
  var head = new Cube();
  head.color = [0.8, 0.655, 0.227, 1.0];
  var headMat = new Matrix4(head.matrix);
  head.matrix.translate(-0.25, 0.2, 0.0);
  head.matrix.scale(0.5, 0.5, 0.5); // reverse order
  head.render();

  var head2 = new Cube();
  head2.color = [0.8, 0.655, 0.227, 1.0];
  head2.matrix = headMat;
  head2.matrix.scale(.55,.25,.5);
  head2.matrix.translate(-.5,1.5,.001);
  head2.render();

  var head3 = new Cube();
  head3.color = [0.8, 0.655, 0.227, 1.0];
  head3.matrix = headMat;
  head3.matrix.scale(1.1,.5,.99);
  head3.matrix.translate(-0.05,.5,.0001);
  head3.render();
  
  var head4 = new Cube();
  head4.color = [0.8, 0.655, 0.227, 1.0];
  head4.matrix = headMat;
  head4.matrix.scale(0.4,1.5,.99);
  head4.matrix.translate(.75,.6,.0001);
  head4.render();

  // front shoulder
  var frontShold = new Cube();
  frontShold.color = [0.42, 0.329, 0.075, 1.0];
  frontShold.matrix.translate(-0.3, 0.2, -0.05);
  frontShold.matrix.scale(0.6, 0.1, 0.05); // reverse order
  frontShold.render();

  // back shoulder
  var backShold = new Cube();
  backShold.color = [0.42, 0.329, 0.075, 1.0];
  backShold.matrix.translate(-0.3, 0.2, 0.5);
  backShold.matrix.scale(0.6, 0.1, 0.05); // reverse order
  backShold.render();

  // left shoulder
  var leftShold = new Cube();
  leftShold.color = [0.0, 0.0, 0.0, 1.0];
  leftShold.matrix.translate(0.25, 0.2, 0.0);
  leftShold.matrix.scale(0.05, 0.1, 0.5); // reverse order
  leftShold.render();

  // right shoulder
  var rightShold = new Cube();
  rightShold.color = [0.0, 0.0, 0.0, 1.0];
  rightShold.matrix.translate(-0.3, 0.2, 0.0);
  rightShold.matrix.scale(0.05, 0.1, 0.5); // reverse order
  rightShold.render();

  // right ear
  var rightEar = new Cube();
  rightEar.color = [0.251, 0.196, 0.035, 1.0];
  rightEar.matrix.translate(-0.27, 0.7, 0.2);
  rightEar.matrix.rotate(g_REarAngle, 0, 0, 1);
  rightEar.matrix.scale(0.12, 0.12, 0.09); // reverse order
  rightEar.render();

  // left ear
  var leftEar = new Cube();
  leftEar.color = [0.251, 0.196, 0.035, 1.0];
  leftEar.matrix.translate(0.15, 0.7, 0.2);
  leftEar.matrix.rotate(g_LEarAngle, 0, 0, 1);
  leftEar.matrix.scale(0.12, 0.12, 0.09); // reverse order
  leftEar.render();

  // right eye
  var rightEye = new Cube();
  rightEye.color = [0.251, 0.196, 0.035, 1.0];
  rightEye.matrix.translate(-0.21, 0.46, 0.0);
  rightEye.matrix.rotate(-25, 0.0, 0.0, 1.0);
  rightEye.matrix.scale(0.1, 0.17, -0.01); // reverse order
  rightEye.render();

  var rightpupil = new Cube();
  rightpupil.color = [1.0, 1.0, 1.0, 1.0];
  rightpupil.matrix.translate(-0.15, 0.52, -0.01001);
  rightpupil.matrix.scale(0.05, 0.05, -0.001); // reverse order
  rightpupil.render();

  var rightpupil2 = new Cube();
  rightpupil2.color = [0.0, 0.0, 0.0, 1.0];
  rightpupil2.matrix.translate(-0.132, 0.53, -0.015);
  rightpupil2.matrix.scale(0.025, 0.025, -0.0001); // reverse order
  rightpupil2.render();


  // left eye
  var leftEye = new Cube();
  leftEye.color = [0.251, 0.196, 0.035, 1.0];
  leftEye.matrix.translate(0.12, 0.42, 0.0);
  leftEye.matrix.rotate(25.0, 0.0, 0.0, 1.0);
  leftEye.matrix.scale(0.1, 0.17, -0.01); // reverse order
  leftEye.render();

  var leftpupil = new Cube();
  leftpupil.color = [1.0, 1.0, 1.0, 1.0];
  leftpupil.matrix.translate(0.101, 0.52, -0.01001);
  leftpupil.matrix.scale(0.05, 0.05, -0.001); // reverse order
  leftpupil.render();

  var leftpupil2 = new Cube();
  leftpupil2.color = [0.0, 0.0, 0.0, 1.0];
  leftpupil2.matrix.translate(0.111, 0.53, -0.015);
  leftpupil2.matrix.scale(0.025, 0.025, -0.0001); // reverse order
  leftpupil2.render();

  // nose and mouth
  var nose = new Cube();
  nose.color = [1.0, 1.0, 1.0, 1.0];
  nose.matrix.translate(-0.09, 0.30, -0.1);
  nose.matrix.scale(0.18, 0.18, 0.1); // reverse order
  nose.render();

  var nose1 = new Cube();
  nose1.color = [0.0, 0.0, 0.0, 1.0];
  nose1.matrix.translate(-0.045, 0.38, -0.11);
  nose1.matrix.scale(0.09, 0.09, 0.01); // reverse order
  nose1.render();

  var nose2 = new Cube();
  nose2.color = [0.0, 0.0, 0.0, 1.0];
  nose2.matrix.translate(-0.0019, 0.33, -0.11);
  nose2.matrix.scale(0.01, 0.05, 0.01); // reverse order
  nose2.render();

  var nose3 = new Cube();
  nose3.color = [0.0, 0.0, 0.0, 1.0];
  nose3.matrix.translate(-0.05, 0.33, -0.11);
  nose3.matrix.scale(0.1, 0.01, 0.01); // reverse order
  nose3.render();

  // tail
  var tail = new Cube();
  tail.color = [0.251, 0.196, 0.035, 1.0];
  //tail.matrix.setTranslate(-0.1, -0.38, 0.6);
  tail.matrix = tailMat;
  tail.matrix.translate(0.25, 0.0, 0.8);
  tail.matrix.rotate(g_tailAngle, -g_tailAngle, 0.0, 1.0);
  tail.matrix.scale(0.2, -0.15, -0.03); // reverse order
  tail.render();

  // trees
  var tree1 = new Cone();
  tree1.color = [0.251, 0.478, 0.055, 1];
  tree1.matrix.translate(0.7, 0.5, .9);
  tree1.matrix.rotate(-180, 0, -1, 1.0);
  tree1.matrix.scale(0.2, 0.2, 0.5);
  tree1.render();

  var tree2 = new Cone();
  tree2.color = [0.208, 0.388, 0.051, 1];
  tree2.matrix.translate(0.7, 0.3, .9);
  tree2.matrix.rotate(-180, 0, -1, 1.0);
  tree2.matrix.scale(0.25, 0.25, 0.5);
  tree2.render();

  var tree3 = new Cube();
  tree3.color = [0.125, 0.212, 0.051,1];
  tree3.matrix.scale(.1,.5,.1);
  tree3.matrix.translate(6.5, -1, 8.5);
  tree3.render();
}


var g_shapesList = []; // Global variable

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
  backGround();
  
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

// Called by broswer repeatedly whenever its time
function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0-g_startTime; // performance returns millesecond(ms)
  // console.log(g_seconds);

  // Update animation angles
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function backGround() {
  // specify the color for clearing <canvas>
  gl.clearColor(0.192, 0.58, 0.671, 1.0);
  // clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
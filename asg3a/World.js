// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    // gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  varying vec2 v_UV;
  void main() {
    if (u_whichTexture == -2) {                         // Use color
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {                  // Use UV debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {                  // Use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {                  // Use texture1
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else {                                            // Error, put Redish
      gl_FragColor = vec4(1, 0.2, 0.2, 1.0);
    }
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size; /// not using
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

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

  // // Get the storage location of a_Position
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



let g_globalAngle = -30;

function addActionsForHtmlUI() {
  // AngleSilde
  // document.getElementById('angleSlide').addEventListener('mouseup', function() {g_globalAngle = this.value; renderAllShapes()});
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes()});
  // document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene()});

  };



// click()
function handleClicks(ev) {
  g_globalAngle += 1;

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
  renderScene();
}


var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]


function drawMap() {
  // var block = new Cube(); // use with renderFast
  for (x = 0; x < 32; x++) {
    for (y = 0; y < 32; y++) {
      if (g_map[x][y] == 1) {
        var block = new Cube(); // Use with render
        block.textureNum = -1;
        block.matrix.translate(x - 16, -1, y-16);

        block.render();
      }
      else if (g_map[x][y] == 2 && (!animalShowP1 || !animalShowP2)) {
        var block = new Cube(); // Use with render
        block.textureNum = 0;
        block.color = [1,1,1,1];
        block.matrix.translate(x - 16, -1, y-16);
        //block.matrix.scale(1, 2, 1);

        block.render();
      }
    }
  }
}

let animalShowP1 = false;
let animalShowP2 = false;

function renderScene() {
  // Sky
  var sky = new Cube();
  sky.textureNum = 1;
  //sky.color = [0, 0, 0, 1];
  sky.matrix.translate(-500, -50, -500);
  sky.matrix.scale(1000, 1000, 1000);
  sky.render();

  // Ground
  var ground = new Cube();
  ground.textureNum = -2;
  ground.color = [0.706, 0.929, 0.557, 1];
  ground.matrix.translate(-500, -50, -500);
  // ground.matrix.rotate(90,90,0,1);
  ground.matrix.scale(1000, 10, 1000);
  ground.render();


  var block = new Cube();
  for (i = 0; i < flexBlock.length; i++) {
    block.textureNum = 0;
    //block.matrix.setTranslate(0,0,0);
    block.matrix.translate(flexBlock[i][0],flexBlock[i][1],flexBlock[i][2]);
    //console.log(block.martix);
    block.render();

  }

  drawMap();
  
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
  image.src = 'file.jpg'; // The size of image need to be 256x256
  image1.src = 'file2.jpg';

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
  //console.log('Finished loadTexture');
}

var g_shapesList = []; // Global variable
var g_eye = [0,0,0];
var g_at = [0,0,-1];
var g_up = [0,1,0];
var g_fov = 20;
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
    cam.eye = g_eye;
    cam.at = g_at;
    cam.up = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.moveForward();
  } else if (ev.keyCode == 83) { //moveBackwards, S
    var cam = new Camera();
    cam.eye = g_eye;
    cam.at = g_at;
    cam.up = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.moveBackwards();
  } else if (ev.keyCode == 65) { // moveLeft, A
    var cam = new Camera();
    cam.eye = g_eye;
    cam.at = g_at;
    cam.up = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.moveLeft();
  } else if (ev.keyCode == 68) { // moveRight, D
    var cam = new Camera();
    cam.eye = g_eye;
    cam.at = g_at;
    cam.up = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.moveRight();
  } else if (ev.keyCode == 81) { // panLeft, Q
    var cam = new Camera();
    cam.eye = g_eye;
    cam.at = g_at;
    cam.up = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.panLeft();
  } else if (ev.keyCode == 69) { // panRight, E
    var cam = new Camera();
    cam.eye = g_eye;
    cam.at = g_at;
    cam.up = g_up;
    cam.fov = g_fov;
    cam.speed = g_speed;
    cam.alpha = g_alpha;
    cam.panRight();
  } else if (ev.keyCode == 78) { // Press N key to add a block
    addBlock();
  } else if (ev.keyCode == 8) { // Press backspace key to delete the block
    delBlock();
  }
}

let flexBlock = [];

function addBlock() {
  // Press space key to add a block
  flexBlock.push([g_eye[0]-g_at[0]-g_up[0], g_eye[1]-g_at[1]-g_up[1], g_eye[2]-g_at[2]-g_up[2]]); 

  if (flexBlock.length >= 1) {
    animalShowP1 = true;
  }
}

function delBlock() {
  // Press backspace key to delete the block
  flexBlock.pop();
  if (flexBlock.length == 0 && animalShowP1) {
    animalShowP2 = true; // reday to pop the animal to canvas
  }
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

// Called by broswer repeatedly whenever its time
function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0-g_startTime; // performance returns millesecond(ms)


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
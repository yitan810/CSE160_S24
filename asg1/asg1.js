// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let drag;
let u_Size;

function setupWebGL(){
    // Retrieve <canvas> element
   canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
   gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLS(){
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

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Related UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedsize=5;
let g_selectedType=POINT;
let g_selectedSegment = 10;

function addActionsForHtmlUI(){
    // Button Events
    document.getElementById('clear').onclick=function(){g_shapesList=[];renderAllShapes();};
    document.getElementById('point').onclick=function(){g_selectedType=POINT};
    document.getElementById('triangle').onclick=function(){g_selectedType=TRIANGLE};
    document.getElementById('circle').onclick=function(){g_selectedType=CIRCLE};

    //document.getElementById('draw').onclick=drawing();

    // Capture from color silders
    document.getElementById('redslide').addEventListener('mouseup', function(){g_selectedColor[0] = this.value/100;});
    document.getElementById('greenslide').addEventListener('mouseup', function(){g_selectedColor[1] = this.value/100;});
    document.getElementById('blueslide').addEventListener('mouseup', function(){g_selectedColor[2] = this.value/100;});
    
    // Size slider event
    document.getElementById('shapeslide').addEventListener('mouseup', function(){g_selectedsize = this.value;});
    document.getElementById('countslide').addEventListener('mouseup', function(){g_selectedSegment = this.value;});

}
let drawingList = [];
function renderDrawing(){
  for(var i = 0; i < drawingList.length; i++){
    tr = drawingList[i];
    var xy = [tr[1], tr[2]];
    var rgba = tr[0];
    var size = 10;
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass color to u_FragColor
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the size tp u_Size
    gl.uniform1f(u_Size, size);
    drawTriangle([tr[1], tr[2], tr[3], tr[4], tr[5], tr[6]]);

  }
    
}
let RED = [1.0,0.2,0.25,1.0];
let GREEN = [0.4,1.0,0.6,1.0];
let GRAY = [0.5,0.5,0.5,1.0];

function drawing(){
  g_shapesList=[];
  renderAllShapes();

  //t[0]:color, t[1]:v1x, t[2]:v1y, t[3]:v2x, t[4]:v2y, t[5]:v3x, t[6]:v4x
 
  // Define leaves
  t1 = [GREEN, 0, 0.2,-0.1, 0.3, 0.1, 0.3 ];
  t2 = [GREEN, 0.1, 0.3, 0.3, 0.3, 0.1, 0.5 ];
  t2 = [GREEN, -0.1, 0.3, -0.3, 0.3, -0.1, 0.5 ];
  t3 = [GREEN, -0.1, 0.3, 0.3, 0.3, 0.1, 0.5 ];
  t4 = [GREEN, -0.1, 0.3, 0.1, 0.3, -0.1, 0.6 ];
  t5 = [GREEN, 0.1, 0.3, 0.1, 0.6, -0.1, 0.6 ];
  t6 = [GREEN, -0.1, 0.5, -0.4, 0.5, -0.1, 0.6 ];
  t7 = [GREEN, 0.1, 0.5, 0.3, 0.5, 0.1, 0.6 ];
  t8 = [GREEN, -0.1, 0.6, 0.1, 0.6, -0.1, 0.8 ];
  t9 = [GREEN, 0.1, 0.6, -0.1, 0.8, 0.1, 0.8 ];
  drawingList.push(t1, t2, t3, t4, t5, t6, t7, t8, t9);

  //Define the red part
  t10 = [RED, -0.3, 0.3, -0.1, 0.5, -0.4, 0.5 ];
  t11 = [RED, -0.3, 0.3, -0.4, 0.3, -0.4, 0.5 ];
  t12 = [RED, -0.4, 0.5, -0.6, 0.0, -0.4, -0.4 ];
  t13 = [RED, -0.4, -0.1, -0.1, -0.1, -0.4, 0.3 ];
  t14 = [RED, -0.4, 0.3, -0.1, 0.3, -0.1, -0.1 ];
  t15 = [RED, -0.4, -0.1, 0.4, -0.1, -0.4, -0.4 ];
  t16 = [RED, -0.1, -0.1, 0.1, -0.1, -0.1, 0.2 ];
  t17 = [RED, 0.1, -0.1, 0.1, 0.2, -0.1, 0.2 ];
  t18 = [RED, -0.1, 0.2, 0.0, 0.2, -0.1, 0.3 ];
  t19 = [RED, 0.0, 0.2, 0.1, 0.2, 0.1, 0.3 ];
  t20 = [RED, 0.1, -0.1, 0.4, -0.1, 0.1, 0.3 ];
  t21 = [RED, 0.4, -0.1, 0.1, 0.3, 0.4, 0.3 ];
  t22 = [RED, 0.3, 0.3, 0.1, 0.5, 0.3, 0.5 ];
  t23 = [RED, 0.3, 0.3, 0.4, 0.3, 0.3, 0.5 ];
  t24 = [RED, 0.4, -0.1, -0.4, -0.4, -0.1, -0.5 ];
  drawingList.push(t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24);
  
  //Define the seeds
  t25 = [GRAY, -0.4, 0.1, -0.3, 0.1, -0.4, 0.2 ];
  t26 = [GRAY, -0.1, 0.0, 0.0, 0.0, -0.1, 0.1 ];
  t27 = [GRAY, 0.2, 0.1, 0.3, 0.1, 0.2, 0.2 ];
  t28 = [GRAY, -0.3, -0.2, -0.3, -0.1, -0.2, -0.2 ];
  t29 = [GRAY, 0.1, -0.1, 0.1, -0.2, 0.2, -0.2 ];
  t30 = [GRAY, -0.2, -0.4, -0.1, -0.4, -0.2, -0.3 ];
  drawingList.push(t25, t26, t27, t28, t29, t30);

  renderDrawing();

}

function main() {
    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLS();

    // Set up actions for the HTML UI elements
    addActionsForHtmlUI();  

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev){click(ev);};
    canvas.onmousemove = function(ev){if(ev.buttons == 1){click(ev)}};

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}



var g_shapesList = [];

/*
var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = []; // Array to store the size of a point
*/

function click(ev) {
  
  //Extract the event click and return it in WebGl coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);

  // Create and store the new points
  let point; 
  if (g_selectedType==POINT){
    point = new Point();
  } else if (g_selectedType==TRIANGLE){
    point = new Triangle();
  } else if (g_selectedType==CIRCLE){
    point = new Circle();
    point.segments=g_selectedSegment;
    
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedsize;
  g_shapesList.push(point);

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();

}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinzfsizeate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x, y]);
  }

function renderAllShapes(){
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_shapesList.length;
        for(var i = 0; i < len; i++) {
            
            g_shapesList[i].render();
        }

}

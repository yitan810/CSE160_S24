// DrawRectangle.js
function main() {
// Retrieve <canvas> element                                  <- (1)
canvas = document.getElementById('example');
if (!canvas) {
console.log('Failed to retrieve the <canvas> element');
return;
}

// Get the rendering context for 2DCG                          <- (2)
ctx = canvas.getContext('2d');

// Draw a blue rectangle                                       <- (3)
ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color


//Instantiate a vector

/*
let b = canvas.width/2 + 45;
let c = canvas.height/2 - 45;
let v1 = new Vector3([b, c, 0]);
console.log(v1);

console.log(v1[0],v1[1],v1[2]);
drawVector(v1, "red");
*/
}

function drawVector(v, color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    let oo = canvas.width/2;
    ctx.moveTo(oo, oo); //start at (0,0)
    ctx.lineTo(oo + v.elements[0]*20 , oo - v.elements[1]*20);
    ctx.stroke();
}

function handleDrawEvent(){
    //1. Clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //Read the inputs to create v1
    let v1x = document.getElementById("1x");
    let v1y = document.getElementById("1y");
    let v1 = new Vector3([v1x.value, v1y.value, 0]);

    //Call drawVector
    drawVector(v1, "red");
    
    //2. Read the inputs to create v2
    let v2x = document.getElementById("2x");
    let v2y = document.getElementById("2y");
    let v2 = new Vector3([v2x.value, v2y.value, 0]);
 
    //Call drawVector
    drawVector(v2, "blue");
}

function angleBetween(v1, v2){
    let dot = Vector3.dot(v1, v2);
    let b = v1.magnitude() * v2.magnitude();
    let d = dot / b;
    let degree = Math.round(Math.acos(d) * 57.2957795);
    return degree;
}
function areaTriangle(v1, v2){
    let v3 = Vector3.cross(v1, v2);
    let c = Math.pow(v3.elements[0], 2) + Math.pow(v3.elements[1], 2) + Math.pow(v3.elements[2], 2);
    let a = 0.5 * Math.sqrt(c);
    return a;
}

function handleDrawOperationEvent(){
    //Clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //Create v1
    let v1x = document.getElementById("1x");
    let v1y = document.getElementById("1y");
    let v1 = new Vector3([v1x.value, v1y.value, 0]);
    drawVector(v1, "red");
    
    //Create v2
    let v2x = document.getElementById("2x");
    let v2y = document.getElementById("2y");
    let v2 = new Vector3([v2x.value, v2y.value, 0]);

    drawVector(v2, "blue");
    
    //Read the value of selector
    var choice = document.getElementById("operation-select");
    var value = choice.value;
    //console.log(value);

    if(value === 'add'){
        v1.add(v2);
        drawVector(v1, "green");

    }else if (value === 'subtract'){
        v1.sub(v2);
        drawVector(v1, "green");
    }else if (value === 'multiply'){
        let sca = document.getElementById("scalar");
        v1.mul(Number(sca.value));
        v2.mul(Number(sca.value));
        drawVector(v1, "green");
        drawVector(v2, "green");
    }else if (value === 'divide'){
        let sca = document.getElementById("scalar");
        v1.div(Number(sca.value));
        v2.div(Number(sca.value));
        drawVector(v1, "green");
        drawVector(v2, "green");
    }else if (value === 'magnitude'){
        console.log("Magnitude v1: " + v1.magnitude());
        console.log("Magnitude v2: " + v2.magnitude());
    }else if (value === 'normalize'){
        v1.normalize();
        drawVector(v1, "green");
        v2.normalize();
        drawVector(v2, "green");
    } else if (value === "anglebetween"){
        let angleDegree = angleBetween(v1, v2);
        console.log("Angle: " + angleDegree);
    } else if (value === "area"){
        let area = areaTriangle(v1, v2);
        console.log("Area of the triangle: " + area);
    }
}
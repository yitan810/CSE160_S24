class Triangle{
    constructor(){
       this.type='triangle';
       this.position = [0.0, 0.0, 0.0];
       this.color = [1.0, 1.0, 1.0, 1.0];
       this.size = 5.0;

       this.buffer = null;
    }
 
    render(){
       var xy = this.position;
       var rgba = this.color;
       var size = this.size/10;
       gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
       // Pass color to u_FragColor
       gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
 
       // Pass the size tp u_Size
       gl.uniform1f(u_Size, size);
 
       var d = size/20.0;
       drawTriangle([xy[0]-d/2, xy[1]-d/2, xy[0]+d/2, xy[1]-d/2, xy[0], xy[1]+d/2]);
 
    }
 }
function drawTriangle(vertices){
   
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
       console.log('Failed to create the buffer object');
       return -1;
    }
 
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
 
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function drawTriangle3D(vertices){
   
   var n = 3;
   
   var vertexBuffer = gl.createBuffer();
   if(!vertexBuffer){
      console.log('Failed to create the buffer object');
      return -1;
   }

   // Bind the buffer object to target
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   // Write date into the buffer object
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);


   // Assign the buffer object to a_Position variable
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

   // Enable the assignment to a_Position variable
   gl.enableVertexAttribArray(a_Position);

   gl.drawArrays(gl.TRIANGLES, 0, n);

}
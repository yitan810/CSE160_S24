class Triangle {
   constructor(){
     this.type = "triangle";
     this.position = [0.0, 0.0, 0.0];
     this.color = [0.5, 0.5, 0.5, 1.0];
     this.size = 1.0;
   }
   render() {
     var xy = this.position;
     var rgba = this.color;
     var size = this.size;
 
     // Pass the position of a point to a_Position variable
     ///gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
     // Pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
     // Pass the size of a point to u_Size variable
     gl.uniform1f(u_Size, size);
     // Draw
     var d = this.size/200.0; // delta
     drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
   }
 }
 
 
 function drawTriangle(vertices) {
   var n = 3; // number of vertices
 
   // Create a buffer object
   var vertexBuffer = gl.createBuffer();
   if (!vertexBuffer) {
     console.log('Failed to create the buffer object');
     return -1;
   }
 
   // Bind the buffer object to target
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   // Write date into the buffer object
   ///gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
   ///gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
 
   ///var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
   ///if (a_Position < 0) {
   ///  console.log('Failed to get the storage location of a_Position');
   ///  return -1;
   ///}
   // Assign the buffer object to a_Position variable
   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
 
   // Enable the assignment to a_Position variable
   gl.enableVertexAttribArray(a_Position);
 
   // draw
   gl.drawArrays(gl.TRIANGLES, 0, n);
   //gl.drawArrays(gl.POINTS, 0, n); // draw 3 points to form a triangle, but why diff?
 
 }
 
 var g_vertexBuffer = null;
 function initTriangle3D() {
   // Create a buffer object
   g_vertexBuffer = gl.createBuffer();
   if (!g_vertexBuffer) {
     console.log('Failed to create the buffer object.');
     return -1;
   }
 
   // Bind the buffer object to target
   gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
 
   // Assign the buffer object to a_Position variable
   Fsize = Float32Array.BYTES_PER_ELEMENT;
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
 
   // Enable the assignment to a_Position variable
   gl.enableVertexAttribArray(a_Position);
   // console.log(a_Position)
 }
 
 function drawTriangle3D(vertices) {
   var n = vertices.length/3; // number of vertices
   if (g_vertexBuffer == null) { // only initialize the triangles once
     initTriangle3D();
   }
   
   // // Create a buffer object
   // var vertexBuffer = gl.createBuffer();
   // if (!vertexBuffer) {
   //   console.log('Failed to create the buffer object');
   //   return -1;
   // }
 
   // // Bind the buffer object to target
   // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   // // Write date into the buffer object
   // // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
   //   // Assign the buffer object to a_Position variable
   // gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
   // // Enable the assignment to a_Position variable
   // gl.enableVertexAttribArray(a_Position);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
   // draw
   gl.drawArrays(gl.TRIANGLES, 0, n);
 }
 
 function oriDrawTriangle3D(vertices) {
   var n =3;
   // Create a buffer object
   var vertexBuffer = gl.createBuffer();
   if (!vertexBuffer) {
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
   // draw
   gl.drawArrays(gl.TRIANGLES, 0, n);
 }
 
 function drawTriangle3DUV(vertices, uv) {
   var n = 3; // number of vertices
   // Create a buffer object
   var vertexBuffer = gl.createBuffer();
   if (!vertexBuffer) {
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
 
   var uvBuffer = gl.createBuffer();
   if (!uvBuffer) {
     console.log('Failed to create the buffer object.');
     return -1;
   }
   gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
   gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
   // gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6, 3);
   gl.enableVertexAttribArray(a_UV);
 
   // draw
   gl.drawArrays(gl.TRIANGLES, 0, n);
 }
 
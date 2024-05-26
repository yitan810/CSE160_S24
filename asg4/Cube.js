class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum = -2;
    this.cubeVerts = new Float32Array([
      // Front
      0,0,0,0,0, 1,1,0,1,1, 1,0,0,1,0,
      0,0,0,0,0, 0,1,0,0,1, 1,1,0,1,1,

      // Top
      0,1,0,0,1, 0,1,1,0,0, 1,1,1,1,0,
      0,1,0,0,1, 1,1,1,1,0, 1,1,0,1,1,
      
      // Left
      0,1,0,0,1, 0,0,1,1,0, 0,1,1,1,1,
      0,0,0,0,0, 0,1,0,0,1, 0,0,1,1,0,

      // Right
      1,0,0,1,0, 1,1,0,1,1, 1,1,1,0,1,
      1,0,0,1,0, 1,0,1,0,0, 1,1,1,0,1,
      
      // Back
      0,0,1,1,0, 1,1,1,0,1, 1,0,1,0,0,
      0,0,1,1,0, 0,1,1,1,1, 1,1,1,0,1,

      // Bottom
      0,0,0,0,0, 1,0,0,1,0, 1,0,1,1,1,
      0,0,0,0,0, 0,0,1,0,1, 1,0,1,1,1,
    ]);
  }


  render() {

    var rgba = this.color;
  
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Front of cube
    drawTriangle3DUVNormal(
      [0,0,0, 1,1,0, 1,0,0],
      [0,0, 1,1, 1,0],
      [0,0,-1, 0,0,-1, 0,0,-1]
    );
    drawTriangle3DUVNormal([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

    // Draw Top of cube
    drawTriangle3DUVNormal([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [0,1, 0,0, 1,0], [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUVNormal([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0], [0,1, 1,0, 1,1], [0,1,0, 0,1,0, 0,1,0]);

    // Draw left-side of cube
    drawTriangle3DUVNormal([0.0,1.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0], [0,1, 1,0, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
    drawTriangle3DUVNormal([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,0.0,1.0], [0,0, 0,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);

    // Draw right-side of cube
    drawTriangle3DUVNormal([1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0], [1,0, 1,1, 0,1], [1,0,0, 1,0,0, 1,0,0]);
    drawTriangle3DUVNormal([1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0], [1,0, 0,0, 0,1], [1,0,0, 1,0,0, 1,0,0]);

    // Draw back of cube
    drawTriangle3DUVNormal([0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0], [1,0, 0,1, 0,0], [0,0,1, 0,0,1, 0,0,1]);
    drawTriangle3DUVNormal([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [1,0, 1,1, 0,1], [0,0,1, 0,0,1, 0,0,1]);

    // Draw bottom of cube
    drawTriangle3DUVNormal([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0], [0,0, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);

   }

  renderFast() {
    var rgba = this.color;
 

    // Pass the texture number

    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts = [];
    // Front of cube
    allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
    allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);

    // Top of cube
    allverts = allverts.concat([0,1,0, 0,1,1, 1,1,1]);
    allverts = allverts.concat([0,1,0, 1,1,1, 1,1,0]);

    // Left of cube
    allverts = allverts.concat([0,1,0, 0,0,1, 0,1,1]);
    allverts = allverts.concat([0,0,0, 0,1,0, 0,0,1]);

    // Right of cube
    allverts = allverts.concat([1,0,0, 1,1,0, 1,1,1]);
    allverts = allverts.concat([1,0,0, 1,0,1, 1,1,1]);

    // Back of cube
    allverts = allverts.concat([0,0,1, 1,1,1, 1,0,1]);
    allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1]);

    // Bottom of cube
    allverts = allverts.concat([0,0,0, 1,0,0, 1,0,1]);
    allverts = allverts.concat([0,0,0, 0,0,1, 1,0,1]);


    drawTriangle3D(allverts);
  };


  renderFaster() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    if (g_vertexBuffer == null) {
      initTriangle3D();
    }

    gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts, gl.DYNAMIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

  }
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
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 5*Fsize, 0);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 5*Fsize, 3*Fsize);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_UV);
  }

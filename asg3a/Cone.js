class Cone {
    constructor() {
      this.type = "cone";
      this.color = [0.5, 0.5, 0.5, 1.0];
      this.matrix = new Matrix4();
    }
  
  
    render() {
      var rgba = this.color;

  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      let angleStep = 360 / 100;
      //let angleStep = 360 / this.segments;
      for (var angle = 0; angle < 360; angle += angleStep) {
        let centerPt = [0,0,0];
        let angle1 = angle;
        let angle2 = angle + angleStep;
        let vec1 = [Math.cos(angle1 * Math.PI / 180), Math.sin(angle1 * Math.PI / 180), 0];
        let vec2 = [Math.cos(angle2 * Math.PI / 180), Math.sin(angle2 * Math.PI / 180), 0];
        let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1], 0];
        let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1], 0];
  
        drawTriangle3D([0,0,0,  pt1[0],pt1[1],1,  pt2[0], pt2[1],1]);
      }
    }
  }
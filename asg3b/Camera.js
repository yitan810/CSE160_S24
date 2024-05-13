class Camera {
    constructor() {
        this.type = "camera";
        this.fov = 60;
        this.eye = new Vector3([0,0,0]);
        this.at = new Vector3([0,0,-1]);
        this.up = new Vector3([0,1,0]);
        this.speed = 1;
        this.alpha = 1;

        this.setup(); // Pass the projection matrix and the view matrix

    }

    setup() {
        var viewMatrix = new Matrix4();
        viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2], this.at.elements[0],this.at.elements[1],this.at.elements[2], this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

        var projectionMatrix = new Matrix4();
        projectionMatrix.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);
        // console.log(this.eye, this.at, this.up, this.speed, this.alpha)
    }

    moveForward() {
        // var eye = new Vector3();
        // eye.elements = this.eye;

        // var at = new Vector3();
        // at.elements = this.at;

        var forVec = new Vector3();
        forVec.set(this.at);
        forVec.sub(this.eye);
        var temp = forVec.normalize().elements;
        forVec[0] = temp[0];
        forVec[1] = temp[1];
        forVec[2] = temp[2];

        var speed = this.speed;
        forVec.mul(speed);

        this.eye.add(forVec);
        this.at.add(forVec);

        // this.eye.elements = eye;
        // this.at.elements = at;

        this.setup(); // Pass the projection matrix and the view matrix
    }

    moveBackwards() {

        var b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        var temp = b.normalize().elements;
        b[0] = temp[0];
        b[1] = temp[1];
        b[2] = temp[2];

        var speed = this.speed;
        b.mul(speed);

        this.eye.add(b);
        this.at.add(b);

        this.setup(); // Pass the projection matrix and the view matrix
    }

    moveLeft() {
        // var eye = new Vector3();
        // eye.elements = this.eye;
        // var at = new Vector3();
        // at.elements = this.at;

        var forVec = new Vector3();
        forVec.set(this.at);
        forVec.sub(this.eye);

        // var up = new Vector3();
        // up.elements = this.up;
        var s = new Vector3();
        s = Vector3.cross(this.up, forVec);

        var temp = s.normalize().elements;
        s[0] = temp[0];
        s[1] = temp[1];
        s[2] = temp[2];

        var speed = this.speed;
        s.mul(speed);

        this.eye.add(s);
        this.at.add(s);

        // this.eye.elements = eye;
        // this.at.elements = at;
        // this.up.elements = up;
        this.setup();
    }

    moveRight() {
        // var eye = new Vector3();
        // eye.elements = this.eye;
        // var at = new Vector3();
        // at.elements = this.at;

        var forVec = new Vector3();
        forVec.set(this.at);
        forVec.sub(this.eye);

        // var up = new Vector3();
        // up.elements = this.up;
        var s = new Vector3();
        s = Vector3.cross(forVec, this.up);

        var temp = s.normalize().elements;
        s[0] = temp[0];
        s[1] = temp[1];
        s[2] = temp[2];

        var speed = this.speed;
        s.mul(speed);

        this.eye.add(s);
        this.at.add(s);

        // this.eye.elements = eye;
        // this.at.elements = at;
        // this.up.elements = up;
        this.setup();
    }

    panLeft() {
        // var eye = new Vector3();
        // eye.elements = this.eye;
        // var at = new Vector3();
        // at.elements = this.at;
        // var up = new Vector3();
        // up.elements = this.up;

        var forVec = new Vector3();
        forVec.set(this.at);
        forVec.sub(this.eye);

        var alpha = this.alpha;
        var roMat = new Matrix4();
        roMat[0] = roMat.elements[0];
        roMat[1] = roMat.elements[1];
        roMat[2] = roMat.elements[2];
        roMat[3] = roMat.elements[3];
        roMat[4] = roMat.elements[4];
        roMat[5] = roMat.elements[5];
        roMat[6] = roMat.elements[6];
        roMat[7] = roMat.elements[7];
        roMat[8] = roMat.elements[8];
        roMat[9] = roMat.elements[9];
        roMat[10] = roMat.elements[10];
        roMat[11] = roMat.elements[11];
        roMat[12] = roMat.elements[12];
        roMat[13] = roMat.elements[13];
        roMat[14] = roMat.elements[14];
        roMat[15] = roMat.elements[15];

        roMat = roMat.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        var f_prime = new Matrix4();
        f_prime = roMat.multiplyVector3(forVec);

        var eye_copy = new Vector3();
        eye_copy.set(this.eye);
        this.at.set(eye_copy.add(f_prime));
        // this.eye.elements = eye;
        // this.up.elements = up;
        this.setup();
    }

    panRight() {
        // var eye = new Vector3();
        // eye.elements = this.eye;
        // var at = new Vector3();
        // at.elements = this.at;
        // var up = new Vector3();
        // up.elements = this.up;

        var forVec = new Vector3();
        forVec.set(this.at);
        forVec.sub(this.eye);

        var alpha = this.alpha;
        var roMat = new Matrix4();
        roMat[0] = roMat.elements[0];
        roMat[1] = roMat.elements[1];
        roMat[2] = roMat.elements[2];
        roMat[3] = roMat.elements[3];
        roMat[4] = roMat.elements[4];
        roMat[5] = roMat.elements[5];
        roMat[6] = roMat.elements[6];
        roMat[7] = roMat.elements[7];
        roMat[8] = roMat.elements[8];
        roMat[9] = roMat.elements[9];
        roMat[10] = roMat.elements[10];
        roMat[11] = roMat.elements[11];
        roMat[12] = roMat.elements[12];
        roMat[13] = roMat.elements[13];
        roMat[14] = roMat.elements[14];
        roMat[15] = roMat.elements[15];

        roMat = roMat.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        var f_prime = new Matrix4();
        f_prime = roMat.multiplyVector3(forVec);

        var eye_copy = new Vector3();
        eye_copy.set(this.eye);
        this.at.set(eye_copy.add(f_prime));
        this.setup();
    }

    debug() {
        // console.log(this.eye);
    }
}
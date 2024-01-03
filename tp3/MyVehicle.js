import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class Vehicle {
  constructor(app, maserati = false) {
    this.app = app;

    if (maserati) {
      this.createMaserati(app);
    } else {
      this.car = new THREE.Group();
      this.getCarFrontTexture();
      this.getCarSideTexture();
      this.buildCar();
    }

    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0;
    this.turningRadius = 0;
    this.maxSpeed = 0.1;
    this.acceleration = 0.008;
    this.deceleration = 0.003;
    this.maxSteeringAngle = Math.PI / 8 / 1000;

    this.currentPathIndex = 0; // Index to track the current target position
    this.botMoveSpeed = 0.05;

    this.controls = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    document.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyW":
          this.controls.forward = true;
          break;
        case "KeyS":
          this.controls.backward = true;
          break;
        case "KeyA":
          this.controls.left = true;
          break;
        case "KeyD":
          this.controls.right = true;
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyW":
          this.controls.forward = false;
          break;
        case "KeyS":
          this.controls.backward = false;
          break;
        case "KeyA":
          this.controls.left = false;
          break;
        case "KeyD":
          this.controls.right = false;
          break;
      }
    });

    this.offsetPath = 0;

    this.botPaths = [
      [40 - this.offsetPath, 0.5, 6],
      [35 - this.offsetPath, 0.5, 12],
      [30 - this.offsetPath, 0.5, 16],
      [25 - this.offsetPath, 0.5, 19],
      [20 - this.offsetPath, 0.5, 22],
      [15 - this.offsetPath, 0.5, 23],
      [10 - this.offsetPath, 0.5, 23],
      [5 - this.offsetPath, 0.5, 22],
      [0 - this.offsetPath, 0.5, 22],
      [-5 - this.offsetPath, 0.5, 22],
      [-10 - this.offsetPath, 0.5, 23],
      [-15 - this.offsetPath, 0.5, 23],
      [-20 - this.offsetPath, 0.5, 22],
      [-25 - this.offsetPath, 0.5, 19],
      [-30 - this.offsetPath, 0.5, 16],
      [-35 - this.offsetPath, 0.5, 12],
      [-40 - this.offsetPath, 0.5, 5],
      [-42 - this.offsetPath, 0.5, 0],
      [-42 - this.offsetPath, 0.5, -5],
      [-41 - this.offsetPath, 0.5, -10],
      [-39 - this.offsetPath, 0.5, -15],
      [-37 - this.offsetPath, 0.5, -20],
      [-35 - this.offsetPath, 0.5, -25],
      [-32 - this.offsetPath, 0.5, -30],
      [-29 - this.offsetPath, 0.5, -35],
      [-19 - this.offsetPath, 0.5, -42],
      [-10 - this.offsetPath, 0.5, -41],
      [-5 - this.offsetPath, 0.5, -39],
      [0 - this.offsetPath, 0.5, -36],
      [5 - this.offsetPath, 0.5, -33],
      [10 - this.offsetPath, 0.5, -29],
      [15 - this.offsetPath, 0.5, -26],
      [20 - this.offsetPath, 0.5, -22],
      [25 - this.offsetPath, 0.5, -18],
      [30 - this.offsetPath, 0.5, -15],
      [35 - this.offsetPath, 0.5, -11],
      [40 - this.offsetPath, 0.5, -5],
      [41 - this.offsetPath, 0.5, 0],
    ];
  }

  getMaserati() {
    return this.maserati;
  }

  setBotVelocity(setBotVelocity) {
    switch (setBotVelocity) {
      case "MEDIUM":
        this.botMoveSpeed = 0.07;
        break;
      case "HARD":
        this.botMoveSpeed = 0.1;
        break;
      default:
        this.botMoveSpeed = 0.05;
    }
  }

  createMaserati(app) {
    const loader = new GLTFLoader();
    loader.load(
      "./models/lada_2107.glb",
      function (gltf) {
        gltf.scene.position.add(new THREE.Vector3(82, 1.5, -41));
        gltf.scene.rotation.y = Math.PI / 2.7;
        gltf.scene.rotation.y += Math.PI;
        app.scene.add(gltf.scene);
        this.maserati = gltf.scene;
      }.bind(this),
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  moveBot() {
    const targetPosition = new THREE.Vector3(
      ...this.botPaths[this.currentPathIndex]
    );

    const distance = this.car.position.distanceTo(targetPosition);

    if (distance < this.botMoveSpeed) {
      this.currentPathIndex =
        (this.currentPathIndex + 1) % this.botPaths.length;
    } else {
      const direction = targetPosition
        .clone()
        .sub(this.car.position)
        .normalize();

      this.velocity = direction.multiplyScalar(this.botMoveSpeed);

      this.car.position.add(this.velocity);
      this.car.rotation.y = Math.PI * 3;
      const desiredAngle = Math.atan2(-direction.x, -direction.z);

      this.car.rotation.z = this.lerpAngle(
        this.car.rotation.z,
        desiredAngle,
        0.05
      );
    }

    // console.log(this.app.controls.target)

    // this.car.getWorldDirection(this.carDirection);
    // this.lookAtPoint.copy(this.car.position).add(this.carDirection.multiplyScalar(1)); // Adjust the scalar as needed
    // if(direction) {
    //   this.app.controls.target = direction;
    //   this.app.getActiveCamera().lookAt(100,100,100);
    //   this.app.controls.update();
    // }

    // this.app.getActiveCamera().position.copy(this.car.position)
    // this.app.controls.rotation = (this.car.rotation);
    // this.app.getActiveCamera().rotation.copy(this.car.rotation);

    // console.log(this.app.controls)

    if (direction) {
      //this.app.controls.target.copy(this.cameraView.position);
      //console.log(this.cameraView.position)

      // Position the camera at the driver's seat
      this.app
        .getActiveCamera()
        .position.copy(this.car.position)
        .add(new THREE.Vector3(-5, 10, -5)); // Adjust for driver's seat position
      //this.app.getActiveCamera().lookAt(new THREE.Vector3(100,100,100))
      this.app.controls.target = this.car.position.add(direction);
      //console.log(direction);

      this.app.controls.update();
    }

    // this.app.controls.update();
    //console.log(this.car.position.x)
  }

  resetBot() {
    this.currentPathIndex = 0;
    this.maserati.position.copy(new THREE.Vector3(82, 1.5, -41));
    this.maserati.rotation.y = Math.PI / 2.7;
    this.maserati.rotation.y += Math.PI;
  }

  resetCar() {
    this.car.position.set(82, 0.5, -35);
    this.car.rotation.x = Math.PI / 2;
    this.car.rotation.z = Math.PI / 2.7;
  }

  moveMaseratiBot() {
    if (this.maserati) {
      const targetPosition = new THREE.Vector3(
        ...this.botPaths[this.currentPathIndex]
      );
      targetPosition.add(new THREE.Vector3(0, 1, 0));

      const distance = this.maserati.position.distanceTo(targetPosition);
      let direction;
      if (distance < this.botMoveSpeed) {
        this.currentPathIndex =
          (this.currentPathIndex + 1) % this.botPaths.length;
      } else {
        direction = targetPosition
          .clone()
          .sub(this.maserati.position)
          .normalize();

        this.velocity = direction.multiplyScalar(this.botMoveSpeed);

        this.maserati.position.add(this.velocity);
        const desiredAngle = Math.atan2(direction.x, direction.z);

        this.maserati.rotation.y = this.lerpAngle(
          this.maserati.rotation.y,
          desiredAngle + Math.PI,
          0.05
        );
      }

      const dire = new THREE.Vector3();
      let origin = new THREE.Vector3();
      let length = 5; // Length of the arrow
      let hex = 0xffff00; // Color of the arrow

      let arrowHelper = new THREE.ArrowHelper(dire, origin, length, hex);
      // this.app.scene.add(arrowHelper);

      //this.app.getActiveCamera().position.copy(new THREE.Vector3(this.maserati.position.x, this.maserati.position.y+2, this.maserati.position.z)); // Adjust for driver's seat position
      this.box = new THREE.BoxHelper(this.maserati, 0xff0000);
      //console.log(direction)

      if (direction) {
        this.app.controls.target.copy(direction);
        // arrowHelper.position.copy(this.maserati.position);
        // arrowHelper.setDirection(direction);
        // arrowHelper.setLength(5, 1, 1);
      }
    }
  }

  lerpAngle(a, b, t) {
    const delta = b - a;
    return a + delta * t;
  }

  move() {
    const steeringAdjustment = 0.0002;

    if (this.controls.forward) {
      this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    } else if (this.controls.backward) {
      this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed);
    } else {
      this.speed *= 0.95; // Natural deceleration
    }

    this.velocity.set(
      Math.sin(this.car.rotation.z) * this.speed,
      0,
      Math.cos(this.car.rotation.z) * this.speed
    );

    if (this.controls.left) {
      this.turningRadius = Math.max(
        this.turningRadius + steeringAdjustment,
        this.maxSteeringAngle
      );
    } else if (this.controls.right) {
      this.turningRadius = Math.min(
        this.turningRadius - steeringAdjustment,
        -this.maxSteeringAngle
      );
    } else {
      this.turningRadius *= 0.09; // Auto-straighten
    }

    const deltaRotation = this.turningRadius * (this.speed / this.maxSpeed);
    this.car.rotation.z += deltaRotation;

    if (this.turningRadius > 0) this.backwheels.rotation.z = -Math.PI / 2.3;
    else if (this.turningRadius < 0) this.backwheels.rotation.z = Math.PI / 2.3;
    else this.backwheels.rotation.z = Math.PI / 2;

    this.car.rotation.y = Math.PI;

    // Apply movement
    this.car.position.add(this.velocity);
  }

  getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
  }

  getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
  }

  buildCar() {
    let wheelsgeometry = new THREE.BoxGeometry(12, 33, 12);
    let wheelsMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    this.backwheels = new THREE.Mesh(wheelsgeometry, wheelsMaterial);
    this.backwheels.rotation.z = Math.PI / 2;
    this.backwheels.position.z = 6;
    this.backwheels.position.y = 20;

    this.car.add(this.backwheels);

    this.frontwheels = new THREE.Mesh(wheelsgeometry, wheelsMaterial);
    this.frontwheels.rotation.z = Math.PI / 2;
    this.frontwheels.position.z = 6;
    this.frontwheels.position.y = -20;

    this.car.add(this.frontwheels);

    let mainpartgeometry = new THREE.BoxGeometry(60, 30, 15);
    this.mainpartMaterial = new THREE.MeshLambertMaterial({ color: 0xffc0cb });
    let mainpart = new THREE.Mesh(mainpartgeometry, this.mainpartMaterial);

    mainpart.rotation.z = Math.PI / 2;
    mainpart.position.z = 12;

    this.car.add(mainpart);

    let carFrontTexture = this.getCarFrontTexture();
    carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
    carFrontTexture.rotation = Math.PI / 2;

    let carBackTexture = this.getCarFrontTexture();
    carBackTexture.center = new THREE.Vector2(0.5, 0.5);
    carBackTexture.rotation = -Math.PI / 2;

    let carLeftSideTexture = this.getCarSideTexture();
    carLeftSideTexture.flipY = false;

    let carRightSideTexture = this.getCarSideTexture();

    let cabingeometry = new THREE.BoxGeometry(33, 24, 12);
    let cabinMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let boxMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      opacity: 0,
      transparent: true,
    });
    let cabin = new THREE.Mesh(cabingeometry, [
      new THREE.MeshLambertMaterial({ map: carFrontTexture }),
      new THREE.MeshLambertMaterial({ map: carBackTexture }),
      new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
      new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
      cabinMaterial, // top
      cabinMaterial, // bottom
    ]);
    cabin.rotation.z = Math.PI / 2;
    cabin.position.z = 25.5;

    let box = new THREE.BoxGeometry(33, 24, 12);
    this.boxx = new THREE.Mesh(box, [
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial, // top
      boxMaterial, // bottom
    ]);

    this.boxx.position.add(new THREE.Vector3(0, 70, 20));

    this.boxxx = new THREE.Mesh(box, [
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial, // top
      boxMaterial, // bottom
    ]);

    this.boxxx.position.add(new THREE.Vector3(0, -70, 20));

    this.car.add(this.boxx, this.boxxx);

    this.car.add(cabin);
    this.car.scale.set(0.04, 0.04, 0.04);
    this.car.position.set(82, 0.5, -35);
    this.car.rotation.x = Math.PI / 2;
    this.car.rotation.z = Math.PI / 2.7;

    this.app.scene.add(this.car);
  }
  setColor(color) {
    if (this.mainpartMaterial) {
      this.mainpartMaterial.color.setRGB(color[0], color[1], color[2]);
    }
  }

  getColor() {
    return this.mainpartMaterial.color;
  }

  getCar() {
    return this.car;
  }

  setVelocity() {
    this.maxSpeed = 0.4;
  }

  setOffTrackVelocity() {
    this.maxSpeed = 0.05;
  }

  resetVelocity() {
    this.maxSpeed = 0.1;
  }

  getBoxx() {
    return this.boxx;
  }

  getBoxxx() {
    return this.boxxx;
  }
}

export { Vehicle };

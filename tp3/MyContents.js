import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { Track } from "./MyTrack.js";
import { Vehicle } from "./MyVehicle.js";
import { Obstacles } from "./MyObstacle.js";
import { Powerups } from "./MyPowerUp.js";
import { Starters } from "./Mystarters.js";
import { Garage } from "./MyGarage.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Fireworks } from "./MyFireworks.js";
import { Menu } from "./MyMenu.js";
import { ChooseMenu } from "./MyChooseMenu.js";
import { EndGameMenu } from "./MyEndGameMenu.js";

/**
 *  This class contains the contents of out application
 */

class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */

  constructor(app) {
    this.app = app;
    this.axis = null;

    this.createdChooseMenu = false;

    this.vertexShader = `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
          vUv = uv;
          
          // Simple wave effect
          float wave = sin(position.x * 2.0 + time) * 0.1;
          wave += sin(position.y * 2.0 + time) * 0.1;
          
          vec3 pos = position + normal * wave;
      
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }`;

    this.fragmentShader = `
      uniform float time;
      uniform sampler2D waterTexture;
      varying vec2 vUv;

      void main() {
          // Sample the texture color using texture coordinates
          vec3 textureColor = texture2D(waterTexture, vUv).rgb;

          // You can mix your texture color with some other effect if you like
          gl_FragColor = vec4(textureColor, 1.0);
      }`;

    const waterTextureLoader = new THREE.TextureLoader();
    const waterTexture = waterTextureLoader.load("./textures/waterTex.jpg"); // Replace with your image path

    this.waterShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: {
        time: { value: 0.0 },
        waterTexture: { value: waterTexture },
      },
    });
    const geometry = new THREE.CircleGeometry(10, 32);
    const waterMesh = new THREE.Mesh(geometry, this.waterShaderMaterial);

    const torusGeometry = new THREE.TorusGeometry(10, 0.5, 16, 200);
    const torusMaterial = new THREE.MeshLambertMaterial({ color: 0x593f24 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    app.scene.add(torus);
    torus.rotation.x = Math.PI / 2;
    torus.position.add(new THREE.Vector3(-10, 0.2, -10));

    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.add(new THREE.Vector3(-10, 0.2, -10));
    app.scene.add(waterMesh);

    this.fireworksOptions = {
      size: 10,
      particleSize: 0.2,
      velocity: 0.1,
      particles: 1000,
    };

    this.textLoader = new FontLoader();

    this.endGame = false;
    this.difficulty = "EASY";

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    window.addEventListener("click", this.onMouseClick.bind(this), false);
    this.raycaster.setFromCamera(this.mouse, app.getActiveCamera());
    this.raycaster.near = app.getActiveCamera().near;
    this.raycaster.far = app.getActiveCamera().far;
    const leaderboard = localStorage.getItem("leaderboard");
    this.menu = new Menu(app, leaderboard);

    this.createdGarageMenu = false;

    this.startRace = false;

    this.garageMenu = false;
    this.dontMove = false;

    this.targetPosition = new THREE.Vector3(159, 112, 62);
    this.lerpFactor = 0.05;
    this.startedCamera = false;

    this.laps = 0;

    this.stop = false;
    this.moveObstacle = false;
    this.leftButton = null; /* Initialize your left button object */
    this.rightButton = null; /* Initialize your right button object */
    this.startButton = null;
    this.left2Button = null; /* Initialize your left button object */
    this.right2Button = null; /* Initialize your right button object */
    this.start2Button = null;

    this.leftButtonColors = [
      [1, 0, 0], // Red
      [0, 1, 0], // Green
      [0, 0, 1], // Blue
    ];

    this.rightButtonColors = [
      [1, 1, 0], // Yellow
      [1, 0, 1], // Magenta
      [0, 1, 1], // Cyan
    ];

    this.startRace = false;

    this.garageMenu = false;
    this.currentLeftButtonColorIndex = 0;
    this.currentRightButtonColorIndex = 0;
  }

  restartGame() {
    this.createdChooseMenu = false;

    this.endGame = false;
    this.stop = false;
    this.moveObstacle = false;
    this.targetPosition = new THREE.Vector3(159, 112, 62);
    this.startedCamera = false;
    this.startRace = false;
    this.laps = 0;
    this.app.scene.remove(this.fireworks.getParticleSystem());
    this.app.scene.remove(this.end.getGroup());
    this.garageMenu = true;
    this.fireworks = null;
    this.end = null;

    this.bot.resetBot();
    this.car.resetCar();
  }

  saveToLeaderboard(newLeaderboard) {
    const leaderboardJSON = localStorage.getItem("leaderboard");
    const leaderboard = leaderboardJSON ? JSON.parse(leaderboardJSON) : [];
    leaderboard.push(newLeaderboard);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onMouseClick(event) {
    event.preventDefault();

    // Update the mouse variable
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    this.checkIntersection();
    if (this.moveObstacle && this.startedCamera) {
      this.placeObstacle();

      const seatWorldPosition = new THREE.Vector3();
      const seattWorldPosition = new THREE.Vector3();
      this.car.getBoxx().getWorldPosition(seatWorldPosition);
      this.car.getBoxxx().getWorldPosition(seattWorldPosition);
      if (this.app.activeCameraName === "Perspective") {
        this.app.getActiveCamera().position.x = seattWorldPosition.x;
        this.app.getActiveCamera().position.y = seattWorldPosition.y + 2;
        this.app.getActiveCamera().position.z = seattWorldPosition.z;
        this.app.controls.target.copy(seatWorldPosition);
      }

      setTimeout(() => {
        this.car.resetVelocity();
      }, 3000);
    }
  }

  placeObstacle() {
    this.moveObstacle = false;
    this.startCountdown(3);
  }

  checkIntersection() {
    // Update the raycaster with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.app.getActiveCamera());

    // Calculate objects intersecting the picking ray
    this.text = this.menu.getThisText();
    const intersects = this.raycaster.intersectObjects([this.text]);

    let intersectsPlayAgain = null;

    if (this.end) {
      intersectsPlayAgain = this.raycaster.intersectObjects([
        this.end.getPlayAgain(),
      ]);
    }

    if (intersects.length > 0) {
      // The text has been clicked
      this.onTextClick();
    }

    if (intersectsPlayAgain && intersectsPlayAgain.length > 0) {
      console.log("heheheh");
      this.restartGame();
    }

    let intersectsLeft;
    let intersectsRight;
    let intersectsStart;
    let intersects2Left;
    let intersects2Right;
    let intersects2Start;

    if (this.leftButton && this.rightButton && this.startButton) {
      intersectsLeft = this.raycaster.intersectObjects([this.leftButton]);
      intersectsRight = this.raycaster.intersectObjects([this.rightButton]);
      intersectsStart = this.raycaster.intersectObjects([this.startButton]);
      intersects2Left = this.raycaster.intersectObjects([this.left2Button]);
      intersects2Right = this.raycaster.intersectObjects([this.right2Button]);
      intersects2Start = this.raycaster.intersectObjects([this.start2Button]);
    }

    if (intersectsLeft && intersectsLeft.length > 0) {
      this.currentLeftButtonColorIndex =
        (this.currentLeftButtonColorIndex + 1) % this.leftButtonColors.length;
      const newColor = this.leftButtonColors[this.currentLeftButtonColorIndex];
      this.car.setColor(newColor);
      return;
    }

    if (intersectsRight && intersectsRight.length > 0) {
      this.currentRightButtonColorIndex =
        (this.currentRightButtonColorIndex + 1) % this.rightButtonColors.length;
      const newColor =
        this.rightButtonColors[this.currentRightButtonColorIndex];
      this.car.setColor(newColor);
      return;
    }

    if (intersectsStart && intersectsStart.length > 0) {
      this.garageMenu = false;
      this.carBox.rotation.z = Math.PI / 1.2;
      this.carBox.rotation.z += Math.PI;
      this.carBox.position.set(37.5, 0.5, 2);

      this.bot.getMaserati().position.set(39.5, 1.5, 4);
      this.bot.getMaserati().rotation.y = Math.PI / 1.2;

      this.startCountdown(3);
    }

    if (intersects2Start && intersects2Start.length > 0) {
      this.difficulty = this.chooseMenu.getDifficulty();
      console.log(this.difficulty);
      this.chooseMenu.getStart2Button().geometry = new TextGeometry(
        this.difficulty,
        {
          font: this.font,
          size: 0.5,
          height: 0,
        }
      );
      this.bot.setBotVelocity(this.difficulty);
    }
  }

  getColorByName(colorName) {
    const colorMap = {
      Red: [1, 0, 0],
      Green: [0, 1, 0],
      Blue: [0, 0, 1],
      Yellow: [1, 1, 0],
      Magenta: [1, 0, 1], // Magenta
      Cyan: [0, 1, 1],
    };
    return colorMap[colorName];
  }

  onTextClick() {
    this.targetPosition.set(60, 29, 21);
  }

  /**
   * initializes the contents
   */
  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 500, 0);
    pointLight.position.set(0, 20, 0);
    this.app.scene.add(pointLight);

    // add a point light helper for the previous point light
    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    this.app.scene.add(pointLightHelper);

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.app.scene.add(ambientLight, hemisphereLight);
    this.track = new Track(this.app);
    this.car = new Vehicle(this.app);
    this.bot = new Vehicle(this.app, true);
    this.maserati = this.bot.getMaserati();
    this.carBox = this.car.getCar();
    this.obstacle = new Obstacles(this.app).getBadClock();
    this.good_clock = new Powerups(this.app);
    this.powerups = this.good_clock.getClockGroup();
    this.isCollidingPowerup = false;
    this.isCollidingChegada = false;
    new Starters(this.app);

    this.path = this.track.getPath();
    this.points = this.path.getPoints(500);

    this.hud = document.createElement("div");
    this.hud.style.position = "absolute";
    this.hud.style.top = "80px";
    this.hud.style.left = "10px";
    this.hud.style.color = "white";
    this.hud.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(this.hud);

    // this.points.forEach((point) => {
    //   let pp = new THREE.Mesh(
    //     new THREE.SphereGeometry(0.5, 32, 32),
    //     new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    //   );
    //   pp.position.copy(point)
    //   this.app.scene.add(pp)
    // });

    // this.marker = new THREE.Mesh(
    //   new THREE.SphereGeometry(0.5, 32, 32),
    //   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // );

    // this.app.scene.add(this.marker)
    // new Menu(this.app);
    let garage = new Garage(this.app);
    this.cameraGarage = garage.getCameraGarage();
    this.lookAtGarage = garage.getLookAtGarage();
  }

  updateHUD() {
    // Update the HUD with app-related information
    this.hud.innerHTML = `
      <div>Elapsed Time: ${this.app.elapsedTime.toFixed(2)}s</div>
      <div>Laps Completed: ${this.app.lapsCompleted}</div>
      <div>Max Speed: ${this.app.maxSpeed.toFixed(2)} km/h</div>
      <div>Remaining Time: ${this.app.remainingTime.toFixed(2)}s</div>
      <div>Game State: ${this.app.gameState}</div>
    `;
  }

  startCountdown(duration) {
    let remaining = duration;
    this.dontMove = true;

    const countdownInterval = setInterval(() => {
      // Update the text geometry
      if (remaining > 0)
        this.countdownText.geometry = new TextGeometry(remaining.toString(), {
          font: this.font,
          size: 1,
          height: 0,
        });
      else {
        this.dontMove = false;
        this.countdownText.geometry = new TextGeometry("GO!!!", {
          font: this.font,
          size: 1,
          height: 0,
        });
        this.startRace = true;
        this.stop = false;
      }
      const worldCameraPosition = new THREE.Vector3();
      this.carBox.getWorldPosition(worldCameraPosition);
      worldCameraPosition.y += 2;
      worldCameraPosition.z += 2;
      this.countdownText.position.copy(worldCameraPosition);
      this.countdownText.rotation.y = Math.PI / 1.3;

      remaining -= 1;

      if (remaining < -1) {
        clearInterval(countdownInterval);
        this.countdownText.geometry = new TextGeometry("", {
          font: this.font,
          size: 1,
          height: 0,
        });
      }
    }, 1000); // 1000 milliseconds = 1 second
  }

  /**
   * Called when user changes number of segments in UI. Recreates the curve's objects accordingly.
   */
  updateCurve() {
    if (this.curve !== undefined && this.curve !== null) {
      this.app.scene.remove(this.curve);
    }
    this.buildCurve();
  }

  /**
   * Called when user curve's closed parameter in the UI. Recreates the curve's objects accordingly.
   */
  updateCurveClosing() {
    if (this.curve !== undefined && this.curve !== null) {
      this.app.scene.remove(this.curve);
    }
    this.buildCurve();
  }

  /**
   * Called when user changes number of texture repeats in UI. Updates the repeat vector for the curve's texture.
   * @param {number} value - repeat value in S (or U) provided by user
   */
  updateTextureRepeat(value) {
    this.material.map.repeat.set(value, 3);
  }

  /**
   * Called when user changes line visibility. Shows/hides line object.
   */
  updateLineVisibility() {
    this.line.visible = this.showLine;
  }

  /**
   * Called when user changes wireframe visibility. Shows/hides wireframe object.
   */
  updateWireframeVisibility() {
    this.wireframe.visible = this.showWireframe;
  }

  /**
   * Called when user changes mesh visibility. Shows/hides mesh object.
   */
  updateMeshVisibility() {
    this.mesh.visible = this.showMesh;
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */

  update() {
    this.carBox.remove(this.car.getBoxx());
    this.carBox.remove(this.car.getBoxxx());
    const box1 = new THREE.Box3().setFromObject(this.carBox);
    this.carBox.add(this.car.getBoxx());
    this.carBox.add(this.car.getBoxxx());
    const box2 = new THREE.Box3().setFromObject(this.powerups);

    const box3 = new THREE.Box3().setFromObject(this.track.getLinhaChegada());

    const isCurrentlyColliding = box1.intersectsBox(box2);
    const isCurrentlyCollidingChegada = box1.intersectsBox(box3);

    this.raycaster.setFromCamera(this.mouse, this.app.getActiveCamera());

    if (!this.stop) {
      if (!this.dontMove) this.car.move();
      if (!this.garageMenu && this.startedCamera && this.startRace)
        this.bot.moveMaseratiBot();

      if (isCurrentlyColliding && !this.isCollidingPowerup) {
        this.car.setVelocity();
        this.isCollidingPowerup = true;
        this.moveObstacle = true;
        this.stop = true;
      } else if (!isCurrentlyColliding && this.isCollidingPowerup) {
        // Reset the flag only when the car has exited the collision
        this.isCollidingPowerup = false;
      }

      if (isCurrentlyCollidingChegada && !this.isCollidingChegada) {
        this.laps += 1;
        this.isCollidingChegada = true;
        console.log(this.laps);
        if (this.laps == 3) {
          this.laps += 1;
          this.endGame = true;
          this.fireworks = new Fireworks(this.app.scene, this.fireworksOptions);
          this.saveToLeaderboard({
            "player name": this.menu.getPlayerName(),
            won: true,
            "time elapsed": this.app.elapsedTime,
          });
          console.log(this.difficulty);
          this.end = new EndGameMenu(this.app, [
            this.difficulty,
            "Car 1",
            "Bot 1",
            "100",
            "120",
            "W",
            "L",
          ]);

          // this.screenMesh.position.x = 120;
          // this.screenMesh.position.y = 85;
          // this.screenMesh.position.z = 50;
        }
      } else if (!isCurrentlyCollidingChegada && this.isCollidingChegada) {
        this.isCollidingChegada = false;
      }
      if (this.endGame) {
        this.fireworks.particleSystem.position.set(
          this.carBox.position.x,
          this.carBox.position.y + 3,
          this.carBox.position.z
        );
        this.fireworks.update();
        const seatWorldPosition = new THREE.Vector3();
        const seattWorldPosition = new THREE.Vector3();
        this.car.getBoxx().getWorldPosition(seatWorldPosition);
        this.car.getBoxxx().getWorldPosition(seattWorldPosition);

        // this.end.getGroup().position.set(-120, -85, -50);
        this.end
          .getGroup()
          .lookAt(
            new THREE.Vector3(
              seattWorldPosition.x,
              seattWorldPosition.y + 3,
              seattWorldPosition.z
            )
          );
        this.end
          .getGroup()
          .position.copy(seatWorldPosition)
          .add(new THREE.Vector3(0, 2, 0));
        //this.end.rotateText();
        this.end.getGroup().scale.set(0.6, 0.6, 0.6);
      }

      if (
        this.app.getActiveCamera().position.distanceTo(this.targetPosition) >
          0.1 &&
        !this.startedCamera
      ) {
        const seattWorldPosition = new THREE.Vector3();
        const seatWorldPosition = new THREE.Vector3();
        this.car.getBoxx().getWorldPosition(seatWorldPosition);
        this.car.getBoxxx().getWorldPosition(seattWorldPosition);
        this.cameraGarage.getWorldPosition(seattWorldPosition);

        this.tPosition = new THREE.Vector3(
          seattWorldPosition.x,
          seattWorldPosition.y + 2,
          seattWorldPosition.z
        );
        if (!this.moveObstacle)
          this.app
            .getActiveCamera()
            .position.lerp(this.tPosition, this.lerpFactor);

        this.app.controls.target.copy(this.lookAtGarage.position);
        if (
          this.app.getActiveCamera().position.distanceTo(this.tPosition) <= 0.1
        ) {
          this.startedCamera = true;
          this.garageMenu = true;
        }
        if (this.garageMenu && !this.createdGarageMenu) {
          if (!this.createdChooseMenu) {
            this.chooseMenu = new ChooseMenu(this.app);
            this.createdChooseMenu = true;
          }
          this.createdGarageMenu = true;
        }
      }

      if (this.leftButton == null && this.createdChooseMenu) {
        this.leftButton = this.chooseMenu.getLeftButton();
        this.rightButton = this.chooseMenu.getRightButton();
        this.startButton = this.chooseMenu.getStartButton();
        this.left2Button = this.chooseMenu.getLeft2Button();
        this.right2Button = this.chooseMenu.getRight2Button();
        this.start2Button = this.chooseMenu.getStart2Button();

        this.countdownText = this.chooseMenu.getThisCountDownText();
        this.font = this.chooseMenu.getThisFont();
      }

      ///////// START GAME /////////////////////////////////////////////////
      if (this.startedCamera && !this.garageMenu) {
        const seatWorldPosition = new THREE.Vector3();
        const seattWorldPosition = new THREE.Vector3();
        this.car.getBoxx().getWorldPosition(seatWorldPosition);
        this.car.getBoxxx().getWorldPosition(seattWorldPosition);
        if (this.app.activeCameraName === "Perspective") {
          this.app.getActiveCamera().position.x = seattWorldPosition.x;
          this.app.getActiveCamera().position.y = seattWorldPosition.y + 2;
          this.app.getActiveCamera().position.z = seattWorldPosition.z;
          this.app.controls.target.copy(seatWorldPosition);
        }
      }

      let closestPoint = null;
      let minDistance = Infinity;

      this.points.forEach((point) => {
        const distance = point.distanceTo(this.car.getCar().position);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = point;
        }
      });

      const trackWidth = 4;
      if (minDistance > trackWidth) {
        this.car.setOffTrackVelocity();
      } else {
        this.car.resetVelocity();
      }

      this.updateHUD();
    } else {
      if (this.startedCamera && this.moveObstacle) {
        const intersects = this.raycaster.intersectObject(
          this.track.getTrack()
        );

        this.app.getActiveCamera().position.set(0, 60, 0);
        this.app.controls.target.copy(new THREE.Vector3(0, 0, 0));

        if (intersects.length > 0 && intersects[0].point !== undefined) {
          this.obstacle.position.copy(intersects[0].point);
          this.obstacle.position.y += 3;
        }
      }
    }
    this.waterShaderMaterial.uniforms.time.value += 0.017;
    this.good_clock.update();
  }
}

export { MyContents };

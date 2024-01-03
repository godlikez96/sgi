import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

class ChooseMenu {
  constructor(app) {
    this.textLoader = new FontLoader();
    this.leftButton = null;
    this.rightButton = null;
    this.startButton = null;
    this.left2Button = null;
    this.right2Button = null;
    this.start2Button = null;

    this.difficultyKey = 0;
    this.difficulty = ["EASY", "MEDIUM", "HARD"];

    this.createChooseCarMenu(app);
  }

  createChooseCarMenu(app) {
    let textMesh;
    let playMesh;
    let startMesh;

    let text2Mesh;
    let play2Mesh;
    let start2Mesh;

    let wheelsgeometry = new THREE.PlaneGeometry(8, 4);
    let wheelsMaterial = new THREE.MeshLambertMaterial({
      color: 0x333333,
      opacity: 0.8,
      transparent: true,
    });
    this.backwheels = new THREE.Mesh(wheelsgeometry, wheelsMaterial);

    this.backwheels.position.x = 82;
    this.backwheels.position.y = 5;
    this.backwheels.position.z = -40;

    this.backwheels.lookAt(app.getActiveCamera().position);

    this.countDownLoader = new FontLoader();
    this.countdownText = 3;

    this.countDownLoader.load(
      "fonts/helvetiker_regular.typeface.json",
      function (font) {
        const textGeometry = new TextGeometry("", {
          font: font,
          size: 1,
          height: 1,
          curveSegments: 20,
        });

        this.font = font;
        const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.countdownText = new THREE.Mesh(textGeometry, textMaterial);
        this.countdownText.position.set(39.5, 1.5, 4);
        app.scene.add(this.countdownText);
      }.bind(this)
    );

    this.textLoader.load(
      "fonts/helvetiker_regular.typeface.json",
      function (font) {
        const textGeometry = new TextGeometry("<-", {
          font: font,
          size: 1,
          height: 0,
          curveSegments: 20,
        });

        const playGeometry = new TextGeometry("->", {
          font: font,
          size: 1,
          height: 0,
          curveSegments: 20,
        });

        const startGeometry = new TextGeometry("START", {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const text2Geometry = new TextGeometry("<-", {
          font: font,
          size: 1,
          height: 0,
          curveSegments: 20,
        });

        const play2Geometry = new TextGeometry("->", {
          font: font,
          size: 1,
          height: 0,
          curveSegments: 20,
        });

        const start2Geometry = new TextGeometry(
          this.difficulty[this.difficultyKey],
          {
            font: font,
            size: 0.5,
            height: 0,
            curveSegments: 20,
          }
        );

        const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        playMesh = new THREE.Mesh(playGeometry, textMaterial);
        startMesh = new THREE.Mesh(startGeometry, textMaterial);

        text2Mesh = new THREE.Mesh(text2Geometry, textMaterial);
        play2Mesh = new THREE.Mesh(play2Geometry, textMaterial);
        start2Mesh = new THREE.Mesh(start2Geometry, textMaterial);

        const worldCameraPosition = new THREE.Vector3();
        this.backwheels.getWorldPosition(worldCameraPosition);

        textMesh.position.x = 82;
        textMesh.position.y = 5;
        textMesh.position.z = -40;
        text2Mesh.position.x = 82;
        text2Mesh.position.y = 4;
        text2Mesh.position.z = -40;

        textMesh.lookAt(worldCameraPosition);
        text2Mesh.lookAt(worldCameraPosition);

        textMesh.rotateY(Math.PI / 2);
        textMesh.position.add(new THREE.Vector3(0, 0.5, 3));
        text2Mesh.rotateY(Math.PI / 2);
        text2Mesh.rotateZ(Math.PI / 2);
        text2Mesh.position.add(new THREE.Vector3(0, 0, 3));

        playMesh.lookAt(app.getActiveCamera().position);
        play2Mesh.lookAt(app.getActiveCamera().position);

        playMesh.position.x = 82;
        playMesh.position.y = 5;
        playMesh.position.z = -40;
        play2Mesh.position.x = 82;
        play2Mesh.position.y = 4;
        play2Mesh.position.z = -40;

        playMesh.lookAt(worldCameraPosition);
        play2Mesh.lookAt(worldCameraPosition);

        playMesh.rotateY(Math.PI / 2);
        play2Mesh.rotateY(Math.PI / 2);
        play2Mesh.rotateZ(Math.PI / 2);
        playMesh.position.add(new THREE.Vector3(0.1, 0.5, -2));
        play2Mesh.position.add(new THREE.Vector3(0.1, 0, -2));

        startMesh.lookAt(app.getActiveCamera().position);
        start2Mesh.lookAt(app.getActiveCamera().position);

        startMesh.position.x = 82;
        startMesh.position.y = 5;
        startMesh.position.z = -40;
        start2Mesh.position.x = 82;
        start2Mesh.position.y = 4;
        start2Mesh.position.z = -40;

        startMesh.lookAt(worldCameraPosition);
        start2Mesh.lookAt(worldCameraPosition);

        startMesh.rotateY(Math.PI / 2);
        start2Mesh.rotateY(Math.PI / 2);
        start2Mesh.rotateZ(Math.PI / 2);
        startMesh.position.add(new THREE.Vector3(0.1, 0.6, 0.9));
        start2Mesh.position.add(new THREE.Vector3(0.1, 0.1, 0.9));

        this.leftButton = textMesh;
        this.rightButton = playMesh;
        this.startButton = startMesh;

        this.left2Button = text2Mesh;
        this.right2Button = play2Mesh;
        this.start2Button = start2Mesh;

        app.scene.add(
          textMesh,
          playMesh,
          startMesh,
          text2Mesh,
          play2Mesh,
          start2Mesh
        );
      }.bind(this)
    );

    app.scene.add(this.backwheels);
  }

  getThisCountDownText() {
    return this.countdownText;
  }

  getLeftButton() {
    return this.leftButton;
  }

  getRightButton() {
    return this.rightButton;
  }

  getStartButton() {
    return this.startButton;
  }

  getLeft2Button() {
    return this.left2Button;
  }

  getRight2Button() {
    return this.right2Button;
  }

  getStart2Button() {
    return this.start2Button;
  }

  getDifficulty() {
    this.difficultyKey += 1;
    if (this.difficultyKey == 3) this.difficultyKey = 0;
    return this.difficulty[this.difficultyKey];
  }

  getThisFont() {
    return this.font;
  }
}

export { ChooseMenu };

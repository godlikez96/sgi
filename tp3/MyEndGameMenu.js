import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

class EndGameMenu {
  constructor(app, data) {
    this.textLoader = new FontLoader();
    this.leftButton = null;
    this.rightButton = null;

    this.group = new THREE.Group();
    this.textGroup = new THREE.Group();

    this.createEndGameMenu(app, data);
  }

  createEndGameMenu(app, data) {
    let textMesh;
    let playMesh;
    let startMesh;

    let resultsMesh;

    let pTimeMesh;
    let oTimeMesh;
    let wMesh;
    let lMesh;

    let playAgainMesh;

    let screen = new THREE.PlaneGeometry(10, 5, 1);
    let screenMaterial = new THREE.MeshLambertMaterial({
      color: 0x333333,
      opacity: 0.8,
      transparent: true,
    });
    this.screenMesh = new THREE.Mesh(screen, screenMaterial);
    //this.screenMesh.lookAt(app.getActiveCamera().position);

    // this.screenMesh.position.x = 120;
    // this.screenMesh.position.y = 85;
    // this.screenMesh.position.y = 5;
    // this.screenMesh.position.z = 50;

    this.textLoader.load(
      "fonts/helvetiker_regular.typeface.json",
      function (font) {
        const resultsGeometry = new TextGeometry("RESULTS", {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const difficultyGeometry = new TextGeometry(data[0], {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const carOwnGeometry = new TextGeometry(data[1], {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const carOppGeometry = new TextGeometry(data[2], {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const playerTimeGeometry = new TextGeometry(data[3], {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const oppTimeGeometry = new TextGeometry(data[4], {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const winGeometry = new TextGeometry(data[5], {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const loseGeometry = new TextGeometry(data[6], {
          font: font,
          size: 0.5,
          height: 0,
          curveSegments: 20,
        });

        const playAgainGeometry = new TextGeometry("Play Again", {
          font: font,
          size: 0.8,
          height: 0,
          curveSegments: 20,
        });

        const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        resultsMesh = new THREE.Mesh(resultsGeometry, textMaterial);
        textMesh = new THREE.Mesh(difficultyGeometry, textMaterial);
        playMesh = new THREE.Mesh(carOwnGeometry, textMaterial);
        startMesh = new THREE.Mesh(carOppGeometry, textMaterial);

        pTimeMesh = new THREE.Mesh(playerTimeGeometry, textMaterial);
        oTimeMesh = new THREE.Mesh(oppTimeGeometry, textMaterial);
        wMesh = new THREE.Mesh(winGeometry, textMaterial);
        lMesh = new THREE.Mesh(loseGeometry, textMaterial);

        playAgainMesh = new THREE.Mesh(playAgainGeometry, textMaterial);

        const worldCameraPosition = new THREE.Vector3();
        this.screenMesh.getWorldPosition(worldCameraPosition);

        textMesh.lookAt(worldCameraPosition);
        textMesh.position.x = -4;
        textMesh.position.y = 0;
        textMesh.position.z = 0.1;
        textMesh.rotateY(-Math.PI / 2.15);

        playMesh.lookAt(worldCameraPosition);
        playMesh.position.x = -0.5;
        playMesh.position.y = 0;
        playMesh.position.z = 0.1;
        playMesh.rotateY(-Math.PI / 2.15);

        startMesh.lookAt(worldCameraPosition);
        startMesh.position.x = 3;
        startMesh.position.y = 0;
        startMesh.position.z = 0.1;
        startMesh.rotateY(-Math.PI / 2.15);

        pTimeMesh.lookAt(worldCameraPosition);
        pTimeMesh.position.x = -0.5;
        pTimeMesh.position.y = -0.6;
        pTimeMesh.position.z = 0.1;
        pTimeMesh.rotateY(-Math.PI / 2.15);

        oTimeMesh.lookAt(worldCameraPosition);
        oTimeMesh.position.x = 3;
        oTimeMesh.position.y = -0.6;
        oTimeMesh.position.z = 0.1;
        oTimeMesh.rotateY(-Math.PI / 2.15);

        wMesh.lookAt(worldCameraPosition);
        wMesh.position.x = -0.5;
        wMesh.position.y = 0.6;
        wMesh.position.z = 0.1;
        wMesh.rotateY(-Math.PI / 2.15);

        lMesh.lookAt(worldCameraPosition);
        lMesh.position.x = 3;
        lMesh.position.y = 0.6;
        lMesh.position.z = 0.1;
        lMesh.rotateY(-Math.PI / 2.15);

        playAgainMesh.lookAt(worldCameraPosition);
        playAgainMesh.position.x = -2.5;
        playAgainMesh.position.y = -2;
        playAgainMesh.position.z = 0.5;
        playAgainMesh.rotateY(-Math.PI / 2.15);

        resultsMesh.lookAt(worldCameraPosition);
        resultsMesh.position.x = -1.5;
        resultsMesh.position.y = 1.7;
        resultsMesh.position.z = 0.1;
        resultsMesh.rotateY(-Math.PI / 2.15);

        this.playAgainButton = playAgainMesh;

        this.textGroup.add(
          textMesh,
          playMesh,
          startMesh,
          pTimeMesh,
          oTimeMesh,
          wMesh,
          lMesh,
          playAgainMesh,
          resultsMesh
        );
        this.textGroup.rotateZ(-Math.PI / 40);
      }.bind(this)
    );

    this.group.add(this.screenMesh, this.textGroup);
    // this.group.lookAt(app.getActiveCamera().position);
    app.scene.add(this.group);
  }

  getPlayAgain() {
    return this.playAgainButton;
  }

  rotateText() {
    this.textGroup.rotateZ(-Math.PI / 10);
  }

  getGroup() {
    return this.group;
  }
}

export { EndGameMenu };

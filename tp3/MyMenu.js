import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

class Menu {
  constructor(app, leaderboard) {
    this.textLoader = new FontLoader();
    this.leaderLoader = new FontLoader();
    this.createMenu(app, leaderboard);
  }

  createLeaderboardLine(line) {}

  createMenu(app, leaderboard) {
    let textMesh;
    let playMesh;
    let authorsMesh;
    let opponentcar;
    let difficultylevel;
    this.playerName = "";
    let carSelected;

    this.textLoader.load(
      "fonts/helvetiker_regular.typeface.json",
      function (font) {
        const textGeometry = new TextGeometry("Welcome to Race Game", {
          font: font,
          size: 3,
          height: 0,
          curveSegments: 20,
        });
        const difficultylevelGeometry = new TextGeometry("Difficulty level: ", {
          font: font,
          size: 2.3,
          height: 0,
          curveSegments: 20,
        });

        const playGeometry = new TextGeometry("Start", {
          font: font,
          size: 3,
          height: 0,
          curveSegments: 20,
        });
        const authorsGeometry = new TextGeometry(
          "Authors: Carlota Silva and Joao Sousa (FEUP)",
          {
            font: font,
            size: 0.5,
            height: 0,
            curveSegments: 20,
          }
        );
        const playerNameGeometry = new TextGeometry("Player name: ", {
          font: font,
          size: 3.8,
          height: 0,
          curveSegments: 20,
        });
        const carSelectedGeometry = new TextGeometry(
          "Touch to select the Car ",
          {
            font: font,
            size: 3,
            height: 0,
            curveSegments: 20,
          }
        );
        const opponentcarGeometry = new TextGeometry(
          "Touch to select the Opponent Car ",
          {
            font: font,
            size: 2.5,
            height: 0,
            curveSegments: 20,
          }
        );

        const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

        const carSelectedMesh = new THREE.Mesh(
          carSelectedGeometry,
          textMaterial
        );
        carSelectedMesh.up.set(0, 1, 0);
        carSelectedMesh.lookAt(app.getActiveCamera().position);
        carSelectedMesh.position.set(87, 75, 84);

        this.text = carSelectedMesh;
        app.scene.add(carSelectedMesh, this.text);

        const opponentcarMesh = new THREE.Mesh(
          opponentcarGeometry,
          textMaterial
        );
        opponentcarMesh.up.set(0, 1, 0);
        opponentcarMesh.lookAt(app.getActiveCamera().position);
        opponentcarMesh.position.set(99, 75, 82);

        app.scene.add(opponentcarMesh);

        const difficultylevelMesh = new THREE.Mesh(
          difficultylevelGeometry,
          textMaterial
        );
        difficultylevelMesh.up.set(0, 1, 0);
        difficultylevelMesh.lookAt(app.getActiveCamera().position);
        difficultylevelMesh.position.set(108, 75, 80.5);

        app.scene.add(difficultylevelMesh);

        let i = 0;
        JSON.parse(leaderboard).forEach((line) => {
          const line2 = new TextGeometry(
            line["player name"] +
              " (" +
              line["time elapsed"].toString() +
              " sec)",
            {
              font: font,
              size: 2,
              height: 0,
              curveSegments: 20,
            }
          );

          const line2Mesh = new THREE.Mesh(line2, textMaterial);
          line2Mesh.up.set(0, 1, 0);
          line2Mesh.lookAt(app.getActiveCamera().position);
          line2Mesh.position.set(120, 97 - i * 2, 5 - i);
          i += 3.5;
          app.scene.add(line2Mesh);
        });

        const playerNameMaterial = new THREE.MeshPhongMaterial({
          color: 0xff0000,
        });
        const playerNameMesh = new THREE.Mesh(
          playerNameGeometry,
          playerNameMaterial
        );
        playerNameMesh.up.set(0, 1, 0);
        playerNameMesh.lookAt(app.getActiveCamera().position);
        playerNameMesh.position.set(70, 75, 85);
        app.scene.add(playerNameMesh);

        // Create player name input box
        const playerNameInput = document.createElement("input");
        playerNameInput.type = "text";
        playerNameInput.placeholder = "Enter your name";
        playerNameInput.style.position = "absolute";
        playerNameInput.style.top = "42%";
        playerNameInput.style.left = "48%";
        playerNameInput.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(playerNameInput);

        // Handle input change
        playerNameInput.addEventListener("input", (event) => {
          this.playerName = event.target.value;
          // Do something with the player name (e.g., store it or update the game state)
        });

        // Handle Enter key press
        playerNameInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            playerNameMesh.geometry = new TextGeometry(
              "Player name: " + this.playerName,
              {
                font: font,
                size: 3,
                height: 0,
                curveSegments: 20,
              }
            );
            playerNameInput.style.display = "none"; // Hide the input box after pressing Enter
          }
        });

        const authorsMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
        });
        authorsMesh = new THREE.Mesh(authorsGeometry, authorsMaterial);
        authorsMesh.up.set(0, 1, 0);
        authorsMesh.lookAt(app.getActiveCamera().position);
        authorsMesh.position.set(145, 95, 71);
        app.scene.add(authorsMesh);

        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        playMesh = new THREE.Mesh(playGeometry, textMaterial);

        textMesh.up.set(0, 1, 0);
        textMesh.lookAt(app.getActiveCamera().position);

        const worldCameraPosition = new THREE.Vector3();
        app.getActiveCamera().getWorldPosition(worldCameraPosition);
        textMesh.lookAt(worldCameraPosition);

        textMesh.position.x = 105;
        textMesh.position.y = 100;
        textMesh.position.z = 70;

        playMesh.up.set(0, 1, 0);
        playMesh.lookAt(app.getActiveCamera().position);

        playMesh.lookAt(worldCameraPosition);

        playMesh.position.x = 140;
        playMesh.position.y = 90;
        playMesh.position.z = 61;

        //this.text = playMesh;

        app.scene.add(textMesh);
      }.bind(this)
    );

    let wheelsgeometry = new THREE.BoxGeometry(70, 50, 1);
    let leaderboardgeometry = new THREE.BoxGeometry(30, 50, 1);

    let wheelsMaterial = new THREE.MeshLambertMaterial({
      color: 0x333333,
      opacity: 0.8,
      transparent: true,
    });
    this.backwheels = new THREE.Mesh(wheelsgeometry, wheelsMaterial);
    this.leaderboardMesh = new THREE.Mesh(leaderboardgeometry, wheelsMaterial);

    this.backwheels.lookAt(app.getActiveCamera().position);
    this.leaderboardMesh.lookAt(app.getActiveCamera().position);

    this.backwheels.position.x = 120;
    this.backwheels.position.y = 85;
    this.backwheels.position.z = 50;

    this.leaderboardMesh.position.x = 130;
    this.leaderboardMesh.position.y = 80;
    this.leaderboardMesh.position.z = -10;

    app.scene.add(this.backwheels, this.leaderboardMesh);
  }

  getPlayerName() {
    return this.playerName;
  }

  getThisText() {
    return this.text;
  }
}

export { Menu };

import * as THREE from "three";

class Obstacles {
  constructor(app) {
    this.app = app;

    this.treeobstacles = new THREE.Group();
    this.buildTree();
    this.badclockGroup = new THREE.Group();
    this.buildbadClock();
  }

  buildTree() {
    let treeTrunkGeometry = new THREE.BoxGeometry(15, 15, 30);
    let treeTrunkMaterial = new THREE.MeshLambertMaterial({ color: 0x4b3f2f });
    let trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
    trunk.position.set(60, -80, 20);
    this.treeobstacles.add(trunk);

    let treeCrownMaterial = new THREE.MeshLambertMaterial({ color: 0x498c2c });
    let treeCrowngeometry = new THREE.SphereGeometry(25, 25, 25);
    let crown = new THREE.Mesh(treeCrowngeometry, treeCrownMaterial);
    crown.position.set(60, -80, 53);
    this.treeobstacles.add(crown);
    this.treeobstacles.scale.set(0.07, 0.07, 0.07);
    this.treeobstacles.rotateX(-Math.PI / 2);

    this.app.scene.add(this.treeobstacles);
  }
  buildbadClock() {
    const clockGeometry = new THREE.CylinderGeometry(10, 10, 1, 64);
    this.imageTexture = new THREE.TextureLoader().load("./images/caveira.jpeg");
    const clockMaterial = new THREE.MeshBasicMaterial({
      map: this.imageTexture,
    });
    const clock = new THREE.Mesh(clockGeometry, clockMaterial);
    clock.rotateZ(Math.PI / 2);
    clock.rotateX(Math.PI);

    const boxGeometry = new THREE.BoxGeometry(2, 20, 20);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x000 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.add(new THREE.Vector3(0, -20, 0));

    this.badclockGroup.add(clock, box);

    this.badclockGroup.scale.set(0.1, 0.1, 0.1);
    this.badclockGroup.position.set(9, 3, 5);

    this.app.scene.add(this.badclockGroup);
  }

  getBadClock() {
    return this.badclockGroup;
  }
}

export { Obstacles };

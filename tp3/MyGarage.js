import * as THREE from "three";

class Garage {
  constructor(app) {
    this.app = app;
    this.buildGarage();
  }

  buildGarage() {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const geometryCamera = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x888888,
      side: THREE.DoubleSide,
    });
    let plane = new THREE.Mesh(geometry, material);
    this.cameraGarage = new THREE.Mesh(geometryCamera, material);
    this.lookAtGarage = new THREE.Mesh(geometryCamera, material);
    plane.position.x = 80;
    plane.position.y = 0.2;
    plane.position.z = -40;
    plane.rotation.x = Math.PI / 2;

    this.cameraGarage.position.x = 90;
    this.cameraGarage.position.y = 3;
    this.cameraGarage.position.z = -40;
    this.cameraGarage.rotation.x = Math.PI / 2;

    this.lookAtGarage.position.x = 60;
    this.lookAtGarage.position.y = -5;
    this.lookAtGarage.position.z = -40;
    this.lookAtGarage.rotation.x = Math.PI / 2;
    this.app.scene.add(plane, this.cameraGarage, this.lookAtGarage);
  }

  getCameraGarage() {
    return this.cameraGarage;
  }

  getLookAtGarage() {
    return this.lookAtGarage;
  }
}

export { Garage };

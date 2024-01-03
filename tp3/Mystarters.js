import * as THREE from "three";

class Starters {
  constructor(app) {
    this.app = app;

    this.flagsobject = new THREE.Group();
    this.buildFlags();
  }

  buildFlags() {
    let poleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 4.5, 32);
    let poleMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    let pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(70, -80, 20);
    this.flagsobject.add(pole);

    this.imageTexture = new THREE.TextureLoader().load(
      "./images/racepole.avif"
    );
    let flagMaterial = new THREE.MeshBasicMaterial({ map: this.imageTexture });
    let flaggeometry = new THREE.BoxGeometry(2.5, 2, 0.05);
    let flag = new THREE.Mesh(flaggeometry, flagMaterial);

    flag.position.set(68.7, -78.8, 20);
    this.flagsobject.add(flag);
    this.flagsobject.scale.set(1, 1, 1);
    // this.flagsobject.rotateY(- Math.PI/2  );
    this.flagsobject.position.set(-25, 82, -20);
    //  this.flagsobject.rotateY( Math.PI/2  );

    this.app.scene.add(this.flagsobject);
  }
}

export { Starters };

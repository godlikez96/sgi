import * as THREE from "three";

class Track {
  constructor(app) {
    this.app = app;
    this.segments = 100;
    this.width = 2;

    this.path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(10, 0, 10),
      new THREE.Vector3(20, 0, 0),
      new THREE.Vector3(10, 0, -20),
      new THREE.Vector3(-10, 0, -10),
      new THREE.Vector3(-20, 0, 0),
      new THREE.Vector3(-10, 0, 10),
      new THREE.Vector3(0, 0, 10), // Closing the loop
    ]);

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

    this.paintPaths(this.botPaths);
    this.curve = new THREE.Group();
    this.buildTrack();
  }

  paintPaths(botPaths) {
    for (var key in botPaths) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0x123456,
        side: THREE.DoubleSide,
      });
      let plane = new THREE.Mesh(geometry, material);
      plane.position.add(
        new THREE.Vector3(botPaths[key][0], botPaths[key][1], botPaths[key][2])
      );
      plane.rotation.x = (Math.PI * 1) / 2;
      this.app.scene.add(plane);
    }
  }

  buildTrack() {
    let textureLoader = new THREE.TextureLoader();
    let roadTexture = textureLoader.load("./images/race.jpg"); // Replace with your texture path
    roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(3, 5); // Adjust as necessary

    const grassTextureLoader = new THREE.TextureLoader();
    const grassTexture = grassTextureLoader.load("./images/grass.jpg");
    // Adjust the texture settings for tiling
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(8, 8); // Experiment with these values
    this.grassMaterial = new THREE.MeshLambertMaterial({ map: grassTexture });
    const anothergeometry = new THREE.CircleGeometry(200, 128);
    this.circle = new THREE.Mesh(anothergeometry, this.grassMaterial);

    const skydomeGeometry = new THREE.SphereGeometry(200, 60, 40);
    skydomeGeometry.scale(-1, 1, 1); // Invert the geometry to see the inside

    const skydomeMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("./images/panorama_s.jpg"),
    });

    const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
    skydome.position.add(new THREE.Vector3(0, 30, 0));

    // // skybox
    // const skyboxImagePaths = [
    //   './images/skybox/posx.jpg',   // pos-x
    //   './images/skybox/negx.jpg',    // neg-x
    //   './images/skybox/negy.jpg',     // pos-y
    //   './images/skybox/posy.jpg',  // neg-y
    //   './images/skybox/negz.jpg',   // pos-z
    //   './images/skybox/posz.jpg'     // neg-z
    // ];

    // // Load textures
    // const skyBoxtextureLoader = new THREE.CubeTextureLoader();
    // const skyboxTexture = skyBoxtextureLoader.load(skyboxImagePaths);

    // // Create skybox material
    // const skyboxMaterial = new THREE.MeshBasicMaterial({
    //   envMap: skyboxTexture,
    //   side: THREE.BackSide // Important: Render the inside of the cube
    // });

    // // Create skybox geometry
    // const skyboxGeometry = new THREE.BoxGeometry(500, 500, 500); // Size should be large enough to encompass your scene

    // // Create the skybox mesh
    // const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

    // skyboxTexture.generateMipmaps = false

    // this.app.scene.add( skybox );

    this.app.scene.add(skydome);

    this.circle.rotation.x = (-Math.PI * 90) / 180;
    this.app.scene.add(this.circle);

    let geometry = new THREE.TubeGeometry(
      this.path,
      this.segments,
      this.width,
      3,
      false
    );
    let trackMaterial = new THREE.MeshBasicMaterial({ map: roadTexture });
    this.trackmesh = new THREE.Mesh(geometry, trackMaterial);

    let points = this.path.getPoints(this.segments);
    let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

    let lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let line = new THREE.Line(bGeometry, lineMaterial);

    let linhaChegada = new THREE.BoxGeometry(3.5, 0.2, 0.2); // Tamanho da linha de chegada
    this.linhaChegadaMesh = new THREE.Mesh(
      linhaChegada,
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.linhaChegadaMesh.position.set(-20, -1.3, 0); // Posição da linha de chegada
    //   this.curve = new THREE.Group();

    this.curve.add(this.trackmesh);
    this.curve.add(line);
    this.curve.add(this.linhaChegadaMesh);

    this.curve.rotateZ(Math.PI);
    this.curve.scale.set(2, 0.4, 2);

    //this.curve.position.add(new THREE.Vector3(3, 0, 5))
    this.app.scene.add(this.curve);

    const curvePoints = this.path.getPoints(100);

    const scaleX = 2,
      scaleY = 0.4,
      scaleZ = 2;
    const scaleMatrix = new THREE.Matrix4().makeScale(scaleX, scaleY, scaleZ);

    const axis = new THREE.Vector3(0, 0, 1);
    const angle = Math.PI;
    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);

    curvePoints.forEach((point) => {
      point.applyMatrix4(scaleMatrix);
      point.applyMatrix4(rotationMatrix);
    });

    this.path.points = curvePoints;
  }

  getLinhaChegada() {
    return this.linhaChegadaMesh;
  }

  getTrackMesh() {
    return this.trackmesh;
  }

  getTrack() {
    return this.circle;
  }

  getPath() {
    return this.path;
  }
}

export { Track };

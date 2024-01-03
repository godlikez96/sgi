import * as THREE from "three";

class Powerups {
  constructor(app) {
    this.app = app;

    this.vertexShader = `
    uniform float time;
varying vec3 vNormal;

void main() {
    vNormal = normal;
    float pulse = sin(time) * 0.1 + 1.0; // Pulsating effect
    vec3 newPosition = position * pulse;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}

  `;

    this.fragmentShader = `
  uniform float time;
uniform float opacity;  // Add an opacity uniform
varying vec3 vNormal;

void main() {
    vec3 color = vec3(0.6, 0.7, 0.8); // Bubble color
    float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1)), 2.0);
    gl_FragColor = vec4(color + intensity * 0.5, opacity);
}

  `;

    this.bubbleShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: {
        time: { value: 0.0 },
        opacity: { value: 0.5 },
      },
      transparent: true,
    });

    const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    this.bubbleMesh = new THREE.Mesh(sphereGeometry, this.bubbleShaderMaterial);

    this.velocitygroup = new THREE.Group();
    this.builddoublevelocity();
    this.goodclockGroup = new THREE.Group();
    this.buildgoodClock();
  }

  builddoublevelocity() {
    const velocGeometry = new THREE.CylinderGeometry(10, 10, 1, 64);
    this.imageTexture = new THREE.TextureLoader().load(
      "./images/2velocityfinal.png"
    );
    const velocMaterial = new THREE.MeshBasicMaterial({
      map: this.imageTexture,
    });
    const velocityPower = new THREE.Mesh(velocGeometry, velocMaterial);
    velocityPower.rotateZ(-Math.PI / 2);
    velocityPower.rotateX(Math.PI);

    const boxGeometry = new THREE.BoxGeometry(2, 20, 20);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x000 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.add(new THREE.Vector3(0, -20, 0));

    this.velocitygroup.add(velocityPower, box);

    this.velocitygroup.scale.set(0.1, 0.1, 0.1);
    this.velocitygroup.position.set(10, 3, 20);

    this.app.scene.add(this.velocitygroup);
  }
  buildgoodClock() {
    const clockGeometry = new THREE.CylinderGeometry(10, 10, 1, 64);
    this.imageTexture = new THREE.TextureLoader().load(
      "./images/pink-clock.jpg"
    );
    const clockMaterial = new THREE.MeshBasicMaterial({
      map: this.imageTexture,
    });
    const clock = new THREE.Mesh(clockGeometry, clockMaterial);
    clock.rotateZ(-Math.PI / 2);

    const boxGeometry = new THREE.BoxGeometry(2, 20, 20);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x000 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.add(new THREE.Vector3(0, -20, 0));

    this.goodclockGroup.add(clock, box);

    this.goodclockGroup.scale.set(0.1, 0.1, 0.1);
    this.goodclockGroup.position.set(7, 3, 15);
    this.bubbleMesh.position.set(7, 3, 15);

    this.app.scene.add(this.goodclockGroup);
    this.app.scene.add(this.bubbleMesh);
  }

  getClockGroup() {
    return this.goodclockGroup;
  }

  update() {
    this.bubbleShaderMaterial.uniforms.time.value += 0.017;
  }
}

export { Powerups };

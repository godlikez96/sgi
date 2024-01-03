import * as THREE from "three";

class Fireworks {
  constructor(scene, options) {
    this.scene = scene;
    this.options = options;
    this.particleSystem = null;
    this.init();
  }

  init() {
    const particles = this.options.particles || 500;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < particles; i++) {
      // Positions
      positions.push((Math.random() * 2 - 1) * this.options.size);
      positions.push((Math.random() * 2 - 1) * this.options.size);
      positions.push((Math.random() * 2 - 1) * this.options.size);

      // Colors
      const vx = (positions[i * 3] + 1) / 2;
      const vy = (positions[i * 3 + 1] + 1) / 2;
      const vz = (positions[i * 3 + 2] + 1) / 2;

      color.setRGB(vx, vy, vz);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: this.options.particleSize || 0.1,
      vertexColors: true,
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  update() {
    const positions = this.particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += (Math.random() - 0.5) * this.options.velocity;
      positions[i + 1] += (Math.random() - 0.5) * this.options.velocity;
      positions[i + 2] += (Math.random() - 0.5) * this.options.velocity;
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  getParticleSystem() {
    return this.particleSystem;
  }
}

export { Fireworks };

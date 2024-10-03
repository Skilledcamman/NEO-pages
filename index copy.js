import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import { STLLoader } from './src/STLLoader.js'
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Constants
const EARTH_RADIUS = 1;
const MOON_RADIUS = 0.25;
const asteroid_RADIUS = 0.05;
const MOON_ORBIT_RADIUS = 25;
const CAMERA_ZOOM_MIN = 1.2;
const CAMERA_ZOOM_MAX = 100;

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// Earth group
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

// Earth mesh
const earthGeometry = new THREE.IcosahedronGeometry(EARTH_RADIUS, 12);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load("./textures/00_earthmap1k.jpg"),
  specularMap: new THREE.TextureLoader().load("./textures/02_earthspec1k.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.add(earthMesh);

// Lights mesh
const lightsGeometry = earthGeometry;
const lightsMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(lightsGeometry, lightsMaterial);
earthGroup.add(lightsMesh);

// Clouds mesh
const cloudsGeometry = earthGeometry;
const cloudsMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
  alphaMap: new THREE.TextureLoader().load('./textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

// Glow mesh
const glowGeometry = earthGeometry;
const glowMaterial = getFresnelMat();
const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

// Create the _Apophis mesh
const _ApophisGroup = new THREE.Group();
scene.add(_ApophisGroup);
const _ApophisGeometry = new THREE.TetrahedronGeometry(asteroid_RADIUS, 2);
const _ApophisMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpScale: 2,
});
const _ApophisMesh = new THREE.Mesh(_ApophisGeometry, _ApophisMaterial);
_ApophisMesh.position.set(2.5, 0, 0);
_ApophisGroup.add(_ApophisMesh)

// Stars
/*const stars = getStarfield({ numStars: 500 });
scene.add(stars);*/

// Sun light
const sunLight = new THREE.DirectionalLight(0xffffff, 4.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Moon group
const moonGroup = new THREE.Group();
scene.add(moonGroup);
const moonGeometry = new THREE.IcosahedronGeometry(MOON_RADIUS, 12);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/06_moonmap4k.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/07_moonbump4k.jpg"),
  bumpScale: 2,
});
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.set(MOON_ORBIT_RADIUS, 0, 0);
moonGroup.add(moonMesh);

// Orbit
const orbitGeometry = new THREE.RingGeometry(MOON_ORBIT_RADIUS, MOON_ORBIT_RADIUS, 500);
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
orbit.rotation.x = Math.PI / 2;
scene.add(orbit); 

// Create a sphere to cover the Earth and Moon
const sphereGeometry = new THREE.SphereGeometry(30, 60, 60);
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("./textures/stars.jpg"),
  side: THREE.BackSide
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = CAMERA_ZOOM_MAX;
controls.minDistance = CAMERA_ZOOM_MIN;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  //stars.rotation.y -= 0.0002;
  moonGroup.rotation.y += 0.001;
  //_ApophisGroup.rotation.y += 0.0002;
  renderer.render(scene, camera);
}

animate();

// Handle window resize
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

// Add click event handler
document.addEventListener('click', (event) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(moonMesh);
  if (intersects.length > 0) {
    // Create a popup with the text "Moon" and a GIF
    const popup = document.createElement('div');
    popup.textContent = 'Moon';
    popup.style.position = 'absolute';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.width = '300px';
    popup.style.height = '200px';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(popup);

// Add a GIF to the popup
const gif = document.createElement('img');
gif.src = './gif/moon.gif'; // 
gif.style.height = '100%';
//gif.style.width = '50%';
gif.style.objectFit = 'cover';
gif.style.display = 'flex';
gif.style.justifyContent = 'center';
gif.style.alignItems = 'center';
gif.style.margin = 'auto';
popup.appendChild(gif);

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.width = '20px';
    closeButton.style.height = '16px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '12px';
    closeButton.style.display = 'flex';
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';
    closeButton.style.lineHeight = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);
  }
});
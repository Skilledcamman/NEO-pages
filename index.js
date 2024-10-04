import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import { CSS2DRenderer, CSS2DObject } from 'jsm/renderers/CSS2DRenderer.js';



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
  bumpScale: 0.015,
});
const _ApophisMesh = new THREE.Mesh(_ApophisGeometry, _ApophisMaterial);
_ApophisMesh.position.set(2.5, 0, 0);
_ApophisGroup.add(_ApophisMesh)

// Create the bennu mesh
const bennuGroup = new THREE.Group();
scene.add(bennuGroup);
const bennuGeometry = new THREE.DodecahedronGeometry(0.072, 1);
const bennuMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpScale: 0.015,
});
const bennuMesh = new THREE.Mesh(bennuGeometry, bennuMaterial);
bennuMesh.position.set(19.5, 2, 0);
bennuGroup.add(bennuMesh)
bennuGroup.rotation.y = -180;

// Create the MD_2011 mesh
const MD_2011Group = new THREE.Group();
scene.add(MD_2011Group);
const MD_2011Geometry = new THREE.DodecahedronGeometry(0.03, 1);
const MD_2011Material = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpScale: 0.015,
});
const MD_2011Mesh = new THREE.Mesh(MD_2011Geometry, MD_2011Material);
MD_2011Mesh.position.set(-1.7, -1, 0);
MD_2011Group.add(MD_2011Mesh)
MD_2011Group.rotation.y = 90

// Create the Chelyabinsk mesh
const ChelyabinskGroup = new THREE.Group();
scene.add(ChelyabinskGroup);
const ChelyabinskGeometry = new THREE.DodecahedronGeometry(0.01, 1);
const ChelyabinskMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpScale: 0.015,
});
const ChelyabinskMesh = new THREE.Mesh(ChelyabinskGeometry, ChelyabinskMaterial);
ChelyabinskMesh.position.set(0.9, 0.58, 0);
ChelyabinskGroup.add(ChelyabinskMesh)

// Create the TC3_2008 mesh
const TC3_2008Group = new THREE.Group();
scene.add(TC3_2008Group);
const TC3_2008Geometry = new THREE.DodecahedronGeometry(0.005, 1);
const TC3_2008Material = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpScale: 0.015,
});
const TC3_2008Mesh = new THREE.Mesh(TC3_2008Geometry, TC3_2008Material);
TC3_2008Mesh.position.set(1, 0, 0);
TC3_2008Group.add(TC3_2008Mesh)

// Create the DZ2_2023 mesh
const DZ2_2023Group = new THREE.Group();
scene.add(DZ2_2023Group);
const DZ2_2023Geometry = new THREE.DodecahedronGeometry(0.02, 1);
const DZ2_2023Material = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpScale: 0.015,
});
const DZ2_2023Mesh = new THREE.Mesh(DZ2_2023Geometry, DZ2_2023Material);
DZ2_2023Mesh.position.set(13, 0, 0);
DZ2_2023Group.add(DZ2_2023Mesh)
DZ2_2023Group.rotation.y = -156;

// Create the TU24_2007 mesh
const TU24_2007Group = new THREE.Group();
scene.add(TU24_2007Group);
const TU24_2007Geometry = new THREE.DodecahedronGeometry(0.1, 1);
const TU24_2007Material = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpScale: 0.015,
});
const TU24_2007Mesh = new THREE.Mesh(TU24_2007Geometry, TU24_2007Material);
TU24_2007Mesh.position.set(40, 0, 0);
TU24_2007Group.add(TU24_2007Mesh)
TU24_2007Group.rotation.y = 5.4;

// Create the XF11_1997 mesh
const XF11_1997Group = new THREE.Group();
scene.add(XF11_1997Group);
const XF11_1997Geometry = new THREE.DodecahedronGeometry(0.1, 1);
const XF11_1997Material = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/asteroid.jpg"),
  bumpScale: 0.015,
});
const XF11_1997Mesh = new THREE.Mesh(XF11_1997Geometry, XF11_1997Material);
XF11_1997Mesh.position.set(70, 0, 0);
XF11_1997Group.add(XF11_1997Mesh)
XF11_1997Group.rotation.y = 4.5;

// Stars
/*const stars = getStarfield({ numStars: 500 });
scene.add(stars);*/

// Sun light
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Moon group
const moonGroup = new THREE.Group();
scene.add(moonGroup);
const moonGeometry = new THREE.IcosahedronGeometry(MOON_RADIUS, 12);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("./textures/06_moonmap4k.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/07_moonbump4k.jpg"),
  bumpScale: 0.01,
});
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.set(MOON_ORBIT_RADIUS, 0, 0);
moonGroup.add(moonMesh);

//moonlabel
const moonlabel = new THREE.Group();
const moontext = document.createElement('moontext')
moontext.textContent = 'Moon';
const moonLabel = new CSS2DObject(moontext);
moonLabel.element.style.color = 'white';
moonLabel.element.style.fontSize = '10px';
moonLabel.element.style.fontFamily = 'Arial';
scene.add(moonLabel);
moonLabel.position.set(26, 0, 0);
moonGroup.add(moonLabel);

//apophislabel
const _Apophislabel = new THREE.Group();
const _ApophisText = document.createElement('_Apophistext')
_ApophisText.textContent = 'apophis';
const _ApophisLabel = new CSS2DObject(_ApophisText);
_ApophisLabel.element.style.color = 'white';
_ApophisLabel.element.style.fontSize = '10px';
_ApophisLabel.element.style.fontFamily = 'Arial';
scene.add(_ApophisLabel);
_ApophisLabel.position.set(2.6, 0, 0);

//bennulabel
const bennulabel = new THREE.Group();
const bennuText = document.createElement('bennutext')
bennuText.textContent = 'bennu';
const bennuLabel = new CSS2DObject(bennuText);
bennuLabel.element.style.color = 'white';
bennuLabel.element.style.fontSize = '10px';
bennuLabel.element.style.fontFamily = 'Arial';
scene.add(bennuLabel);
bennuLabel.position.set(19.6, 2, 0);
bennuGroup.add(bennuLabel);


//MD_2011label
const MD_2011label = new THREE.Group();
const  MD_2011Text = document.createElement('MD_2011text')
MD_2011Text.textContent = 'MD_2011';
const MD_2011Label = new CSS2DObject(MD_2011Text);
MD_2011Label.element.style.color = 'white';
MD_2011Label.element.style.fontSize = '10px';
MD_2011Label.element.style.fontFamily = 'Arial';
scene.add(MD_2011Label);
MD_2011Label.position.copy(MD_2011Mesh.position);
MD_2011Group.add(MD_2011Label);

//Chelyabinsklabel
const Chelyabinsklabel = new THREE.Group();
const  ChelyabinskText = document.createElement('Chelyabinsktext')
ChelyabinskText.textContent = 'Chelyabinsk';
const ChelyabinskLabel = new CSS2DObject(ChelyabinskText);
ChelyabinskLabel.element.style.color = 'white';
ChelyabinskLabel.element.style.fontSize = '10px';
ChelyabinskLabel.element.style.fontFamily = 'Arial';
scene.add(ChelyabinskLabel);
ChelyabinskLabel.position.copy(ChelyabinskMesh.position);
ChelyabinskGroup.add(ChelyabinskLabel);

//TC3_2008label
const TC3_2008label = new THREE.Group();
const  TC3_2008Text = document.createElement('TC3_2008text')
TC3_2008Text.textContent = 'TC3_2008';
const TC3_2008Label = new CSS2DObject(TC3_2008Text);
TC3_2008Label.element.style.color = 'white';
TC3_2008Label.element.style.fontSize = '10px';
TC3_2008Label.element.style.fontFamily = 'Arial';
scene.add(TC3_2008Label);
TC3_2008Label.position.copy(TC3_2008Mesh.position);
TC3_2008Group.add(TC3_2008Label);

//DZ2_2023label
const DZ2_2023label = new THREE.Group();
const  DZ2_2023Text = document.createElement('DZ2_2023text')
DZ2_2023Text.textContent = 'DZ2_2023';
const DZ2_2023Label = new CSS2DObject(DZ2_2023Text);
DZ2_2023Label.element.style.color = 'white';
DZ2_2023Label.element.style.fontSize = '10px';
DZ2_2023Label.element.style.fontFamily = 'Arial';
scene.add(DZ2_2023Label);
DZ2_2023Label.position.copy(DZ2_2023Mesh.position);
DZ2_2023Group.add(DZ2_2023Label);

//TU24_2007label
const TU24_2007label = new THREE.Group();
const  TU24_2007Text = document.createElement('TU24_2007text')
TU24_2007Text.textContent = 'TU24_2007';
const TU24_2007Label = new CSS2DObject(TU24_2007Text);
TU24_2007Label.element.style.color = 'white';
TU24_2007Label.element.style.fontSize = '10px';
TU24_2007Label.element.style.fontFamily = 'Arial';
scene.add(TU24_2007Label);
TU24_2007Label.position.copy(TU24_2007Mesh.position);
TU24_2007Group.add(TU24_2007Label);

//XF11_1997label
const XF11_1997label = new THREE.Group();
const  XF11_1997Text = document.createElement('XF11_1997text')
XF11_1997Text.textContent = 'XF11_1997';
const XF11_1997Label = new CSS2DObject(XF11_1997Text);
XF11_1997Label.element.style.color = 'white';
XF11_1997Label.element.style.fontSize = '10px';
XF11_1997Label.element.style.fontFamily = 'Arial';
scene.add(XF11_1997Label);
XF11_1997Label.position.copy(XF11_1997Mesh.position);
XF11_1997Group.add(XF11_1997Label);


// Orbit
const orbitGeometry = new THREE.RingGeometry(MOON_ORBIT_RADIUS, MOON_ORBIT_RADIUS, 500);
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
orbit.rotation.x = Math.PI / 2;
scene.add(orbit); 

// star sphere
/*const sphereGeometry = new THREE.SphereGeometry(30, 60, 60);
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("./textures/stars.jpg"),
  side: THREE.BackSide
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);*/

// Create a CSS2DRenderer instance
const css2dRenderer = new CSS2DRenderer();
css2dRenderer.setSize(window.innerWidth, window.innerHeight);
css2dRenderer.domElement.style.position = 'absolute';
css2dRenderer.domElement.style.top = '0px';
css2dRenderer.domElement.style.pointerEvents = 'all'
document.body.appendChild(css2dRenderer.domElement);


// Controls
const controls = new OrbitControls(camera, css2dRenderer.domElement);
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
  renderer.render(scene, camera);
  css2dRenderer.render(scene, camera);
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
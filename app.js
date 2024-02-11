// Import the necessary libraries
import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

const vrButton = document.getElementById("enter-vr");

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0x9b111e,
  roughness: 0.1,
  metalness: 0.7,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 2, -5);
scene.add(cube);

const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x156c0c,
  roughness: 0.7,
  metalness: 0.1,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Make it horizontal
floor.receiveShadow = true; // Allow it to receive shadows
floor.position.y = 0;
scene.add(floor);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfdfbd3, 1);
directionalLight.position.set(50, 100, 100);
directionalLight.castShadow = true;
scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
cube.castShadow = true;
cube.receiveShadow = true;

async function initXR() {
  // WebXR
  if ("xr" in navigator) {
    if (await navigator.xr.isSessionSupported("immersive-vr")) {
      vrButton.addEventListener("click", async () => {
        const session = await navigator.xr.requestSession("immersive-vr", {
          requiredFeatures: ["local-floor"],
          //optionalFeatures: ["hand-tracking"],
        });
        renderer.xr.setSession(session);
      });
    } else {
      vrButton.disabled = true;
      vrButton.innerText = "VR not supported";
    }
  } else {
    vrButton.disabled = true;
    vrButton.innerText = "VR not supported";
  }
}

renderer.setAnimationLoop(function () {
  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
});

// Start the animation loop
initXR().catch(function (err) {
  console.error(err);
});

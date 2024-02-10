// Import the necessary libraries
import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

const vrButton = document.getElementById("enter-vr");

// Create a scene
const scene = new THREE.Scene();

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
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.set(0, 2, -5);

async function initXR() {
  // WebXR
  if ("xr" in navigator) {
    if (await navigator.xr.isSessionSupported("immersive-vr")) {
      vrButton.addEventListener("click", async () => {
        const session = await navigator.xr.requestSession("immersive-vr", {
          requiredFeatures: ["local-floor"],
          optionalFeatures: ["bounded-floor"],
        });
        console.log(session);
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

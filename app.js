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
const material = new THREE.MeshStandardMaterial({ color: 0x0033aa });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 2, -5);
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1); // color, intensity
spotLight.position.set(5, 5, -2); // position the light
spotLight.angle = Math.PI / 6; // spread angle
spotLight.penumbra = 0.1; // fade out at the edges
spotLight.decay = 0.5; // how the light intensity decays over distance
spotLight.distance = 100; // maximum range of the light
spotLight.target = cube; // target to point the light at
scene.add(spotLight);

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

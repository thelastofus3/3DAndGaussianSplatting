import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { scene, camera, renderer } from "./sceneSetup.js";
import {initializeMouseControl, updateCameraPositionWithCollision} from "./controls.js";
import { loadModel } from "./models.js";
import { initializeAgora } from "./videoSetup.js";

const loadingScreen = document.getElementById("loading-screen");
let loadedObjects = 0;
const totalObjectsToLoad = 2;

function onLoadingComplete() {
    loadedObjects += 1;
    if (loadedObjects === totalObjectsToLoad) {
        loadingScreen.classList.add("hidden");
    }
}

const rotation = { targetX: 0, targetY: 0 };

document.getElementById("container3D").appendChild(renderer.domElement);

initializeMouseControl(rotation);
updateCameraPositionWithCollision();

// Загружаем модели
let room, monitor;
loadModel("models/inRoom.gltf", [0, 0, 0], scene).then((model) => {
    room = model;
    onLoadingComplete();
});

loadModel("models/monitorForOldRoom.gltf", [0, 0, 0], scene).then((model) => {
    monitor = model;
    onLoadingComplete();
});

function updateMonitorTexture(videoElement) {
    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.flipY = false;

    monitor.traverse((node) => {
        if (node.isMesh && node.material.name === 'ScreenOn') {
            node.material = new THREE.MeshBasicMaterial({ map: videoTexture });
            node.material.needsUpdate = true;
        }
    });
}

document.getElementById("video-agora").addEventListener("click", async () => {
    loadingScreen.classList.add("hidden");

    const videoElement = await initializeAgora(
        "d31faec490be4c68a3d3c659585719fe", // Ваш App ID
        "main", // Канал
        sessionStorage.getItem("uid") || String(Math.floor(Math.random() * 10000))
    );

    updateMonitorTexture(videoElement);
    document.getElementById("phone-container").style.display = "none";
});

document.getElementById("video-regular").addEventListener("click", () => {
    loadingScreen.classList.add("hidden");

    const videoElement = document.createElement('video');
    videoElement.src = 'models/defaultVideo.mp4'; // Замените на путь к вашему видео
    videoElement.loop = true;
    videoElement.play();

    updateMonitorTexture(videoElement);
    document.getElementById("phone-container").style.display = "none";
});

document.getElementById("upload-video-btn").addEventListener("click", () => {
    document.getElementById("video-upload").click();
});

document.getElementById("video-upload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        loadingScreen.classList.add("hidden");

        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(file);
        videoElement.controls = true;
        videoElement.loop = true;
        videoElement.play();

        updateMonitorTexture(videoElement);
        document.getElementById("phone-container").style.display = "none";
    }
});

function animate() {
    requestAnimationFrame(animate);
    updateCameraPositionWithCollision();
    camera.rotation.y = rotation.targetY;
    renderer.render(scene, camera);
}

animate();
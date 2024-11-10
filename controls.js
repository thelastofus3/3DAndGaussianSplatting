import { scene, camera } from "./sceneSetup.js";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

export const keys = {};
const moveSpeed = 0.05;

export const handleMouseMove = (event, rotation) => {
    const lookSpeed = 0.005;
    rotation.targetY -= event.movementX * lookSpeed;
    rotation.targetX -= event.movementY * lookSpeed;
    rotation.targetX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.targetX));
};

export const initializeMouseControl = (rotation) => {
    document.addEventListener("mousemove", (event) =>
        handleMouseMove(event, rotation)
    );
};

const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3();

function checkCollisions() {
    // Получаем направление движения камеры
    camera.getWorldDirection(direction);

    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.copy(direction);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const distanceToCollision = intersects[0].distance;
        if (distanceToCollision < moveSpeed) {
            return true;
        }
    }
    return false;
}

export const updateCameraPositionWithCollision = () => {
    if (!checkCollisions()) {
        if (keys['w']) {
            camera.position.x -= Math.sin(camera.rotation.y) * moveSpeed;
            camera.position.z -= Math.cos(camera.rotation.y) * moveSpeed;
        }
        if (keys['s']) {
            camera.position.x += Math.sin(camera.rotation.y) * moveSpeed;
            camera.position.z += Math.cos(camera.rotation.y) * moveSpeed;
        }
        if (keys['a']) {
            camera.position.x -= Math.cos(camera.rotation.y) * moveSpeed;
            camera.position.z += Math.sin(camera.rotation.y) * moveSpeed;
        }
        if (keys['d']) {
            camera.position.x += Math.cos(camera.rotation.y) * moveSpeed;
            camera.position.z -= Math.sin(camera.rotation.y) * moveSpeed;
        }
    }
};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});
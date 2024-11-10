import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

export const loadModel = (url, position, scene) => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => {
                const model = gltf.scene;
                model.position.set(...position);
                scene.add(model);
                resolve(model);
            },
            undefined,
            (error) => reject(error)
        );
    });
};

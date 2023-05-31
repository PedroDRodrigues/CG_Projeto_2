/* global THREE, requestAnimationFrame, console */

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var stereo;

var keysPressed = {};

var materials = [];

let textureType = 'field'; // Define o tipo de textura inicial como campo floral

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene(){
    'use strict';
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    createSkyDome();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';

    //Camara inicial
    camera = new THREE.PerspectiveCamera(75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 325;
    camera.lookAt(scene.position);

    //Camara stereo
    stereo = new THREE.StereoCamera();
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLights() {
    'use strict';

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createSkyDome() {
    const geometry = new THREE.SphereGeometry(1000, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: generateSkyTexture() });
    const skyDome = new THREE.Mesh(geometry, material);
    skyDome.material.side = THREE.BackSide;
    scene.add(skyDome);
}

function createMaterials() {
    materials.lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    materials.phong = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    materials.toon = new THREE.MeshToonMaterial({ color: 0x0000ff });
}

function applyMaterials() {
    const geometry = new THREE.BoxGeometry(10, 10, 10);

    const meshLambert = new THREE.Mesh(geometry, materials.lambert);
    meshLambert.position.x = -20;
    scene.add(meshLambert);

    const meshPhong = new THREE.Mesh(geometry, materials.phong);
    scene.add(meshPhong);

    const meshToon = new THREE.Mesh(geometry, materials.toon);
    meshToon.position.x = 20;
    scene.add(meshToon);
}

function switchShadingType() {
    if (shadingType === 'Gouraud') {
        shadingType = 'Phong';
    } else if (shadingType === 'Phong') {
        shadingType = 'Cartoon';
    } else if (shadingType === 'Cartoon') {
        shadingType = 'Gouraud';
    }
}

function toggleLighting() {
    lightingEnabled = !lightingEnabled;
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

function checkCollisions() {
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////

function handleCollisions() {
    'use strict';

}

////////////
/* UPDATE */
////////////

function update() {
    'use strict';

    if (keysPressed['q'] || keysPressed['w'] || keysPressed['e']) {
        switchShadingType();
    }
    if (keysPressed['r']) {
        toggleLighting();
    }

    for (const materialName in materials) {
        const material = materials[materialName];
        material.flatShading = (shadingType === 'Gouraud');
        material.needsUpdate = true;
        material.lights = lightingEnabled;
    }
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    createLights();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////

function animate() {
    'use strict';

    update();
    requestAnimationFrame(animate);
    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////

function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////

function onKeyDown(e) {
    'use strict';

    keysPressed[e.keyCode] = true;
    switch (e.keyCode) {
        case 49: //1
            break; 
        case 50: //2
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////

function onKeyUp(e){
    'use strict';

    // Remove the released key from the keysPressed object
    delete keysPressed[e.keyCode];
}
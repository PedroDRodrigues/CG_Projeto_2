/* global THREE, requestAnimationFrame, console */

import * as THREE from '../js/three.module.js';
import { generateFieldTexture, generateSkyTexture } from '../js/textures.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let textureType = 'field'; // Define o tipo de textura inicial como campo floral

var camera, scene, renderer;

var camera_1, camera_2;

var geometry, material, mesh;

var lightCalc = true;

var clock = new THREE.Clock(false);

clock.start();

var delta_time;

//objects

var mountains, moon, skyDome;

var ovni = new THREE.Object3D();

var sobreiro = new THREE.Object3D();

var grupo_de_sobreiros = new THREE.Object3D();

var luzes_ovni = new THREE.Object3D();

var objects = [];

//textures

var texture;

var mountainsTexture, moonTexture, skyDomeTexture, sobreiroTexture, ovniTexture;

var keysPressed = {};

var materials = [];

const luzes = [];


var ambientLight;

var directionalLight = true;

var ovni_lights = false;


var bool_Camera_1 = true;

let shadingType;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    scene.add(new THREE.AxesHelper(100));


    createMountains();
    createSkyDome();
    createMoon();
    createSobreiros();
    createOvni();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createStereoCamera() {
    'use strict';

    camera_2 = new THREE.StereoCamera();
}

function createFixedPerspectiveCamera() {
    'use strict';

    camera_1 = new THREE.PerspectiveCamera(125,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
    camera_1.position.x = 0;
    camera_1.position.y = -10;
    camera_1.position.z = 0;
    var position = new THREE.Vector3(0, 200, 0);
    camera_1.lookAt(position);


    camera_1 = new THREE.PerspectiveCamera(125,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
    camera_1.position.x = 100;
    camera_1.position.y = 100;
    camera_1.position.z = 100;
    camera_1.lookAt(scene.position);


}

function createCamera() {
    'use strict';

    //Camara inicial
    createFixedPerspectiveCamera();

    //Camara stereo
    createStereoCamera();

    camera = new THREE.PerspectiveCamera(125,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLights() {
    'use strict';

    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createOvni() {
    'use strict';

    const positions = [
        [0, -7, 10],
        [5, -7, 8],
        [0, -7, -8],
        [-5, -7, 8],
        [-9, -7, -2],
        [-9, -7, 3],
        [9, -7, 3],
        [9, -7, -2],
        [-5, -7, -6],
        [5, -7, -6]
    ];

    geometry = new THREE.SphereGeometry(5, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const body = new THREE.Mesh(geometry, material);
    body.scale.x = 10;
    body.scale.z = 3;
    ovni.add(body);

    geometry = new THREE.SphereGeometry(5, 20, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cockpit = new THREE.Mesh(geometry, material);
    cockpit.scale.x = 3.5;
    cockpit.position.set(0, 2.5,0);
    ovni.add(cockpit);

    //cockpit e um cilindro achatado na parte de baixo do ovni
    geometry = new THREE.CylinderGeometry(15, 15, 3, 5);
    material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const body2 = new THREE.Mesh(geometry, material);
    body2.scale.x = 0.9;
    body2.position.set(0, -5, 0);
    ovni.add(body2);

    /*  Sobre o terreno e a casa, deve orbitar um disco voador (i.e., um ovni). Para tal, 
        sugere-se recorrer a uma esfera achatada para modelar o corpo da nave, a uma calote esférica 
        para definir o cockpit, tendomúltiplas pequenas esferas colocadas radialmente no fundo da nave 
        assim como um cilindro achatado no centro da parte de baixo da nave.
    */

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s1 = new THREE.Mesh(geometry, material);
    s1.position.set(0, -7, 10);
    luzes_ovni.add(s1);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s2 = new THREE.Mesh(geometry, material);
    s2.position.set(5, -7, 8);
    luzes_ovni.add(s2);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s3 = new THREE.Mesh(geometry, material);
    s3.position.set(0, -7, -8);
    luzes_ovni.add(s3);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s4 = new THREE.Mesh(geometry, material);
    s4.position.set(-5, -7, 8);
    luzes_ovni.add(s4);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s5 = new THREE.Mesh(geometry, material);
    s5.position.set(-9, -7, -2);
    luzes_ovni.add(s5);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s6 = new THREE.Mesh(geometry, material);
    s6.position.set(-9, -7, 3);
    luzes_ovni.add(s6);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s7 = new THREE.Mesh(geometry, material);
    s7.position.set(9, -7, 3);
    luzes_ovni.add(s7);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s8 = new THREE.Mesh(geometry, material);
    s8.position.set(9, -7, -2);
    luzes_ovni.add(s8);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s9 = new THREE.Mesh(geometry, material);
    s9.position.set(-5, -7, -6);
    luzes_ovni.add(s9);

    geometry = new THREE.SphereGeometry(0.8, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const s10 = new THREE.Mesh(geometry, material);
    s10.position.set(5, -7, -6);
    luzes_ovni.add(s10);



    ovni.add(luzes_ovni);

    for (let i = 0; i < positions.length; i++) {
        const position = positions[i];

        // Create a yellow sphere for the light
        const lightGeometry = new THREE.SphereGeometry(0.8, 50, 50);
        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
        lightSphere.position.set(position[0], position[1], position[2]);

        // Create a point light source for the sphere
        const light = new THREE.PointLight(0xffff00, 1, 10);
        light.position.copy(lightSphere.position);

        // Add the light and the sphere to the scene
        lightSphere.add(light);
        lightSphere.add(ovni);

        // Add the light to the lights array
        luzes.push(light);
    }  
    
    ovni.position.set(0, 100, 0);

    synchronizeLightPositions();
    scene.add(ovni);

    //  ovni.rotation.z = Math.PI / 2;
}

function toggleLights(x) {
    // Iterate over the lights array
    for (let i = 0; i < luzes.length; i++) {
        const light = luzes[i];

        // Toggle the intensity of the light
        if (x === false) {
            light.intensity = 0; // Turn off the light
        } else {
            light.intensity = 100000000000; // Turn on the light
        }
    }

    // Toggle the lights state
    synchronizeLightPositions();    
    ovni_lights = !ovni_lights;
    }


    // Function to synchronize the positions of the lights with the spheres
function synchronizeLightPositions() {
    for (let i = 0; i < luzes.length; i++) {
        const light = luzes[i];
        const sphere = luzes_ovni.children[i];

        // Update the position of the light to match the position of the sphere
        light.position.copy(sphere.position);
    }
}


function createSobreiro(x, y, z) {

    var troncoPrincipalGeometry = new THREE.CylinderGeometry(1, 1, 6, 32);
    var troncoPrincipalMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E, roughness: 0, metalness: 0, wireframe: true });
    var troncoPrincipal = new THREE.Mesh(troncoPrincipalGeometry, troncoPrincipalMaterial);
    sobreiro.add(troncoPrincipal);

    // Criação do ramo secundário
    var ramoSecundarioGeometry = new THREE.CylinderGeometry(0.5, 1, 3, 32);
    var ramoSecundarioMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E, roughness: 0, metalness: 0, wireframe: true });
    var ramoSecundario = new THREE.Mesh(ramoSecundarioGeometry, ramoSecundarioMaterial);
    ramoSecundario.position.set(1, 2, 0);
    ramoSecundario.rotation.z = Math.PI / 4;
    sobreiro.add(ramoSecundario);

    // Criação da copa
    var copaGeometry = new THREE.SphereGeometry(2, 32, 32);
    var copaMaterial = new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0, metalness: 0, wireframe: true });
    var copa = new THREE.Mesh(copaGeometry, copaMaterial);
    copa.position.set(0, 5, 0);
    copa.scale.x = 2;


    sobreiro.scale.set(2, 2, 2);
    sobreiro.add(copa);
    sobreiro.position.set(x, y, z);
    scene.add(sobreiro);

}

function createSobreiros() {
    // createSobreiro(0,15,0);
    createSobreiro(0, 10, 15);
    var sobreiro2 = sobreiro.clone();
    sobreiro2.position.set(0, 10, -15);
    scene.add(sobreiro2);
}

function createMoon() {
    geometry = new THREE.SphereGeometry(7, 152, 32);
    material = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0, metalness: 0, wireframe: true });
    moon = new THREE.Mesh(geometry, material);
    scene.add(moon);
    moon.position.set(-40, 78, 10);

    objects.push(moon);
}

function createSkyDome() {
    'use strict';

    geometry = new THREE.SphereGeometry(400, 1000, 1000, 0, Math.PI * 2, 0, Math.PI / 2);
    material = new THREE.MeshBasicMaterial({ map: generateSkyTexture(), wireframe: true });
    moon = new THREE.Mesh(geometry, material);
    moon.position.set(0, 0, 0);
    scene.add(moon);
}

function createMountains() {
    "use strict";
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    geometry = new THREE.PlaneGeometry(800, 800, 200, 200);
    material = new THREE.MeshStandardMaterial({ map: generateFieldTexture(), wireframe: true });

    mountains = new THREE.Mesh(geometry, material);
    mountains.position.set(0, 0, 0);
    mountains.rotation.x = -Math.PI / 2;
    scene.add(mountains);
}

function createMaterials() {
    'use strict'

    texture = new THREE.TextureLoader().load(`./text/heightmap.png`);
    mountainsTexture = new Array(4);
    mountainsTexture[0] = new THREE.MeshBasicMaterial({ color: 0xff0000, map: texture });
    mountainsTexture[1] = new THREE.MeshLambertMaterial({ color: 0xff0000, map: texture, displacementMap: texture, displacementScale: 20 });
    mountainsTexture[2] = new THREE.MeshPhongMaterial({ color: 0xff0000, map: texture, displacementMap: texture, displacementScale: 20 });
    mountainsTexture[3] = new THREE.MeshToonMaterial({ color: 0xff0000, map: texture, displacementMap: texture, displacementScale: 20 });

    skyDomeTexture = new Array(4);
    skyDomeTexture[0] = new THREE.MeshBasicMaterial({ color: 0x3d3d3d, map: generateSkyTexture() });
    skyDomeTexture[1] = new THREE.MeshLambertMaterial({ color: 0x3d3d3d, map: generateSkyTexture(), displacementMap: generateSkyTexture(), displacementScale: 20 });
    skyDomeTexture[2] = new THREE.MeshPhongMaterial({ color: 0x3d3d3d, map: generateSkyTexture(), displacementMap: generateSkyTexture(), displacementScale: 20 });
    skyDomeTexture[3] = new THREE.MeshToonMaterial({ color: 0x3d3d3d, map: generateSkyTexture(), displacementMap: generateSkyTexture(), displacementScale: 20 });

    moonTexture = new Array(4);
    moonTexture[0] = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    moonTexture[1] = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    moonTexture[2] = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    moonTexture[3] = new THREE.MeshToonMaterial({ color: 0xffff00 });

    ovniTexture = new Array(4);
    ovniTexture[0] = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    ovniTexture[1] = new THREE.MeshLambertMaterial({ color: 0x00ffff });
    ovniTexture[2] = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    ovniTexture[3] = new THREE.MeshToonMaterial({ color: 0x00ffff });

    sobreiroTexture = new Array(4);
    sobreiroTexture[0] = new THREE.MeshBasicMaterial({ color: 0x006400 });
    sobreiroTexture[1] = new THREE.MeshLambertMaterial({ color: 0x006400 });
    sobreiroTexture[2] = new THREE.MeshPhongMaterial({ color: 0x006400 });
    sobreiroTexture[3] = new THREE.MeshToonMaterial({ color: 0x006400 });
}

/////////////
/* UPDATE  */
/////////////


function update() {
    'use strict';

    let delta_time = clock.getDelta();
    let ovni_speed = 100;
    let texture;

    var diff = new THREE.Vector3();
    if (keysPressed[37]) diff.x--; // left
    if (keysPressed[39]) diff.x++; // right
    if (keysPressed[38]) diff.z++; // up
    if (keysPressed[40]) diff.z--; // down
    if (diff.x || diff.z)
        ovni.position.add(diff.normalize().multiplyScalar(ovni_speed * delta_time));


    if (textureType === 'field') {
        texture = generateFieldTexture();
    } else if (textureType === 'sky') {
        texture = generateSkyTexture();
    }

    if (lightCalc) {
        if (shadingType == 'Lambert') {
            mountains.material = mountainsTexture[1];
            skyDome.material = skyDomeTexture[1];
            ovni.material = ovniTexture[1];
            sobreiro.material = sobreiroTexture[1];
            moon.material = moonTexture[1];
        } else if (shadingType == 'Phong') {
            mountains.material = mountainsTexture[2];
            skyDome.material = skyDomeTexture[2];
            ovni.material = ovniTexture[2];
            sobreiro.material = sobreiroTexture[2];
            moon.material = moonTexture[2];
        }
        else {
            mountains.material = mountainsTexture[3];
            //skyDome.material = skyDomeTexture[3];
            ovni.material = ovniTexture[3];
            sobreiro.material = sobreiroTexture[3];
            moon.material = moonTexture[3];
        }
    } else {
        mountains.material = mountainsTexture[0];
        skyDome.material = skyDomeTexture[0];
        ovni.material = ovniTexture[0];
        sobreiro.material = sobreiroTexture[0];
        moon.material = moonTexture[0];
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

    createMaterials();
    createScene();
    createCamera();
    createLights();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    animate();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////

function animate() {
    'use strict';

    if (bool_Camera_1) {
        camera = camera_1;
    }
    else {
        camera = camera_2;
    }

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
            textureType = 'field';
            break;
        case 50: //2
            textureType = 'sky';
            break;
        //q 
        case 81 || 113:
            shadingType = 'Lambert';
            break;
        //w
        case 87 || 119:
            shadingType = 'Phong';
            break;
        //e
        case 69 || 101:
            shadingType = 'Cartoon';
            break;
        //r
        case 82 || 114:
            lightCalc = !lightCalc;
            break;
        //d
        case 68 || 100:
            directionalLight.visible = !directionalLight.visible;
            break;
        //p
        case 80:
            toggleLights(true);
            break;
        //s
        case 83:
            toggleLights(false);
            break;
        /*
         *
        case 49: //1
            bool_Camera_1 = !bool_Camera_1;
            break; 
         *
         */
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////

function onKeyUp(e) {
    'use strict';

    // Remove the released key from the keysPressed object
    delete keysPressed[e.keyCode];
}

export { init }
/* global THREE, requestAnimationFrame, console */

import * as THREE from '../js/three.module.js';
import { generateFieldTexture, generateSkyTexture } from '../js/textures.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, scene1, scene2, actualScene, renderer;

var camera_1, camera_2;

var geometry, material;

var lightCalc = true;

var clock = new THREE.Clock(false);

clock.start();

//objects

var mountains, moon, skyDome, house;

var ovni = new THREE.Object3D();

var sobreiro = new THREE.Object3D();

var luzes_ovni = new THREE.Object3D();

var holofote_container = new THREE.Object3D();

var objects = [];

//textures

var texture;

var mountainsTexture, moonTexture, sobreiroTexture, ovniTexture, houseTexture;

var keysPressed = {};

const luzes = [];

const lightSphere = new THREE.Object3D();

var ambientLight;

var directionalLight = true;

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
    createHouse();
    createOvni();
}

function createScene1() {
    'use strict';

    scene1 = new THREE.Scene();
    scene1.background = new THREE.Color(0xFFFFFF);

    scene1.add(new THREE.AxesHelper(100));

    createPlane();
}

function createScene2() {
    'use strict';

    scene2 = new THREE.Scene();
    scene2.background = new THREE.Color(0xFFFFFF);

    scene2.add(new THREE.AxesHelper(100));

    createPlane2();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createFixedPerspectiveCamera() {
    'use strict';

    camera_1 = new THREE.PerspectiveCamera(100,
        window.innerWidth / window.innerHeight,
        0.1,
        5000);
    camera_1.position.x = 100;
    camera_1.position.y = 100;
    camera_1.position.z = 100;
    camera_1.lookAt(scene.position);

}

function createOrtogonalCamera() {
    'use strict';

    camera_2 = new THREE.PerspectiveCamera(100,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
    camera_2.position.x = 0;
    camera_2.position.y = 300;
    camera_2.position.z = 0;
    camera_2.lookAt(scene.position);

}

function createCamera() {
    'use strict';

    //Camara inicial
    createFixedPerspectiveCamera();

    createOrtogonalCamera();

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

function createPlane() {
    'use strict';

    geometry = new THREE.PlaneGeometry(200, 100, 100, 100);
    material = new THREE.MeshBasicMaterial({ color: 0x90ee90, map: generateFieldTexture(), wireframe: true});
    const plane = new THREE.Mesh(geometry, material);
    scene1.add(plane);
}

function createPlane2() {
    'use strict';

    geometry = new THREE.PlaneGeometry(200, 100, 100, 100);
    material = new THREE.MeshBasicMaterial({ color: 0x90ee90, map: generateSkyTexture()});
    const plane = new THREE.Mesh(geometry, material);
    scene2.add(plane);
}

function createHouse() {
    'use strict';

    geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, //0
        0, 25, 0, //1
        0, 0, 25, //2
        0, 25, 25, //3
        17.5, 0, 25, //4
        17.5, 20, 25, //5
        25, 0, 25, //6
        25, 20, 25, //7
        50, 0, 0, //8
        50, 25, 0, //9
        50, 0, 25, //10
        50, 25, 25, //11
        // Top BOX
        0, 25, -5, //12
        0, 25, 30, //13
        0, 35, -5, //14
        0, 35, 30, //15
        50, 25, -5, //16
        50, 25, 30, //17
        50, 35, -5, //18
        50, 35, 30, //19
        // Windows
        5, 12.5, 25, //20
        5, 20, 25, //21
        10, 12.5, 25, //22
        10, 20, 25, //23
        35, 12.5, 25, //24
        35, 20, 25, //25
        40, 12.5, 25, //26
        40, 20, 25, //27
        //aux points
        0, 20, 25, //28
        5, 0, 25, //29
        10, 0, 25, //30
        35, 0, 25, //31
        40, 0, 25, //32
        50, 20, 25, //33
    ]);

    // Define the indices of the faces
    const indices = [
        // MAIN HOUSE
        1, 0, 2,        // Face 0
        1, 2, 3,        // Face 1
        0, 1, 9,        // Face 2    
        0, 9, 8,        // Face 3
        10, 8, 9,       // Face 4
        9, 11, 10,      // Face 5
        28, 11, 3,      // Face 6
        28, 33, 11,     // Face 7
        30, 4, 23,      // Face 8
        6, 31, 25,      // Face 9
        27, 32, 10,     // Face 10
        31, 32, 24,     // Face 11
        28, 2, 29,      // Face 12
        20, 29, 30,     // Face 13
        32, 26, 24,     // Face 14
        10, 33, 27,     // Face 15
        29, 21, 28,     // Face 16
        30, 22, 20,     // Face 17 
        4, 5, 23,       // Face 18
        6, 25, 7,       // Face 19

        // ROOF
        1, 9, 16,       // Face 20
        3, 13, 11,      // Face 21
        11, 13, 17,       // Face 22
        15, 13, 17,     // Face 23
        16, 12, 18,     // Face 24
        12, 13, 14,     // Face 25
        14, 13, 15,     // Face 26
        14, 15, 18,     // Face 27
        18, 15, 19,     // Face 28
        17, 16, 18,     // Face 29
        17, 18, 19,     // Face 30
        18, 12, 14,     // Face 31
        15, 17, 19,     // Face 32
        12, 1, 16,      // Face 33


        // WINDOWS
        21, 20, 22,     // Face 34
        21, 22, 23,     // Face 35
        25, 24, 26,     // Face 36
        25, 26, 27,     // Face 37

        // DOOR
        5, 4, 6,        // Face 38
        5, 6, 7,        // Face 39
    ];

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    geometry.setIndex(indices);

    geometry.computeVertexNormals();

    geometry.clearGroups();
    geometry.addGroup(0,60,0);
    geometry.addGroup(60,102,1);
    geometry.addGroup(102,114,2);
    geometry.addGroup(114,120,3);


    material = [
        new THREE.MeshStandardMaterial({
            color: 0xf5f5dc
        }),
        new THREE.MeshStandardMaterial({
            color: 0x008000
        }),
        new THREE.MeshStandardMaterial({
            color: 0xff0000
        }),
        new THREE.MeshStandardMaterial({
            color: 0x5C3317
        })
    ];

    house = new THREE.Mesh(geometry, material);
    house.position.set(25, -53, -100);
    scene.add(house);

    objects.push(house);

}

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
    cockpit.position.set(0, 2.5, 0);
    ovni.add(cockpit);

    //cockpit e um cilindro achatado na parte de baixo do ovni
    geometry = new THREE.CylinderGeometry(15, 15, 3, 5);
    material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const body2 = new THREE.Mesh(geometry, material);
    body2.scale.x = 0.9;
    body2.position.set(0, -5, 0);
    ovni.add(body2);

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
        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
        lightSphere.position.set(position[0] - 25, -53, position[2]);
        console.log(lightSphere.position);
        lightSphere.visible = false;

        // Create a point light source for the sphere
        const light = new THREE.PointLight(0xffff00, 1,20);
        light.position.copy(lightSphere.position);


        // Add the light and the sphere to the scene
        scene.add(light);
        scene.add(lightSphere);

        // Add the light to the lights array
        luzes.push(light);
    }

    geometry = new THREE.SphereGeometry(2, 50, 50);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    holofote_container = new THREE.Mesh(geometry, material);
    holofote_container.position.set(0, -7, 1);

    const holofote = new THREE.SpotLight(0xffffff);
    holofote.angle = Math.PI / 8;
    holofote_container.add(holofote);
    holofote_container.children[0].target.position.set(-31.5, 0, 0);
    ovni.add(holofote_container);
    scene.add( holofote.target );

    ovni.position.set(-30, 55, 0);
    scene.add(ovni);
}

function toggleLights(x) {
    for (let i = 0; i < luzes.length; i++) {
        const light = luzes[i];

        if (x === false) {
            light.intensity = 0;
            holofote_container.children[0].intensity = 0;
        } else {
            light.intensity = 1000; // Turn on the light
            holofote_container.children[0].intensity = 1;
        }
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
    createSobreiro(-70, -50, 90);
    var sobreiro2 = sobreiro.clone();
    sobreiro2.position.set(200, -50, -15);
    scene.add(sobreiro2);

    var sobreiro3 = sobreiro.clone();
    sobreiro3.position.set(100, -50, -15);
    sobreiro3.rotation.y = Math.PI / 3;
    scene.add(sobreiro3);

    var sobreiro4 = sobreiro.clone();
    sobreiro4.position.set(100, -50, 50);
    sobreiro4.rotation.y = Math.PI / 3;
    scene.add(sobreiro4);

    var sobreiro5 = sobreiro.clone();
    sobreiro5.position.set(-170, -50, -15);
    sobreiro5.rotation.y = Math.PI / 3;
    scene.add(sobreiro5);

    var sobreiro6 = sobreiro.clone();
    sobreiro6.position.set(-170, -50, 200);
    sobreiro6.rotation.y = Math.PI / 3;
    scene.add(sobreiro6);
    
}

function createMoon() {
    geometry = new THREE.SphereGeometry(7, 152, 32);
    material = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0, metalness: 0, wireframe: true });
    moon = new THREE.Mesh(geometry, material);
    scene.add(moon);
    moon.position.set(-40, 115, 10);

    objects.push(moon);
}

function createSkyDome() {
    'use strict';

    geometry = new THREE.SphereGeometry(400, 1000, 1000, 0, Math.PI * 2, 0, Math.PI / 2);
    material = new THREE.MeshBasicMaterial({ map: generateSkyTexture(), wireframe: true });
    skyDome = new THREE.Mesh(geometry, material);
    skyDome.position.set(0, -70, 0);
    scene.add(skyDome);
}

function createMountains() {
    "use strict";
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    geometry = new THREE.PlaneGeometry(800, 800, 200, 200);
    material = new THREE.MeshStandardMaterial({ color: 0x90ee90, map: generateFieldTexture(), displacementMap: texture, displacementScale: 100, side: THREE.DoubleSide });

    mountains = new THREE.Mesh(geometry, material);
    mountains.position.set(0, -70, 0);
    mountains.rotation.x = -Math.PI / 2;
    scene.add(mountains);
}

function createMaterials() {
    'use strict'

    texture = new THREE.TextureLoader().load(`./text/heightmap.png`);

    moonTexture = new Array(4);
    moonTexture[0] = new THREE.MeshStandardMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    moonTexture[1] = new THREE.MeshLambertMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    moonTexture[2] = new THREE.MeshPhongMaterial({ color: 0xffff00, side: THREE.DoubleSide  });
    moonTexture[3] = new THREE.MeshToonMaterial({ color: 0xffff00, side: THREE.DoubleSide });

    ovniTexture = new Array(4);
    ovniTexture[0] = new THREE.MeshStandardMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
    ovniTexture[1] = new THREE.MeshLambertMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
    ovniTexture[2] = new THREE.MeshPhongMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
    ovniTexture[3] = new THREE.MeshToonMaterial({ color: 0x00ffff, side: THREE.DoubleSide });

    sobreiroTexture = new Array(4);
    sobreiroTexture[0] = new THREE.MeshStandardMaterial({ color: 0x006400, side: THREE.DoubleSide });
    sobreiroTexture[1] = new THREE.MeshLambertMaterial({ color: 0x006400, side: THREE.DoubleSide });
    sobreiroTexture[2] = new THREE.MeshPhongMaterial({ color: 0x006400, side: THREE.DoubleSide });
    sobreiroTexture[3] = new THREE.MeshToonMaterial({ color: 0x006400, side: THREE.DoubleSide });

    var material_b = [
        new THREE.MeshStandardMaterial({
            color: 0xf5f5dc,
            side: THREE.DoubleSide
        }),
        new THREE.MeshStandardMaterial({
            color: 0x008000, 
            side: THREE.DoubleSide
        }),
        new THREE.MeshStandardMaterial({
            color: 0xff0000, 
            side: THREE.DoubleSide
        }),
        new THREE.MeshStandardMaterial({
            color: 0x5C3317, 
            side: THREE.DoubleSide
        })
    ];

    var material_l = [
        new THREE.MeshLambertMaterial({
            color: 0xf5f5dc,
            side: THREE.DoubleSide
        }),
        new THREE.MeshLambertMaterial({
            color: 0x008000,
            side: THREE.DoubleSide
        }),
        new THREE.MeshLambertMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        }),
        new THREE.MeshLambertMaterial({
            color: 0x5C3317,
            side: THREE.DoubleSide
        })
    ];

    var material_p = [
        new THREE.MeshPhongMaterial({
            color: 0xf5f5dc,
            side: THREE.DoubleSide
        }),
        new THREE.MeshPhongMaterial({
            color: 0x008000,
            side: THREE.DoubleSide
        }),
        new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        }),
        new THREE.MeshPhongMaterial({
            color: 0x5C3317,
            side: THREE.DoubleSide
        })
    ];

    var material_t = [
        new THREE.MeshToonMaterial({
            color: 0xf5f5dc,
            side: THREE.DoubleSide
        }),
        new THREE.MeshToonMaterial({
            color: 0x008000,
            side: THREE.DoubleSide
        }),
        new THREE.MeshToonMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        }),
        new THREE.MeshToonMaterial({
            color: 0x5C3317,
            side: THREE.DoubleSide
        })
    ];

    houseTexture = new Array(4);
    houseTexture[0] = material_b;
    houseTexture[1] = material_l;
    houseTexture[2] = material_p;
    houseTexture[3] = material_t;
}

/////////////
/* UPDATE  */
/////////////


function update() {
    'use strict';

    let delta_time = clock.getDelta();
    let speed = 100;
    let texture;

    var diff = new THREE.Vector3();
    if (keysPressed[37]) diff.x--; // left
    if (keysPressed[39]) diff.x++; // right
    if (keysPressed[38]) diff.z++; // up
    if (keysPressed[40]) diff.z--; // down
        
    if (diff.x || diff.z){
        ovni.position.add(diff.normalize().multiplyScalar(speed * delta_time));
        for (let i = 0; i < luzes.length; i++) {
            const light = luzes[i];
            light.position.add(diff.normalize().multiplyScalar(speed * delta_time));
        }
        holofote_container.children[0].target.position.set(ovni.position.x, 0, ovni.position.z);
    }

    if (lightCalc) {
        if (shadingType == 'Lambert') {
            ovni.material = ovniTexture[1];
            sobreiro.material = sobreiroTexture[1];
            moon.material = moonTexture[1];
            house.material = houseTexture[1];
        } else if (shadingType == 'Phong') {
            ovni.material = ovniTexture[2];
            sobreiro.material = sobreiroTexture[2];
            moon.material = moonTexture[2];
            house.material = houseTexture[2];
        }
        else {
            ovni.material = ovniTexture[3];
            sobreiro.material = sobreiroTexture[3];
            moon.material = moonTexture[3];
            house.material = houseTexture[3];
        }
    } else {
        ovni.material = ovniTexture[0];
        sobreiro.material = sobreiroTexture[0];
        moon.material = moonTexture[0];
        house.material = houseTexture[0];
    }
}

/////////////
/* DISPLAY */
/////////////

function render() {
    'use strict';

    renderer.render(actualScene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.setAnimationLoop(function () {
        renderer.render(scene, camera);
    });

    createMaterials();
    createScene();
    createScene1();
    createScene2();
    createCamera();
    createLights();
    toggleLights(false);

    actualScene = scene;

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

    //case 9
    if (bool_Camera_1) {
        camera = camera_1;
    }
    else {
        camera = camera_2;
    }

    update();
    //requestAnimationFrame(animate);
    render();
    renderer.setAnimationLoop(animate);
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
            actualScene = scene1;
            break;
        case 50: //2
            actualScene = scene2;
            break;
        case 51: //3
            actualScene = scene;
            break;
        case 57: //9
            bool_Camera_1 = !bool_Camera_1;
        //q 
        case 81 || 113:
            shadingType = 'Lambert';
            mountains.material.map = generateFieldTexture();
            break;
        //w
        case 87 || 119:
            shadingType = 'Phong';
            mountains.material.map = generateFieldTexture();
            break;
        //e
        case 69 || 101:
            shadingType = 'Cartoon';
            mountains.material.map = generateFieldTexture();
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
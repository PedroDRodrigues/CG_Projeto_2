/* global THREE, requestAnimationFrame, console */

import { generateFieldTexture, generateSkyTexture } from  './text/textures.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var stereo;

var lightCalc = true;

var clock = new THREE.Clock(false);

clock.start();

var delta_time;

//objects

var mountains, moon, skyDome;

var ovni = new THREE.Object3D();

var objects = [];

//textures

var texture;

var mountainsTexture;

var keysPressed = {};

var materials = [];


var ambientLight;

var directionalLight = true; 


var bool_Camera_1 = true;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene(){
    'use strict';
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    createSkyDome();
    createMountains();
    createMoon();
    createOvni();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createStereoCamera() {
    'use strict';

    stereo = new THREE.StereoCamera();
}

function createFixedPerspectiveCamera() {
    'use strict';

    camera = new THREE.PerspectiveCamera(75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 325;
    camera.lookAt(scene.position);
}

function createCamera() {
    'use strict';

    //Camara inicial
    createFixedPerspectiveCamera();

    //Camara stereo
    createStereoCamera();
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLights() {
    'use strict';

    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createOvni() {
    'use strict';

    const body = new THREE.Mesh(
        new THREE.SphereGeometry(10, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffff00 })
    );

    materials.push(body.material);
    ovni.add(body);

    //cockpit e um cilindro achatado na parte de baixo do ovni
    
    
    
    const cockpit = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 10, 20, 32),
        new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffff00 })
    );


    //falta acabar este que e o 7
}

function createMoon() {
    'use strict';

    geometry = new THREE.SphereGeometry(10, 32, 32);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffff00 });
    moon = new THREE.Mesh(geometry, material);
    moon.position.set(0, 100, 0);

    scene.add(moon);

}

function createMountains() {
    "use strict";
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
  
    geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    material = mountainsTexture[2];
  
    mountains = new THREE.Mesh(geometry, material);
    //floor.translateY(-34);
    //floor.rotateX(Math.PI / 2);
    scene.add(mountains);
  
    objects.push(mountains);

  }  

function createSkyDome() {
    geometry = new THREE.SphereGeometry(1000, 32, 32);
    material = new THREE.MeshBasicMaterial({ map: generateSkyTexture(), side: THREE.BackSide });
    skyDome = new THREE.Mesh(geometry, material);

    scene.add(skyDome);
}

function createMaterials() {
    'use strict'

    texture = new THREE.TextureLoader().load(`./textures/heighmap.png`);
    mountainsTexture = new Array(4);
    mountainsTexture[0] = new THREE.MeshBasicMaterial({ color: 0xff0000, map: texture });
    mountainsTexture[1] = new THREE.MeshLambertMaterial({ color: 0xff0000, map: texture });
    mountainsTexture[2] = new THREE.MeshPhongMaterial({ color: 0xff0000, map: texture });
    mountainsTexture[3] = new THREE.MeshToonMaterial({ color: 0xff0000, map: texture });
}

/////////////
/* UPDATE  */
/////////////

function updateShading() {
    'use strict';

    if (lightCalc) {
        if (shadingType == 'Lambert') {
            mountains.material = mountainsTexture[1];
        } else if (shadingType == 'Phong') {
            mountains.material = mountainsTexture[2];
        }
        else {
            mountains.material = mountainsTexture[3];
        }
    } else {
        mountains.material = mountainsTexture[0];
    }
}

function update() {
    'use strict';

    let delta_time = clock.getDelta();
    let ovni_speed = 100;

    var diff = new THREE.Vector3();
    if (keysPressed[37]) diff.x--; // left
    if (keysPressed[39]) diff.x++; // right
    if (keysPressed[38]) diff.z++; // up
    if (keysPressed[40]) diff.z--; // down
    if (diff.x || diff.z)
        reboque.position.add(diff.normalize().multiplyScalar(ovni_speed * delta_time));

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

    if (bool_Camera_1) {
        camera = camera_1;
    }
    else {
        camera = camera_2;
    }

    if (directionalLight) {
        directionalLight.visible = true;
    }
    else {
        directionalLight.visible = false;
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
            bool_Camera_1 = !bool_Camera_1;
            break; 
        //q 
        case 81 || 113:
            shadingType = 'Gouraud';
            updateShading();
            break;
        //w
        case 87 || 119:
            shadingType = 'Phong';
            updateShading();
            break;
        //e
        case 69 || 101:
            shadingType = 'Cartoon';
            updateShading();
            break;
        //r
        case 82 || 114:
            lightCalc = !lightCalc;
            break;
        //d
        case 68 || 100:
            directionalLight = !directionalLight;
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
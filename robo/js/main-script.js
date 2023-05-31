/* global THREE, requestAnimationFrame, console */

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var keysPressed = {};

let textureType = 'field'; // Define o tipo de textura inicial como campo floral

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene(){
    'use strict';
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    createPlane();
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
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function generateFieldTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  
  // Preenche o fundo com verde claro
  context.fillStyle = '#cde7c0';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Gera centenas de pequenos círculos brancos, amarelos, lilases e azuis-claros
  const colors = ['#ffffff', '#ffff00', '#c8a2c8', '#add8e6'];
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  }
  
  return new THREE.CanvasTexture(canvas);
}

function generateSkyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  
  // Cria um degradê linear de azul-escuro para violeta-escuro como fundo
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#00008b');
  gradient.addColorStop(1, '#8a2be2');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Gera centenas de pequenos círculos brancos para representar as estrelas
  context.fillStyle = '#ffffff';
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2;
    
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
  }
  
  return new THREE.CanvasTexture(canvas);
}

function createPlane() {
    const geometry = new THREE.PlaneGeometry(1000, 500);
    const material = new THREE.MeshBasicMaterial();
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
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

    let texture;
  
    if (textureType === 'field') {
        texture = generateFieldTexture();
    } else if (textureType === 'sky') {
        texture = generateSkyTexture();
    }
    
    // Atualiza o material da cena com a nova textura
    const material = new THREE.MeshBasicMaterial({ map: texture });
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
        child.material = material;
        }
    });
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

    requestAnimationFrame(animate);
    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////

function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);
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
            update();
            break; 
        case 50: //2
            textureType = 'sky';
            update();
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
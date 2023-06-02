/* global THREE, requestAnimationFrame, console */

import * as THREE from '../js/three.module.js';

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
  
  const aux = new THREE.CanvasTexture(canvas);
  aux.wrapS = THREE.RepeatWrapping;
  aux.wrapT = THREE.RepeatWrapping;
  return aux;

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
  
  const aux = new THREE.CanvasTexture(canvas);
  aux.wrapS = THREE.RepeatWrapping;
  aux.wrapT = THREE.RepeatWrapping;
  return aux;

}

export { generateFieldTexture, generateSkyTexture };
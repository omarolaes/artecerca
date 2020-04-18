//Three.js
import * as THREE from 'three';

import FirstPersonControls from './fpscontrols';
FirstPersonControls(THREE);

// Event emitter implementation for ES6
import EventEmitter from 'event-emitter-es6';

class Scene extends EventEmitter {
  constructor(domElement = document.getElementById('gl_context'),
    _width = window.innerWidth,
    _height = window.innerHeight,
    hasControls = true,
    clearColor = 'black') {

    //Since we extend EventEmitter we need to instance it from here
    super();

    //THREE scene
    this.scene = new THREE.Scene();
    /*
    var fogColor = new THREE.Color(0xffffff);
    this.scene.background = fogColor;
    this.scene.fog = new THREE.Fog(fogColor, 0.0025, 20);
    */
   
  let bgMesh;
  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'http://localhost:3000/fondo.jpg',
    );
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    const shader = THREE.ShaderLib.equirect;
		const material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide,
    });
		material.uniforms.tEquirect.value = texture;
    const plane = new THREE.BoxBufferGeometry(500, 500, 500);
    bgMesh = new THREE.Mesh(plane, material);
    this.scene.add(bgMesh);
  }

   



    

    this.width = _width;
    this.height = _height;
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);

    //THREE WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialiasing: true
    });

    this.renderer.setClearColor(new THREE.Color(clearColor));

    this.renderer.setSize(this.width, this.height);

    //Push the canvas to the DOM
    domElement.append(this.renderer.domElement);

    if (hasControls) {
      this.controls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
      this.controls.lookSpeed = 0.05;
    }

    //Setup event listeners for events and handle the states
    window.addEventListener('resize', e => this.onWindowResize(e), false);
    domElement.addEventListener('mouseenter', e => this.onEnterCanvas(e), false);
    domElement.addEventListener('mouseleave', e => this.onLeaveCanvas(e), false);
    window.addEventListener('keydown', e => this.onKeyDown(e), false);

/*
    this.helperGrid = new THREE.GridHelper(100, 100);
    this.helperGrid.position.y = -0.5;
    this.scene.add(this.helperGrid);
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({
      color: 0xf0f0f0,
      side: THREE.DoubleSide
    });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.y = 5;
    this.scene.add(cube);
    
*/



this.worldLight = new THREE.AmbientLight(0xe0e0e0);
this.scene.add(this.worldLight);


			//Create the walls////
			this.wallGroup = new THREE.Group();
			this.scene.add(this.wallGroup);

			this.wall1 = new THREE.Mesh(new THREE.BoxGeometry(20,7, 2), new THREE.MeshLambertMaterial({color: 0xf0f0f0}));
			this.wall2 = new THREE.Mesh(new THREE.BoxGeometry(7,7, 2), new THREE.MeshLambertMaterial({color: 0xf0f0f0}));
			this.wall3 = new THREE.Mesh(new THREE.BoxGeometry(10,7, 1), new THREE.MeshLambertMaterial({color: 0xf0f0f0}));
			this.wall4 = new THREE.Mesh(new THREE.BoxGeometry(20,7, 1), new THREE.MeshLambertMaterial({color: 0xf0f0f0}));

			this.wallGroup.add(this.wall1, this.wall2, this.wall3, this.wall4);
			this.wallGroup.position.y = 3;

			this.wall1.position.z = -10;
			this.wall2.position.x = -10;
			this.wall2.rotation.y = Math.PI/2;
			this.wall3.position.x = 10;
			this.wall3.rotation.y = -Math.PI/2;
			this.wall4.position.z = 10;
			this.wall4.rotation.y = Math.PI;

            for(var i = 0; i < this.wallGroup.children.length; i++) {
                this.wallGroup.children[i].BBox = new THREE.Box3();
                this.wallGroup.children[i].BBox.setFromObject(this.wallGroup.children[i]);
            }

			//Ceiling//
			//this.ceilMaterial = new THREE.MeshLambertMaterial({color: 0x8DB8A7});
      this.ceilMaterial = new THREE.MeshLambertMaterial({
        color: 0xe0e0e0
      });
			this.ceil = new THREE.Mesh(new THREE.PlaneGeometry(20,20), this.ceilMaterial);
			this.ceil.position.y = 6;
			this.ceil.rotation.x = Math.PI/2;

			this.scene.add(this.ceil);


      this.floorMaterial = new THREE.MeshLambertMaterial({
        color: 0x202020
      });
			this.folor = new THREE.Mesh(new THREE.BoxGeometry(22,22,1), this.floorMaterial);
			this.folor.position.y = -1;
			this.folor.rotation.x = Math.PI/2;

			this.scene.add(this.folor);















    this.clock = new THREE.Clock();

    this.update();

  }

  drawUsers(positions, id) {
    for (let i = 0; i < Object.keys(positions).length; i++) {
      if (Object.keys(positions)[i] != id) {
        this.users[i].position.set(positions[Object.keys(positions)[i]].position[0],
          positions[Object.keys(positions)[i]].position[1],
          positions[Object.keys(positions)[i]].position[2]);
      }
    }
  }

  update() {
    requestAnimationFrame(() => this.update());
    this.controls.update(this.clock.getDelta());
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(e) {
    this.width = window.innerWidth;
    this.height = Math.floor(window.innerHeight - (window.innerHeight * 0.3));
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  onLeaveCanvas(e) {
    this.controls.enabled = false;
  }
  onEnterCanvas(e) {
    this.controls.enabled = true;
  }
  onKeyDown(e) {
    this.emit('userMoved');
  }
}

export default Scene;
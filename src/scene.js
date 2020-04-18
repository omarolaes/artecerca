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
    var fogColor = new THREE.Color(0xFFFFFF);
    this.scene.background = fogColor;
    this.scene.fog = new THREE.Fog(fogColor, 0.0025, 20);
    */

    let bgMesh; {
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


    this.worldLight = new THREE.AmbientLight(0xEAEAEA);
    this.scene.add(this.worldLight);


// artwork 
// funcion to obtain ratio
var ratio = 1;
function getRatio(url, callback) {
  var img = new Image();
  img.src = url;
  img.onload = function() { callback(this.width, this.height); }
}




// texto de sala
var roomtext = 'http://localhost:3000/art/texto1.jpg';
var widthtext = 2;
var heighttext = 2;
var text1 = new THREE.TextureLoader().load(roomtext);
getRatio(roomtext,function(width,height) {
  ratio = height / width;
  heighttext = widthtext * ratio;
});
this.textmat = new THREE.MeshBasicMaterial({
  map: text1
});
this.text1 = new THREE.Mesh(new THREE.BoxGeometry(0.05,heighttext,widthtext), this.textmat);
this.text1.position.z = -4.52;
this.text1.position.y = heighttext / 2;
this.text1.position.x = 3;
this.text1.rotation.y = -Math.PI / 2;
this.scene.add(this.text1);






// Primer cuadro
var imagen1src = 'http://localhost:3000/art/art1.jpg';
var widthart = 2;
var heightart = 2;
var imagen1 = new THREE.TextureLoader().load(imagen1src);
getRatio(imagen1src,function(width,height) {
  ratio = height / width;
  heightart = widthart * ratio;
});
this.artmat1 = new THREE.MeshBasicMaterial({
  map: imagen1
});
this.arte1 = new THREE.Mesh(new THREE.BoxGeometry(0.05,heightart,widthart), this.artmat1);
this.arte1.position.z = 0;
this.arte1.position.y = heightart / 2;
this.arte1.position.x = 4.5;
this.scene.add(this.arte1);

// pleca de cuadro
var plecasrc = 'http://localhost:3000/art/pleca1.png';
var pleca = new THREE.TextureLoader().load(plecasrc);
this.plecamat = new THREE.MeshBasicMaterial({ map: pleca });
this.pleca1 = new THREE.Mesh(new THREE.BoxGeometry(0.01,0.1,0.2), this.plecamat);
this.pleca1.position.z = widthart/1.5;;
this.pleca1.position.y = heightart/5;;
this.pleca1.position.x = 4.5;
this.scene.add(this.pleca1);







// video cuadro
var videocuadro = document.getElementById( 'video' );
var widthvideo = 4;
var heightvideo = 2;
var videotxt = new THREE.VideoTexture( video );
videotxt.minFilter = THREE.LinearFilter;
videotxt.magFilter = THREE.LinearFilter;
videotxt.format = THREE.RGBFormat;
this.videomat = new THREE.MeshBasicMaterial({
  map: videotxt
});
this.videogeo1 = new THREE.Mesh(new THREE.BoxGeometry(0.05,heightvideo,widthvideo), this.videomat);
this.videogeo1.position.z = 4.5;
this.videogeo1.position.y = heightvideo / 2;
this.videogeo1.position.x = 0;
this.videogeo1.rotation.y = -Math.PI / 2;
this.scene.add(this.videogeo1);








    //Create the walls////
    this.wallGroup = new THREE.Group();
    this.scene.add(this.wallGroup);

    this.wall1 = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 1), new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    }));
    this.wall2 = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 1), new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    }));
    this.wall3 = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 1), new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    }));
    this.wall4 = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 1), new THREE.MeshLambertMaterial({
      color: 0x151515
    }));

    this.wallGroup.add(this.wall1, this.wall2, this.wall3, this.wall4);
    this.wallGroup.position.y = 0;
    this.wall1.position.z = -5;
    this.wall2.position.x = -5;
    this.wall2.rotation.y = Math.PI / 2;
    this.wall3.position.x = 5;
    this.wall3.rotation.y = -Math.PI / 2;
    this.wall4.position.z = 5;
    this.wall4.rotation.y = Math.PI;

    for (var i = 0; i < this.wallGroup.children.length; i++) {
      this.wallGroup.children[i].BBox = new THREE.Box3();
      this.wallGroup.children[i].BBox.setFromObject(this.wallGroup.children[i]);
    }

    //Ceiling//
    this.ceilMaterial = new THREE.MeshLambertMaterial({
      color: 0xebf0f4,
      opacity: 0.85,
      transparent: true,
    });
    this.ceil = new THREE.Mesh(new THREE.BoxGeometry(10, 10,0.1), this.ceilMaterial);
    this.ceil.position.y = 2.5;
    this.ceil.rotation.x = Math.PI / 2;
    this.scene.add(this.ceil);


    //Floor//
    var txture = new THREE.TextureLoader().load('http://localhost:3000/dw.jpg', function (txture) {
      txture.wrapS = THREE.RepeatWrapping;
      txture.wrapT = THREE.RepeatWrapping;
      txture.repeat.x = 25;
      txture.repeat.y = 50;
    });
    this.floorMaterial = new THREE.MeshBasicMaterial({
      map: txture,
      side: THREE.DoubleSide
    });
    this.floor = new THREE.Mesh(new THREE.BoxGeometry(22, 22, 1), this.floorMaterial);
    this.floor.position.y = -1;
    this.floor.rotation.x = Math.PI / 2;
    this.scene.add(this.floor);



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
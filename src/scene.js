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
    this.scene = new THREE.Scene();

    var raycaster = new THREE.Raycaster(); // Needed for object intersection
    var mouse = new THREE.Vector2(); //Needed for mouse coordinates
// Define Geometry
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshPhongMaterial({ // Required For Shadows
  color: 0xecebec,
  specular: 0x000000,
  shininess: 100
});
var cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
cube.castShadow = true;
cube.receiveShadow = true;
this.scene.add(cube);





    /* Fog */
    var fogColor = new THREE.Color(0xFFFFFF);
    this.scene.background = fogColor;
    this.scene.fog = new THREE.Fog(fogColor, 0.00025, 100);


    /* Skybox */
    let Skybox; {
      const loader_sky = new THREE.TextureLoader();
      const texture_sky = loader_sky.load(
        'http://localhost:3000/img/fondo.jpg',
      );
      texture_sky.magFilter = THREE.LinearFilter;
      texture_sky.minFilter = THREE.LinearFilter;
      const shader = THREE.ShaderLib.equirect;
      const material_sky = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide,
      });
      material_sky.uniforms.tEquirect.value = texture_sky;
      const plane = new THREE.BoxBufferGeometry(500, 500, 500);
      Skybox = new THREE.Mesh(plane, material_sky);
      this.scene.add(Skybox);
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

    /* Configure controls */
    if (hasControls) {
      this.controls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
      this.controls.lookSpeed = 0.08;
    }

    // Setup event listeners for events and handle the states
    window.addEventListener('resize', e => this.onWindowResize(e), false);
    domElement.addEventListener('mouseenter', e => this.onEnterCanvas(e), false);
    domElement.addEventListener('mouseleave', e => this.onLeaveCanvas(e), false);
    window.addEventListener('keydown', e => this.onKeyDown(e), false);

    // Ambient Light in Gray
    this.worldLight = new THREE.AmbientLight(0xf0f0f0);
    this.scene.add(this.worldLight);



    // Room variables
    var room_x = 10;
    var room_z = 5;
    var room_y = 8;



    // Inserta cuadros
    var artworks = ['http://localhost:3000/art/art1.png', 'http://localhost:3000/art/art2.png', 'http://localhost:3000/art/art3.png', 'http://localhost:3000/art/art4.png', 'http://localhost:3000/art/art5.png', 'http://localhost:3000/art/art1.jpg', 'http://localhost:3000/art/art1.png', 'http://localhost:3000/art/art4.png', 'http://localhost:3000/art/art1.png'];

    var widthart = 2;
    var heightart = 2;
    var eye_seight = 0.5;
    var ratio = 1;

    for (var i = 0; i < 12; i++) {
      var imagen1src = artworks[i];
      var imagen1 = new THREE.TextureLoader().load(imagen1src, function ( tex ) {
        ratio = tex.image.width / tex.image.height;
        heightart = widthart * ratio;
      });
      this.artmat1 = new THREE.MeshBasicMaterial({
        map: imagen1
      });
      this.arte1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, heightart, widthart), this.artmat1);
        this.arte1.position.z = room_z;
        this.arte1.position.y = eye_seight;
        this.arte1.rotation.y = -Math.PI / 0.5;
        this.arte1.position.x = (room_x/2) + ((widthart + 0.5) * i);
      this.scene.add(this.arte1);
    }


// raycast
window.addEventListener('click', onDocumentMouseDown, false);

function onDocumentMouseDown(event) {

  // Welcome to the exciting world of raycasting !
  // First let's get some mouse coordinates:
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // This is basically converting 2d coordinates to 3d Space:
  raycaster.setFromCamera(mouse, this.camera);
  // And checking if it intersects with an array object
  var intersects = raycaster.intersectObjects([cube]);
  
  // does your cursor intersect the object on click ? 
  //console.log(intersects.length > 0 ? "yes" : "no");
  
  // And finally change the color:
  if (intersects.length > 0) {
    intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
  }
}





    // Inserta cuadros
    var videocuadro = document.getElementById('video');
    var widthvideo = 8;
    var heightvideo = 4;
    var videotxt = new THREE.VideoTexture(videocuadro);
    videotxt.minFilter = THREE.LinearFilter;
    videotxt.magFilter = THREE.LinearFilter;
    videotxt.format = THREE.RGBFormat;
    this.videomat = new THREE.MeshBasicMaterial({
      map: videotxt,
      side: THREE.DoubleSide
    });
    this.videogeo1 = new THREE.Mesh(new THREE.BoxGeometry(widthvideo, heightvideo, widthvideo), this.videomat);
    this.videogeo1.position.z = -room_z * 2;
    this.videogeo1.position.x = room_x * 1.5;
    this.videogeo1.position.y = 1.55;
    this.videogeo1.rotation.y = -Math.PI / 2;
    this.scene.add(this.videogeo1);
    /* escenario */
    var listener = new THREE.AudioListener();
    this.camera.add( listener );
    var audioLoader = new THREE.AudioLoader();
    
    var sound1 = new THREE.PositionalAudio( listener );
    audioLoader.load('http://localhost:3000/sounds/aldon.mp3', function ( buffer ) {
      sound1.setBuffer( buffer );
      sound1.setRefDistance(1);
      sound1.setVolume( 0 );
      sound1.play();
    } );
    this.videogeo1.add( sound1 );
  


    // texto de sala
    var roomtext = 'http://localhost:3000/art/texto1.png';
    var widthtext = 3;
    var heighttext = 5;
    var text1 = new THREE.TextureLoader().load(roomtext);
    this.textmat = new THREE.MeshBasicMaterial({
      map: text1,
      side: THREE.DoubleSide
    });
    this.text1 = new THREE.Mesh(new THREE.BoxGeometry(widthtext, heighttext, widthtext), this.textmat);
    this.text1.position.z = 0;
    this.text1.position.y = 2.1;
    this.text1.position.x = room_x;
    this.scene.add(this.text1);
    var spotLighttext = new THREE.SpotLight(0xf0f0f0, 1, 100, 0.5);
    spotLighttext.position.set(0, 2, room_z - 1);
    spotLighttext.castShadow = true;
    this.scene.add(spotLighttext);



    /* Floor create */
    var floor_texture = new THREE.TextureLoader().load('http://localhost:3000/img/darkwood.jpg', function (floor_texture) {
      floor_texture.wrapS = THREE.RepeatWrapping;
      floor_texture.wrapT = THREE.RepeatWrapping;
      floor_texture.repeat.x = 50;
      floor_texture.repeat.y = 50;
    });
    this.floorMaterial = new THREE.MeshBasicMaterial({
      map: floor_texture
    });
    this.floor = new THREE.Mesh(new THREE.BoxGeometry(room_x + 50, room_z + 50, 1), this.floorMaterial);
    this.floor.position.y = -1;
    this.floor.position.x = 20;
    this.floor.rotation.x = Math.PI / 2;
    this.scene.add(this.floor);
    /* finish floor  */

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
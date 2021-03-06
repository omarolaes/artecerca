import Scene from './scene';
import * as THREE from 'three';



//A socket.io instance
const socket = io();


//One WebGL context to rule them all !
let glScene = new Scene();
let id;
let instances = [];
let clients = new Object();

glScene.on('userMoved', ()=>{
  socket.emit('move', [glScene.camera.position.x, glScene.camera.position.y, glScene.camera.position.z]);
});




//On connection server sends the client his ID
socket.on('introduction', (_id, _clientNum, _ids)=>{
  
  var geometry = new THREE.BoxGeometry( 0.5, 1, 0.5 );
  var material = new THREE.MeshNormalMaterial();

  for(let i = 0; i < _ids.length; i++){
    if(_ids[i] != _id){
      clients[_ids[i]] = {
        mesh: new THREE.Mesh( geometry, material )
      }

      //Add initial users to the scene
      glScene.scene.add(clients[_ids[i]].mesh);
    }
  }

  console.log(clients);

  id = _id;
  console.log('mi usuario: ' + id);

});

socket.on('newUserConnected', (clientCount, _id, _ids)=>{
  console.log(clientCount + ' personas conectadas');
  let alreadyHasUser = false;
  for(let i = 0; i < Object.keys(clients).length; i++){
    if(Object.keys(clients)[i] == _id){
      alreadyHasUser = true;
      break;
    }
  }
  if(_id != id && !alreadyHasUser){
    var geometry = new THREE.BoxGeometry( 0.5, 1, 0.5 );
    var material = new THREE.MeshNormalMaterial();
    console.log('Nuevo: ' + _id);
    clients[_id] = {
      mesh: new THREE.Mesh( geometry, material )
    }

    //Add initial users to the scene
    glScene.scene.add(clients[_id].mesh);
  }

});

socket.on('userDisconnected', (clientCount, _id, _ids)=>{
  //Update the data from the server
  document.getElementById('numUsers').textContent = clientCount;

  if(_id != id){
    console.log('Se salió: ' + _id);
    glScene.scene.remove(clients[_id].mesh);
    delete clients[_id];
  }
});

socket.on('connect', ()=>{});

//Update when one of the users moves in space
socket.on('userPositions', _clientProps =>{
  // console.log('Positions of all users are ', _clientProps, id);
  // console.log(Object.keys(_clientProps)[0] == id);
  for(let i = 0; i < Object.keys(_clientProps).length; i++){
    if(Object.keys(_clientProps)[i] != id){

      //Store the values
      let oldPos = clients[Object.keys(_clientProps)[i]].mesh.position;
      let newPos = _clientProps[Object.keys(_clientProps)[i]].position;

      //Create a vector 3 and lerp the new values with the old values
      let lerpedPos = new THREE.Vector3();
      lerpedPos.x = THREE.Math.lerp(oldPos.x, newPos[0], 0.3);
      lerpedPos.y = THREE.Math.lerp(oldPos.y, newPos[1], 0.3);
      lerpedPos.z = THREE.Math.lerp(oldPos.z, newPos[2], 0.3);

      //Set the position
      clients[Object.keys(_clientProps)[i]].mesh.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);
    }
  }
});

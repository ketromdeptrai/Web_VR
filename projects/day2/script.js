var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
var geometry = new THREE.SphereGeometry(500, 60, 40);

var videoElement = document.createElement('video');
videoElement.src = 'common/pano.mp4';
videoElement.load();
videoElement.crossOrigin = 'anonymous';
videoElement.setAttribute('webkit-playsinline', 'true');
videoElement.setAttribute('playsinline', 'true');
//

var videoTexture = new THREE.Texture(videoElement);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;


var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;
camera.target = new THREE.Vector3(-1, controls.userHeight, 0);
camera.lookAt(camera.target);

var material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.scale.x = -1;
mesh.position.set(0, controls.userHeight, 0);
scene.add(mesh);
//
var planeGeometry = new THREE.PlaneGeometry(1, 1);
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var maxWidth = canvas.width;
var lineHeight = 25;
var startScroll = false;

var text = /*' '+camera.scale.x+' '+camera.scale.y+' '+camera.scale.z+*/'Start';
var x = 0;
var y = 60;

function wrapText(x, y) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(x, y);
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
  context.setTransform(1, 0, 0, 1, 0, 0);
}
wrapText(x, y);

context.font = '11pt Calibri';
context.fillStyle = 'yellow';

var textTexture = new THREE.Texture(canvas);
textTexture.minFilter = THREE.LinearFilter;
textTexture.needsUpdate = true;
var textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, side: THREE.DoubleSide, transparent: true });
var textMesh = new THREE.Mesh(planeGeometry, textMaterial);
textMesh.position.set(0, controls.userHeight, -3);

var pivot = new THREE.Object3D();
scene.add(pivot);

pivot.add(textMesh);

//
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var options = {
  color: 'black',
  background: 'white',
  corners: 'square',
  textEnterVRTitle: 'Play Video'
};
var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options);
enterVRButton.on('hide', function() {
  document.getElementById('ui').style.display = 'none';
});
enterVRButton.on('show', function() {
  document.getElementById('ui').style.display = 'inherit';
});
document.getElementById('vr-button').appendChild(enterVRButton.domElement);
document.getElementById('no-vr').addEventListener('click', function() {
  enterVRButton.requestEnterFullscreen();
  //videoElement.loop = true;
 // camera.lookAt(camera.target);
  videoElement.play();
  startScroll = true;
});

document.getElementById('vr-button').addEventListener('click', function() {
  //camera.lookAt(camera.target);
  videoElement.play();
 // videoElement.loop = true;
 startScroll = true;
});

var interacting;
var pointerX = 0;
var pointerY = 0;
var lat = 0;
var lng = 0;
var savedLat = 0;
var savedLng = 0;

var xaxis = new THREE.Vector3(1, 0, 0);
var yaxis = new THREE.Vector3(0, 1, 0);
var zaxis = new THREE.Vector3(0, 0, 1);
var pos = 60;
animate();

function animate() {
  //
if(startScroll) {
    textTexture.needsUpdate = true;
    wrapText(0, pos);
    text = ' '+camera.rotation.x.toFixed(3)+' '+camera.rotation.y.toFixed(3)+' '+camera.rotation.z.toFixed(3);
   // pos -= 0.1;
  }
//
var direction = zaxis.clone();
  // Apply the camera's quaternion onto the unit vector of one of the axes
  // of our desired rotation plane (the z axis of the xz plane, in this case).
  direction.applyQuaternion(camera.quaternion);
  // Project the direction vector onto the y axis to get the y component
  // of the direction.
  var ycomponent = yaxis.clone().multiplyScalar(direction.dot(yaxis));
  var xcomponent = xaxis.clone().multiplyScalar(direction.dot(xaxis));
  // Subtract the y component from the direction vector so that we are
  // left with the x and z components.
  direction.sub(ycomponent);
 //direction.sub(xcomponent);
  // Normalize the direction into a unit vector again.
  direction.normalize();
  // Set the pivot's quaternion to the rotation required to get from the z axis
  // to the xz component of the camera's direction.
  pivot.quaternion.setFromUnitVectors(zaxis, direction);
  //camera.add( pivot.target );
  //camera.target.position.set( 0, 0, -1 );
  pivot.position.copy(camera.position);
  pivot.position.z = -0.5;
  //pivot.lookAt(camera.position);

  effect.render(scene, camera);

  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  if( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA ){
    videoTexture.needsUpdate = true;
  }

  requestAnimationFrame(animate);
}

renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('resize', onResize, false);

function onMouseDown(event) {
  event.preventDefault();
  interacting = true;
 /* pointerX = event.clientX;
  pointerY = event.clientY;
  savedLng = lng;
  savedLat = lat;*/
}

function onMouseMove(event) {
  if (interacting) {
/*    lng = ( pointerX - event.clientX ) * 0.1 + savedLng;
    lat = ( pointerY - event.clientY ) * 0.1 + savedLat;*/
  }
}

function onMouseUp(event) {
  event.preventDefault();
  interacting = false;
}

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("keydown", onkey, true);
function onkey(event) {
    event.preventDefault();
      if (event.keyCode == 32) { // space bar 
         if (videoElement.paused == true){
            videoElement.play();
          }
          else {
          videoElement.pause();
          }
      }
}

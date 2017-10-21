var socket = io.connect('http://192.168.4.26:8009');
//
var FOV = 90;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 1100);
var geometry = new THREE.SphereGeometry(500, 60, 40);
var videoElement = document.createElement('video');
videoElement.src = './walking_dead.mp4';
videoElement.load();
videoElement.crossOrigin = 'anonymous';
videoElement.setAttribute('webkit-playsinline', 'true');
videoElement.setAttribute('playsinline', 'true');
var videoName = "Pano";
//
var videoTexture = new THREE.Texture(videoElement);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;
//
var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;
camera.target = new THREE.Vector3(0, controls.userHeight, 0);
camera.lookAt(camera.target);
camera.rotationAutoUpdate = false;
camera.eulerOrder = "YXZ";
//
var material = new THREE.MeshBasicMaterial({
	map: videoTexture,
	side: THREE.DoubleSide
});
var mesh = new THREE.Mesh(geometry, material);
mesh.scale.x = -1;
mesh.position.set(0, controls.userHeight, 0);
mesh.rotation.y = -Math.PI / 2; // Xoay goc nhin dau tien
scene.add(mesh);
//
var planeGeometry = new THREE.PlaneGeometry(2, 2);
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var maxWidth = canvas.width;
var lineHeight = 25;
var startScroll = false;
var text = '';

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//
var options = {
	color: 'black',
	background: 'white',
	corners: 'square',
	textEnterVRTitle: 'Play Video'
};
var coordinatedTransfered = false;
var videoPlayed = false;
var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options);
enterVRButton.on('hide', function() {
	document.getElementById('ui').style.display = 'none';
});
enterVRButton.on('show', function() {
	document.getElementById('ui').style.display = 'inherit';
});
enterVRButton.on('exit', function() {
	if (!videoElement.ended){
		socket.emit('coordinate',"Error");
	}
	window.clearTimeout(myVar);
	videoPlayed = false;
	videoElement.pause();
    videoElement.currentTime = 0;
	coordinatedTransfered = true;
});
document.getElementById('vr-button').appendChild(enterVRButton.domElement);
document.getElementById('no-vr').addEventListener('click', function() {
	enterVRButton.requestEnterFullscreen();
	//textFile = '';
	videoElement.play();
	videoPlayed = true;
	coordinatedTransfered = false;
	socket.emit('coordinate',"Start");
	myVar = window.setInterval(sendtoServer, 1/60 * 1000);
	startScroll = true;
});
document.getElementById('vr-button').addEventListener('click', function() {
	//textFile = '';
	videoElement.play();
	socket.emit('coordinate',"Start");
	myVar = window.setInterval(sendtoServer, 1/60 * 1000);
	videoPlayed = true;
	coordinatedTransfered = false;
	startScroll = true;
});
var myVar;
function sendtoServer(){
	if (!videoElement.ended && !videoElement.paused){
		socket.emit('coordinate',text);
	}
}

function saveFile(text) {
	var d = new Date();
	var filename = videoName + " " + d.getFullYear().toString() + "-" + d.getMonth().toString() + "-" + d.getDate().toString() + " " + d.getHours().toString() + "h" + d.getMinutes().toString() + "m" + d.getSeconds().toString() + "s";
	var blob = new Blob([text], {
		type: "text/plain;charset=utf-8"
	});
	saveAs(blob, filename + ".txt");
}
var interacting;
/*var xaxis = new THREE.Vector3(1, 0, 0);
var yaxis = new THREE.Vector3(0, 1, 0);
var zaxis = new THREE.Vector3(0, 0, 1);
var pos = 60;*/
//var textFile = '';
animate();

function animate() {
	//
	if (videoElement.ended && !coordinatedTransfered) {
		videoPlayed = false;
		window.clearTimeout(myVar);
		socket.emit('coordinate',"Stop");
		coordinatedTransfered = true;
	}
	if (startScroll) {
		//textTexture.needsUpdate = true;
		//wrapText(0, pos);
		text = videoElement.currentTime.toFixed(3)+ ' ' + ((camera.getWorldRotation().x) * 180 / Math.PI).toFixed(3) + ' ' + ((camera.getWorldRotation().y) * 180 / Math.PI).toFixed(3) + ' ' + ((camera.getWorldRotation().z) * 180 / Math.PI).toFixed(3);
		//text = camera.eulerOrder +'';
	}
	/*var direction = zaxis.clone();
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
	// Normalize the direction into a unit vector again.
	direction.normalize();
	// Set the pivot's quaternion to the rotation required to get from the z axis
	// to the xz component of the camera's direction.
	pivot.quaternion.setFromUnitVectors(zaxis, direction);
	pivot.position.copy(camera.position);
	pivot.position.z = -0.5;*/
	effect.render(scene, camera);
	if (enterVRButton.isPresenting()) {
		controls.update();
	}
	//videoTexture.needsUpdate = true;
	if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
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
}

function onMouseMove(event) {}

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
		if (videoElement.paused == true) {
			videoElement.play();
		} else {
			videoElement.pause();
		}
	}
	//roll
	else if (event.keyCode == 69) { //e
		camera.rotation.z += 0.01;
		effect.render(scene, camera);
	} else if (event.keyCode == 81) { //q
		camera.rotation.z -= 0.01;
		effect.render(scene, camera);
	}
	//pitch
	else if (event.keyCode == 87) { //w
		camera.rotation.x += 0.01;
		effect.render(scene, camera);
	} else if (event.keyCode == 83) { //s
		camera.rotation.x -= 0.01;
		effect.render(scene, camera);
	}
	//yaw
	else if (event.keyCode == 65) { //a
		camera.rotation.y += 0.01;
		effect.render(scene, camera);
	} else if (event.keyCode == 68) { //d
		camera.rotation.y -= 0.01;
		effect.render(scene, camera);
	}
}
var elem = document.getElementById("myBar");
function loaded()
{
    var r = videoElement.buffered;
    var total = videoElement.duration;

    var start = r.start(0);
    var end = r.end(0);
    var width = Math.round((end/total)*100);

    elem.style.width = width + '%'; 
    elem.innerHTML = width * 1  + '%';
}   
videoElement.onprogress = function() {
   loaded();
};
videoElement.oncanplay= function() {
    console.log(videoElement.buffered.length+"");
};
var downloadProgress = setInterval(function(){ loaded() }, 1000);
function stopProgress() {
    clearInterval(myVar);
}
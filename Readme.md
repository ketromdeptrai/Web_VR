# 360 VR Video player based on WebVR with headtracking
360 VR Video player based on WebVR with headtracking movement, compatible with Google Cardboard or Oculus Samsung Gear VR.
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installing

A step by step series of examples that tell you have to get a development env running

* Install nodejs and npm:

```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install nodejs-legacy
sudo apt-get install npm
```

* Install http-server:

```
sudo npm install http-server -g
```

* Clone this repository:

```
git clone https://github.com/phunm211/Web_VR.git
```

## Running the tests

Explain how to run the automated tests

* Edit variable and run file bash Run.sh in this repository:

```
bash Run.sh
```
* Follow the variable of Server IP and WebVR Port in file ***Run.sh***, access this address via a browser such as Google Chrome for Android or Samsung Internet VR and play video in VR mode.
* Note that if you use Samsung Internet VR, the first time you use WebVR, you have to enable this function by naviagate to ***internet://flags***, select **Enable** for WebVR.
* Headtracking log will be in the folder ***./head_tracking_log***.
* Log format order: [current_Time_Video_value]  [pitch_value]   [yaw_value]  [roll_value].

## Bug founded

* Sometimes, when you navigate to address of Web VR server in Samsung Internet VR and click button **Play Video**, at the first time, maybe video not completely loaded so maybe it can display a dark screen or pause video. You can solve this issue by press button **Back** on Samsung Gear VR, then click button **Play Video** again.

* If you change any variable in file ***Run.sh***, you have to change variable ***WebVRPort***.

## Built With

* [Threejs](https://threejs.org/) - Javascript 3D library.
* [Webvr Polyfill](https://github.com/googlevr/webvr-polyfill/) - From Google.
* [Socket.io](https://github.com/socketio/socket.io/) - Realtime application framework.

## Versioning

v1.0

## Authors

* **Phu Nguyen Minh** - *ESRC Lab - Hanoi University of Science and Technology* - [Facebook](https://facebook.com/ketromdeptrai)
* Many thanks to my teammates: **Cuong Pham The** for the ideal of Euler Angles Order, and specially, **Nguyen Phung Dinh** who is the idol in my eyes.


## License

This project is licensed under the ESRC License.

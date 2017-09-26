#!/bin/bash
#ServerIP="192.168.1.14"
ServerIP=$(ip route get 1 | awk '{print $NF;exit}')
SocketIOPort="8009"
WebVRPort="8080" #WebVR port must different from Socket IO port
VideoPath="common/pano.mp4"
FOV=75
ReapeatTime=1 #number of times to loop SocketIO Server's code
sed -i '1s|.*|var socket = io.connect('\''http://'$ServerIP':'$SocketIOPort''\'');|' ./script.js
sed -i '8s|.*|videoElement.src = '\'''$VideoPath''\'';|' ./script.js
sed -i '3s|.*|var FOV = '$FOV';|' ./script.js
sed -i '22s|.*|	<script src='\''http://'$ServerIP':'$SocketIOPort'/socket.io/socket.io.js'\''></script>|' ./index.html
sed -i '5s@.*@    port = process.env.PORT || '$SocketIOPort',@' ./server/socket_server.js
sed -i '7s@.*@    ip = process.env.IP || '\'$ServerIP\'',@' ./server/socket_server.js
echo "Start WebVR Server"
gnome-terminal -e "http-server -p "$WebVRPort
echo "Start Socket IO Server"
gnome-terminal -e "bash ./StartSocketIOServer.sh "$VideoPath" "$ReapeatTime
kill -9 $PPID
$SHELL

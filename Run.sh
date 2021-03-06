#!/bin/bash
#ServerIP="192.168.1.14"
ServerIP=$(ip route get 1 | awk '{print $NF;exit}') #get your local IP address automatically
SocketIOPort="8009"
WebVRPort=8013 #WebVR port must different from Socket IO port
#VideoPath="./walking_dead.mp4"
FOV=90
ListVideo=''
ReapeatTime=100 #number of times to loop SocketIO Server's code
#If you change any variable in file ***Run.sh***, you have to change variable ***WebVRPort***.
VideoDir='./Nguyenidol'
i=0
for entry in "$VideoDir"/*
do
  	echo "$entry"
	((i++))
	ListVideo=''$ListVideo'<option value="'$entry'">'$(basename "${entry%.*}")'</option>'
done
echo $i
sed -i "23s|.*|<select id=\"mylist\" size=\"$i\">$ListVideo</select>|" ./index.html
sed -i '1s|.*|var socket = io.connect('\''http://'$ServerIP':'$SocketIOPort''\'');|' ./script.js
#sed -i '8s|.*|videoElement.src = '\'''$VideoPath''\'';|' ./script.js
sed -i '3s|.*|var FOV = '$FOV';|' ./script.js
sed -i '22s|.*|<script src='\''http://'$ServerIP':'$SocketIOPort'/socket.io/socket.io.js'\''></script>|' ./index.html
sed -i '5s@.*@    port = process.env.PORT || '$SocketIOPort',@' ./server/socket_server.js
sed -i '7s@.*@    ip = process.env.IP || '\'$ServerIP\'',@' ./server/socket_server.js
echo "Start WebVR Server"
gnome-terminal -e "http-server -p "$WebVRPort
echo "Start Socket IO Server"
node ./server/socket_server.js
#gnome-terminal -e "bash ./StartSocketIOServer.sh "$VideoPath" "$ReapeatTime
#kill -9 $PPID
$SHELL

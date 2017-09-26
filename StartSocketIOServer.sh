#!/bin/bash

VideoPath=$1
VideoName=${VideoPath##*/}
index=1
ReapeatTime=$2;
while ((ReapeatTime--)); do
	((index++))
	OutputName=$VideoName'_'$index'.txt'
	node ./server/socket_server.js | tee ./head_tracking_log/$OutputName
done
$SHELL

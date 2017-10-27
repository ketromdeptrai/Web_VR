var http = require('http'),

    socketIO = require('socket.io'),

    port = process.env.PORT || 8009,

    ip = process.env.IP || '192.168.4.26',

    server = http.createServer().listen(port, ip, function(){

        console.log('Socket.IO server started at %s:%s!', ip, port);

    }),

    io = socketIO.listen(server);

    io.set('match origin protocol', true);

    io.set('origins', '*:*');

    io.set('log level', 1);

    var videoName = "";
    var array = []; 
    var run = function(socket){
        socket.on('coordinate', function(data){
            //console.log('%s', data);
            if ((data+'').indexOf("videoName") != -1){
                console.log('%s', data);
                videoName = (data+'').replace("videoName:", "");
                array = [];
                array.push(videoName);
            }
            else if ((data+'').localeCompare("Stop") == 0){
           //write to file
                console.log('%s', data);
                var fs = require('fs');
                var file = fs.createWriteStream('./head_tracking_log/'+videoName+'.log');
                file.on('error', function(err) { /* error handling */ });
                array.forEach(function(item, index, arr) {
                   file.write(item+'\r\n')
                });
                file.end();
            }
            else if ((data+'').localeCompare("Error") == 0){
                console.log('%s', data);
                array = [];
                array.push(videoName);
	    	}
            else if (((data+'').indexOf("Start") == -1) && (data+'').localeCompare("") != 0)
            {
                console.log('%s', data);
                array.push(data+'');
            }
        })
    }

    io.sockets.on('connection', run);

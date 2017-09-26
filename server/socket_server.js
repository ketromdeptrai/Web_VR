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

    var run = function(socket){
        socket.on('coordinate', function(data){
            console.log('%s', data);
            if ((data+'').localeCompare("Stop") == 0){
            process.exit();
            }
        })
    }

    io.sockets.on('connection', run);
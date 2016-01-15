//Lets require/import the HTTP module
var http = require('http');
var spawn = require('child_process').spawn;

//Lets define a port we want to listen to
const PORT=process.argv[2]; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    request.on('data',function(data){
        var svg_buf = new Buffer(200*1024);
        var err = "";
        var offset = 0;

        var child = spawn('racket');
        child.stdin.write(data);
        child.stdin.end();

        child.on('error',function(msg){
            err += msg.toString('utf-8');
        });

        child.stdout.on('data',function(data){
            data.copy(svg_buf,offset);
            offset+=data.length;
        });

        child.stderr.on('data',function(data){
            err += data.toString('utf-8');

        });

        child.on('close', function(code) {
            body = JSON.stringify({
                "errors":err,
                "svg":svg_buf.toString('utf-8',0,offset)
            });
            response.writeHead(200, 
                    {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
                    });
            response.end(body);

        });

        var to = setTimeout(function(){
            console.log('Sending sigkill');
            child.kill();
        }, 3000);

    });
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

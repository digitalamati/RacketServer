//Lets require/import the HTTP module
var http = require('http');
var spawn = require('child_process').spawn;

//Lets define a port we want to listen to
const PORT=process.argv[2]; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    var child = spawn('racket/bin/racket');
        var svg = "";
        var err = "";
	request.on('end',function(){
        child.stdin.end();
});
    request.on('data',function(data){

        child.stdin.write(data);

        child.on('error',function(msg){
            err += msg.toString('utf-8');
        });

        child.stdout.on('data',function(data){
	    svg += data.toString('utf-8');
        });

        child.stderr.on('data',function(msg){
            err += msg.toString('utf-8');
		console.log(msg.toString('utf-8'));

        });

        child.on('close', function(code) {
		clearTimeout(to);
            body = JSON.stringify({
                "errors":err,
                "svg":svg
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
}, 5000);
    });
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on port %s", PORT);
});

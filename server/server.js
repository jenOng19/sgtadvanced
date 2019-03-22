

const express= require('express'); //load the express library into the file

const server= express();

//use is a middle
// dirname is a variable that has a string inside of it
server.use(express.static( __dirname + '/html'))

var insults=[
    'your father smelt of elderberries',
    'you program on an altaire',
    'one line functions are for chumps'
]

    // end points-the forward slashes are the ones in the url address
    //parameters
    //the path to listen for
    //the callback function to call once that path has been received, req or res
server.get('/', function(request, response){ 
    //an object representing all of the data coming from the client to the server
    //an object representing all of the data going from the server to the client
    response.send('Hello, World.')
})

server.get('/time', (request, response)=>{
    var now=new Date();
    response.send(now.toLocaleDateString())
})

server.get('/insult', (request, response)=>{
    var change= insults[Math.random()*insults.length];
    response.send(change);
})






server.listen(3001, ()=>{ // listen is a method and wants 2 parameters(port that it is going to open up on and the callback function that it will call once its set up)
    // console.log('server is running on port 3001');
    console.log('carrier has arrived');
})
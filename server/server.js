

const express= require('express'); //load the express library into the file
const mysql= require('mysql');
const mysqlcredentials= require('./mysqlcreds.js');//load the credentials from a local file for mysql


// establish a connection to the database
//using the credentials that we loaded, establish a preliminary connection to the database
const db= mysql.createConnection(mysqlcredentials);

const server= express();

//use is a middleman
// dirname is a variable that has a string inside of it
// /html is a path ,__dirname means wherever you are and look there for any requests 
// __dirname is your current working directory and looks for static files(does not change)
//file won't change unless you manually change the code
server.use(express.static( __dirname + '/html'))
server.use(express.urlencoded({extended: false }))//have express pull body data that is urlencoded and place it into an object called 'body' (url encoded:key, value pairs)

//  /api means nothing, can be named something else 
// event when a connection is received at port 3001 at the url above call this function
//make an endpoint to handle retrieving the grades of all students
server.get('/api/grades', (req, res)=>{
    // takes a callback functions once it is made
    //establish the connection to the database, and call the callback function when connection is made
    db.connect( ()=> {
        //create a query for our desired operation
        const query = 'SELECT `id`, CONCAT (`givenname`, " ", `surname`)AS `name`, `course`, `grade` FROM `grades`'
        //send query to the database, and call the given call back function once the data is retrieved
        db.query(query, (error, data)=>{
            //if error is null, no error occurred
            //create an output object to be sent back to the client
            const output={
                success:false,
            }
            //if error is null, send the data
            if(!error){
                //notify the client that we were successful
                output.success=true;
                //attach the data from the database to the output object
                output.data=data;
            }else{
                //an error occurred, attach that error onto the output so we can see what happened
                output.error=error;
            }
            //send the data back to the client, in reality shouldn't send data back to the client 
            res.send(output);
        })
    })
})


server.post('/api/grades', (request, response)=>{

})


// var insults=[
//     'your father smelt of elderberries',
//     'you program on an altaire',
//     'one line functions are for chumps'
// ]

    // end points-the forward slashes are the ones in the url address
    //parameters
    //the path to listen for
    //the callback function to call once that path has been received, req or res
// server.get('/', function(request, response){ 
    //an object representing all of the data coming from the client to the server
    //an object representing all of the data going from the server to the client
//     response.send('Hello, World.')
// })

// server.get('/time', (request, response)=>{
//     var now=new Date();
//     response.send(now.toLocaleDateString())
// })

// server.get('/insult', (request, response)=>{
//     var change= insults[(Math.random()*insults.length)];
//     response.send(change);
// })






server.listen(3001, ()=>{ // listen is a method and wants 2 parameters(port that it is going to open up on and the callback function that it will call once its set up)
    // console.log('server is running on port 3001');
    console.log('carrier has arrived');
})
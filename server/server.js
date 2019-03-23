

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
server.use(express.json())//used for things like axios


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

// INSERT INTO `grades` SET `surname` = "Ong", `givenname`= "Jennifer", `course`="math", `grade`=80
// INSERT INTO `grades`(`surname`, `givenname`, `course`, `grade`) 
//     VALUES ("Ong", "Jennifer", "math", 80), ("Lee","David","math",90)

server.post('/api/grades', (request, response)=>{
    // check the body object and see if any data was not sent
    if(request.body.name===undefined || request.body.course===undefined || request.body.grade=== undefined){
        // response to the client with an appropriate error message
        response.send({
            success: false,
            error: 'invalid name, course, or grade'
        });
        // return nothing to the server
        return;
    }
    // response.send(request.body);//body is from postman 
    // connect to the database
    db.connect(()=>{
        const name= request.body.name.split(" "); //will give array of first name and last name, split based on space
        const query= 'INSERT INTO `grades` SET `surname` = "'+name[1]+'", `givenname`= "'+name[0]+'", `course`="'+request.body.course+'", `grade`="'+request.body.grade+'", `added`=NOW()'
        // console.log(query);
        db.query(query, (error, result)=>{
            if(!error){
                response.send({
                    success: true,
                    new_id: result.insertId
                })
            }else{
                response.send({
                    success: false,
                    error//es6 structuring allows to use error by itself instead of error: error
                })
            }
        })
    })
})

server.delete('/api/grades', (request, response)=>{
    // console.log(request.query);
    // query is all the data in the query string http://localhost:3001/api/grades?student_id=10 so student_id=10
    // response.send(request.query); //closes the connection before the endpoint
    if(request.query.student_id===undefined){
        response.send({
            success: false,
            error: 'must provide a student id for delete'
        });
        return;
    }
    db.connect(()=>{
        const query='DELETE FROM `grades` WHERE `id`= "' +request.query.student_id+'"';

        db.query(query, (error, result)=>{
            if(!error){
                response.send({
                    success:true,
                })
            }else{
                response.send({
                    success: false,
                    error
                })
            }
        })
    })


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
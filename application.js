
const redis = require("redis");
const redisclient = redis.createClient();

// var express = require("express");
// var app = express();
// app.listen(3000, () => {
//  console.log("Server running on port 3000");
// });

(async () => {
    await redisclient.connect();
})();
 
redisclient.on("ready", () => {
    console.log("Connected to Redis Client!");
});

/*console.log("Connecting to the Redis");
  

  
redisclient.on("error", (err) => {
    console.log("Error in the Connection");
});*/



// redisclient.lRange('my_key',0,-1,function(err,reply){
//     console.log(reply); 
// })

var express = require('express');
const { response } = require("express");

var app = express();


const reqdata = function(req,res,next){

    try {
        console.log(req.headers)
        var request = {
            correlationId : Math.random(),
            body: req.body,
            headers: req.headers,
            url: req.url
        }
        var req1 = JSON.stringify(request);
        console.log(req1);

        
    
        redisclient.rPush('my_key',req1,function(err,reply){
        console.log(reply);    
        })    
    }

       catch(error) {
        console.error(error);
      } 
      //resdata(correlationId) ;
      /*finally {
        res.send("Request data succes"); 
        
      }*/
      next(); 
    
}


const resdata = function(req,res){
    
    
    try {
        var response = {
            body : res.body, 
            headers : res.header,
            correlationId: reqdata.correlationId
        
        
        
                
            }
        
            var res1 = JSON.stringify(response)
            console.log(res1)
            redisclient.rPush('my_key',res1,function(err,reply){
                console.log(reply);    
                })  


        
    }

       catch(error) {
        console.error(error);
      }

}


app.use(reqdata) ; 

app.use(resdata) ; 


app.get('/', function (req, res) {
    console.log(req.headers);
 //   console.log(req.body);
 
   //
   
   res.header('time', 12345);

    res.send('Hello World');

res.send('Simple Web Application is UP');

});







app.get('/redis',function(req,res){

    
      res.send("Req and Response data stored in Elastic search") ;
    
       
    });



app.listen(8081, function () {

console.log('Simple Web Application running on port 8081!');

});



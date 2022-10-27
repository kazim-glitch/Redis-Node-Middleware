
const redis = require("redis");
const redisclient = redis.createClient();
const fs = require('fs');

var uuid = require('uuid');


(async () => {
    await redisclient.connect();
})();
 
redisclient.on("ready", () => {
    console.log("Connected to Redis Client!");
});

var express = require('express');
const { response } = require("express");
const bodyParser = require('body-parser');

var app = express();


const reqdata = function(req,res,next){

    var req_type = "Request"
    req.correlationId = uuid.v1();
    try {
        console.log(req.headers)
        var request = {
            correlationId:req.correlationId,
            body: req.body,
            status:req_type,
            headers: req.headers,
            url: req.url,
            method:req.method
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

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())



app.use(reqdata,function(req,res,next){

    console.log("Sending and pushing request data and headers"); 
    next(); 
}) ; 
//app.use(express.json())



app.get('/', function (req, res) {
    console.log(req.headers);
 //   console.log(req.body);
 
   //
   
   res.header('time', 12345);

    res.send('Hello World');

res.send('Simple Web Application is UP');

});



app.use(function(req, res, next){
    res.on('finish', function(){
          console.log("~~~~~~~~~~~~~~RESPONSE~~~~~~~~~~~~~~~~");
        //console.log(res.data1);
       
        console.log(res.data2)

        

        redisclient.rPush('my_key',res.data2,function(err,reply){
        console.log(reply) ; 
        })
    });


    next();
  });


    app.post('/api/v1/Benificiaries',function(req,res,next){
      
        var data = fs.readFileSync('data.json');
        var myObject= JSON.parse(data);
    
        res.data1= myObject; 
        console.log('sending data');

        var res_type = "Response"


        var response = {
            
            
            correlationId: req.correlationId,
            body : res.data1, 
            method:res.method,
            status:res_type,
            headers : res.headers,
            Code:res.statusCode
            }
            
            res.data2 = JSON.stringify(response)
            
        
        res.send("Req and Response data stored in Elastic search");
        
        next(); 
    
    }); 

    app.get('/api/v1/Benificiaries',function(req,res,next){
        var data = fs.readFileSync('data.json');
        var myObject= JSON.parse(data);
        res.data1= myObject; 
        var response = {
            correlationId: req.correlationId,
            body:res.data1,
            headers : res.headers,
            Code:res.statusCode,
            method:res.method
            }
        res.data2 = JSON.stringify(response)
        res.send("Benificiaries details"); 
        next(); 
    })


  //  app.use(resdata) ; 

app.listen(8081, function () {

console.log('Simple Web Application running on port 8081!');

});



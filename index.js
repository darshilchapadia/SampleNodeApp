var express = require('express');
var app = express();
var fileSystem = require('jsonfile');
var jsonFile = 'counter.json'

var auth = require('http-auth');
var basic = auth.basic({
        realm: "DemoAuth"
    }, (username, password, callback) => {              	
		callback(username === "Darshil" && password === "test123");
    }
);

app.use(auth.connect(basic));

var counter = 0;
fileSystem.readFile(jsonFile,function(err,obj){
		if(err)
			console.log("Error",err);
		else{		
			counter = parseInt(obj.counter);
		}
	})

app.get('/me', function(req, res){
	
	counter += parseInt(req.query.increment);	
	setTimeout(function(){
		res.send({
			User : req.user, 
			Delay : req.query.delay, 
			Increment:counter
		});
	}, req.query.delay*1000);

	var obj = {"counter" : counter};	
	fileSystem.writeFile(jsonFile, obj,function(err){
		if(err)
			console.log("Error",err);				
	});
});

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
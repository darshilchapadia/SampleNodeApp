var express = require('express');
var app = express();

var auth = require('http-auth');
var basic = auth.basic({
        realm: "DemoAuth"
    }, (username, password, callback) => {              	
		callback(username === "Darshil" && password === "test123");
    }
);

app.use(auth.connect(basic));

app.get('/me', function(req, res){	
	setTimeout(function(){res.send({User : req.user, Delay : req.query.delay, Counter:req.query.counter});}, req.query.delay*1000);    		
});

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
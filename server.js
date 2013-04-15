var express = require('express')
, swig = require('swig')
, cons = require('consolidate')
var app = express();


app.configure(function(){

	app.use(express.bodyParser());

	// serve static files
	app.use("/public", express.static(__dirname + '/public'));

	app.engine('.html', cons.swig);
	app.set('view engine', 'html');

	// NOTE: Swig requires some extra setup
	// This helps it know where to look for includes and parent templates
	swig.init({
		root: __dirname + '/views',
	    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
	});

});





app.get('/', function(req, res){

	res.render("index.html", { 
		params: req.body
	});
	
});

app.post('/mail', function(req, res){


	if(req.body.name && req.body.message) {

		res.render('email.html',{
			params: req.body
		});

	} else {
		res.location('/');
		res.render("index.html", { 
			params: req.body,
			scrollTo: 'formButtonSendMessage'
		});
	}	

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log("Listening on " + port);
});
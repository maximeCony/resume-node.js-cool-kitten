var express = require('express')
, swig = require('swig')
, cons = require('consolidate')
,SendGrid = require('sendgrid').SendGrid

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


var sendgrid = new SendGrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

app.get('/', function(req, res){

	res.render("index.html", { 
		params: req.body
	});
	
});

app.post('/mail', function(req, res){


	if(req.body.name && req.body.message) {

		sendgrid.send({
			to: 'maxime.cony@gmail.com',
			from: 'app14916551@heroku.com',
			subject: 'Message from resume',
			text: req.body
		}), function(success, message) {
			if (!success) {
				console.log(message);
			}
			res.redirect('/');
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
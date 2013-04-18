var express = require('express')
, swig = require('swig')
, cons = require('consolidate')
,SendGrid = require('sendgrid').SendGrid

var app = express();

//mailing configuration
var sendgrid = new SendGrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

//global configuration
app.configure(function(){

	//used to parse forms
	app.use(express.bodyParser());

	// serve static files
	app.use("/public", express.static(__dirname + '/public'));

	//set swig as view engine
	app.engine('.html', cons.swig);
	app.set('view engine', 'html');

	//swig configuration
	swig.init({
		root: __dirname + '/views',
	    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
	});

});


//get main page
app.get('/', function(req, res){

	res.render("index.html", { 
		params: req.body
	});
	
});

//post mail (on form submit)
app.post('/mail', function(req, res){

	//required name and message
	if(req.body.name && req.body.message) {

		//render mail view
		app.render('email.html', { params: req.body }, function(err, html){
			
			//send the mail
			sendgrid.send({
				to: 'maxime.cony@gmail.com',
				from: 'contact@maxime-cony.com',
				subject: 'Message from your resume',
				html: html
			}, function(success, message) {
				if (!success) {
					console.log(message);
				} else {
					console.log('Message send!');
				}
			});
		});
		//redirect user to the main page
		res.redirect('/');

	} else {
		//redirect user to the main page
		res.location('/');

		//render the wiew with fields content
		res.render("index.html", { 
			params: req.body,
			scrollTo: 'formButtonSendMessage'
		});
	}	

});

//start listening
var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log("Listening on " + port);
});
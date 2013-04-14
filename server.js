var express = require('express')
, swig = require('swig')
, cons = require('consolidate')
,Recaptcha = require('recaptcha').Recaptcha
var app = express();


var PUBLIC_KEY  = process.env.RECAPTCHA_PUBLIC_KEY || '6Lf7198SAAAAAL3r8tq1sCXfmneWmAcweNv2_JlW',
PRIVATE_KEY = process.env.RECAPTCHA_PRIVATE_KEY || '6Lf7198SAAAAAEENUeuklL4S4Wwcnm8DcaetO04W';

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

	var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY);
	
	res.render("index.html", { 
		captcha: recaptcha.toHTML(),
		params: req.body
	});
	
});

app.post('/mail', function(req, res){


	if(req.body.email && req.body.name && req.body.message) {

		var data = {
			remoteip:  req.connection.remoteAddress,
			challenge: req.body.recaptcha_challenge_field,
			response:  req.body.recaptcha_response_field
		};
		var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY, data);

		recaptcha.verify(function(success, error_code) {
			if (success) {
				res.render('email.html',{
					params: req.body
				});
			}
			else {
				res.location('/');
				res.render("index.html", { 
					captcha: recaptcha.toHTML(),
					params: req.body,
					scrollTo: 'formButtonSendMessage'
				});
			}
		});
	} else {
		res.render("index.html");
	}	
	
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log("Listening on " + port);
});
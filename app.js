(function() {
  //Module dependencies.
  var app, express;
  express = require('express');
  
  //Configuration
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });
  
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  
  //Routes
  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Vertex.IO'
    });
  });
  
  
  var check = require('validator').check;
  app.post('/signup', function(req, res) {
    // setTimeout(function() {
    var email = req.body.email;
    var rets = {
      success: false,
      errors: []
    };

    try {
      check(email).len(6, 64).isEmail();
      rets.success = true;
    } catch (err) {
      rets.errors.push("Invalid Email");
      rets.success = false; //not necessary
    }

    res.send(rets);
    //},2000);
  });
  
  //Only listen on $ node app.js
  if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
  }
}).call(this);

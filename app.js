(function() {
  //Module dependencies.
  var app,
    express = require('express'),
    cradle = require('cradle'),
    db = new(cradle.Connection)().database('vio_signups'),
    port = (process.env.PORT || 3000),
    analyticssiteid = "2UA-XXXXX-X";
  
  //Configuration
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/public'));
    return app.use(app.router);
  });
  
  // app.configure('development', function() {
  //     return app.use(express.errorHandler({
  //       dumpExceptions: true,
  //       showStack: true
  //     }));
  //   });
  // 
  //   app.configure('production', function() {
  //     return app.use(express.errorHandler());
  //   });
  
  //Setup the errors
  //TODO: define within configure() blocks to provide
  // introspection when in the development environment
  app.error(function(err, req, res, next){
    if (err instanceof NotFound) {
      res.render('404', { 
        status: 404, 
        title: 'Not Found',
        error: err,
        layout: 'layouts/error',
        analyticssiteid: analyticssiteid
      });
    } else {
      next(err);
    }
  });
  
  app.error(function(err, req, res){
    res.render('500', { 
      status: 500, 
      title: 'The Server Encountered an Error',
      error: err,
      layout: 'layouts/error',
      analyticssiteid: analyticssiteid
    });
  });
  
  ///////////////////////////////////////////
  //              Routes                   //
  ///////////////////////////////////////////

  /////// ADD ALL YOUR ROUTES HERE  /////////
  
  app.get('/', function(req, res) {
    
    return res.render('index', {
      title: 'Vertex.IO',
      layout: 'layouts/app',
      analyticssiteid: analyticssiteid
      // TODO: set this as default layout, instead of ./layout
    });
  });
  
  var check = require('validator').check;
  app.post('/invitation/request', function(req, res) {

    var email = req.body.email;
    var rets = {
     success: false,
     errors: []
    };
    
    // check if hidden field filled in by bot
    var confuca = req.body.confuca;
    if (confuca.length > 0) {
      rets.errors.push("You're a bot! :o");
      res.send(rets);
      return;
    }
    
    // get users ip address
    var ip_address = null, user_agent = null;
    ip_address = req.connection.remoteAddress;
    user_agent = req.headers['user-agent'];
    
    try {
     check(email).len(6, 64).isEmail();

     //TODO: add better email check

     // check if email already exists in db
     db.get(email, function(err, doc) {
       if (doc) {
         // already exists
         rets.success = true;
         rets.repeat = true;
         res.send(rets);
       } else {
         // save it
         db.save(email, {
           ip_address: ip_address,
           user_agent: user_agent
         }, function (err, dbRes) {
           if (err) {
              // Handle error
              rets.success = false;
            } else {
              // Handle success
              rets.success = true;
            }
            res.send(rets);
          });
       }
     });
    } catch (err) {
     rets.errors.push("Please enter a <span>valid</span> email.");
     rets.success = false; //not necessary
     res.send(rets);
    }
  });
  
  app.get('/404', function(req, res){
    throw new NotFound(req.url);
  })
  
  //A Route for Creating a 500 Error (Useful to keep around)
  app.get('/500', function(req, res){
      next(new Error('keyboard cat!'));
  });
  
  //The 404 Route (ALWAYS Keep this as the last route)
  app.get('/*', function(req, res){
    throw new NotFound;
  });
  
  // Provide our app with the notion of NotFound exceptions

  function NotFound(path){
    this.name = 'NotFound';
    if (path) {
      Error.call(this, 'Cannot find ' + path);
      this.path = path;
    } else {
      Error.call(this, 'Not Found');
    }
    Error.captureStackTrace(this, arguments.callee);
  }

  /**
   * Inherit from `Error.prototype`.
   */

  NotFound.prototype.__proto__ = Error.prototype;
  
  //Only listen on $ node app.js
  if (!module.parent) {
    app.listen(port);
    console.log("Express server listening on port %d", app.address().port);
  }
}).call(this);

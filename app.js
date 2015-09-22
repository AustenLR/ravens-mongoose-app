var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require("./models");
var methodOverride = require("method-override");
var session = require("cookie-session");
var morgan = require("morgan");
var loginMiddleware = require("./middleware/loginHelper");
var routeMiddleware = require("./middleware/routeHelper");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  maxAge: 3600000,
  secret: 'illnevertell',
  name: "chocolate chip"
}));

// use loginMiddleware everywhere!
app.use(loginMiddleware);


app.get('/', routeMiddleware.ensureLoggedIn, function(req,res){
  res.render('users/index');
});

app.get('/signup', routeMiddleware.preventLoginSignup , function(req,res){
  res.render('users/signup');
});

app.post("/signup", function (req, res) {
  console.log('hi', req.body.user);
  var newUser = req.body.user; //grabbing the newUser info from the form from the User object
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user); //req.session.id = user._id; for the session/cookies
      res.redirect("/ravens");
    } else {
      console.log(err);
      res.render("users/signup"); //?? 3:38pm showing user page if there is an error? Why not an error page?
    }
  });
});

app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
  res.render("users/login");
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user, function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/ravens");
    } else {
      // TODO - handle errors in ejs!
      res.render("users/login");
    }
  });
});




app.get('/ravens',routeMiddleware.ensureLoggedIn, function(req,res){
  db.Raven.find({},function(err, ravens){
    err ? res.render('errors/404') : res.render('ravens/index', {ravens : ravens});
  });
});

app.get('/ravens/new', routeMiddleware.ensureLoggedIn, function(req,res){
  res.render('ravens/new');
});

app.post('/ravens',function(req,res){
  db.Raven.create(req.body, function(err){
    err? res.render('errors/404') : res.redirect('/ravens');
  });
});

app.delete('/ravens/:id', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Raven.findByIdAndRemove(req.params.id, function(err){
    err ? res.render('errors/404') : res.redirect('/ravens');
  });
});

app.get('/ravens/:id/edit', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Raven.findById(req.params.id, function(err, ravens){
    err ? res.render('errors/404') : res.render('ravens/edit', {ravens : ravens});
  });
});

app.put('/ravens/:id',function(req,res){
  db.Raven.findByIdAndUpdate(req.params.id, req.body, function(err){
    err ? res.render('errors/404') : res.redirect('/ravens');
  });
});

app.get('/ravens/:id', function(req,res){
  db.Raven.findById(req.params.id, function(err, ravens){
    err ? res.render('errors/404') : res.render('ravens/show', {ravens: ravens});
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get('*', function(req,res){
  res.render('errors/404');
});


app.listen(3000, function (){
  console.log('Server running on port 3000');
});

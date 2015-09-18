var express = require('express'),
  app = express(),
  bodyParser = require("body-parser");
  methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true})); 
app.use(methodOverride('_method'));

db = require('./models');

app.get('/',function(req,res){
  res.redirect('/ravens');
});

app.get('/ravens',function(req,res){
  db.Raven.find({},function(err, ravens){
    err ? res.render('404') : res.render('index', {ravens : ravens});
  });
});

app.get('/ravens/new',function(req,res){
  res.render('new');
});

app.post('/ravens',function(req,res){
  db.Raven.create(req.body, function(err){
    err? res.render('404') : res.redirect('/ravens');
  });
});

app.delete('/ravens/:id',function(req,res){
  db.Raven.findByIdAndRemove(req.params.id, function(err){
    err ? res.render('404') : res.redirect('/ravens');
  });
});

app.get('/ravens/:id/edit',function(req,res){
  db.Raven.findById(req.params.id, function(err, ravens){
    err ? res.render('404') : res.render('edit', {ravens : ravens});
  });
});

app.put('/ravens/:id',function(req,res){
  db.Raven.findByIdAndUpdate(req.params.id, req.body, function(err){
    err ? res.render('404') : res.redirect('/ravens');
  });
});

app.get('/ravens/:id', function(req,res){
  db.Raven.findById(req.params.id, function(err, ravens){
    err ? res.render('404') : res.render('show', {ravens: ravens});
  });
});




app.listen(3000, function (){
  console.log('Server running on port 3000');
});

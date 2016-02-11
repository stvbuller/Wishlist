var express = require('express')
var app = express()
var expressHandlebars = require('express-handlebars')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var PORT = 8000;
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
  host:'localhost',
  port:3306,
  user:'root',
  database:'wishlist'
});
app.get('/',function(req,res){
  connection.query("SELECT * FROM wishlist", function(err, results) {
    if(err) {
      throw err;
    }
    var data = {
      wish: results

    }
    res.render('home', data);
  });
});

app.post('/create', function(req, res) {
  console.log(req.body.item);
  var mySQLQuery = "INSERT INTO wishlist (item) VALUES ('" + req.body.item + "')";

  connection.query(mySQLQuery, function(err) {
    if (err) {
      throw err
    }
    res.redirect('/');
  });
});

app.get('/delete/:id', function(req, res) {
  var mySQLQuery = "DELETE FROM wishlist WHERE id=" + req.params.id;

  connection.query(mySQLQuery, function(err) {
    if (err) {
      throw err
    }
    res.redirect('/');
  });
});

app.post('/update/:id', function(req, res) {
  var mySQLQuery = "UPDATE wishlist SET item=" + connection.escape(req.body.item) + " WHERE id=" + connection.escape(req.params.id);

  connection.query(mySQLQuery, function(err) {
    if (err) {
      throw err
    }
    res.redirect('/');
  });
});

app.listen(PORT, function(){
  console.log('Listening on %s', PORT)
})

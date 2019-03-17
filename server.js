const { MongoClient, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
const port = 3000

var url = "mongodb://localhost:27017/musicdb";
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit', function(req, res){
    var details = req.body;
    console.log(details);
    MongoClient.connect(url, function(err, client) {
        if(!err) {
        console.log("We are connected");
        var db = client.db('musicdb');
        db.collection('songs').insertOne({
            Song: details.song,
            Artist: details.artist,
            Upvotes: 0
        });
        console.log("Inserted");
        }
        client.close();
        res.redirect('/list');
    });
});


app.get('/list', function(req, res){
    MongoClient.connect(url, (err, client) => {
      if (err) {
        return console.log('Unable to connect');
      }
      console.log('Connected to Mongo Database Server');
      const db = client.db('musicdb');
      db.collection("songs").find({}).sort({Upvotes: -1}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
        client.close();
    });
});

app.post('/upvote', function(req, res) {
    // var id = req.body.id
    console.log(req.body.id);
    res.send("LOL");
    MongoClient.connect(url, function(err, client) {
      if (err) throw err;
      const db = client.db("musicdb");
      db.collection("songs").updateOne(
        { "_id": ObjectId(req.body.id.toString()) },
        { $inc: { "Upvotes": 1 } }
      );
    });
});

app.post('/play', function(req, res) {
    console.log(req.body.id.toString());
    res.send("LOL");
    MongoClient.connect(url, function(err, client) {
      if (err) throw err;
      const db = client.db("musicdb");
      var query = {"_id": ObjectId(req.body.id.toString())};
      db.collection("songs").deleteOne(query, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
      });
      client.close();
    });
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

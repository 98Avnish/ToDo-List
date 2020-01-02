const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js');
//const database = require(__dirname+'/database.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express();
app.listen(3000, function() {
  console.log("Server started on port: 3000");
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
mongoose.connect('mongodb://app-todolist:password-todolist@cluster0-shard-00-00-bjhdm.mongodb.net:27017,cluster0-shard-00-01-bjhdm.mongodb.net:27017,cluster0-shard-00-02-bjhdm.mongodb.net:27017/testDB', {
  keepAlive: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

const itemSchema = new Schema({
  itemName: {
    type: String,
    required: true
  }
});

const Item = mongoose.model("Item", itemSchema);


//Home
app.get("/", function(req, res){
  Item.find({}, function(err, foundItems){
    if(err){
      console.log("Error in finding items : "+ err);
    } else {
      res.render("index.ejs", {
        listTitle: date.getDate(),
        items: foundItems
      });
    }
  });
});


//Added
app.post("/add", function(req, res){
  const newItem = req.body.newItem;
  const listTitle = req.body.listTitle;
  const addItem = new Item({itemName: newItem});
  addItem.save().then(() => console.log("Saved Item : "+ newItem));
  res.redirect("/");
});

//Delete
app.post("/delete", function(req, res){
  const deleteItemId = req.body.deleteItem;
  Item.findByIdAndRemove(deleteItemId, function(err, item){
    if(err){
      console.log("Error while deleting : "+ err);
    } else {
      console.log("Deleted item : "+ item);
    }
    res.redirect("/");
  });
});

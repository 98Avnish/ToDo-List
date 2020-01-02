const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js');
//const database = require(__dirname+'/database.js');
const _ = require('lodash');
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
mongoose.connect('mongodb://localhost:27017/testDB', {
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

const listSchema = new Schema({
  listName: {
    type: String,
    required: true
  },
  listItems: [itemSchema]
});

const Item = mongoose.model("Item", itemSchema);

const List = mongoose.model("List", listSchema);

const today = date.getDate();


//Home
app.get("/", function(req, res) {
  Item.find(function(err, items){
    if(err){
      console.log(err);
    } else {
      res.render("index.ejs", {
        listTitle: today,
        items: items
      });
    }
  });
});

//Custom get
app.get("/:customListTitle", function(req, res){
  const customListTitle = _.capitalize(req.params.customListTitle);
  List.findOne({listName: customListTitle}, function(err, list){
    if(!err){
      if(!list){
        const newList = new List({
          listName: customListTitle,
          listItems: []
        });
        newList.save();
        console.log("New List Created : " + customListTitle);
        res.redirect("/"+customListTitle);
      } else {
        res.render("index.ejs",{
          listTitle: list.listName,
          items: list.listItems
        });
      }
    }
  });
});



//Post
app.post("/add", function(req, res) {
  const newItem = req.body.newItem;
  const listTitle = req.body.listTitle;
  const addItem = new Item({itemName: newItem});
  if(listTitle === today){
    addItem.save();
    console.log("Saved Item : "+ newItem);
    res.redirect("/");
  } else {
    List.findOne({listName: listTitle}, function(err, list){
      if(!err){
        list.listItems.push(addItem);
        list.save().then(() => console.log("Saved "+ addItem +" in list "+listTitle));
        res.redirect("/"+listTitle);
      }
    });
  }

});

//Delete
app.post("/delete", function(req, res){
  const deleteItemId = req.body.deleteItemId;
  const listTitle = req.body.listTitle;
  if(listTitle === today){
    Item.deleteOne({_id: deleteItemId}, function(err){
      if(!err){
        console.log("deleted id : "+deleteItemId);
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({listName: listTitle},
      {$pull: {listItems: {_id: deleteItemId}}},
      function(err, list){
        if(!err){
          console.log("Deleted : "+deleteItemId+" from list "+listTitle);
          res.redirect("/"+listTitle);
        }
      });
  }
});

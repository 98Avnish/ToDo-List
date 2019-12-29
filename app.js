const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js');
//const database = require(__dirname+'/database.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testDB', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const Item = mongoose.model("Item", {
   name: {
    type: String,
    required: true
   }
 });

const app = express();
app.listen(3000, function() {
  console.log("Server started on port: 3000");
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

let workItems = [];

//Home
app.get("/", function(req, res) {
  const itemsArray = [];
  Item.find(function(err, items){
    if(err){
      console.log(err);
    } else {
      items.forEach(item => {
        itemsArray.push(item.name);
      });
      res.render("index.ejs", {
        listTitle: date.getDate(),
        items: itemsArray
      });
    }
  });
});

//WorkList
app.get("/work", function(req, res) {
  res.render("index.ejs", {
    listTitle: "WorkList",
    items: workItems,
    listSize: workItems.length
  });
});

//Post
app.post("/", function(req, res) {
  if(req.body.button === "WorkList") {
    workItems.push(req.body.newItem);
    console.log(workItems);
    res.redirect("/work");
  } else {
      const item = new Item({
        name: req.body.newItem
      });
      item.save().then(() => console.log("Saved : " + item));
      res.redirect("/");
  }
});

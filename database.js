// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/testDB', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
//
// const Item = mongoose.model("Item", {
//    name: {
//     type: String,
//     required: true
//    }
//  });
//
//  exports.addItem = function(name){
//    const item = new Item({
//      name: name
//    });
//    item.save().then(() => console.log("Saved : " + item));
//  }
// 
//  exports.getItems = function(){
//    const itemsArray = [];
//    Item.find(function(err, items){
//      if(err){
//        console.log(err);
//      } else {
//        console.log("Items : "+items);
//        items.forEach(item => {
//          itemsArray.push(item.name);
//        });
//        console.log("Array : "+itemsArray);
//        return items;
//      }
//
//    });
//  }

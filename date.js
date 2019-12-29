exports.getDate = function(){
  let options = { weekday: 'long', month: 'long', day: 'numeric' };
  let data = new Date();
  return data.toLocaleDateString("en-US", options);
}

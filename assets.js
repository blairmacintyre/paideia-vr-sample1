var express = require('express');
var fs = require('fs');

var router = express.Router();
var content = fs.readFileSync('.glitch-assets', 'utf8');
var str = content.split("\n").join(",\n");
var elems = JSON.parse('{"elems":[' + str + "{}]}").elems;
elems.pop(); // get rid of that last empty element

var myAssets = {};
for (var val of elems) {
    myAssets[val.uuid] = val;
}
console.log(myAssets); 
// Example url
// https://cdn.gomix.com/us-east-1%3A1a0f89c8-26bf-4073-baed-2b409695e959%2Ffoobar.png

// For some reason the .glitch-assets file is not parseable by JSON.parse :|
router.use((request, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  console.log(request.path);
  var name = request.path.substring(1); // get rid of leading /.  used to be encodeURIComponent(request.path) + '"';
  console.log(name)
  
  for (val in myAssets) {
      if (myAssets.hasOwnProperty(val)) {
        var e = myAssets[val];
        if (e.hasOwnProperty("name") && e.name === name) {
          return response.redirect(e.url);          
        }          
      }
  }

  return response.sendStatus(404);    
  // var index = content.indexOf(name);
  // if (index < 0) {
  //   return response.sendStatus(404);
  // }
  // var startIndex = index - 1;
  // while (startIndex >= 0) {
  //   if (content[startIndex] === '"') {
  //     break;
  //   }
  //   startIndex -= 1;
  // }
  // if (startIndex === 0) {
  //   return response.sendStatus(503);
  // }
  // startIndex += 1;
  // var endIndex = index + name.length - 1;
  // var url = content.substring(startIndex, endIndex);
  // return response.redirect(url);
});

module.exports = router;
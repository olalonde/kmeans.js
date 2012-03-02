var fs = require('fs'),
  path = require('path'),
  exec = require('child_process').exec;

// Parse raw data
function raw_data_to_array(raw_data) {
  var observations = [];
  var new_line = '\n';
  var line = '';
  for(var i = 0; i < raw_data.length; i++) {
    var char = raw_data[i];

    if(char == new_line) {
      var observation = line.trim().split(/\s+/);
      for(var j in observation) {
        observation[j] = parseFloat(observation[j]);
      }
      line = '';
      observations.push(observation);
      continue;
    }
     line += char;
  }
  return observations;
}

function array_to_csv(vectors) {
  var output = '';
  for(var i in vectors) {
    var components = vectors[i];
    var line = '';
    var delim = '';
    for(var j in components) {
      line += delim + components[j];
      delim = ',';
    }
    output += line + '\n';
  }
  return output;
}

var filename = process.argv[2];

if(!filename) {
  console.log('You must provide a filename as the first argument.');
  process.exit(-1);
}

var raw_data = fs.readFileSync(filename).toString();
var data = raw_data_to_array(raw_data);

console.log(array_to_csv(data));


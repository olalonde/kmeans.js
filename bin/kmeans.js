var kmeans = require('../lib/kmeans'),
  vector = require('../lib/vector'),
  utils = require('../lib/utils'),
  fs = require('fs'),
  path = require('path'),
  exec = require('child_process').exec;

// Parse raw data
function raw_data_to_array() {
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

// Output data to filesystem
function save_iteration(iteration, folder) {
  folder = folder || './out/';
  if(!require('path').existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  for(var i in iteration.clusters) {
    fs.writeFileSync(folder + 'cluster' + i + '.csv', array_to_csv(iteration.clusters[i]));
  }
  fs.writeFileSync(folder + 'means.csv', array_to_csv(iteration.means));
}


var filename = process.argv[2];
var k = parseInt(process.argv[3]) || 3;

if(!filename) {
  console.log('You must provide a filename as the first argument.');
  process.exit(-1);
}

console.log('filename: ' + filename);
console.log('k: ' + k);


var raw_data = fs.readFileSync(filename).toString();

if(filename.substr(filename.length - 4, 4) === '.csv')
  var data = utils.CSVToArray(raw_data, ',', true);
else
  var data = raw_data_to_array(raw_data);

console.log(data);
var km = kmeans.create(data, k);
var res = km.process();

console.log('Finished after %s iterations', km.iterationCount());
//console.log(res.clusters());

// Clean out/
exec('rm -rf ./out/iteration*',
     function (error, stdout, stderr) {
       for(var i = 0; i < km.iterationCount(); i++) {
         save_iteration(km.iteration(i), './out/iteration' + i + '/');
       }
     });

var kmeans = require('../lib/kmeans'),
  vector = require('../lib/vector'),
  fs = require('fs'),
  path = require('path'),
  exec = require('child_process').exec;

// Parse raw data
function raw_data_to_vector_array() {
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
      observations.push(vector.create(observation));
      continue;
    }
     line += char;
  }
  return observations;
}

function vectors_to_csv(vectors) {
  var output = '';
  for(var i in vectors) {
    var components = vectors[i].getComponents();
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
  if(!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  var means = [];
  for(var i in iteration) {
    var c = iteration[i];
    means.push(c.mean);
    fs.writeFileSync(folder + 'cluster' + i + '.csv', vectors_to_csv(c.vectors));
  }
  fs.writeFileSync(folder + 'means.csv', vectors_to_csv(means));
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
var vectors = raw_data_to_vector_array(raw_data);

//console.log(observations);
var res = kmeans.process(vectors, k);

console.log('Finished after %s iterations', res.iterationCount);
//console.log(res.clusters());

// Clean out/
exec('rm -rf ./out/iteration*',
  function (error, stdout, stderr) {
    for(var i in res.iterations) {
      save_iteration(res.iterations[i], './out/iteration' + i + '/');
    }
});

//algo.step()
//res.iterationCount;
//res.iterations;

//res.iteration(0).clusters[0].vectors;
//res.iteration(0).clusters[0].mean;
//res.iteration(0).clusters;

//res.clusters // ommit .iteration implies .iteration(res.iterationCount-1)

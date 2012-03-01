var kmeans = require('../lib/kmeans'),
  vector = require('../lib/vector'),
  fs = require('fs');

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

console.log(res.clusters());

// Output data to filesystem
var means = [];
for(var i in res.clusters()) {
  var c = res.clusters()[i];
  means.push(c.mean);
  fs.writeFileSync('./out/cluster' + i + '.csv', vectors_to_csv(c.vectors));
}
fs.writeFileSync('./out/means.csv', vectors_to_csv(means));

//algo.step()
//res.iterationCount;
//res.iterations;

//res.iteration(0).clusters[0].vectors;
//res.iteration(0).clusters[0].mean;
//res.iteration(0).clusters;

//res.clusters // ommit .iteration implies .iteration(res.iterationCount-1)

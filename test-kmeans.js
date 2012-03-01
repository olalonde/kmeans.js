var kmeans = require('./k-means'),
  Vector = require('./vector'),
  fs = require('fs');

var filename = process.argv[2] || 'data100.txt';
var k = parseInt(process.argv[3]) || 3;

console.log('filename: ' + filename);
console.log('k: ' + k);

var new_line = '\n';
var raw_data = fs.readFileSync(filename).toString();
var observations = [];

// Parse raw data
var line = '';
for(var i = 0; i < raw_data.length; i++) {
  var char = raw_data[i];

  if(char == new_line) {
    var observation = line.trim().split(/\s+/);
    for(var j in observation) {
      observation[j] = parseFloat(observation[j]);
    }
    line = '';
    observations.push(new Vector(observation));
    continue;
  }
   line += char;
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

var res = kmeans.k(k).process(observations);
var clusters = res.clusters;
var means = res.means;

fs.writeFileSync("./out/means.csv", vectors_to_csv(means));
for(var i in clusters) {
  var csv = vectors_to_csv(clusters[i]);
  fs.writeFileSync("./out/cluster" + i + ".csv", csv);
}

# Usage #

var kmeans = require('kmeans');
var km = kmeans.create([
  [1, 2],
  [5, 4],
  [2, 5],
  [8, 4]
], 3);

var result = km.process();

console.log(result.means);
console.log(result.clusters);

## Under the hood ##
for(var i = 0; i < km.iteratoinCount(); i++) {
  // clusters and means generated at iteration i
  console.log(km.iteration(i));
}

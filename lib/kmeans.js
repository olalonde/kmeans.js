var vector = require('./vector');
// todo: should accept array and then convert to vectors internally
var Kmeans = function(vectors, k) {
  this.vectors = vectors;
  this.k = k;
  this.dimension = vectors[0].getDimension();
  this.iterations = [];
  this.iterationCount = 0;
}

Kmeans.prototype = {
  process: function() {
    for(var i = 0; i < 100; i++) { // until it converges in fact...
      this.iterate();
      return this;
    }
    return this;
  }
  ,
  iteration: function(index) {
    return this.iterations[index];
  }
  ,
  previousIteration: function() {
    return this.iterations[this.iterationCount-2];
  }
  ,
  clusters: function() {
    return this.iterations[this.iterationCount-1];
  }
  ,
  iterate: function() {
    // 1. Get means
    // first iteration
    if(this.iterationCount === 0) {
      // generate random K means
      var means = this.generateRandomMeans();
    }
    else {
      // generate K means from previous cluster's centroids
      var means = [];
      for(var i = 0; i < this.k; i++) {
        var mean = vector.getCentroid(this.previousIteration().clusters[i].vectors);
        means.push(mean);
      }
    }
    // 2. Form clusters
    // Initialize clusters data structure
    var clusters = [];
    for(var i = 0; i < this.k; i++) 
      clusters.push({mean: means[i], vectors: []});
    // For each vector, find which mean is closest to him and put him in appropriate cluster
    for(var i in this.vectors) {
      var v = this.vectors[i];
      // Compare distance with all means
      var min = v.getDistanceTo(means[0]);
      var cluster = 0;
      for(var j = 1; j < means.length; j++) {
        var d = v.getDistanceTo(means[j]);
        if(d < min) {
          min = d;
          cluster = j;
        }
      }
      clusters[cluster].vectors.push(v);
    }
    this.iterations.push(clusters);
    this.iterationCount++;
  }
  , 
  generateRandomMeans: function() {
    var box = vector.getBoundingBox(this.vectors);
    var means = [];
    // Find K means
    for(var i = 0; i < this.k; i++) {
      var random_point = [];
      // Generate a random vector component for each dimension
      for(var j = 0; j < this.dimension; j++) {
        var c = box.min[j] + Math.random() * (box.max[j] - box.min[j]); // number between min-max
        random_point.push(c);
      }
      means.push(vector.create(random_point));
    }
    return means;
  }
}

exports.process = function(data, k) {
  k = k || 3;
  var km = new Kmeans(data, k);
  km.process();
  return km;
}

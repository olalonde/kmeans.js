// browser compatibility
(function (module, vector) {
  var exports = module.exports;
// /browser compatibility

  // utility function, returns true if arr1 is equal to arr2
  function arrays_are_equivalent(arr1, arr2, ret) {
    if(ret === undefined) ret = true;
    if(arr1.length != arr2.length) return false;
    arr1.forEach(function(ele, i) {
      if(ele instanceof Array) {
        ret = ret && arrays_are_equivalent(ele, arr2[i]);
      }
      else if(ele !== arr2[i]) {
        ret = false;
        return;
      }
    });
    return ret;
  }

  var Kmeans = function(observations, k) {
    this._observations = observations;
    this._k = k || 3;
    this._iterations = []; // collection of iteration objects
  }

  Kmeans.prototype = {
    process: function() {
      // iterate until generated means converged
      while(this._iterate()) {
        //console.log(this._lastIteration());
      }
      return this._lastIteration();
    }
    ,
    iterationCount: function() {
      return this._iterations.length;
    }
    ,
    iteration: function(i) {
      return this._iterations[i];
    }
    ,
    _lastIteration: function() {
      return this._iterations[this._iterations.length - 1];
    }
    ,
    _generateClusters: function(means) {
      // Initialize clusters data structure
      var clusters = [];
      for(var i = 0; i < this._k; i++) { clusters.push([]); }

      // For each observation, find out which mean is closest to him and put him in a
      // corresponding cluster
      for(var i in this._observations) {
        var observation = this._observations[i];
        // Compare distance with all means
        var cluster = 0;
        for(var j in means) {
          var d = vector(observation).getDistanceTo(vector(means[j]));
          if(j == 0 || d < min_d) {
            min_d = d;
            cluster = j;
          }
        }
        clusters[cluster].push(observation);
      }
      return clusters;
    }
    ,
    _generateMeansRandomly: function() {
      var box = vector.getBoundingBox(this._observations);
      var means = [];
      // Find K means
      for(var i = 0; i < this._k; i++) {
        var mean = [];
        // Generate a random vector component for each dimension
        box.min.each(function(min_c, j) {
          var max_c = box.max.getComponent(j);
          var c = min_c + Math.random() * (max_c - min_c); // number between min-max
          mean.push(c);
        });
        means.push(mean);
      }
      return means;
    }
    ,
    _generateMeansFromClusters: function(clusters) {
      var means = [];
      clusters.forEach(function(cluster, i) {
        if(cluster.length === 0)
          var mean = null;
        else
          var mean = vector.getCentroid(cluster).getComponents();
        means.push(mean);
      });
      return means;
    }
    ,
    _iterate: function() {
      // 1. Grab some means
      if(this._iterations.length == 0) {
        var means = this._generateMeansRandomly();
      }
      else {
        var means = this._generateMeansFromClusters(this._lastIteration().clusters);

        // If some clusters were empty, thry generated a null mean
        // In this case, keep mean from last iteration
        var that = this;
        means.forEach(function(mean, i) {
          if(mean === null) 
            means[i] = that._lastIteration().means[i];
        });

        // If means are identical to last iteration, we reached the end 
        if(arrays_are_equivalent(means, this._lastIteration().means))
          return false;
      }
      console.log('Iteration ' + this.iterationCount() + ' means');
      console.log(means);
      // 2. Form clusters around means
      var clusters = this._generateClusters(means);

      this._iterations.push({
        means: means,
        clusters: clusters
      });
      return true;
    }
  }

  exports.create = function(data, k) {
    return new Kmeans(data, k);
  }

// browser compatibility
})('object' === typeof module ? module : (this.module = {exports: {}})
  , 'function' === typeof vector ? vector : require('./vector'));
var kmeans = module.exports;
// /browser compatibility

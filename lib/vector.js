var Vector = function(components) {
  if(!components)
    throw new Error("Must specify at least one component.");
  if(!(components instanceof Array))
     components = arguments;
  this._components = components;
}

Vector.prototype.getComponent = function(index) {
  return this._components[index];
}

Vector.prototype.getComponents = function() {
  return this._components;
}

Vector.prototype.getDimension = function() {
  return this._components.length;
}

Vector.prototype.each = function(fn) {
  for(var i in this._components)
    fn(this._components[i], i);
}

Vector.prototype.map = function(fn) {
  var components = [];
  this.each(function(c, i) {
    components.push(fn(c, i));
  });
  return new Vector(components);
}

Vector.prototype.reduce = function(fn, memo) {
  memo = memo || 0;
  this.each(function(c) {
    memo = fn(c, memo);
  });
  return memo;
}

Vector.prototype.getMagnitude = function() {
  return Math.sqrt(this.reduce(function(c, memo) {
    return memo + Math.pow(c, 2);
  }));
}

Vector.prototype.getDistanceTo = function(v) {
  return this.subtract(v).getMagnitude();
}

Vector.prototype.getInverse = function() {
  return this.map(function(c) { return c*-1; });
}

Vector.prototype.equals = function(v) {
  var zero = this.map(function(c, i) { return c - v.getComponent(i); });
  return (zero.reduce(function(c, memo) { return memo + c; }) === 0);
}

Vector.prototype.add = function(v) {
  if(this.getDimension() !== v.getDimension())
    throw new Error("Cannot add 2 vectors of different dimensions.");

  var res = this.map(function(c, i) {
    return c + v.getComponents()[i];
  });

  return res;
}

Vector.prototype.subtract = function(v) {
  return this.add(v.getInverse());
}

Vector.prototype.multiply = function(scalar) {
  if(isNaN(scalar)) throw new Error('Only scalar multiplication implemented at the moment.');
  return this.map(function(c) { return scalar*c; });
} 

Vector.prototype.divide = function(scalar) {
  return this.multiply(1/scalar);
}

exports.create = function(components) {
  // todo: caching, since vectors are immutable
  return new Vector(components);
}

exports.getBoundingBox = function(vectors) {
  var min_boundary = vectors[0].getComponents().slice(0); // slice(0) -> copy array, dont pass by reference
  var max_boundary = vectors[0].getComponents().slice(0);
  for(var i in vectors) {
    for(var j in vectors[i].getComponents()) {
      var c = vectors[i].getComponents()[j];
      if(c < min_boundary[j]) min_boundary[j] = c;
      if(c > max_boundary[j]) max_boundary[j] = c;
    }
  }
  return {min: min_boundary, max: max_boundary};
}

// see http://en.wikipedia.org/wiki/Centroid#Of_a_finite_set_of_points
exports.getCentroid = function(vectors) {
  var sum = vectors[0];
  for(var i = 1; i < vectors.length; i++) {
    sum = sum.add(vectors[i]);
  }
  var res = sum.divide(vectors.length);
  return res;
}

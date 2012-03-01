var Vector = function(components) {
  if(!components)
    throw new Error("Must specify at least one component.");
  if(!(components instanceof Array))
     components = arguments;
  this._components = components;
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

exports.getCentroid = function(vectors) {


}

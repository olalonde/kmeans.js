// browser compatibility
(function (module) {
  var exports = module.exports;
// /browser compatibility

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

  Vector.prototype.toArray = function() {
    return this._components;
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

  // wraps array to make them behave like vectors
  var V = function(components) {
    // todo: caching, since vectors are immutable
    if(typeof components !== 'Vector') 
      components = new Vector(components);
    return components;
  }

  V.getBoundingBox = function(vectors) {
    var min_boundary = V(vectors[0]).getComponents().slice(0); // slice(0) -> copy array, dont pass by reference
    var max_boundary = V(vectors[0]).getComponents().slice(0);
    vectors.forEach(function(v) {
      V(v).each(function(c, i) {
        if(c < min_boundary[i]) min_boundary[i] = c;
        if(c > max_boundary[i]) max_boundary[i] = c;
      });
    });
    return {min: V(min_boundary), max: V(max_boundary)};
  }

  // see http://en.wikipedia.org/wiki/Centroid#Of_a_finite_set_of_points
  V.getCentroid = function(vectors) {
    var sum = V(vectors[0]);
    vectors.forEach(function(vector) {
      sum = sum.add(V(vector));
    });
    var res = sum.divide(vectors.length);
    return res;
  }

  exports = module.exports = V;
// browser compatibility
})('object' === typeof module ? module : (this.module = {exports: {}}));
var vector = module.exports;
// /browser compatibility

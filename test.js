var Vector = require("./vector"); 
var v1 = new Vector([2, 5, -3]); 
var v2 = new Vector([-10, 5, 11]);

console.log(v1.subtract(v2)); // 12,0,14
console.log(v1.reduce(function(c, memo) {return memo+c;})); // 4
console.log(v2.getMagnitude()); // 15.6843
console.log(v2.getDistanceTo(v1)); // 18.43908

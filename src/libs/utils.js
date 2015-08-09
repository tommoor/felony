var Box2D = require('box-2d-web');

var b2Vec2 = Box2D.Common.Math.b2Vec2;

module.exports = {
  Rotateb2Vec2: function(vector, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    
    return new b2Vec2(
      vector.x * cos - vector.y * sin, 
      vector.x * sin + vector.y * cos
    );
  }
}
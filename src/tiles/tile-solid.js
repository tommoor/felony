var Tile = require('./tile');
var Box2D = require('box-2d-web');
var THREE = require('three');

var b2Vec2 = Box2D.Common.Math.b2Vec2
 	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
 	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

module.exports = Tile.extend({
	
	initialize: function () {
		Tile.prototype.initialize.call(this);
		
		// setup physics properties
		var fixDef = new b2FixtureDef;
		fixDef.restitution = 0.2;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(this.WIDTH/2, this.HEIGHT/2);
		
		// create tile body
		var bodyDef = new b2BodyDef;
		this.body = felony.game.world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);
    
    var loader = new THREE.ObjectLoader();
    loader.load('data/objects/building1.json', function(object){
      this.display = object;
      this.display.castShadow = object.userData.castShadow;
      this.display.receiveShadow = object.userData.receiveShadow;
  		this.display.position.x = this.x;
  		this.display.position.y = this.y;
  		this.display.position.z = object.geometry.depth/2;
      this.loaded();
    }.bind(this));
	},
	
	render: function() {
		return this.display;
	}
});
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
	},
	
	render: function() {
		// temporary graphic
    var height = 100 + (Math.random()*200);
		var geometry = new THREE.BoxGeometry(100, 100, height);

    var material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, vertexColors: THREE.VertexColors } );
		this.display = new THREE.Mesh(geometry, material);
		this.display.position.z = height/2;
    this.display.castShadow = true;
		this.display.receiveShadow = true;
		return this.display;
	}
});
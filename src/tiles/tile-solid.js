var Tile = require('./tile');
var Box2D = require('box-2d-web');
var THREE = require('three');

var b2Vec2 = Box2D.Common.Math.b2Vec2
 	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
 	,	b2Body = Box2D.Dynamics.b2Body
 	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
 	,	b2Fixture = Box2D.Dynamics.b2Fixture
 	,	b2World = Box2D.Dynamics.b2World
 	,	b2MassData = Box2D.Collision.Shapes.b2MassData
 	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
 	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
 	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	,	b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	,	b2Joint = Box2D.Dynamics.Joints.b2Joint
	,	b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

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
		var geometry = new THREE.CubeGeometry(150, 150, height);
		
		for (var i = 0; i < geometry.faces.length; i++) {
			geometry.faces[i].color.setHex( Math.random() * 0xffffff );
		}
		
		var material = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors });
		this.display = new THREE.Mesh(geometry, material);
		this.display.position.z = height/2;
    this.display.castShadow = true;
		return this.display;
	}
});
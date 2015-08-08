var Body = require('./body');
var Config = require('../config');
var Controls = require('../controls');
var Box2D = require('box-2d-web');
var THREE = require('three');
var _ = require('underscore');

var b2Vec2 = Box2D.Common.Math.b2Vec2
  , b2Dot = Box2D.Common.Math.b2Math.Dot
 	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
 	,	b2Body = Box2D.Dynamics.b2Body
 	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
 	,	b2Fixture = Box2D.Dynamics.b2Fixture
  ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;


module.exports = Body.extend({
	
	// properties
	SIZE: 0.15,
	DENSITY: 1.0,
	SPEED: 3,

	health: 1,
  direction: new b2Vec2(0,0),
	rotation: 0,
  
	// bodies
	body: null,
	
	initialize: function () {
		
		// setup physics properties
		var fixDef = new b2FixtureDef;
		fixDef.density = this.DENSITY;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.1;
		fixDef.linearDamping = 10;
		fixDef.angularDamping = 10;
		fixDef.shape = new b2CircleShape;
		fixDef.shape.SetRadius(this.SIZE);
		
		// create person body
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.allowSleep = false;
		this.body = felony.game.world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);
		
		Body.prototype.initialize.call(this);
	},
	
	render: function() {
    this.display = new THREE.Object3D(); //create an empty container
		
		// temporary graphic
		var geometry = new THREE.CircleGeometry(this.SIZE*Config.SCALE*2);
		var material = new THREE.MeshLambertMaterial({ color: 0x563463 });
		var circle = new THREE.Mesh(geometry, material);
		circle.position.z = 1; // place just above road surface
		circle.receiveShadow = true;
    
		// temporary point direction
    var material = new THREE.LineBasicMaterial({color: 0xffffff});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
    	new THREE.Vector3( 0, 0, 0 ),
    	new THREE.Vector3( 0, 10, 0 )
    );
    var direction = new THREE.Line(geometry, material);
		direction.position.z = 2; // place just above road surface
    
    this.display.add(circle);
    this.display.add(direction);

    return this.display;
	},
	
	tick: function() {
		var p = this.body.GetWorldCenter();
		var a = this.body.GetAngle();
    
    this.direction.Multiply(this.SPEED);
    this.body.SetLinearVelocity(this.direction);
    this.body.SetAngle(Math.atan2(-this.direction.x, this.direction.y));
    this.direction.SetZero();
    
		this.x = this.display.position.x = p.x*Config.SCALE;
		this.y = this.display.position.y = p.y*Config.SCALE;
		this.display.rotation.z = a;
	},
	
	moveLeft: function () {
		this.direction.x = -1;
	},
	
	moveRight: function () {
		this.direction.x = 1;
	},
	
	moveUp: function () {
		this.direction.y = 1;
	},
	
  moveDown: function () {
		this.direction.y = -1;
	},

	bindControls: function () {
		_.bindAll(this, 'moveLeft', 'moveRight', 'moveUp', 'moveDown');
		
		Controls.on('left', this.moveLeft);
		Controls.on('right', this.moveRight);
		Controls.on('up', this.moveUp);
		Controls.on('down', this.moveDown);
	}
});

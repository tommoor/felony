var Body = require('./body');
var Config = require('../config');
var Controls = require('../controls');
var Box2D = require('box-2d-web');
var THREE = require('three');
var _ = require('underscore');

var b2Vec2 = Box2D.Common.Math.b2Vec2
  , b2AABB = Box2D.Collision.b2AABB
  , b2Dot = Box2D.Common.Math.b2Math.Dot
 	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
 	,	b2Body = Box2D.Dynamics.b2Body
 	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
 	,	b2Fixture = Box2D.Dynamics.b2Fixture
  ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

module.exports = Body.extend({
	
	// properties
	SIZE: 0.15,
	DENSITY: 0.1,
	SPEED: 3,
  VEHICLE_ENTER_DISTANCE: 2,
  
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

  // TODO: refactor this logic out of person, upto game level
  enterVehicle: function() {
    // find vehicle
    var vehicle = this.getClosestVehicle();
    
    // enter vehicle
    if(vehicle) {
      this.hide();
      this.unbindControls();
      vehicle.bindControls();
      felony.game.camera.track(vehicle);
    }
  },
  
  getClosestVehicle: function() {
    var aabb = new b2AABB();
		var p = this.body.GetWorldCenter();
    aabb.lowerBound.Set(p.x - this.VEHICLE_ENTER_DISTANCE, p.y - this.VEHICLE_ENTER_DISTANCE);
    aabb.upperBound.Set(p.x + this.VEHICLE_ENTER_DISTANCE, p.y + this.VEHICLE_ENTER_DISTANCE);
    
    // query the world for overlapping shapes.
    var closest;
    felony.game.world.QueryAABB(function(fixture){
      // TODO: this just picks the last right now, actually get the closest
      var data = fixture.GetBody().GetUserData();
      if (data && data.TYPE == 'vehicle') {
        closest = data;
        return false;
      }
      return true;
    }, aabb);
    
    return closest;
  },

  unbindControls: function() {
		Controls.removeListener('left', this.moveLeft);
		Controls.removeListener('right', this.moveRight);
		Controls.removeListener('up', this.moveUp);
		Controls.removeListener('down', this.moveDown);
		Controls.removeListener('enterPressed', this.enterVehicle);
  },
  
	bindControls: function() {
		_.bindAll(this, 'moveLeft', 'moveRight', 'moveUp', 'moveDown', 'enterVehicle');
		
		Controls.on('left', this.moveLeft);
		Controls.on('right', this.moveRight);
		Controls.on('up', this.moveUp);
		Controls.on('down', this.moveDown);
		Controls.on('enterPressed', this.enterVehicle);
	}
});

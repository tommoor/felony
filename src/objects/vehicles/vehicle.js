var Body = require('../body');
var Config = require('../../config');
var Controls = require('../../controls');
var Box2D = require('box-2d-web');
var THREE = require('three');
var _ = require('underscore');

var b2Vec2 = Box2D.Common.Math.b2Vec2
  , b2Dot = Box2D.Common.Math.b2Math.Dot
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


module.exports = Body.extend({
	
	// properties
	LENGTH: 0.5,
	WIDTH: 1.0,
	DENSITY: 2.0,
	DRIVE: 'all',
	
	health: 1,
	
	steerCurrent: 0,
	accelerationMax: 25,
	accelerationCurrent: 0,
	accelerationIncrement: 1,
	
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
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(this.LENGTH, this.WIDTH);
		
		// create vehicle body
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		this.body = felony.game.world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);
		
		Body.prototype.initialize.call(this);
	},
	
	render: function() {
		
		// temporary graphic
		var geometry = new THREE.PlaneGeometry(this.LENGTH*Config.SCALE*2, this.WIDTH*Config.SCALE*2);
		var material = new THREE.MeshBasicMaterial({ color: 0x563463 });
		this.display = new THREE.Mesh(geometry, material);
		this.display.position.z = 1; // place just above road surface
		
		return this.display;
	},
	
	tick: function() {
		var p = this.body.GetWorldCenter();
		var a = this.body.GetAngle();

		// apply driving force
		if (this.accelerationCurrent) {
      var d = this.body.GetTransform().R.col2.Copy();
			d.Multiply(this.accelerationCurrent);
			this.body.ApplyForce(d, this.body.GetPosition());
		}

    // dampen sideways velocity
    var maxLateralImpulse = 2.5; // change to get different levels of 'skid'
    var impulse = this.getLateralVelocity();
    impulse.Multiply(-this.body.GetMass());
    if (impulse.Length() > maxLateralImpulse) {
      impulse.Multiply(maxLateralImpulse / impulse.Length());
    }
    this.body.ApplyImpulse(impulse, p);
    
    // dampen angular velocity
    this.body.ApplyTorque( 0.99 * this.body.GetInertia() * -this.body.GetAngularVelocity() );
    
    // dampen forward velocity
    var currentForwardNormal = this.getForwardVelocity();
    var currentForwardSpeed = currentForwardNormal.Normalize();
    var dragForceMagnitude = -2 * currentForwardSpeed;
    currentForwardNormal.Multiply(dragForceMagnitude)
    this.body.ApplyForce(currentForwardNormal, p);
    
    // apply steering, we reduce the amount of steering by our current speed
    // to stop the vehicle spinning on the spot
    var l = currentForwardNormal.Length();
    this.body.ApplyTorque(this.steerCurrent * (l/this.accelerationMax));

		// return steering to central position
		// when no controls are being pressed
		this.steerCurrent *= 0;
		
		// release acceleration when no controls
		// are being pressed
		this.accelerationCurrent *= 0;
		
		this.x = this.display.position.x = p.x*Config.SCALE;
		this.y = this.display.position.y = p.y*Config.SCALE;
		this.display.rotation.z = a; // * (180 / Math.PI);
	},
  
  getLateralVelocity: function() {
    var currentRightNormal = this.body.GetWorldVector( new b2Vec2(1,0) );
    currentRightNormal.Multiply( b2Dot( currentRightNormal, this.body.GetLinearVelocity() ));
    return currentRightNormal;
  },
  
  getForwardVelocity: function() {
    var currentRightNormal = this.body.GetWorldVector( new b2Vec2(0,1) );
    currentRightNormal.Multiply( b2Dot( currentRightNormal, this.body.GetLinearVelocity() ));
    return currentRightNormal;
  },
	
	steerRight: function () {
		this.steerCurrent = -10;
	},
	
	steerLeft: function () {
		this.steerCurrent = 10;
	},
	
	accelerate: function () {
		this.accelerationCurrent = Math.max(this.accelerationMax, this.accelerationCurrent+this.accelerationIncrement);
	},
	
	brake: function () {
		this.accelerationCurrent = Math.max(-this.accelerationMax, this.accelerationCurrent-this.accelerationIncrement);
	},
	
	explode: function () {
		// todo
	},
	
	bindControls: function () {
		_.bindAll(this, 'steerLeft', 'steerRight', 'accelerate', 'brake');
		
		Controls.on('left', this.steerLeft);
		Controls.on('right', this.steerRight);
		Controls.on('up', this.accelerate);
		Controls.on('down', this.brake);
	}
});

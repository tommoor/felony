var Body = require('../body');
var Config = require('../../config');
var Controls = require('../../controls');
var Utils = require('../../libs/utils');
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
  ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;


module.exports = Body.extend({
	
	// properties
  TYPE: 'vehicle',
	LENGTH: 0.5,
	WIDTH: 1.0,
	DENSITY: 2.0,
	DOOR_OFFSET: 1.3,

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
		var material = new THREE.MeshLambertMaterial({ color: 0x563463 });
		this.display = new THREE.Mesh(geometry, material);
		this.display.position.z = 1; // place just above road surface
		this.display.receiveShadow = true;
    return this.display;
	},
	
	tick: function() {
		var p = this.body.GetWorldCenter();
		var a = this.body.GetAngle();

    // smoothly snap to 90 degree angles whilst driving
    var DEGTORAD = 0.0174532925;
    var NINETYDEG = 90*DEGTORAD;
    var nextAngle = a + this.body.GetAngularVelocity() / 3.0;
    var nextSnap = Math.round(a/NINETYDEG)*NINETYDEG;
    var nextDiff = nextSnap-a;
    
    if (Math.abs(nextDiff) < 20*DEGTORAD && !this.steerCurrent) {
      var totalRotation = nextSnap - nextAngle;
    
      while ( totalRotation < -180 * DEGTORAD ) { totalRotation += 360 * DEGTORAD; }
      while ( totalRotation >  180 * DEGTORAD ) { totalRotation -= 360 * DEGTORAD; }
    
      var desiredAngularVelocity = totalRotation * 10;
      var torque = this.body.GetInertia() * desiredAngularVelocity / (1/3.0);
      this.body.ApplyTorque( torque );
    }
    
		// apply driving force
		if (this.accelerationCurrent) {
      var d = this.body.GetTransform().R.col2.Copy();
			d.Multiply(this.accelerationCurrent);
			this.body.ApplyForce(d, this.body.GetPosition());
		}

    // dampen sideways velocity
    var maxLateralImpulse = 2.5; // change to get different levels of 'skid'
    var maxLateralImpulseMarks = 10; // change to get different levels of 'skid'
    var impulse = this.getLateralVelocity();
    impulse.Multiply(-this.body.GetMass());
    var impulseLength = impulse.Length();
    if (impulseLength > maxLateralImpulse) {
      impulse.Multiply(maxLateralImpulse / impulse.Length());
      if (impulseLength > maxLateralImpulseMarks) {
        this.drawSkidMarks();
      }
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
    var direction = l > 0 ? 1 : -1;
    this.body.ApplyTorque(direction * this.steerCurrent * (l/this.accelerationMax));

		// return steering to central position
		// when no controls are being pressed
		this.steerCurrent *= 0;
		
		// release acceleration when no controls
		// are being pressed
		this.accelerationCurrent *= 0;
		
		this.x = this.display.position.x = p.x*Config.SCALE;
		this.y = this.display.position.y = p.y*Config.SCALE;
		this.display.rotation.z = a;
	},
  
  drawSkidMarks: function() {
		var p = this.body.GetWorldCenter();
		var av = this.body.GetLinearVelocity();
    var a = Math.atan2(-av.x, av.y);
		var geometry = new THREE.PlaneGeometry(0.05*Config.SCALE*2, av.Length()*2);
		var material = new THREE.MeshLambertMaterial({ color: 0x303030 });

    // back left
		var skid = new THREE.Mesh(geometry, material);
    var offset = Utils.Rotateb2Vec2(new b2Vec2((this.WIDTH/2.5), -this.LENGTH*2), a);
    
    // add on the vehicles global position
    offset.Add(p);
    
    skid.position = new THREE.Vector3(offset.x*Config.SCALE, offset.y*Config.SCALE, 0.5);
		skid.rotation.z = a;
    skid.receiveShadow = true;
    felony.game.scene.add(skid);
    
    // back right
		var skid = new THREE.Mesh(geometry, material);
    var offset = Utils.Rotateb2Vec2(new b2Vec2(-(this.WIDTH/2.5), -this.LENGTH*2), a);
    
    // add on the vehicles global position
    offset.Add(p);
    
    skid.position = new THREE.Vector3(offset.x*Config.SCALE, offset.y*Config.SCALE, 0.5);
		skid.rotation.z = a;
    skid.receiveShadow = true;
    felony.game.scene.add(skid);
  },
  
  getDriverDoorPosition: function() {
		var p = this.body.GetWorldCenter();
		var a = this.body.GetAngle();
    
    // gets the offset of the drivers door and rotates it to the current
    // angle of the vehicle
    var offset = Utils.Rotateb2Vec2(new b2Vec2((this.WIDTH/2)+0.2, this.LENGTH*this.DOOR_OFFSET), a);
    
    // add on the vehicles global position
    offset.Add(p);
    return offset;
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
		this.accelerationCurrent = -this.accelerationMax/4;
  },
	
	leaveVehicle: function () {
    var player = felony.game.player;
    this.unbindControls();

    player.SetPosition(this.getDriverDoorPosition());
    player.show();
    player.bindControls();

    felony.game.camera.track(player);
	},
  
  unbindControls: function() {
		Controls.removeListener('left', this.steerLeft);
		Controls.removeListener('right', this.steerRight);
		Controls.removeListener('up', this.accelerate);
		Controls.removeListener('down', this.brake);
		Controls.removeListener('enterPressed', this.leaveVehicle);
  },
	
	bindControls: function () {
		_.bindAll(this, 'steerLeft', 'steerRight', 'accelerate', 'brake', 'leaveVehicle');
		
		Controls.on('left', this.steerLeft);
		Controls.on('right', this.steerRight);
		Controls.on('up', this.accelerate);
		Controls.on('down', this.brake);
		Controls.on('enterPressed', this.leaveVehicle);
	}
});

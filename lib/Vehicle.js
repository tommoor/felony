felony.Vehicle = felony.Body.extend({
	
	// properties
	LENGTH: 0.5,
	WIDTH: 1.0,
	DENSITY: 2.0,
	DRIVE: 'rear',
	WHEELOFFSET: 1.3,
	
	health: 1,
	
	steerMax: Math.PI/4,
	steerCurrent: 0,
	steerIncrement: 3,
	
	accelerationMax: 10,
	accelerationCurrent: 0,
	accelerationIncrement: 0.5,
	
	// bodies
	body: null,
	wheelFrontLeft: null,
	wheelFrontRight: null,
	wheelFrontLeftJoint: null,
	wheelFrontRightJoint: null,
	wheelRearLeft: null,
	wheelRearRight: null,
	
	// artwork
	art: null,
	
	initialize: function () {
		felony.Body.prototype.initialize.call(this);
		
		// setup physics properties
		var fixDef = new b2FixtureDef;
		fixDef.density = this.DENSITY;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.8;
		fixDef.linearDamping = 10;
		fixDef.angularDamping = 10;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(this.LENGTH, this.WIDTH);
		
		// create vehicle body
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		this.body = felony.game.world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);
		
		// create wheel bodies
		var c = this.body.GetWorldCenter();
		bodyDef.position.x = c.x-(this.WIDTH/2);
		bodyDef.position.y = c.y+this.LENGTH*this.WHEELOFFSET;
		this.wheelFrontLeft = felony.game.world.CreateBody(bodyDef);
		
		bodyDef.position.x = c.x+(this.WIDTH/2);
		bodyDef.position.y = c.y+this.LENGTH*this.WHEELOFFSET;
		this.wheelFrontRight = felony.game.world.CreateBody(bodyDef);
		
		bodyDef.position.x = c.x-(this.WIDTH/2);
		bodyDef.position.y = c.y-this.LENGTH*this.WHEELOFFSET;
		this.wheelRearLeft = felony.game.world.CreateBody(bodyDef);
		
		bodyDef.position.x = c.x+(this.WIDTH/2);
		bodyDef.position.y = c.y-this.LENGTH*this.WHEELOFFSET;
		this.wheelRearRight = felony.game.world.CreateBody(bodyDef);
		
		fixDef.density = 1;
		fixDef.shape.SetAsBox(0.1, 0.2);
		this.wheelFrontLeft.CreateFixture(fixDef);
		this.wheelFrontRight.CreateFixture(fixDef);
		this.wheelRearLeft.CreateFixture(fixDef);
		this.wheelRearRight.CreateFixture(fixDef);
		
		// create a revolute joint definition
		var jointDef = new b2RevoluteJointDef();
		jointDef.Initialize(this.body , this.wheelFrontLeft, this.wheelFrontLeft.GetWorldCenter());
		jointDef.enableMotor = true;
		jointDef.maxMotorTorque = 100000;
		jointDef.enableLimit = true;
		jointDef.lowerAngle =  -1 * this.steerMax;
		jointDef.upperAngle =  this.steerMax;
		
		// attach wheels one by one with joints
		this.wheelFrontLeftJoint = felony.game.world.CreateJoint(jointDef);
		
		jointDef.Initialize(this.body, this.wheelFrontRight, this.wheelFrontRight.GetWorldCenter());
		this.wheelFrontRightJoint = felony.game.world.CreateJoint(jointDef);
		
		// create a prismatic joint definition
		jointDef = new b2PrismaticJointDef();
		jointDef.Initialize(this.body, this.wheelRearLeft, this.wheelRearLeft.GetWorldCenter(), new b2Vec2(1, 0));
		jointDef.lowerTranslation = 0;
		jointDef.upperTranslation = 0;
		jointDef.enableLimit = true;
		
		// attach wheels one by one with joints
		felony.game.world.CreateJoint(jointDef);
		
		jointDef.Initialize(this.body, this.wheelRearRight, this.wheelRearRight.GetWorldCenter(), new b2Vec2(1, 0));
		felony.game.world.CreateJoint(jointDef);
		
		// attach artwork
		this.display();
	},
	
	display: function() {
		
		// temporary graphic
		this.art = new Shape();
		var g = this.art.graphics;
		var w = this.WIDTH*felony.game.SCALE/2;
		var l = this.LENGTH*felony.game.SCALE/2;
		
		g.clear();
		g.beginStroke("#111111");
		g.beginFill("#aaaaaa");
		g.moveTo(-l, -w);
		g.lineTo(-l, w);
		g.lineTo(l, w);
		g.lineTo(l, -w);
		g.closePath();
		
		// add artwork to stage
		// this.addChild(this.art);
		felony.interface.layers.vehicles.addChild(this);
	},
	
	tick: function() {
		
		var p = this.body.GetWorldCenter();
		var a = this.body.GetAngle();
		var self = this;
		var wheels = [this.wheelFrontLeft, this.wheelFrontRight, this.wheelRearLeft, this.wheelRearRight];
		var powered = [];
		
		// update rotation of wheels to match steering
		var s = this.steerCurrent - this.wheelFrontLeftJoint.GetJointAngle();
		this.wheelFrontLeftJoint.SetMotorSpeed(s * this.steerIncrement);
		this.wheelFrontRightJoint.SetMotorSpeed(s * this.steerIncrement);
		
		// apply driving force to wheels, depending on drive mode
		if (this.accelerationCurrent) {
			if (this.DRIVE == 'front' || this.DRIVE == 'all') {
				powered = powered.concat([this.wheelFrontLeft, this.wheelFrontRight]);
			} else if (this.DRIVE == 'rear' || this.DRIVE == 'all') {
				powered = powered.concat([this.wheelRearLeft, this.wheelRearRight]);	
			}
			
			_.each(powered, function(wheel){
		
				var d = wheel.GetTransform().R.col2.Copy();
				d.Multiply(self.accelerationCurrent);
				wheel.ApplyForce(d, wheel.GetPosition());
			});
		}
		
		// apply sideways friction to all wheels
		_.each(wheels, function(wheel){
		
			var velocity = wheel.GetLinearVelocityFromLocalPoint(new b2Vec2(0,0));
			var sidewaysAxis = wheel.GetTransform().R.col2.Copy();
			sidewaysAxis.Multiply( velocity.x*sidewaysAxis.x + velocity.y*sidewaysAxis.y)
			wheel.SetLinearVelocity(sidewaysAxis);
		});
		
		
		// update artwork to match position and
		// rotation of physics object
		this.x = p.x*felony.game.SCALE;
		this.y = p.y*felony.game.SCALE;
		this.rotation = a * (180 / Math.PI);
		
		// return steering to central position
		// when no controls are being pressed
		this.steerCurrent *= 0.5;
		
		// release acceleration when no controls
		// are being pressed
		this.accelerationCurrent *= 0;
	},
	
	steerLeft: function () {
		this.steerCurrent = Math.max(-this.steerMax, this.steerCurrent-(this.steerMax*2));
	},
	
	steerRight: function () {
		this.steerCurrent = Math.min(this.steerMax, this.steerCurrent+(this.steerMax*2));
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
		
		felony.controls.bind('left', this.steerLeft);
		felony.controls.bind('right', this.steerRight);
		felony.controls.bind('up', this.accelerate);
		felony.controls.bind('down', this.brake);
	}
});

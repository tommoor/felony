felony.Vehicle = felony.Body.extend({
	
	// properties
	LENGTH: 0.5,
	WIDTH: 1,
	DENSITY: 2.0,
	DRIVE: 'front',
	
	health: 1,
	
	steerMax: Math.PI/3,
	steerCurrent: 0,
	steerIncrement: 3,
	
	accelerationMax: 8,
	accelerationCurrent: 0,
	accelerationIncrement: 0.2,
	
	// bodies
	body: null,
	wheelFrontLeft: null,
	wheelFrontRight: null,
	wheelFrontLeftJoint: null,
	wheelFrontRightJoint: null,
	wheelBackLeft: null,
	wheelBackRight: null,
	
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
		
		// create wheels
		var c = this.body.GetWorldCenter();
		bodyDef.position.x = c.x-(this.WIDTH/2);
		bodyDef.position.y = c.y+this.LENGTH*1.5;
		this.wheelFrontLeft = felony.game.world.CreateBody(bodyDef);
		
		bodyDef.position.x = c.x+(this.WIDTH/2);
		bodyDef.position.y = c.y+this.LENGTH*1.5;
		this.wheelFrontRight = felony.game.world.CreateBody(bodyDef);
		
		bodyDef.position.x = c.x-(this.WIDTH/2);
		bodyDef.position.y = c.y-this.LENGTH*1.5;
		this.wheelBackLeft = felony.game.world.CreateBody(bodyDef);
		
		bodyDef.position.x = c.x+(this.WIDTH/2);
		bodyDef.position.y = c.y-this.LENGTH*1.5;
		this.wheelBackRight = felony.game.world.CreateBody(bodyDef);
		
		fixDef.density = 0.5;
		fixDef.shape.SetAsBox(0.1, 0.2);
		this.wheelFrontLeft.CreateFixture(fixDef);
		this.wheelFrontRight.CreateFixture(fixDef);
		this.wheelBackLeft.CreateFixture(fixDef);
		this.wheelBackRight.CreateFixture(fixDef);
		
		// attach wheels
		var jointDef = new b2RevoluteJointDef();
		jointDef.Initialize(this.body , this.wheelFrontLeft, this.wheelFrontLeft.GetWorldCenter());
		jointDef.enableMotor = true;
		jointDef.maxMotorTorque = 100000;
		jointDef.enableLimit = true;
		jointDef.lowerAngle =  -1 * this.steerMax;
		jointDef.upperAngle =  this.steerMax;
		
		this.wheelFrontLeftJoint = felony.game.world.CreateJoint(jointDef);
		
		jointDef.Initialize(this.body, this.wheelFrontRight, this.wheelFrontRight.GetWorldCenter());
		this.wheelFrontRightJoint = felony.game.world.CreateJoint(jointDef);
		
		jointDef.Initialize(this.body, this.wheelBackLeft, this.wheelBackLeft.GetWorldCenter());
		felony.game.world.CreateJoint(jointDef);
		
		jointDef.Initialize(this.body, this.wheelBackRight, this.wheelBackRight.GetWorldCenter());
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
		felony.game.stage.addChild(this);
	},
	
	tick: function() {
		
		var p = this.body.GetWorldCenter();
		var a = this.body.GetAngle();
		var self = this;
		var wheels = [this.wheelFrontLeft, this.wheelFrontRight, this.wheelBackLeft, this.wheelBackRight];
		
		// update rotation of wheels to match steering
		var s = this.steerCurrent - this.wheelFrontLeftJoint.GetJointAngle();
		this.wheelFrontLeftJoint.SetMotorSpeed(s * this.steerIncrement);
		this.wheelFrontRightJoint.SetMotorSpeed(s * this.steerIncrement);
		
		// apply driving force to wheels, depnending on drive mode
		if (this.accelerationCurrent && this.DRIVE == 'front') {

			_.each([this.wheelFrontLeft, this.wheelFrontRight], function(wheel){
			
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
		this.accelerationCurrent = 0;
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
		this.accelerationCurrent = 0;
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

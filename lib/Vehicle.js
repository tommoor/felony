felony.Vehicle = felony.Body.extend({
	
	// properties
	length: 0.5,
	width: 1,
	density: 1.0,
	
	// bodies
	body: null,
	
	initialize: function () {
		felony.Body.prototype.initialize.call(this);
	
		var fixDef = new b2FixtureDef;
		fixDef.density = this.density;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(this.length, this.width);
		
		// vehicle body
		this.body = new b2BodyDef;
		this.body.type = b2Body.b2_dynamicBody;
		this.body.position.x = 9;
		this.body.position.y = 13;
		
		felony.game.world.CreateBody(this.body).CreateFixture(fixDef);
	},
	
	steerLeft: function () {

	},
	
	steerRight: function () {
		
	},
	
	accelerate: function () {
		
	},
	
	brake: function () {
		
	},
	
	bindControls: function () {
		
		_.bindAll(this, 'steerLeft', 'steerRight', 'accelerate', 'brake');
		
		felony.controls.bind('left', this.steerLeft);
		felony.controls.bind('right', this.steerRight);
		felony.controls.bind('up', this.accelerate);
		felony.controls.bind('down', this.brake);
	}
});

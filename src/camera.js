felony.camera = _.extend({

	offset: new b2Vec2(0,0),
	target: new b2Vec2(0,0),
	tracking: null,
	
	speed: 10,
	
	init: function() {
	
		return this;
	},
	
	track: function(body) {
		this.tracking = body;
	},
	
	update: function() {
		if (this.tracking) {
			this.target.x = -this.tracking.x+(felony.interface.width/2);
			this.target.y = -this.tracking.y+(felony.interface.height/2);
		}
		
		this.offset.x += (this.target.x-this.offset.x)/this.speed;
		this.offset.y += (this.target.y-this.offset.y)/this.speed;
		
		return this.offset;
	},
	
	bindControls: function() {
		
		_.bindAll(this, 'panUp', 'panDown', 'panLeft', 'panRight');
		
		felony.controls.bind('left', this.panLeft);
		felony.controls.bind('right', this.panRight);
		felony.controls.bind('up', this.panUp);
		felony.controls.bind('down', this.panDown);
	},
	
	panUp: function() {
		this.target.y -= this.speed;
	},
	
	panDown: function() {
		this.target.y += this.speed;
	},
	
	panLeft: function() {
		this.target.x -= this.speed;
	},
	
	panRight: function() {
		this.target.x += this.speed;
	}
	
}, Events);
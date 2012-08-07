felony.camera = _.extend({

	offset: new b2Vec2(0,0),
	target: new b2Vec2(0,0),
	
	speed: 10,
	
	init: function() {
	
		return this;
	},
	
	follow: function(body) {
		
	},
	
	update: function() {
		this.offset.x += (this.target.x-this.offset.x)/this.speed;
		this.offset.y += (this.target.y-this.offset.y)/this.speed;
		
		felony.game.stage.x = this.offset.x;
		felony.game.stage.y = this.offset.y;
		
		felony.mapManager.update(this.offset);
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
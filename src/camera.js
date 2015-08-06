var Controls = require('./controls');
var Box2D = require('box-2d-web');
var b2Vec2 = Box2D.Common.Math.b2Vec2;

module.exports = {

	offset: null,
	target: new b2Vec2(0,0),
	speed: 10,
	lookAhead: 30,
  
	init: function() {
		return this;
	},
	
	track: function(body) {
		this.target = body;
	},
	
	update: function() {
    if (!this.offset) {
      this.offset = new b2Vec2(this.target.x, this.target.y);
    }
    
    // get the speed of body we're tracking and look ahead to where it will be
    var velocity = this.target.getForwardVelocity();
    var target = new b2Vec2(this.target.x+(velocity.x*this.lookAhead), this.target.y+(velocity.y*this.lookAhead));
    
		this.offset.x += (target.x-this.offset.x)/this.speed;
		this.offset.y += (target.y-this.offset.y)/this.speed;
		
		return this.offset;
	},
	
	bindControls: function() {
		_.bindAll(this, 'panUp', 'panDown', 'panLeft', 'panRight');
		
		Controls.bind('left', this.panLeft);
		Controls.bind('right', this.panRight);
		Controls.bind('up', this.panUp);
		Controls.bind('down', this.panDown);
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
};
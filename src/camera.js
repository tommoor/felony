var Controls = require('./controls');
var THREE = require('three');
var Box2D = require('box-2d-web');
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var _ = require('underscore');

var TrackingCamera = function() {
	this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	this.camera.position.z = this.zoom;
	return this;
}

_.extend(TrackingCamera.prototype, {
	position: null,
	target: new b2Vec2(0,0),
	speed: 10,
	lookAhead: 30,
  zoom: 400,
  camera: null,

	track: function(body) {
		this.target = body;
	},

	update: function() {
    if (!this.offset) {
      this.offset = new b2Vec2(this.target.x, this.target.y);
    }

    var target;
    var autoZoom = 0;
    
    // get the speed of body we're tracking and look ahead to where it will be
    if (this.lookAhead) {
      var velocity = this.target.getForwardVelocity();
      target = new b2Vec2(this.target.x+(velocity.x*this.lookAhead), this.target.y+(velocity.y*this.lookAhead));
      autoZoom = (velocity.Length() * velocity.Length());
    } else {
      target = this.target;
    }

    this.offset.x += (target.x-this.offset.x)/this.speed;
    this.offset.y += (target.y-this.offset.y)/this.speed;

    this.camera.position.x = this.offset.x;
    this.camera.position.y = this.offset.y;
    this.camera.position.z = this.zoom + autoZoom;
	},

	bindControls: function() {
		_.bindAll(this, 'panUp', 'panDown', 'panLeft', 'panRight');
	
		Controls.on('left', this.panLeft);
		Controls.on('right', this.panRight);
		Controls.on('up', this.panUp);
		Controls.on('down', this.panDown);
	},

	panUp: function() {
		this.target.y += this.speed;
	},

	panDown: function() {
		this.target.y -= this.speed;
	},

	panLeft: function() {
		this.target.x -= this.speed;
	},

	panRight: function() {
		this.target.x += this.speed;
	}
});

module.exports = TrackingCamera;

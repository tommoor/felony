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

    // get the speed of body we're tracking and look ahead to where it will be
    var velocity = this.target.getForwardVelocity();
    var target = new b2Vec2(this.target.x+(velocity.x*this.lookAhead), this.target.y+(velocity.y*this.lookAhead));

    this.offset.x += (target.x-this.offset.x)/this.speed;
    this.offset.y += (target.y-this.offset.y)/this.speed;

    this.camera.position.x = this.offset.x;
    this.camera.position.y = this.offset.y;
    this.camera.position.z = this.zoom + (velocity.Length() * velocity.Length());
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
});

module.exports = TrackingCamera;

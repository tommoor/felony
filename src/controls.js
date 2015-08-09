var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

module.exports = _.extend({

	keys: {},

	keyMapping: {
		'up':       38,
		'down':     40,
		'left':     37,
		'right':    39,
		'enter':    13,
		'space':    32,
		'p':        80,
		'd':        68
	},

	init: function () {
		this.bindEvents();
		return this;
	},
	
	update: function () {
		
		var o = c = (new Date()).getTime();
		
		for(var keyname in this.keyMapping) {
			o = this.keyIsDown(keyname);
			
			// include the time that a key has been pressed in emitted event
			if (o) this.emit(keyname, c-o);
		}
	},
	
	keyDown: function (ev) {
		var key = ev.keyCode || window.event.keyCode;
		
		// record when this key was pressed down
		this.keys[key] = (new Date()).getTime();
    
    var self = this;
    var keyName = Object.keys(this.keyMapping).filter(function(a) {return self.keyMapping[a] === key})[0];
    this.emit(keyName + 'Pressed', true);
	},
	
	keyUp: function (ev) {
		var key = ev.keyCode || window.event.keyCode;
    
		this.keys[key] = false;
	},
	
	keyIsDown: function (key) {
		
		// allow passing of keycode or key name
		if (_.isString(key)) key = this.keyMapping[key];
		
		return this.keys[key];
	},

	bindEvents: function () {
		_.bindAll(this, 'keyDown', 'keyUp');
		
		$(window).bind('keydown', this.keyDown);
		$(window).bind('keyup', this.keyUp);
	}
}, EventEmitter.prototype);

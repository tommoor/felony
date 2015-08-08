var EventEmitter = require('events').EventEmitter;
var Config = require('../config');
var Box2D = require('box-2d-web');
var _ = require('underscore');
var b2Vec2 = Box2D.Common.Math.b2Vec2
  , b2Dot = Box2D.Common.Math.b2Math.Dot;

Body = function() {
	this.initialize();
};

_.extend(Body.prototype, {
	initialize: function() {
		if (this.render) {
			felony.game.scene.add(this.render());
		}
    
    if (this.body) {
      this.body.SetUserData(this);
    }

		Ticker.addListener(this);
	},

  hide: function() {
    this.body.SetActive(false);
    this.display.traverse(function ( object ) { object.visible = false; } );
  },

  show: function() {
    this.body.SetActive(true);
    this.display.traverse(function ( object ) { object.visible = true; } );
  },
	
	destroy: function () {
		
		// remove physics body
		if (this.body) felony.game.world.DestroyBody(this.body);
		
		// remove display object
		felony.game.scene.remove(this.display);
		
		delete this;
	},
	
	SetPosition: function (vector) {
		if (this.display) {
			this.display.position.x = vector.x*Config.SCALE;
			this.display.position.y = vector.y*Config.SCALE;
		}
		
		if (this.body) {
			this.body.SetPosition(vector);
		}
	},
  
  getLateralVelocity: function() {
    var currentRightNormal = this.body.GetWorldVector( new b2Vec2(1,0) );
    currentRightNormal.Multiply( b2Dot( currentRightNormal, this.body.GetLinearVelocity() ));
    return currentRightNormal;
  },
  
  getForwardVelocity: function() {
    var currentRightNormal = this.body.GetWorldVector( new b2Vec2(0,1) );
    currentRightNormal.Multiply( b2Dot( currentRightNormal, this.body.GetLinearVelocity() ));
    return currentRightNormal;
  }
});

Body.extend = require('../libs/extend');
module.exports = Body;
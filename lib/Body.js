Body = function() {
	this.initialize();
};

_.extend(Body.prototype, Events, {
	
	initialize: function() {
		
		if (this.render) {
			felony.game.scene.add(this.render());
		}
		
		Ticker.addListener(this);
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
			this.display.position.x = vector.x*felony.game.SCALE;
			this.display.position.y = vector.y*felony.game.SCALE;
		}
		
		if (this.body) {
			this.body.SetPosition(vector);
		}
	}
});
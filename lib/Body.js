felony.Body = Container.extend({
	
	destroy: function () {
		if (this.body) felony.game.world.DestroyBody(this.body);
		
		// is there anything else to clean up here?
		if (this.parent) this.parent.removeChild(this);
		delete this;
	}
});

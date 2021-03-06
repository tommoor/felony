felony.particleManager = {

	// maximum amount of projectiles on screen at once
	LIMIT: 200,

	particles: [],
	cache: [],
	
	// allows us to precreate and cache a selection of particles
	init: function() {
		
	},

	add: function (n) {
	
		var projectiles = felony.interface.layers.enemy_projectiles.getNumChildren() + 
					      felony.interface.layers.player_projectiles.getNumChildren() +
						  felony.interface.layers.particles.getNumChildren();
		
		// have we run out of available bodies?
		// limit includes only projectiles
		if (projectiles >= this.LIMIT)
		{
			var p = felony.interface.layers.particles.children.shift();
			if (p) p.destroy();
		}
		
		return n;
	},
	
	spark: function (object, size) {
		
		var size = size || 10;
		
		for (var i=0; i< size; i++) {
			var n = new felony.Particle();
			n.position(object.x,object.y);
			n.kick();
			this.add(n);
			felony.interface.addChildTo(n, 'particles');
		}
	}
}
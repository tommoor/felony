felony.Tile = Container.extend({
	
	WIDTH: 5,
	HEIGHT: 5,
	COLOUR: "#dddddd",
	
	initialize: function () {
		Container.prototype.initialize.call(this);
		
		// attach artwork
		this.display();
	},
	
	display: function() {
		
		// temporary graphic
		var art = new Shape();
		var g = art.graphics;
		var w = (this.WIDTH/2)*felony.game.SCALE;
		var l = (this.HEIGHT/2)*felony.game.SCALE;
		
		g.clear();
		g.beginStroke("#999999");
		g.beginFill(this.COLOUR);
		g.moveTo(-w, -l);
		g.lineTo(w, -l);
		g.lineTo(w, l);
		g.lineTo(-w, l);
		g.closePath();
		
		// add artwork to stage
		this.addChild(art);
		felony.interface.addChildTo(this, 'tiles');
	},
	
	SetPosition: function (vector) {
		this.x = vector.x*felony.game.SCALE;
		this.y = vector.y*felony.game.SCALE;
		
		if (this.body) this.body.SetPosition(vector);
	}
});
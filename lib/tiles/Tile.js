felony.Tile = Container.extend({
	
	WIDTH: 3,
	HEIGHT: 3,
	
	initialize: function () {
		Container.prototype.initialize.call(this);
		
		// attach artwork
		this.display();
	},
	
	display: function() {
		
		// temporary graphic
		var art = new Shape();
		var g = art.graphics;
		var w = this.WIDTH*felony.game.SCALE;
		var l = this.HEIGHT*felony.game.SCALE;
		
		g.clear();
		g.beginStroke("#999999");
		g.beginFill("#dddddd");
		g.moveTo(0, 0);
		g.lineTo(w, 0);
		g.lineTo(w, l);
		g.lineTo(0, l);
		g.closePath();
		
		// add artwork to stage
		this.addChild(art);
		felony.interface.addChildTo(this, 'tiles');
	},
	
	SetPosition: function (vector) {
		
		this.x = vector.x*felony.game.SCALE;
		this.y = vector.y*felony.game.SCALE;
	}
});
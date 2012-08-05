felony.Tile = felony.Body.extend({
	
	WIDTH: 2,
	HEIGHT: 2,
	
	art: null,
	
	initialize: function () {
		felony.Body.prototype.initialize.call(this);
		
		// attach artwork
		this.display();
	},
	
	display: function() {
		
		// temporary graphic
		this.art = new Shape();
		var g = this.art.graphics;
		var w = this.WIDTH*felony.game.SCALE/2;
		var l = this.LENGTH*felony.game.SCALE/2;
		
		g.clear();
		g.beginStroke("#111111");
		g.beginFill("#aaaaaa");
		g.moveTo(-l, -w);
		g.lineTo(-l, w);
		g.lineTo(l, w);
		g.lineTo(l, -w);
		g.closePath();
		
		// add artwork to stage
		this.addChild(this.art);
		felony.interface.layers.tiles.addChild(this);
		//console.log(this);
	},
	
	SetPosition: function (vector) {
		
		this.x = vector.x*felony.game.SCALE;
		this.y = vector.y*felony.game.SCALE;
	}
});
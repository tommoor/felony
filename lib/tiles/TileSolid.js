felony.TileSolid = felony.Tile.extend({

	COLOUR: "#333333",
	
	body: null,
	
	initialize: function () {
		felony.Tile.prototype.initialize.call(this);
		
		// setup physics properties
		var fixDef = new b2FixtureDef;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(this.WIDTH/2, this.HEIGHT/2);
		
		// create tile body
		var bodyDef = new b2BodyDef;
		this.body = felony.game.world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);
	}
});
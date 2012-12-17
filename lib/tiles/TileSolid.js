felony.TileSolid = felony.Tile.extend({
	
	initialize: function () {
		felony.Tile.prototype.initialize.call(this);
		
		// setup physics properties
		var fixDef = new b2FixtureDef;
		fixDef.restitution = 0.2;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(this.WIDTH/2, this.HEIGHT/2);
		
		// create tile body
		var bodyDef = new b2BodyDef;
		this.body = felony.game.world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);
	},
	
	render: function() {
		// temporary graphic
		var geometry = new THREE.CubeGeometry( 200, 200, 200 );
		
		for (var i = 0; i < geometry.faces.length; i++) {
			geometry.faces[i].color.setHex( Math.random() * 0xffffff );
		}
		
		var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
		
		return this.display = new THREE.Mesh(geometry, material);
	}
});
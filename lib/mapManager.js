felony.mapManager = _.extend({

	offsetX: 0,
	offsetY: 0,
	tileSize: 60,
	tiles: [],
	
	init: function () {
			
		var h = felony.map.length;
		var w = felony.map[0].length;
		
		for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
				
				var pos = new b2Vec2(x*this.tileSize, y*this.tileSize);
				var tile = felony.map[y][x];
				
				var t = new felony.Tile();
				t.SetPosition(pos);
			}
		}
	}
	
}, Events);
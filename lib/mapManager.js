felony.mapManager = _.extend({

	offsetX: 0,
	offsetY: 0,
	visibleWidth: 5,
	visibleHeight: 5,
	
	tiles: [],
	
	init: function () {
			
		var h = Math.min(felony.map.length, this.offsetY+this.visibleHeight);
		var w = Math.min(felony.map[0].length, this.offsetX+this.visibleWidth);
		
		for (var y=this.offsetX; y<h; y++) {
			for (var x=this.offsetY; x<w; x++) {
				
				var tile = felony.map[y][x];
				
				//temp
				if (tile.s) var t = new felony.TileSolid();
				if (!tile.s) var t = new felony.Tile();
				
				t.SetPosition(new b2Vec2(x*t.WIDTH, y*t.HEIGHT));
			}
		}
	}
	
}, Events);
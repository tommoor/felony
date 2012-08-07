felony.mapManager = _.extend({

	offset: new b2Vec2(0,0),
	tileOffset: new b2Vec2(0,0),
	visibleWidth: 5,
	visibleHeight: 5,
	
	tiles: [],
	
	init: function() {
			
		var h = this.getMaxHeight();
		var w = this.getMaxWidth();
		
		for (var y=this.tileOffset.y; y<h; y++) {
			this.tiles[y] = [];
			
			for (var x=this.tileOffset.x; x<w; x++) {
				this.createTile(x, y);
			}
		}
	},
	
	update: function(vector) {
		this.offset = vector;
		
		// todo remove hardcoded tile size
		var currentY = -Math.round(vector.y/5/felony.game.SCALE);
		var currentX = -Math.round(vector.x/5/felony.game.SCALE);
		
		// up
		if (currentY > this.tileOffset.y) {
			
			var w = this.getMaxWidth();
			for (var x=this.tileOffset.x; x<w; x++) {
				this.createTile(x, this.tileOffset.y+this.visibleHeight);
				this.tiles[this.tileOffset.y][x].destroy();
			}
			
			this.tileOffset.y = currentY;

		// down
		} else if (currentY < this.tileOffset.y) {

			var w = this.getMaxWidth();
			for (var x=this.tileOffset.x; x<w; x++) {
				this.createTile(x, currentY);
				this.tiles[this.tileOffset.y+this.visibleHeight-1][x].destroy();
			}
			
			this.tileOffset.y = currentY;
		}
		
		// left
		if (currentX > this.tileOffset.x) {
			
			var h = this.getMaxHeight();
			for (var y=this.tileOffset.y; y<h; y++) {
				this.createTile(this.tileOffset.x+this.visibleWidth, y);
				this.tiles[y][this.tileOffset.x].destroy();
			}
			
			this.tileOffset.x = currentX;

		// right
		} else if (currentX < this.tileOffset.x) {

			var h = this.getMaxHeight();
			for (var y=this.tileOffset.y; y<h; y++) {
				this.createTile(currentX, y);
				this.tiles[y][this.tileOffset.x+this.visibleWidth-1].destroy();
			}
			
			this.tileOffset.x = currentX;
		}
	},
	
	createTile: function(x, y) {
		
		var opts = felony.map[y][x];
		//temp
		if (opts.s) var t = new felony.TileSolid();
		if (!opts.s) var t = new felony.Tile();
		
		t.SetPosition(new b2Vec2(x*t.WIDTH, y*t.HEIGHT));
		if (!this.tiles[y]) this.tiles[y] = [];
		return this.tiles[y][x] = t;
	},
	
	getMaxWidth: function() {
		return Math.min(felony.map[0].length, this.tileOffset.x+this.visibleWidth);
	},
	
	getMaxHeight: function() {
		return Math.min(felony.map.length, this.tileOffset.y+this.visibleHeight);
	}
	
}, Events);
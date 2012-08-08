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
		var t = null;
		
		// up
		if (currentY > this.tileOffset.y) {
			
			if (currentY < felony.map.length-this.visibleHeight) {
				var w = this.getMaxWidth();
				var m = Math.max(0, this.tileOffset.x);
				
				for (var x=m; x<w; x++) {
					this.createTile(x, this.tileOffset.y+this.visibleHeight);
					this.destroyTile(x, this.tileOffset.y);
				}
			}
			
			this.tileOffset.y = currentY;

		// down
		} else if (currentY < this.tileOffset.y) {
			
			if (currentY > 0) {
				var w = this.getMaxWidth();
				var m = Math.max(0, this.tileOffset.x);
				
				for (var x=m; x<w; x++) {
					this.createTile(x, currentY);
					this.destroyTile(x, this.tileOffset.y+this.visibleHeight-1);
				}
			}
			
			this.tileOffset.y = currentY;
		}
		
		// left
		if (currentX > this.tileOffset.x) {
			
			if (currentX < felony.map[0].length-this.visibleWidth) {
				var h = this.getMaxHeight();
				var m = Math.max(0, this.tileOffset.y);
				
				for (var y=m; y<h; y++) {
					this.createTile(this.tileOffset.x+this.visibleWidth, y);
					this.destroyTile(this.tileOffset.x, y);
				}
			}
			
			this.tileOffset.x = currentX;

		// right
		} else if (currentX < this.tileOffset.x) {
			
			if (currentX > 0) {
				var h = this.getMaxHeight();
				var m = Math.max(0, this.tileOffset.y);
				
				for (var y=m; y<h; y++) {
					this.createTile(currentX, y);
					this.destroyTile(this.tileOffset.x+this.visibleWidth-1, y);
				}
			}
			
			this.tileOffset.x = currentX;
		}
	},
	
	createTile: function(x, y) {
		
		var opts = felony.map[y][x];
		
		//temp
		if (opts.s == 0) var t = new felony.Tile();
		if (opts.s == 1) var t = new felony.TileSolid();
		if (opts.s == 2) var t = new felony.TileRoad();
		
		t.SetPosition(new b2Vec2(x*t.WIDTH, y*t.HEIGHT));
		if (!this.tiles[y]) this.tiles[y] = [];
		return this.tiles[y][x] = t;
	},
	
	destroyTile: function(x, y) {
	
		if (!this.getInBounds(x, y)) return false;
		if (!this.tiles[y]) return false;
		if (!this.tiles[y][x]) return false;
		
		return this.tiles[y][x].destroy();
	},
	
	getInBounds: function(x, y) {
		
		if (x < 0 || y < 0) return false;
		if (x > felony.map[0].length || y > felony.map.length) return false;
		return true;
	},
	
	getMaxWidth: function() {
		return Math.min(felony.map[0].length, this.tileOffset.x+this.visibleWidth);
	},
	
	getMaxHeight: function() {
		return Math.min(felony.map.length, this.tileOffset.y+this.visibleHeight);
	}
	
}, Events);
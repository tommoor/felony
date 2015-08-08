var EventEmitter = require('events').EventEmitter;
var Map = require('../map');
var Config = require('../config');
var Tile = require('../tiles/tile');
var TileSolid = require('../tiles/tile-solid');
var TileRoad = require('../tiles/tile-road');
var Box2D = require('box-2d-web');
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var _ = require('underscore');

module.exports = _.extend({
	
	offset: new b2Vec2(0,0),
	tileOffset: new b2Vec2(0,0),
	visibleWidth: 8,	// must be divisible by 2
	visibleHeight: 6,   // must be divisible by 2
	
	tiles: [],
	
	init: function() {
		this.tile = new Tile();
		var h = this.getMaxHeight();
		var w = this.getMaxWidth();
		
		for (var y=this.tileOffset.y; y<h; y++) {
			this.tiles[y] = [];
			
			for (var x=this.tileOffset.x; x<w; x++) {
				this.createTile(x, y);
			}
		}
	},
	
	update: function(camera) {
		
    var vector = camera.position;
		var currentY = Math.round(vector.y/this.tile.HEIGHT/Config.SCALE) - (this.visibleHeight/2);
		var currentX = Math.round(vector.x/this.tile.WIDTH/Config.SCALE) - (this.visibleWidth/2);
		
		// debugging
		//if (currentX != this.tileOffset.x || currentY != this.tileOffset.y) {
		//	console.log(currentX + " - " + currentY);
		//}
		
		// up
		if (currentY > this.tileOffset.y) {
			console.log('up');
			
			//if (currentY < Map.length-this.visibleHeight) {
				var w = this.getMaxWidth();
				var m = Math.max(0, this.tileOffset.x);
				
				for (var x=m; x<w; x++) {
					this.createTile(x, this.tileOffset.y+this.visibleHeight);
					this.destroyTile(x, this.tileOffset.y);
				}
        //}
			
			this.tileOffset.y = currentY;

		// down
		} else if (currentY < this.tileOffset.y) {
			console.log('down');
			
			//if (currentY >= 0) {
				var w = this.getMaxWidth();
				var m = Math.max(0, this.tileOffset.x);
				
				for (var x=m; x<w; x++) {
					this.createTile(x, currentY);
					this.destroyTile(x, currentY+this.visibleHeight);
				}
        //}
			
			this.tileOffset.y = currentY;
		}
		
		// left
		if (currentX > this.tileOffset.x) {
			console.log('left');
			
			//if (currentX < Map[0].length-this.visibleWidth) {
				var h = this.getMaxHeight();
				var m = Math.max(0, this.tileOffset.y);
				
				for (var y=m; y<h; y++) {
					this.createTile(this.tileOffset.x+this.visibleWidth, y);
					this.destroyTile(this.tileOffset.x, y);
				}
        //}
			
			this.tileOffset.x = currentX;

		// right
		} else if (currentX < this.tileOffset.x) {
			console.log('right');
			
			//if (currentX >= 0) {
				var h = this.getMaxHeight();
				var m = Math.max(0, this.tileOffset.y);
				
				for (var y=m; y<h; y++) {
					this.createTile(currentX, y);
					this.destroyTile(currentX+this.visibleWidth, y);
				}
        //}
			
			this.tileOffset.x = currentX;
		}
	},
	
	createTile: function(x, y) {
		var why = Map.length-y-1;
    if (!Map[why]) return;
		var opts = Map[why][x];
		if (!opts) return;
		
		// temp
		if (opts.s == 0) var t = new Tile();
		if (opts.s == 1) var t = new TileSolid();
		if (opts.s == 2) var t = new TileRoad();
		
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
		if (x > Map[0].length || y > Map.length) return false;
		return true;
	},
	
	getMaxWidth: function() {
		return Math.min(Map[0].length, this.tileOffset.x+this.visibleWidth);
	},
	
	getMaxHeight: function() {
		return Math.min(Map.length, this.tileOffset.y+this.visibleHeight);
	}
	
}, EventEmitter.prototype);
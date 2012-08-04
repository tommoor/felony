felony.levelManager = _.extend({

	level: 0,
	wave: 0,
    stage: null,
	current: null,
	statistics: {},
	time_last: 0,
	time_start: 0,
	
	init: function () {
		this.stage = felony.interface.stage;
		this.bindEvents();
	},
		
	default: {
		time: 0,
		bonuses: 0,
		points: 0,
		collectables: 0,
		kills: 0,
		shots: 0,
		lives: 3,
		bombs: 3
	},
	
	restart: function () {
	    //
	},
	
	complete: function () {
		
		// record total level time
		var t = (new Date()).getTime();
		this.statistics.time = t-this.time_start;
	},
	
	incStatistic: function(key, value) {

		var value = value || 1;
		this.statistics[key] += value;
		this.trigger(key, this.statistics[key]);
	},
	
	decStatistic: function(key, value) {

		var value = value || 1;
		this.statistics[key] -= value;
		this.trigger(key, this.statistics[key]);
	},
	
    tick: function () {
		
		//
    },
	
	bindEvents: function () {
	
		_.bindAll(this, 'checkCollectables');
		this.bind('kill', this.checkCollectables); // check state of collectables on every kill event
	},
	
	checkCollectables: function (enemy) {

		var max = this.current.collectables.max || 2;
		var chance = this.current.collectables.chance || 0.05;
		if (felony.interface.layers.collectables.getNumChildren() < max) {
			// ooh, we need another lets see what our chances are like?
			if (Math.random() < chance) {
				var c = new felony.Collectable();
				c.position(enemy.x, enemy.y);
				c.kick();
				felony.interface.addChildTo(c, 'collectables')
			}
		}
	}
	
}, Events);
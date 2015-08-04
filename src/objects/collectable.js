felony.Collectable = Body.extend({

 	SPEED: 3,
  RADIUS: 15,
	POINTS: 1000,
	TYPES: ['life', 'weapon', 'bomb', 'upgrade'],
  FRICTION: 1, // collectables never slow down

	type: null,
	
  initialize: function () {
    Body.prototype.initialize.call(this);

		this.display();
	  this.chooseType();
  },
	
	collect: function () {
	
		switch(this.type) {
			case 'life':
				felony.levelManager.incStatistic('lives');
				break;
			case 'weapon':
				felony.game.player.upgradeWeapon();
				break;
			case 'bomb':
				felony.levelManager.incStatistic('bombs');
				break;
			case 'upgrade':
				felony.game.player.upgradeShip();
				break;
		}
		
		console.log(this.type + ' got');
		felony.levelManager.incStatistic('points', this.POINTS);
		felony.levelManager.incStatistic('collectables');
		this.destroy();
	},
	
	chooseType: function () {
	
		var rand = Math.floor(Math.random()*this.TYPES.length);
		this.type = this.TYPES[rand];
	},

  display: function () {
    this.body = new Shape();
    var g = this.body.graphics;
    g.clear();
    g.beginFill("orange");
    g.drawPolyStar(0,0,this.RADIUS,5, 0, -90);

    this.addChild(this.body);
  }
});

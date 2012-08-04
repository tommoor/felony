felony.Player = felony.Body.extend({

	PROTECTION: felony.game.FRAMERATE*3,
    ACCELERATION: 15,
    FRICTION: 0.5,
	WIDTH: 12,
	HEIGHT: 16,
	WEAPONS: [
		['WeaponBasic', 2],
		['WeaponBasic', 3],
		['WeaponBasic', 5]
	],
	
	protected: 0,
	weapon: null,
	weapon_current: 0,
	name: 'player',
	
    tick: function() {
        this.update();
		this.limitMovement();
		
		if (this.protected && --this.protected) {
			// todo show sprite as protected
		}
    },
	
    initialize: function () {
        felony.Body.prototype.initialize.call(this);

		this.weapon = new felony.WeaponBasic(2);
        this.bindEvents();
		this.display();
    },

	display: function () {
		
        // temporary graphic
        this.body = new Shape();
        var g = this.body.graphics;
        g.clear();
        g.beginStroke("#ffffff");
        g.beginFill("#aaaaaa");
        g.moveTo(0,-this.HEIGHT);
		g.lineTo(this.WIDTH,this.HEIGHT);
		g.lineTo(-this.WIDTH,this.HEIGHT);
		g.closePath();
        this.addChild(this.body);
	},
	
	hit: function (projectile) {
		if (!this.protected) {
			this.protected = this.PROTECTION;
			felony.levelManager.decStatistic('lives');
		}
		
		projectile.destroy();
	},
	
	upgradeWeapon: function () {
		this.weapon_current = Math.min(++this.weapon_current, this.WEAPONS.length-1);
		
		var upgrade = this.WEAPONS[this.weapon_current];
		this.weapon = new felony[upgrade[0]](upgrade[1]);
	},
	
	upgradeShip: function () {
		
	},
	
	downgradeWeapon: function () {
		
	},

    bindEvents: function () {
        _.bindAll(this, 'moveLeft', 'moveRight', 'moveUp', 'moveDown', 'fire', 'upgradeWeapon', 'upgradeShip');

        felony.controls.bind('left', this.moveLeft);
        felony.controls.bind('right', this.moveRight);
        felony.controls.bind('up', this.moveUp);
        felony.controls.bind('down', this.moveDown);
        felony.controls.bind('space', this.fire);
    },

	limitMovement: function () {
		this.x = Math.max(Math.min(this.x, felony.interface.width), 0);
		this.y = Math.max(Math.min(this.y, felony.interface.height), 0);
	},
	
    moveLeft: function () {
		this.accelerate(-this.ACCELERATION);
    },

    moveRight: function () {
        this.accelerate(this.ACCELERATION);
    },
	
    moveUp: function () {
        this.accelerate(null, -this.ACCELERATION);
    },

    moveDown: function () {
		this.accelerate(null, this.ACCELERATION);
    },

    fire: function () {
		var p = this.weapon.fire(this);
		felony.interface.addChildTo(p, 'player_projectiles');
		felony.levelManager.incStatistic('shots');
    }

});

felony.menuManager = _.extend({
	
	init: function () {
		
		this.bindEvents();
		this.go('front');
		
		return this;
	},
	
	hide: function () {
	
		$('nav').hide();
	},
	
	go: function (page) {
	
		$('nav').hide();
		$('nav.'+page).show();
	},
	
	menuItem: function (ev) {
		var method = $(ev.currentTarget).parents('li').data('method');
		if (!method) return console.log('No method on menu item');
		
		this[method]();
	},
	
	// menu methods
	play: function () {
		felony.game.restart();
	},
	
	pause: function () { 
	
		felony.game.pause();
		this.go('pause');
	},
	
	resume: function () {
	
		felony.game.resume();
		this.hide();
	},
	
	bindEvents: function () { 
	
		_.bindAll(this, 'menuItem', 'pause', 'resume');
		$('nav li a').click(this.menuItem);
		felony.controls.bind('p', this.pause);
	}

}, Events);
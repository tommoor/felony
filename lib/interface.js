felony.interface = {

	width: 0,
	height: 0,
	canvas: null,
	stage: null,
	debugger: null,
	layers: {},
	hud: {},
	shake: 0,
	
	init: function() {
		this.canvas = document.getElementById('debugger');
		this.stage = new Stage(this.canvas);

		this.resize();
		this.bindEvents();
		this.fpsCounter();
		this.createHUD();
		this.createLayers();
		this.createDebugger();
		
		return this.stage;
	},
	
	resize: function() {
		
		// calculate width from ratio
		var height = $(window).height();
		var width = $(window).width();
		
		// resize canvas dom element
		$(this.canvas).css({
		    width: width,
		    height: height
		});
		
		$('.game').css({
		    width: width,
		    height: height
		});
		
		// resize canvas context itself
		//var context = this.canvas.getContext('2d');
		//context.canvas.width = this.width = width;
		//context.canvas.height = this.height = height;
	},
	
	reset: function() {
		
		this.stage.clear();
	},
	
	createLayers: function() {
	
		this.layers.tiles = this.stage.addChild(new Container());
		this.layers.vehicles = this.stage.addChild(new Container());
		this.layers.collectables = this.stage.addChild(new Container());
		this.layers.particles = this.stage.addChild(new Container());
		this.layers.debugging = this.stage.addChild(new Shape());
	},
	
	createHUD: function() {
		this.hud.$points = $('<div class="points">0</div>');
		this.hud.$lives = $('<div class="lives"></div>');
		
		$('.hud').append(this.hud.$points)
		         .append(this.hud.$lives);
	},
	
	createDebugger: function() {
		
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(this.canvas.getContext("2d"));
		debugDraw.SetDrawScale(felony.game.SCALE);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		debugDraw.offsetX = 0;
		debugDraw.offsetY = 0;
		
		this.debugger = debugDraw;
	},
	
	update: function(vector) {
	
		// if shaking is happening
		if (this.shake > 0) {
			// reset if we are at the end of shaking
			if (--this.shake > 0) {
				// calculate a random x/y offset within bounds
				var shakex = -this.shake+(Math.random()*this.shake);
				var shakey = -this.shake+(Math.random()*this.shake);
			} else {
				var shakex = 0;
				var shakey = 0;
			}
			
			// move the actual canvas aboot
			$(this.canvas).css({
				top: shakex,
				left: shakey
			});
		}
		
		// update graphics position
		//this.stage.x = vector.x;
		//this.stage.y = vector.y;
		
		// update debugging position
		//this.debugger.offsetX = vector.x/felony.game.SCALE;
		//this.debugger.offsetY = vector.y/felony.game.SCALE;
	},
	
	addChildTo: function(children, layer) {
		
		if (!children) return;
		
		if (_.isArray(children)) {
			for (var i in children) { 
				this.layers[layer].addChild(children[i]);
			}
		} else {
			this.layers[layer].addChild(children);
		}
	},
	
	setPoints: function(points) {
		this.hud.$points.text(points);
	},
	
	setLives: function(lives) {
		this.hud.$lives.text(lives);
	},
	
	fpsCounter: function() {
		return;
		
		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		$('body').append(stats.domElement);
		
		setInterval(function() {
		
			stats.update();
			
		}, 1000 / felony.game.FRAMERATE);
	},
	
	toggleDebugging: function() {
		
		if (felony.game.debug) $(this).text('Disable Debugging');
		if (!felony.game.debug) $(this).text('Enable Debugging');
		
		felony.game.debug = !felony.game.debug;
	},
	
	bindEvents: function() {
		_.bindAll(this, 'resize', 'setPoints', 'setLives');
		
		// we want to resize the canvas keep proportions
		$(window).resize(this.resize);
		$('#toggle-debugging').click(this.toggleDebugging);
		felony.levelManager.bind('points', this.setPoints);
		felony.levelManager.bind('lives', this.setLives);
	}
};

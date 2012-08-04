var   b2Vec2 = Box2D.Common.Math.b2Vec2
 	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
 	,	b2Body = Box2D.Dynamics.b2Body
 	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
 	,	b2Fixture = Box2D.Dynamics.b2Fixture
 	,	b2World = Box2D.Dynamics.b2World
 	,	b2MassData = Box2D.Collision.Shapes.b2MassData
 	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
 	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
 	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ;

felony = {};

felony.game = {

	FRAMERATE: 30,
	
	stage: null,
	controls: null,
	player: null,
	world: null,
	
	init: function () {
		
		Zap.init();
		felony.levelManager.init();
		
		this.stage = felony.interface.init();
		this.controls = felony.controls.init();
		this.menus = felony.menuManager.init();
		this.world = new b2World(
			new b2Vec2(0, 10),    //gravity
			true                  //allow sleep
		);
	},
	
	restart: function () {
		
		this.menus.hide();
		/*
		this.player = new felony.Player();
		this.player.position(
			felony.interface.width / 2,
			felony.interface.height - 20
		);
		this.stage.addChild(this.player);
		*/
		
		// start game loop
		Ticker.addListener(this);
		Ticker.setFPS(this.FRAMERATE);
		
		felony.levelManager.restart();
	},
	
	pause: function () { 
		Ticker.setPaused(true);
	},
	
	resume: function () { 
		Ticker.setPaused(false);
	},
	
	tick: function() {
		
		// player control
		this.controls.update();
		
		// current mission
		felony.levelManager.tick();
		
		// physics
		this.world.Step(
			1 / this.FRAMERATE,   //frame-rate
			10,       //velocity iterations
			10        //position iterations
		);
		this.world.ClearForces();
		
		// rendering
		felony.interface.update();
		this.stage.update();
	}
};

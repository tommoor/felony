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
	,	b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	,	b2Joint = Box2D.Dynamics.Joints.b2Joint
	,	b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;


felony = {};

felony.game = {

	FRAMERATE: 30,
	SCALE: 60.0,
	
	debugging: false,
	stage: null,
	controls: null,
	player: null,
	world: null,
	menus: null,
	levels: null,
	
	init: function () {
		
		Zap.init();
		
		this.levels = felony.levelManager.init();
		this.stage = felony.interface.init();
		this.controls = felony.controls.init();
		this.menus = felony.menuManager.init();
		this.world = new b2World(
			new b2Vec2(0, 0),     // gravity
			true                  // allow sleep
		);
				
		this.debugging();
		
		// temp to avoid menu
		this.restart();
	},
	
	restart: function () {
		
		this.menus.hide();
		
		this.player = new felony.Vehicle(new b2Vec2(4, 4));
		this.player.bindControls();
		
		//var temp = new felony.Vehicle();
		//temp.body.SetPosition(new b2Vec2(6, 4));
		
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
		
		// physics
		this.world.Step(
			1 / this.FRAMERATE,   //frame-rate
			10,       //velocity iterations
			10        //position iterations
		);
		this.world.ClearForces();
		
		// interface
		felony.interface.update();
		
		// rendering
		this.stage.update();
		
		if (this.debugging) this.world.DrawDebugData();
	},
	
	debugging: function() {
		
		var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("world").getContext("2d"));
			debugDraw.SetDrawScale(this.SCALE/2);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		
		this.world.SetDebugDraw(debugDraw);
	}
};

felony.log = function (message) {

	if (window.console) {
		window.console.log(message);
	}
};

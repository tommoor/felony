var Box2D = require('box-2d-web');
var THREE = require('three');
var MapManager = require('./managers/map-manager');
var Vehicle = require('./objects/vehicles/vehicle');
var Controls = require('./controls');
var Config = require('./config');
var $ = require('jquery-browserify');

var b2Vec2 = Box2D.Common.Math.b2Vec2
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
	
	debug: true,
	controls: null,
	player: null,
	world: null,
	menus: null,
	levels: null,
	scene: null,
	renderer: null,
	
	init: function () {

		this.controls = Controls.init();
		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AxisHelper(1000));

		this.world = new b2World(
			new b2Vec2(0, 0),     // gravity
			true                  // allow sleep
		);
		
		//this.world.SetDebugDraw(felony.interface.debugger);
		
		this.map = MapManager.init(new b2Vec2(20, 10));
		
		// camera
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.z = 400;
		
		// setup rendering
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.getElementById('world').appendChild(this.renderer.domElement);
		
		// temp to avoid menu
		this.restart();
	},
	
	restart: function () {
		
		//this.menus.hide();
		
		this.player = new Vehicle();
		this.player.bindControls();
		this.player.SetPosition(new b2Vec2(20, 10));
		//this.camera.track(this.player);
		
		//var temp = new felony.Tile();
		//temp.body.SetPosition(new b2Vec2(6, 4));
		// this.camera.bindControls();
		
		// start game loop
		Ticker.addListener(this);
		Ticker.setFPS(Config.FRAMERATE);
		
		//felony.levelManager.restart();
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
			1 / Config.FRAMERATE,   //frame-rate
			10,       //velocity iterations
			10        //position iterations
		);
		this.world.ClearForces();
		
		this.updateCamera();
		
		// sync graphics with camera position
		//felony.interface.update();
		
		// sync tiles with camera position
		MapManager.update(this.camera.position);
		
		// rendering
		this.renderer.render(this.scene, this.camera);
	},
	
	updateCamera: function() {
		//this.target.x = -this.tracking.x+(felony.interface.width/2);
		//this.target.y = -this.tracking.y+(felony.interface.height/2);
		
		//this.offset.x += (this.target.x-this.offset.x)/this.speed;
		//this.offset.y += (this.target.y-this.offset.y)/this.speed;
		
		this.camera.position.x = this.player.x;
		this.camera.position.y = this.player.y;
	}
};

felony.log = function (message) {

	if (window.console) {
		window.console.log(message);
	}
};

felony.game.init();
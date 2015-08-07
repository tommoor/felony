var Box2D = require('box-2d-web');
var THREE = require('three');
var MapManager = require('./managers/map-manager');
var Vehicle = require('./objects/vehicles/vehicle');
var Controls = require('./controls');
var Camera = require('./camera');
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
		
    // lights
    var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    //this.scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.set(300, 400, 1000)
    directionalLight.castShadow = true;
    directionalLight.shadowCameraVisible = true;
    var d = 2000;
    var light = directionalLight;
    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;
        
    this.scene.add( directionalLight );
    this.scene.add( new THREE.DirectionalLightHelper(directionalLight, 0.2) );
    
		// camera
    this.tracker = Camera.init();
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.z = 400;
    
    
		// setup rendering
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;    
    renderer.shadowMapSoft = false;
/*
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = this.camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;*/
    this.renderer = renderer;

		document.getElementById('world').appendChild(this.renderer.domElement);
		
		// action
		this.restart();
	},
	
	restart: function () {
		this.player = new Vehicle();
		this.player.bindControls();
		this.player.SetPosition(new b2Vec2(20, 10));
		this.tracker.track(this.player, true);

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

		// sync tiles with camera position
		MapManager.update(this.camera.position);
		
		// rendering
		this.renderer.render(this.scene, this.camera);
	},
	
	updateCamera: function() {
    var pos = this.tracker.update();

		this.camera.position.x = pos.x;
		this.camera.position.y = pos.y;
	}
};

felony.game.init();
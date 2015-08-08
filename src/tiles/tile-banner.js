var Tile = require('./tile-road');
var THREE = require('three');

module.exports = Tile.extend({

	render: function() {
    this.display = new THREE.Object3D(); //create an empty container

		var geometry = new THREE.BoxGeometry(10, 150, 50);
    var material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, vertexColors: THREE.VertexColors } );
		var banner = new THREE.Mesh(geometry, material);
		banner.position.z = 150;
    banner.castShadow = true;
    this.display.add(banner);
    
    
		// road
		var geometry = new THREE.PlaneGeometry(150, 150);
		var material = new THREE.MeshLambertMaterial({ color: this.COLOUR });
		var road = new THREE.Mesh(geometry, material);
		road.receiveShadow = true;
    this.display.add(road);
    
		return this.display;
	}
});
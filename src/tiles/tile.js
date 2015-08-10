var Body = require('../objects/body');
var THREE = require('three');

module.exports = Body.extend({
	
	WIDTH: 4,
	HEIGHT: 4,
	COLOUR: 0xa2f985,
	
	render: function() {
		
		// temporary graphic
		var geometry = new THREE.PlaneGeometry(100, 100);
		var material = new THREE.MeshLambertMaterial({ color: this.COLOUR });
		this.display = new THREE.Mesh(geometry, material);
		this.display.receiveShadow = true;
    return this.display;
	}
});
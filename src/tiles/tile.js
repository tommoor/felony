var Body = require('../objects/body');
var THREE = require('three');

module.exports = Body.extend({
	
	WIDTH: 5,
	HEIGHT: 5,
	COLOUR: 0xa2f985,
	
	render: function() {
		
		// temporary graphic
		var geometry = new THREE.PlaneGeometry(150, 150);
		var material = new THREE.MeshLambertMaterial({ color: this.COLOUR });
		this.display = new THREE.Mesh(geometry, material);
		this.display.receiveShadow = true;
    return this.display;
	}
});
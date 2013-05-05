felony.Tile = Body.extend({
	
	WIDTH: 5,
	HEIGHT: 5,
	COLOUR: 0xa2f985,
	
	render: function() {
		
		// temporary graphic
		var geometry = new THREE.PlaneGeometry(150, 150);
		var material = new THREE.MeshBasicMaterial({ color: this.COLOUR });
		
		return this.display = new THREE.Mesh(geometry, material);
	}
});
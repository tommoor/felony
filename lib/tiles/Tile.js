felony.Tile = Body.extend({
	
	WIDTH: 5,
	HEIGHT: 5,
	
	render: function() {
		
		// temporary graphic
		var geometry = new THREE.PlaneGeometry(200, 200);
		var material = new THREE.MeshBasicMaterial({ color: 0xe0e0e0 });
		
		return this.display = new THREE.Mesh(geometry, material);
	}
});
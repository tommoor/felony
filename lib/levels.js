felony.levels = [{
	name: 'Level 1',
	collectables: {
		chance: 0.5,
		max: 2
	},
	waves: [[{
		class: 'Enemy',	// type of enemy
		delay: 2,		// with this much delay between
		multiple: 100,
		offset: 1,
		movement: [
			[50, 0],
			[10, 20],
			[90, 30],
			[10, 40],
			[90, 20],
			[70, 110]
		]
	},{
		class: 'Enemy',	// type of enemy
		delay: 2,		// with this much delay between
		multiple: 100,
		offset: 1,
		movement: [
			[50, 0],
			[90, 40],
			[10, 60],
			[90, 40],
			[10, 80],
			[30, 110]
		]
	}]]
}];
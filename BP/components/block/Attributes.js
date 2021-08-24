export default defineComponent(({ name, template, schema }) => {
	name('furnideco:attributes')
	schema({
		map_color: 'string',
		strength: 'array',
		flameable: 'array',
		solidness: 'float'
	})

	template(({ map_color = 'oak', strength = [1, 1], flameable = false, solidness = 0 }, { create, identifier }) => {

		// List of pre-set map colors
		const mapColors = new Map([
			[ 'oak', '#b8945f' ],
			[ 'spruce', '#82613a' ],
			[ 'birch', '#d7c185' ],
			[ 'jungle', '#b88764' ],
			[ 'acacia', '#ba6337' ],
			[ 'dark_oak', '#4f3218' ],
			[ 'crimson', '#7e3a56' ],
			[ 'warped', '#398382' ]
		])

		// List of known materials
		const materials = [
			'oak',
			'spruce',
			'birch',
			'jungle',
			'acacia',
			'dark_oak',
			'crimson',
			'warped'
		]

		if (flameable != false) {
			create(
				{
					'minecraft:flammable': {
						flame_odds: flameable[0],
						burn_odds: flameable[1]
					}
				},
				'minecraft:block/components'
			)
		}

		create(
			{
				'minecraft:display_name': identifier.split(':')[1],
				'minecraft:map_color': (mapColors.has(map_color) ? mapColors.get(map_color) : map_color),
				'minecraft:loot': `loot_tables/${identifier.split(/[\.\:]/)[1]}/${materials.includes(identifier.split('.')[1]) ? identifier.split('.')[1] + '.' : ''}${materials.includes(identifier.split('.')[1]) ? identifier.split('.')[2] : identifier.split('.')[1]}.loot.json`,
				'minecraft:destroy_time': strength[0],
				'minecraft:explosion_resistance': strength[1],
				'minecraft:block_light_absorption': solidness,
				'minecraft:breathability': (solidness > 0 ? 'solid' : 'air'),

			},
			'minecraft:block/components'
		)

	})
})

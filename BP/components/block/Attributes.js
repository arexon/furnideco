export default defineComponent(({ name, template, schema }) => {
	name('furnideco:attributes')
	schema({
		description: 'Sets the general properties of the block.',
		type: 'object',
		properties: {
			map_color: {
				description: 'Material or hex color to use for map color.',
				type: 'string'
			},
			loot_table: {
				description: 'Loot table path to use.',
				type: 'string'
			},
			strength: {
				description: 'Sets hardness & resistance.',
				type: 'array',
				items: { type: 'number' }
			},
			flameable: {
				description: 'Sets how resistant the block to fire is.',
				type: 'array',
				items: { type: 'number' }
			},
			solidness: {
				description: 'Specifies whether the block is solid or not.',
				type: 'number'
			}
		}
	})

	template(({ map_color = '', loot_table = false, strength = [1, 1], flameable = false, solidness = 0 }, { create, identifier }) => {

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

		create(
			{
				'minecraft:display_name': identifier.split(':')[1],
				'minecraft:creative_category': {
					category: 'Construction',
					group: 'itemGroup.name.Construction'
				},
				'minecraft:map_color': (mapColors.has(map_color) ? mapColors.get(map_color) : map_color),
				...(loot_table && {
					'minecraft:loot': `loot_tables/${loot_table}.loot.json`
				}),
				'minecraft:destroy_time': strength[0],
				'minecraft:explosion_resistance': strength[1],
				'minecraft:block_light_absorption': solidness,
				'minecraft:breathability': (solidness > 0 ? 'solid' : 'air'),
				...(flameable && {
					'minecraft:flammable': {
						flame_odds: flameable[0],
						burn_odds: flameable[1]
					}
				})
			},
			'minecraft:block/components'
		)
	})
})

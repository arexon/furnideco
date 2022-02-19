export default defineComponent(({ name, template, schema }) => {
	name('furnideco:attributes')
	schema({
		description: 'Sets the general properties of the block.',
		type: 'object',
		properties: {
			category: {
				description: 'Specifies which category the block will apear on. (Default: construction)',
				enum: [ 'construction', 'items' ]
			},
			map_color: {
				description: 'Material name or hex color to use for the map color.',
				anyOf: [
					{
						enum: [ 'oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'crimson', 'warped' ]
					},
					{
						type: 'string'
					}
				]
			},
			loot_table: {
				description: 'Loot table path to use.',
				type: 'string'
			},
			strength: {
				description: 'Sets hardness & resistance.',
				type: 'array',
				minItems: 2,
				maxItems: 2,
				items: { type: 'number' }
			},
			flameable: {
				description: 'Sets how resistant the block to fire is.',
				type: 'array',
				minItems: 2,
				maxItems: 2,
				items: { type: 'number' }
			},
			solidness: {
				description: 'Specifies whether the block is solid or not.',
				type: 'number',
				maximum: 1
			},
			geometry: {
				description: 'Defines the geometry to use.',
				type: 'string'
			},
			collision: {
				description: 'Sets the collision of the block.',
				type: 'object',
				properties: {
					aim: {
						description: 'The aim collision. Disabled if set to false.',
						anyOf: [
							{
								type: 'array',
								minItems: 6,
								maxItems: 6,
								items: { type: 'number' }
							},
							{
								enum: [ false ]
							}
						]
					},
					entity: {
						description: 'The entity collision. Disabled if set to false.',
						anyOf: [
							{
								type: 'array',
								minItems: 6,
								maxItems: 6,
								items: { type: 'number' }
							},
							{
								enum: [ false ]
							}
						]
					}
				}
			}
		}
	})

	template(({
		category = 'construction',
		map_color,
		loot_table = false,
		strength,
		flameable = false,
		solidness,
		geometry,
		collision = {}
	}:{
		category: string,
		map_color: string,
		loot_table: boolean|string,
		strength: number[]
		flameable: boolean
		solidness: number
		geometry: string
		collision: any
	}, { create, identifier }) => {

		const capitalize = (word: string) => word && word[0].toUpperCase() + word.slice(1)

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
					category: capitalize(category),
					group: `itemGroup.name.${capitalize(category)}`
				},
				'minecraft:map_color': (mapColors.has(map_color) ? mapColors.get(map_color) : map_color),
				...(loot_table && {
					'minecraft:loot': `loot_tables/block/${loot_table}.loot.json`
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
				}),
				...(geometry && {
					'minecraft:geometry': `geometry.${geometry}`
				}),
				...(collision.aim !== undefined && {
					'minecraft:aim_collision': (!collision.aim ? false : {
						origin: collision.aim.slice(0, 3),
						size: collision.aim.slice(3, 6)
					})
				}),
				...(collision.block !== undefined && {
					'minecraft:entity_collision': (!collision.block ? false : {
						origin: collision.block.slice(0, 3),
						size: collision.block.slice(3, 6)
					})
				})
			},
			'minecraft:block/components'
		)
	})
})

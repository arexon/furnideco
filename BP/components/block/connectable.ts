export default defineComponent(({ name, template, schema }) => {
	name('furnideco:connectable')
	schema({
		description: 'Allows the block to connect to neighboring blocks.',
		type: 'object',
		properties: {
			tag: {
				description: 'The neighbor block tag.',
				type: 'string'
			},
			directions: {
				description: 'Outlines which directions can be connected to.',
				type: 'array',
				items: {
					type: 'string',
					enum: [ 'north', 'east', 'south', 'west', 'up', 'down' ]
				}
			},
			parts: {
				description: 'part_visiblity method | Defines when to hide specific parts of the geometry. Not compatible with the "geometries" method.',
				type: 'object',
				additionalProperties: false,
				patternProperties: {
					'^[a-z0-9_-]+$': {
						enum: [ 'north', 'east', 'south', 'west', 'up', 'down' ]
					}
				}
			},
			geometries: {
				description: 'geometries method | Defines a list of geometries and when to hide each one. Not compatible with the "part_visiblity" method.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'Definition name of the geometry.',
							type: 'string'
						},
						conditions: {
							description: 'When to show the geometry',
							type: 'array',
							items: { enum: [ 'north', 'east', 'south', 'west', 'up', 'down' ] }
						}
					}
				}
			}
		}
	})

	template(({ tag, directions, parts = {}, geometries = [] }:{ tag: string, directions: string[], parts: any, geometries: any }, { create, identifier }) => {

		const positions = new Map([
			[ 'north', [ 0, 0, -1 ] ],
			[ 'east', [ 1, 0, 0 ] ],
			[ 'south', [ 0, 0, 1 ] ],
			[ 'west', [ -1, 0, 0 ] ],
			[ 'up', [ 0, 1, 0 ] ],
			[ 'down', [ 0, -1, 0 ] ]
		])

		// Maps through directions and creates a property for each direction
		directions.map((dir: string) => {
			create(
				{
					[`p:${dir}_neighbor`]: [ false, true ]
				},
				'minecraft:block/description/properties'
			)
		})

		// Loops through parts and creates part visibility rules for each part
		if (parts) {
			for (const [bone, dir] of Object.entries(parts)) {
				create(
					{
						[bone]: `q.block_property('p:${dir}_neighbor')`
					},
					'minecraft:block/components/minecraft:part_visibility/rules'
				)
			}
		}
		// Maps through geometries and creates a permutations for each geo
		if (geometries) {
			create(
				{
					permutations: geometries.map(geo => ({
						...(geo.conditions.length === 1 ? {
							condition: `q.block_property('p:${geo.conditions}_neighbor')`
						} : {
							condition: `${geo.conditions.map((condition: string) => `q.block_property('p:${condition}_neighbor')`).join('&&')}`
						}),
						components: {
							'minecraft:geometry': `geometry.${geo.name}`
						}
					}))
				},
				'minecraft:block'
			)
		}

		create(
			{
				'minecraft:ticking': {
					looping: true,
					range: [ 0, 0 ],
					on_tick: {
						event: 'e:update.neighbors'
					}
				}
			},
			'minecraft:block/components'
		)

		// Maps through directions and creates a set_block_property entry for each direction
		directions.map((dir: string) => {
			create(
				{
					[`p:${dir}_neighbor`]: `q.block_neighbor_has_any_tag(${positions.get(dir)}, '${tag}') ? true : false`
				},
				'minecraft:block/events/e:update.neighbors/set_block_property'
			)
		})
	})
})

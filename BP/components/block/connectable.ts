export default defineComponent(({ name, template, schema }) => {
	name('furnideco:connectable')
	schema({
		description: 'Allows the block to connect to neighboring blocks.',
		type: 'object',
		properties: {
			tag: {
				description: `The block's tag.`,
				type: 'string'
			},
			faces: {
				description: 'Defines the faces in which neighboring blocks are allowed to connect.',
				type: 'array',
				items: {
					type: 'string',
					enum: [ 'north', 'east', 'south', 'west', 'up', 'down' ]
				}
			},
			parts: {
				description: 'Defines which parts to show/hide.',
				type: 'object',
				additionalProperties: false,
				patternProperties: {
					'^[a-z0-9_-]+$': {
						enum: [ 'north', 'east', 'south', 'west', 'up', 'down' ]
					}
				}
			},
			geometries: {
				description: 'Defines a list of geometries to show/hide.',
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

	template(({ tag, faces, parts = {}, geometries = [] }:{ tag: string, faces: string[], parts: any, geometries: any }, { create, identifier }) => {

		const positions = new Map([
			[ 'north', [ 0, 0, -1 ] ],
			[ 'east', [ 1, 0, 0 ] ],
			[ 'south', [ 0, 0, 1 ] ],
			[ 'west', [ -1, 0, 0 ] ],
			[ 'up', [ 0, 1, 0 ] ],
			[ 'down', [ 0, -1, 0 ] ]
		])

		// Maps through faces and creates property for each face
		faces.map((face: string) => {
			create(
				{
					[`p:${face}_neighbor`]: [ false, true ]
				},
				'minecraft:block/description/properties'
			)
		})

		// Loops through parts and creates part visibility rules for each part
		if (parts) {
			for (const [bone, face] of Object.entries(parts)) {
				create(
					{
						[bone]: `q.block_property('p:${face}_neighbor')`
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

		// Maps through faces and creates a set_block_property entry for each face
		faces.map((face: string) => {
			create(
				{
					[`p:${face}_neighbor`]: `q.block_neighbor_has_any_tag(${positions.get(face)}, '${tag}') ? true : false`
				},
				'minecraft:block/events/e:update.neighbors/set_block_property'
			)
		})
	})
})

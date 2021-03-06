export default defineComponent(({ name, template, schema }) => {
	name('furnideco:facing')
	schema({
		description: 'Makes the block face the direction its placed on.',
		type: 'object',
		properties: {
			faces: {
				description: 'Defines faces to use.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'The geometry definition name.',
							type: 'string'
						},
						collision: {
							description: 'Collision of the geometry.',
							type: 'object',
							properties: {
								aim: {
									description: 'The aim collision. Gets disabled if set to false.',
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
									description: 'The entity collision. Gets disabled if set to false.',
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
				}
			}
		}
	})

	template(({ faces = [] }:{ faces: any[] }, { create }) => {

		create(
			{
				'p:facing': [ 0, 1, 2, 3, 4, 5 ]
			},
			'minecraft:block/description/properties'
		)

		// Loops and create 6 permutations for faces
		for (let i = 0; i < 6; i++) {
			const directions = [ 0, 180, 90, 270 ]
			const face: any = faces[i > 1 ? 2 : i]
			create(
				{
					condition: `q.block_property('p:facing') == ${i}`,
					components: {
						'minecraft:geometry': `geometry.${face.name}`,
						'minecraft:aim_collision': (!face.collision.aim ? false : {
							origin: face.collision.aim.slice(0, 3),
							size: face.collision.aim.slice(3, 6)
						}),
						'minecraft:entity_collision': (!face.collision.block ? false : {
							origin: face.collision.block.slice(0, 3),
							size: face.collision.block.slice(3, 6)
						}),
						...(i > 1 && {
							'minecraft:rotation': [ 0, directions[i - 2], 0 ]
						})
					}
				},
				'minecraft:block/permutations'
			)
		}

		create(
			{
				'minecraft:on_player_placing': {
					event: 'e:set.facing'
				}
			},
			'minecraft:block/components'
		)

		create(
			{
				'e:set.facing': {
					set_block_property: {
						'p:facing': 'q.block_face'
					}
				}
			},
			'minecraft:block/events'
		)
	})
})

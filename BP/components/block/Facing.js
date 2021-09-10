export default defineComponent(({ name, template, schema }) => {
	name('furnideco:facing')
	schema({
		description: 'Makes the block directional on placing.',
		type: 'object',
		properties: {
			faces: {
				description: 'Array of faces to apply.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'Name of the geometry to use.',
							type: 'string'
						},
						hitbox: {
							description: 'Hitbox of the block.',
							type: 'object',
							properties: {
								pick: { type: 'array' },
								entity: { type: 'array' }
							}
						}
					}
				}
			}
		}
	})

	template(({ faces = [] }, { create }) => {

		create(
			{
				'p:facing': [ 0, 1, 2, 3, 4, 5 ]
			},
			'minecraft:block/description/properties'
		)

		// Loop and create 6 permutations for faces
		for (let i = 0; i < 6; i++) {
			const directions = [ 0, 180, 90, 270 ]
			const face = faces[i > 1 ? 2 : i]
			create(
				{
					condition: `q.block_property('p:facing') == ${i}`,
					components: {
						'minecraft:geometry': `geometry.${face.name}`,
						'minecraft:pick_collision': {
							origin: face.hitbox.pick.slice(0, 3),
							size: face.hitbox.pick.slice(3, 6)
						},
						'minecraft:entity_collision': (face.hitbox.entity == false ? false : {
							origin: face.hitbox.entity.slice(0, 3),
							size: face.hitbox.entity.slice(3, 6)
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

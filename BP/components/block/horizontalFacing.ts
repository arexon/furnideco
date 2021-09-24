export default defineComponent(({ name, template, schema }) => {
	name('furnideco:horizontal_facing')
	schema({
		description: 'Makes the block horizontally face the player on placing.'
	})

	template(({}, { create }) => {

		const directions = [ 180, 0, 270, 90 ]

		create(
			{
				'p:facing': [ 0, 1, 2, 3 ]
			},
			'minecraft:block/description/properties'
		)

		// Maps through directions and creates a permutation for each direction
		create(
			{
				permutations: directions.map((direction, i) => ({
					condition: `q.block_property('p:facing') == ${i}`,
					components: {
						'minecraft:rotation': [ 0, direction, 0 ]
					}
				}))
			},
			'minecraft:block'
		)

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
						'p:facing': 'q.cardinal_facing_2d - 2'
					}
				}
			},
			'minecraft:block/events'
		)
	})
})

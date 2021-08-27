export default defineComponent(({ name, template, schema }) => {
	name('furnideco:lightable')
	schema({
		emission: 'number'
	})

	template(({ emission = 1 }, { create }) => {

		create(
			{
				'p:is_lit': [ false, true ]
			},
			'minecraft:block/description/properties'
		)

		create(
			[
				{
					condition: `!q.block_property('p:is_lit')`,
					components: {
						'minecraft:block_light_emission': 0
					}
				},
				{
					condition: `q.block_property('p:is_lit')`,
					components: {
						'minecraft:block_light_emission': emission
					}
				}
			],
			'minecraft:block/permutations'
		)

		create(
			{
				'minecraft:on_interact': {
					condition: 'q.is_sneaking',
					event: 'e:toggle'
				}
			},
			'minecraft:block/components'
		)

		create(
			{
				'e:toggle': {
					set_block_property: {
						'p:is_lit': `q.block_property('p:is_lit') ? false : true`
					},
					run_command: {
						command: 'playsound furnideco.switch @p ~~~'
					}
				}
			},
			'minecraft:block/events'
		)
	})
})

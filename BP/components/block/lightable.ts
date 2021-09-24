export default defineComponent(({ name, template, schema }) => {
	name('furnideco:lightable')
	schema({
		description: 'Makes the block conditionally glow.',
		type: 'object',
		properties: {
			emission: {
				description: 'The light level.',
				type: 'number',
				maximum: 1
			}
		}
	})

	template(({ emission }:{ emission: number }, { create }) => {

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
						'minecraft:block_light_emission': emission,
						'minecraft:ticking': {
							looping: true,
							range: [ 1, 1 ],
							on_tick: {
								event: 'e:play.sparkles'
							}
						}
					}
				}
			],
			'minecraft:block/permutations'
		)

		create(
			{
				'minecraft:on_interact': {
					event: 'e:toggle'
				}
			},
			'minecraft:block/components'
		)

		create(
			{
				'e:toggle': {
					set_block_property: {
						'p:is_lit': `!q.block_property('p:is_lit')`
					},
					run_command: {
						command: 'playsound furnideco.switch @p ~~~'
					}
				},
				'e:play.sparkles': {
					run_command: {
						command: 'particle furnideco:sparkles ~~~'
					}
				}
			},
			'minecraft:block/events'
		)
	})
})

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
			},
			part: {
				description: 'Material instance part name.',
				type: 'string'
			},
			texture: {
				description: 'Definition name of a texture.',
				type: 'string'
			}
		}
	})

	template(({ emission, part, texture }:{ emission: number, part: string, texture: string }, { create }) => {

		create(
			{
				'p:is_lit': [ false, true ]
			},
			'minecraft:block/description/properties'
		)

		create(
			[
				{
					condition: '(1.0)',
					components: {
						'minecraft:material_instances': {
							'*': {
								texture: texture,
								render_method: 'alpha_test',
								ambient_occlusion: false
							}
						}
					}
				},
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
						'minecraft:material_instances': {
							[part]: {
								texture: texture,
								render_method: 'alpha_test',
								face_dimming: false
							}
						},
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

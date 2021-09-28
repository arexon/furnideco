export default defineComponent(({ name, template, schema }) => {
	name('furnideco:paintable')
	schema({
		description: 'Allows the block to be painted.',
		type: 'object',
		properties: {
			colors: {
				description: 'Amount of colors that can be painted on the block.',
				type: 'number'
			},
			texture: {
				description: 'The first part of the texture definition name.',
				type: 'string'
			},
			part: {
				description: 'Material instance part name.',
				type: 'string'
			},
			base: {
				description: 'Specifies the block base texture',
				type: 'string'
			}
		}
	})

	template(({ colors, texture, part = '*', base }:{ colors: number, texture: string, part: string, base: string }, { create }) => {

		const createNumberArray = (value: number): number[] => [...Array(value).keys()]

		// Creates an integer property from colors length
		create(
			{
				'p:color': createNumberArray(colors)
			},
			'minecraft:block/description/properties'
		)

		if (base) {
			create(
				{
					condition: '(1.0)',
					components: {
						'minecraft:material_instances': {
							'*': {
								texture: base,
								render_method: 'alpha_test',
								ambient_occlusion: false
							}
						}
					}
				},
				'minecraft:block/permutations'
			)
		}

		// Creates a number array from colors length and maps through it creating a permutation for texture
		create(
			{
				permutations: createNumberArray(colors).map(i => ({
					condition: `q.block_property('p:color') == ${i}`,
					components: {
						'minecraft:material_instances': {
							[part]: {
								texture: `${texture}.color_${i}`,
								render_method: 'alpha_test',
								ambient_occlusion: false
							}
						}
					}
				}))
			},
			"minecraft:block"
		)

		create(
			{
				'e:cycle_color': {
					set_block_property: {
						'p:color': `q.block_property('p:color') == ${colors - 1} ? 0 : q.block_property('p:color') + 1`
					},
					run_command: {
						command: [
							'playsound furnideco.paint @p ~~~',
							'particle furnideco:paint ~~~'
						]
					}
				}
			},
			'minecraft:block/events'
		)
	})
})

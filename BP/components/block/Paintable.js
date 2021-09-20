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
			geometry_name: {
				description: 'The geometry definition name.',
				type: 'string'
			},
			part_name: {
				description: 'Material instance part name.',
				type: 'string'
			}
		}
	})

	template(({ colors = 0, geometry_name, part_name = '*' }, { create }) => {

		const createNumberArray = value => [...Array(value).keys()]

		// Creates a number property based on colors value
		create(
			{
				'p:color': createNumberArray(colors)
			},
			'minecraft:block/description/properties'
		)

		// Creates a number array and loops through it creating a permutation for each entry
		create(
			{
				permutations: createNumberArray(colors).map(i => ({
					condition: `q.block_property('p:color') == ${i}`,
					components: {
						'minecraft:material_instances': {
							[part_name]: {
								texture: `${geometry_name}.color_${i}`,
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
						command: 'function customization/cycle_color'
					}
				}
			},
			'minecraft:block/events'
		)
	})
})

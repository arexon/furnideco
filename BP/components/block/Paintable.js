export default defineComponent(({ name, template, schema }) => {
	name('furnideco:paintable')
	schema({
		colors: 'number',
		part: 'string'
	})

	template(({ colors = 0, part = '*' }, { create, identifier }) => {

		let colorsCount = []
		for (let i = 0; i < colors; i++) colorsCount.push(i)

		create(
			{
				'p:color': colorsCount
			},
			'minecraft:block/description/properties'
		)

		create(
			{
				permutations: colorsCount.map(i => ({
					condition: `q.block_property('p:color') == ${i}`,
					components: {
						'minecraft:material_instances': {
							[part]: {
								texture: `rustic.${identifier.split('.')[2]}.color_${i}`,
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
						'p:color': `q.block_property('p:color') == 15 ? 0 : q.block_property('p:color') + 1`
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

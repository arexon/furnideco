export default defineComponent(({ name, template, schema }) => {
	name('furnideco:paintable')
	schema({
		"color_count": "number",
		"part_name": "string"
	})

	template(({ colors_count = 7, part_name = '*' }, { create, identifier }) => {

		for (let i = 0; i <= colors_count; i++) {
			const color = {
				"condition": "q.block_property('p:color') == " + i,
				"components": {
					"minecraft:material_instances": {
						[part_name]: {
							"texture": "rustic." + identifier.split('.')[2] + ".color_" + i,
							"render_method": "alpha_test",
							"ambient_occlusion": false
						}
					}
				}
			}
			create(
				{
					...color
				},
				"minecraft:block/permutations"
			)
		}

		create(
			{
				"e:cycle_color": {
					"sequence": [
						{
							"condition": "q.is_sneaking",
							"set_block_property": {
								"p:color": "q.block_property('p:color') == 15 ? 0 : q.block_property('p:color') + 1"
							},
							"run_command": {
								"command": [
									"function customization/cycle_color"
								]
							}
						}
					]
				}
			},
			"minecraft:block/events"
		)
	})
})

export default defineComponent(({ name, template, schema }) => {
	name('furnideco:attributes')
	schema({
		"map_color": "string",
		"strength": "array",
		"flameable": "array",
		"solidness": "float"
	})

	template(({ map_color = 'oak', strength = [1, 1], flameable = null, solidness = 0 }, { create, identifier }) => {

		const mapColors = new Map([
			[ 'oak', '#b8945f' ],
			[ 'spruce', '#82613a' ],
			[ 'birch', '#d7c185' ],
			[ 'jungle', '#b88764' ],
			[ 'acacia', '#ba6337' ],
			[ 'dark_oak', '#4f3218' ],
			[ 'crimson', '#7e3a56' ],
			[ 'warped', '#398382' ]
		])

		if (flameable != null) {
			create(
				{
					"minecraft:flammable": {
						"flame_odds": flameable[0],
						"burn_odds": flameable[1]
					}
				},
				"minecraft:block/components"
			)
		}

		create(
			{
				"minecraft:display_name": identifier.split(':')[1],
				"minecraft:map_color": mapColors.get(map_color),
				"minecraft:loot": "loot_tables/" + identifier.split(/[\.\:]/)[1] + "/" + identifier.split('.')[2] + "/" + identifier.split('.')[1] + "." + identifier.split('.')[2] + ".loot.json",
				"minecraft:destroy_time": strength[0],
				"minecraft:explosion_resistance": strength[1],
				"minecraft:block_light_absorption": solidness,
				"minecraft:breathability": (solidness > 0 ? 'solid' : 'air'),

			},
			"minecraft:block/components"
		)

	})
})

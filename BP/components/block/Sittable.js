export default defineComponent(({ name, template, schema }) => {
	name('furnideco:sittable')
	schema({
		directional: 'boolean'
	})

	template(({ directional = false }, { create, identifier }) => {

		create(
			{
				'minecraft:on_interact': {
					condition: `q.get_equipped_item_name != 'paint_brush' && !q.is_sneaking`,
					event: 'e:add.rider'
				},
				'minecraft:on_placed': {
					event: 'e:add.seat'
				}
			},
			'minecraft:block/components'
		)

		const directions = [
			'e:set.direction.east',
			'e:set.direction.south',
			'e:set.direction.west'
		]
		create(
			{
				'e:add.seat': (
					directional ? {
						sequence: directions.map((direction, i) => ({
							condition: `q.block_property('p:direction') == ${i}`,
							run_command: {
								command: `summon furnideco:seat.${identifier.split(/[\.\:]/)[1]}_${identifier.split(/[\.\:]/)[3]} ~~~ ${direction}`
							}
						}))
					} : {
						run_command: {
							command: `summon furnideco:seat.${identifier.split(/[\.\:]/)[1]}_${identifier.split(/[\.\:]/)[3]} ~~~`
						}
					}
				)
			},
			'minecraft:block/events'
		)

		create(
			{
				'e:add.rider': {
					sequence: [
						{
							run_command: {
								command: 'tag @s add pre_sitting',
								target: 'other'
							}
						},
						{
							run_command: {
								command: 'event entity @e[family=seat, r=0.1] e:add.rider'
							}
						}
					]
				}
			},
			'minecraft:block/events'
		)
	})
})

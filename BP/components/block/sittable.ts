export default defineComponent(({ name, template, schema }) => {
	name('furnideco:sittable')
	schema({
		description: 'Allows the player to sit on the block.',
		type: 'object',
		properties: {
			name: {
				description: 'The identifier of the block without a namespace.',
				type: 'string'
			},
			directional: {
				description: 'Specifies if the seat is directional.',
				type: 'boolean'
			}
		}
	})

	template(({ name, directional = false }:{ name: string, directional: boolean }, { create }) => {

		const directions = [
			'e:set.direction.east',
			'e:set.direction.south',
			'e:set.direction.west'
		]

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

		create(
			{
				'e:add.seat': (
					directional ? {
						sequence: directions.map((direction, i) => ({
							condition: `q.block_property('p:direction') == ${i}`,
							run_command: {
								command: `summon furnideco:seat.${name} ~~~ ${direction}`
							}
						}))
					} : {
						run_command: {
							command: `summon furnideco:seat.${name} ~~~`
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

export default defineComponent(({ name, template, schema }) => {
	name('furnideco:seat')
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
			'e:set.direction.north',
			'e:set.direction.east',
			'e:set.direction.south',
			'e:set.direction.west'
		]

		create(
			{
				'minecraft:on_interact': {
					condition: `q.get_equipped_item_name != 'paint_brush' && !q.is_sneaking`,
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
							condition: `q.block_property('p:facing') == ${i}`,
							run_command: {
								command: `summon furnideco:seat.${name} ~~~ ${direction}`
							}
						}))
					} : {
						sequence: [
							{
								run_command: {
									command: `summon furnideco:seat.${name} ~~~`
								}
							}
						]
					}
				)
			},
			'minecraft:block/events'
		)
	})
})

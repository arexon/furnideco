export default defineComponent(({ name, template, schema }) => {
	name('furnideco:plantable')
	schema({
		description: 'Allows the player to interactively place/remove plants.',
		type: 'object',
		properties: {
			plants: {
				description: 'Defines the plants to use.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'Identifier of the plant.',
							type: 'string'
						},
						geometry: {
							description: 'The corresponding geometry definition name to the plant.',
							type: 'string'
						},
						loot_table: {
							description: 'Loot table path.',
							type: 'string'
						}
					}
				}
			},
			geometry: {
				description: 'The first part of the geometry definition name.',
				type: 'string'
			}
		}
	})

	template(({ plants = {}, geometry = '' }:{ plants: any, geometry: string }, { create }) => {

		const createNumberArray = (value: number): number[] => [...Array(value).keys()]

		// Creates an integer property based on plants.length
		create(
			{
				'p:plant': createNumberArray(plants.length)
			},
			'minecraft:block/description/properties'
		)

		// Maps plants array and creates the necessary permutations and events for each plant
		plants.map((plant: any, i: number) => {
			create(
				{
					condition: `q.block_property('p:plant') == ${i}`,
					components: {
						'minecraft:geometry': `geometry.${geometry}.${plant.geometry}`,
						...(i === 0 && {
							'minecraft:on_interact': {
								condition: '!q.is_sneaking',
								event: 'e:add.plant'
							}
						}),
						...(i > 0 && {
							'minecraft:on_interact': {
								condition: 'q.is_sneaking',
								event: 'e:remove.plant'
							}
						}),
						...(i > 0 && {
							'minecraft:loot': `loot_tables/${plant.loot_table}.loot.json`
						})
					}
				},
				'minecraft:block/permutations'
			)
		})

		// Creates the remove plant event
		create(
			{
				'e:add.plant': {
					sequence: plants.slice(1).map((plant: any, i: number) => ({
						condition: `q.get_equipped_item_name == '${plant.name}'`,
						decrement_stack: {},
						set_block_property: {
							'p:plant': i + 1
						},
						run_command: {
							command: [
								'playsound block.sweet_berry_bush.place @p ~~~',
								'particle furnideco:green_sparkles ~ ~0.75 ~'
							]
						}
					}))
				},
				'e:remove.plant': {
					sequence: plants.map((plant: any, i: number) => ({
						...(i === 0 && {
							set_block_property: {
								'p:plant': 0
							},
							run_command: {
								command: [
									'playsound block.sweet_berry_bush.break @p ~~~',
									'particle furnideco:dust ~ ~0.75 ~'
								]
							}
						}),
						...(i > 0 && {
							condition: `q.block_property('p:plant') == ${i}`,
							run_command: {
								command: `give @s minecraft:${plant.name}`,
								target: 'other'
							}
						})
					}))
				}
			},
			'minecraft:block/events'
		)
	})
})

export default defineComponent(({ name, template, schema }) => {
	name('furnideco:plantable')
	schema({
		description: 'Allows the player to interactivly place/remove plants.',
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
						texture: {
							description: 'The corresponding texture definition name to the plant.',
							type: 'string'
						},
						loot_table: {
							description: 'Loot table path.',
							type: 'string'
						}
					}
				}
			},
			texture: {
				description: 'The first part of the texture definition name.',
				type: 'string'
			},
			part: {
				description: 'Material instance part name.',
				type: 'string'
			}
		}
	})

	template(({ plants = {}, texture = '', part = '*' }:{ plants: any, part: string, texture: string }, { create }) => {

		const createNumberArray = (value: number): number[] => [...Array(value).keys()]

		// Creates an integer property based on plants.length
		create(
			{
				'p:plant': createNumberArray(plants.length)
			},
			'minecraft:block/description/properties'
		)

		plants.map((plant: any, i: number) => {
			const isDefault: boolean = i === 0

			create(
				{
					condition: `q.block_property('p:plant') == ${i}`,
					components: {
						'minecraft:material_instances': {
							[part]: {
								texture: `${texture}.${plant.texture}`,
								render_method: 'alpha_test',
								ambient_occlusion: false
							}
						},
						...(isDefault && {
							'minecraft:on_interact': {
								condition: '!q.is_sneaking',
								event: 'e:add.plant'
							}
						}),
						...(!isDefault && {
							'minecraft:on_interact': {
								condition: 'q.is_sneaking',
								event: `e:remove.${plant.name}`
							}
						}),
						...(!isDefault && {
							'minecraft:loot': `loot_tables/${plant.loot_table}.loot.json`
						})
					}
				},
				"minecraft:block/permutations"
			)

			create(
				{
					...(isDefault && {
						'e:add.plant': {
							sequence: plants.slice(1).map((plant: any, i: number) => ({
								condition: `q.get_equipped_item_name == '${plant.name}'`,
								decrement_stack: {},
								set_block_property: {
									'p:plant': i + 1
								}
							}))
						}
					}),
					...(!isDefault && {
						[`e:remove.${plant.name}`]: {
							run_command: {
								command: `give @s minecraft:${plant.name}`,
								target: 'other'
							},
							trigger: 'e:remove.plant'
						}
					})
				},
				'minecraft:block/events'
			)
		}),

		create(
			{
				'e:remove.plant': {
					set_block_property: {
						'p:plant': 0
					}
				}
			},
			'minecraft:block/events'
		)
	})
})

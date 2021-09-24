export default defineComponent(({ name, template, schema }) => {
	name('furnideco:spawn_item')
	schema({
		description: 'Removes the actor spawns an item.',
		type: 'object',
		properties: {
			items: {
				description: 'Defines a list of avaliable items.',
				type: 'array',
				items: {
					type: 'string'
				}
			}
		}
	})

	template(({ items = [] }:{ items: any }, { create, identifier }) => {

		// Creates the property to list the defined items
		create(
			{
				values: items.map((item: any) => item)
			},
			'minecraft:entity/description/properties/p:item_type'
		)

		// Maps through items and creates an aliase for each item
		items.map((item: any) => {
			create(
				{
					[`${identifier}.${item}`]: {
						'p:item_type': item
					}
				},
				'minecraft:entity/description/aliases'
			)
		})

		// Maps through items and creates a permutation for each item
		create(
			{
				permutations: items.map((item: any) => ({
					condition: `q.actor_property('p:item_type') == '${item}'`,
					components: {
						'minecraft:spawn_entity': {
							entities: [
								{
									max_wait_time: 0,
									min_wait_time: 0,
									spawn_item: item,
									single_use: true
								}
							]
						},
						'minecraft:instant_despawn': {}
					}
				}))
			},
			'minecraft:entity'
		)
	})
})

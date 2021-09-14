export default defineComponent(({ name, template, schema }) => {
	name('furnideco:mixed_geometries')
	schema({
		description: 'Makes the block cycle between geometries based on a property value.',
		type: 'object',
		properties: {
			geometries: {
				description: 'Defines geometries to use.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'Name of the geometry.',
							type: 'string'
						},
						collision: {
							description: 'Collision of the geometry.',
							type: 'object',
							properties: {
								pick: { type: 'array' },
								entity: { type: 'array' }
							}
						}
					}
				}
			},
			property: {
				description: `Property to use. Default: 'p:geometry'.`,
				type: 'string'
			},
			loot_table: {
				description: 'Loot table path to use for each geometry.',
				type: 'string'
			}
		}
	})

	template(({ geometries = [], property = 'p:geometry', loot_table = false }, { create, identifier }) => {

		const createNumberArray = value => [...Array(value).keys()]

		// Creates an integer property based on geometries length
		create(
			{
				[property]: createNumberArray(geometries.length)
			},
			'minecraft:block/description/properties'
		)

		// Loops through geometries and creates a permutation for each entry
		create(
			{
				permutations: geometries.map((geo, i) => ({
					condition: `q.block_property('${property}') == ${i}`,
					components: {
						'minecraft:geometry': `geometry.${identifier.split(/[\.\:]/)[1]}.${identifier.split('.')[1]}.${geo.name}`,
						'minecraft:pick_collision': {
							origin: geo.collision.pick.slice(0, 3),
							size: geo.collision.pick.slice(3, 6)
						},
						'minecraft:entity_collision': (geo.collision.entity == false ? false : {
							origin: geo.collision.entity.slice(0, 3),
							size: geo.collision.entity.slice(3, 6)
						}),
						...(loot_table && {
							'minecraft:loot': `loot_tables/${loot_table}/${geo.name}.loot.json`
						})
					}
				}))
			},
			'minecraft:block'
		)
	})
})

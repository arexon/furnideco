export default defineComponent(({ name, template, schema }) => {
	name('furnideco:mixed_geometries')
	schema({
		description: 'Makes the block switch between geometries based on a property value.',
		type: 'object',
		properties: {
			geometries: {
				description: 'An array of geometries to use.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'Key name of the geometry.',
							type: 'string'
						},
						hitbox: {
							description: 'Hitbox of the block.',
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

		// Creates a number property based on geometries length
		create(
			{
				[property]: [...Array(geometries.length).keys()]
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
							origin: geo.hitbox.pick.slice(0, 3),
							size: geo.hitbox.pick.slice(3, 6)
						},
						'minecraft:entity_collision': (geo.hitbox.entity == false ? false : {
							origin: geo.hitbox.entity.slice(0, 3),
							size: geo.hitbox.entity.slice(3, 6)
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

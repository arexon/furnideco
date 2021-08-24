export default defineComponent(({ name, template, schema }) => {
	name('furnideco:mixed_geometries')
	schema({
		geometries: 'array',
		key: 'string',
		loot_table: 'boolean'
	})

	template(({ geometries = [], key = '', loot_table = false }, { create, identifier }) => {

		let geosCount = []
		for (let i = 0; i < geometries.length; i++) geosCount.push(i)
		create(
			{
				'p:geometry': geosCount
			},
			'minecraft:block/description/properties'
		)

		create(
			{
				permutations: geometries.map((geo, i) => ({
					condition: `q.block_property('p:geometry') == ${i}`,
					components: {
						'minecraft:geometry': `geometry.${identifier.split(/[\.\:]/)[1]}.${identifier.split('.')[1]}.${key}_${i}`,
						'minecraft:pick_collision': (geo.pick_collision == false ? false : {
							origin: geo.pick_collision.slice(0, 3),
							size: geo.pick_collision.slice(3, 6)
						}),
						'minecraft:entity_collision': (geo.entity_collision == false ? false : {
							origin: geo.entity_collision.slice(0, 3),
							size: geo.entity_collision.slice(3, 6)
						}),
						...(loot_table && {
							'minecraft:loot': `loot_tables/${loot_table}.${key}_${i}.loot.json`
						}),
					}
				}))
			},
			'minecraft:block'
		)
	})
})

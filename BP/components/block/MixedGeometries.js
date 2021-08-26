export default defineComponent(({ name, template, schema }) => {
	name('furnideco:mixed_geometries')
	schema({
		geometries: 'array',
		property: 'string',
		loot_table: 'boolean'
	})

	template(({ geometries = [], property = 'p:geometry', loot_table = false }, { create, identifier }) => {

		let geosCount = []
		for (let i = 0; i < geometries.length; i++) geosCount.push(i)
		create(
			{
				[property]: geosCount
			},
			'minecraft:block/description/properties'
		)

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

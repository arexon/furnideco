export default defineComponent(({ name, template, schema }) => {
	name('furnideco:mixed_geometries')
	schema({
		description: 'Makes the block cycle between geometries based on a property value.',
		type: 'object',
		properties: {
			name: {
				description: 'The first part of the geometry definition name.',
				type: 'string'
			},
			geometries: {
				description: 'Defines geometries to use.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'The last part of the geometry definition name.',
							type: 'string'
						},
						collision: {
							description: 'Collision of the geometry.',
							type: 'object',
							properties: {
								pick: {
									description: 'The pick collision. Gets disabled if set to false.',
									anyOf: [
										{
											type: 'array',
											minItems: 6,
											maxItems: 6,
											items: { type: 'number' }
										},
										{
											enum: [ false ]
										}
									]
								},
								entity: {
									description: 'The entity collision. Gets disabled if set to false.',
									anyOf: [
										{
											type: 'array',
											minItems: 6,
											maxItems: 6,
											items: { type: 'number' }
										},
										{
											enum: [ false ]
										}
									]
								}
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

	template(({ name = '', geometries = [], property = 'p:geometry', loot_table = false }, { create }) => {

		const createNumberArray = (value: number): number[] => [...Array(value).keys()]

		// Creates an integer property based on geometries length
		create(
			{
				[property]: createNumberArray(geometries.length)
			},
			'minecraft:block/description/properties'
		)

		// Maps through geometries and creates a permutation for each geometry
		create(
			{
				permutations: geometries.map((geo, i) => ({
					condition: `q.block_property('${property}') == ${i}`,
					components: {
						'minecraft:geometry': `geometry.${name}.${geo.name}`,
						'minecraft:pick_collision': (!geo.collision.pick ? false : {
							origin: geo.collision.pick.slice(0, 3),
							size: geo.collision.pick.slice(3, 6)
						}),
						'minecraft:entity_collision': (!geo.collision.entity ? false : {
							origin: geo.collision.entity.slice(0, 3),
							size: geo.collision.entity.slice(3, 6)
						}),
						...(loot_table && {
							'minecraft:loot': `loot_tables/block/${loot_table}/${geo.name}.loot.json`
						})
					}
				}))
			},
			'minecraft:block'
		)
	})
})

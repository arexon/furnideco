export default defineComponent(({ name, template, schema }) => {
	name('furnideco:connectable')
	schema({
		description: 'Allows the block to connect to neighboring blocks.',
		type: 'object',
		properties: {
			tag: {
				description: 'The neighbor block tag which the component will test for.',
				type: 'string'
			},
			directions: {
				description: 'Specifies which direction the component will use & create block properties for.',
				type: 'array',
				items: {
					type: 'string',
					enum: [ 'north', 'east', 'south', 'west', 'up', 'down' ]
				}
			},
			rotation_property: {
				description: 'Specifies if the block uses rotations. Takes a block property. (Requires to define "use_rotation" in parts or geometries).',
				type: 'string'
			},
			parts: {
				description: 'The part_visiblity method | Defines when to hide specific parts of the geometry. Not compatible with the "geometries" method.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'Name of the bone.',
							type: 'string'
						},
						use_rotation: {
							description: 'Allows to use rotations.',
							type: 'boolean'
						}
					},
					if: {
						properties: {
							use_rotation: {
								const: false
							}
						}
					},
					then: {
						properties: {
							rules: {
								description: 'Specifies when to show the part using directions.',
								type: 'array',
								items: {
									enum: [
										'north', 'east', 'south', 'west', 'up', 'down',
										'!north', '!east', '!south', '!west', '!up', '!down'
									]
								}
							}
						}
					},
					else: {
						properties: {
							rules: {
								description: 'Specifies when to show the part using directions & rotations.',
								type: 'array',
								items: {
									type: 'object',
									properties: {
										directions: {
											type: 'array',
											items: {
												enum: [
													'north', 'east', 'south', 'west', 'up', 'down',
													'!north', '!east', '!south', '!west', '!up', '!down'
												]
											}
										},
										rotation: {
											type: 'number',
											enum: [ 0, 1, 2, 3 ]
										}
									}
								}
							}
						}
					}
				}
			},
			geometries: {
				description: 'The geometries method | Defines a list of geometries and when to hide each one. Not compatible with the "part_visiblity" method.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							description: 'Definition name of the geometry.',
							type: 'string'
						},
						use_rotation: {
							description: 'Allows to use rotations.',
							type: 'boolean'
						}
					},
					if: {
						properties: {
							use_rotation: {
								const: false
							}
						}
					},
					then: {
						properties: {
							rules: {
								description: 'Specifies when to show the geometry using directions.',
								type: 'array',
								items: {
									enum: [
										'north', 'east', 'south', 'west', 'up', 'down',
										'!north', '!east', '!south', '!west', '!up', '!down'
									]
								}
							}
						}
					},
					else: {
						properties: {
							rules: {
								description: 'Specifies when to show the geometry using directions & rotations.',
								type: 'array',
								items: {
									type: 'object',
									properties: {
										directions: {
											type: 'array',
											items: {
												enum: [
													'north', 'east', 'south', 'west', 'up', 'down',
													'!north', '!east', '!south', '!west', '!up', '!down'
												]
											}
										},
										rotation: {
											type: 'number',
											enum: [ 0, 1, 2, 3 ]
										}
									}
								}
							}
						}
					}
				}
			},
			material_instances: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						use_rotation: {
							description: 'Allows to use rotations.',
							type: 'boolean'
						},
						instances: {
							$ref: '/data/packages/minecraftBedrock/schema/block/v1.16.100/components/material_instances.json'
						}
					},
					if: {
						properties: {
							use_rotation: {
								const: false
							}
						}
					},
					then: {
						properties: {
							rules: {
								description: 'Specifies when to show the texture using directions.',
								type: 'array',
								items: {
									enum: [
										'north', 'east', 'south', 'west', 'up', 'down',
										'!north', '!east', '!south', '!west', '!up', '!down'
									]
								}
							}
						}
					},
					else: {
						properties: {
							rules: {
								description: 'Specifies when to show the texture using directions & rotations.',
								type: 'array',
								items: {
									type: 'object',
									properties: {
										directions: {
											type: 'array',
											items: {
												enum: [
													'north', 'east', 'south', 'west', 'up', 'down',
													'!north', '!east', '!south', '!west', '!up', '!down'
												]
											}
										},
										rotation: {
											type: 'number',
											enum: [ 0, 1, 2, 3 ]
										}
									}
								}
							}
						}
					}
				}
			}
		}
	})

	template(({ tag, directions, rotation_property, parts = [], geometries = [], material_instances = [] }:{ tag: string, directions: string[], rotation_property: string, parts: any, geometries: any, material_instances: any }, { create }) => {

		const positions = new Map([
			[ 'north', [ 0, 0, -1 ] ],
			[ 'east', [ 1, 0, 0 ] ],
			[ 'south', [ 0, 0, 1 ] ],
			[ 'west', [ -1, 0, 0 ] ],
			[ 'up', [ 0, 1, 0 ] ],
			[ 'down', [ 0, -1, 0 ] ]
		])

		const toStringFirstChar = value => value.toString().charAt(0)

		const createNeighborProperty = dir => toStringFirstChar(dir) === '!' ? `!q.block_property('p:${dir.toString().substring(1)}_neighbor')` : `q.block_property('p:${dir}_neighbor')`
		const createRotationProperty = (rotation: number|boolean = false) => rotation !== false ? `q.block_property('${rotation_property}') == ${rotation}` : ''

		// Maps through directions and creates a property for each direction
		directions.map((dir: string) => {
			create(
				{
					[`p:${dir}_neighbor`]: [ false, true ]
				},
				'minecraft:block/description/properties'
			)
		})

		// Loops through parts and creates part visibility rules for each part
		if (parts) {
			parts.map(part => {
				create(
					{
						...(part.use_rotation ? {
							[part.name]: `${part.rules.map(rule => `(${createRotationProperty(rule.rotation)}&&${rule.directions.map(dir => createNeighborProperty(dir)).join('&&')})`).join('||')}`
						} : {
							[part.name]: `${part.rules.map(rule => createNeighborProperty(rule)).join('&&')}`
						})
					},
					'minecraft:block/components/minecraft:part_visibility/rules'
				)
			})
		}

		// Maps through geometries and creates a permutations for each geo
		if (geometries) {
			create(
				{
					permutations: geometries.map(geo => ({
						...(geo.use_rotation ? {
							condition: `${geo.rules.map(rule => `(${createRotationProperty(rule.rotation)}&&${rule.directions.map(dir => createNeighborProperty(dir)).join('&&')})`).join('||')}`
						} : {
							condition: `${geo.rules.map(rule => createNeighborProperty(rule)).join('&&')}`
						}),
						components: {
							'minecraft:geometry': `geometry.${geo.name}`
						}
					}))
				},
				'minecraft:block'
			)
		}

		create(
			{
				permutations: material_instances.map(texture => ({
					...(texture.use_rotation ? {
						condition: `${texture.rules.map(rule => `(${createRotationProperty(rule.rotation)}&&${rule.directions.map(dir => createNeighborProperty(dir)).join('&&')})`).join('||')}`
					} : {
						condition: `${texture.rules.map(rule => createNeighborProperty(rule)).join('&&')}`
					}),
					components: {
						'minecraft:material_instances': texture.instances
					}
				}))
			},
			'minecraft:block'
		)

		create(
			{
				'minecraft:ticking': {
					looping: true,
					range: [ 0, 0 ],
					on_tick: {
						event: 'e:update.neighbors'
					}
				}
			},
			'minecraft:block/components'
		)

		// Maps through directions and creates a set_block_property entry for each direction
		directions.map((dir: string) => {
			create(
				{
					[`p:${dir}_neighbor`]: `q.block_neighbor_has_any_tag(${positions.get(dir)}, '${tag}') ? true : false`
				},
				'minecraft:block/events/e:update.neighbors/set_block_property'
			)
		})
	})
})

export default defineComponent(({ name, template, schema }) => {
	name('furnideco:animate')
	schema({
		description: 'Allows the block to animate through a set of defined frames.',
		type: 'object',
		properties: {
			duration: {
				description: 'Duration between each frame.',
				type: 'number'
			},
			frames: {
				description: 'Specifies the length of the animations.',
				type: 'number'
			},
			texture: {
				description: 'Sets the first part of the texture definition name.',
				type: 'string'
			},
			part: {
				description: 'Specifies the material instance to play animation on.',
				type: 'string'
			},
			run_command: {
				description: 'Set of commands to run at a specific frame.',
				type: 'object',
				required: [ 'command', 'frame' ],
				properties: {
					command: {
						description: 'Command to run.',
						type: [ 'array', 'string' ],
						items: {
							type: 'string'
						}
					},
					frame: {
						description: 'The frame to run the command at.',
						type: 'number'
					}
				}
			}
		}
	})

	template(({ duration = 0, frames = 0, texture = '', part = '*', run_command = {} }:{ duration: number, frames: number, texture: string, part: string, run_command: any }, { create }) => {

		const createNumberArray = (value: number): number[] => [...Array(value).keys()]
		const isEmptyObject = (object: any): boolean => !(Object.keys(object).length === 0 && object.constructor === Object)

		// Creates an integer property based on frames length
		create(
			{
				'p:frame': createNumberArray(frames)
			},
			'minecraft:block/description/properties'
		)

		// Creates the base texture
		create(
			{
				condition: '(1.0)',
				components: {
					'minecraft:material_instances': {
						'*': {
							texture: texture,
							render_method: 'alpha_test',
							ambient_occlusion: false
						}
					}
				}
			},
			'minecraft:block/permutations'
		)

		// Maps through frames and creates a permutation for each frame
		createNumberArray(frames).map((i: number) => {
			create(
				{
					condition: `q.block_property('p:frame') == ${i}`,
					components: {
						'minecraft:material_instances': {
							[part]: {
								texture: `${texture}.frame_${i}`,
								render_method: 'alpha_test',
								ambient_occlusion: false
							}
						}
					}
				},
				'minecraft:block/permutations'
			)
		})

		// Creates time loop
		create(
			{
				'minecraft:ticking': {
					looping: true,
					range: [ duration, duration ],
					on_tick: {
						event: 'e:play.frame'
					}
				}
			},
			'minecraft:block/components'
		)

		// Creates the frame event
		create(
			{
				'e:play.frame': {
					...(isEmptyObject(run_command) ? {
						sequence: [
							{
								set_block_property: {
									'p:frame': `q.block_property('p:frame') == ${frames - 1} ? 0 : q.block_property('p:frame') + 1`
								}
							},
							{
								condition: `q.block_property('p:frame') == ${run_command.frame - 1}`,
								run_command: {
									command: run_command.command.map((cmd: any) => cmd)
								}
							}
						]
					} : {
						set_block_property: {
							'p:frame': `q.block_property('p:frame') == ${frames - 1} ? 0 : q.block_property('p:frame') + 1`
						}
					})
				}
			},
			'minecraft:block/events'
		)
	})
})

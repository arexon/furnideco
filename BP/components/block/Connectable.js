export default defineComponent(({ name, template, schema }) => {
	name('furnideco:connectable')
	schema({
		description: 'Allows the block to connect to neighbor blocks.',
		type: 'object',
		properties: {
			tag: {
				description: `The block's tag.`,
				type: 'string'
			}
		}
	})

	template(({ tag = '' }, {}) => {

		const createNeighbors = (north, east, south, west) => {
			const properties = [
				[ `${north ? '' : '!'}q.block_neighbor_has_any_tag(0, 0, -1, '${tag}')` ],
				[ `${east ? '' : '!'}q.block_neighbor_has_any_tag(1, 0, 0, '${tag}')` ],
				[ `${south ? '' : '!'}q.block_neighbor_has_any_tag(0, 0, 1, '${tag}')` ],
				[ `${west ? '' : '!'}q.block_neighbor_has_any_tag(-1, 0, 0, '${tag}')` ]
			]
			return `${properties[0]} && ${properties[1]} && ${properties[2]} && ${properties[3]}`
		}
	})
})

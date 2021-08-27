export default defineComponent(({ name, template, schema }) => {
	name('furnideco:connectable')
	schema({
		tag: 'string',
		keys: 'array'
	})

	template(({ tag = '', keys = [] }, { create, identifier }) => {

		let neighbors = (north, east, south, west) => {
			let property = 'q.block_neighbor_has_any_tag'
			let properties = [
				[ `${north ? '' : '!'}${property}(0, 0, -1, '${tag}')` ],
				[ `${east ? '' : '!'}${property}(1, 0, 0, '${tag}')` ],
				[ `${south ? '' : '!'}${property}(0, 0, 1, '${tag}')` ],
				[ `${west ? '' : '!'}${property}(-1, 0, 0, '${tag}')` ]
			]
			return `${properties[0]} && ${properties[1]} && ${properties[2]} && ${properties[3]}`
		}
	})
})

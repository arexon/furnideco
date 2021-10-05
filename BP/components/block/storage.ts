export default defineComponent(({ name, template, schema }) => {
	name('furnideco:storage')
	schema({
		description: 'Adds a storage container.',
		type: 'object',
		properties: {
			type: {
				description: 'The type of the contaier',
				enum: [ 'rustic_cabinet' ]
			}
		}
	})

	template(({ type }:{ type: string }, { create }) => {

		create(
			{
				'minecraft:on_placed': {
					event: 'e:add.storage'
				}
			},
			'minecraft:block/components'
		)

		create(
			{
				'e:add.storage': {
					run_command: {
						command: `summon furnideco:storage.${type} ui.${type.split(/_(.+)/)[1]}.name ~~~`
					}
				}
			},
			'minecraft:block/events'
		)
	})
})

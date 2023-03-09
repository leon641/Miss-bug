'use strict'

import bugPreview from './BugPreview.js'

export default {
	props: ['bugs'],
	template: `
    <section v-if="bugs.length" className="bug-list">                    
      <bug-preview v-for="bug in bugs" :bug="bug" :key="bug._id" @removeBug="$emit('removeBug', $event)" />
    </section>
    <section v-else class="bug-list">Yay! No Bugs!</section>
    `,
	methods: {},
	components: {
		bugPreview,
	},
}

'use strict'

export default {
  template: `
        <section class="bug-filter">
            <span>Filter by title: </span>
            <input @input="setFilterBy" type="text" v-model="filterBy.title">
            <input @input="setFilterBy" type="range" min="1" max="3" v-model="filterBy.severity">

            <select v-model="filterBy.labels" multiple>
              <option value="easy">easy</option>
              <option value="need-CR">need-CR</option>
              <option value="dev-branch">dev-branch</option>
              <option value="hard">hard</option>
		    	</select>
		    <button @click="setFilterBy">Submit</button>
        </section>
    `,
  data() {
    return {
      filterBy: {
        title: '', page: 0, severity: 1, labels: []
      },
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
  },
}


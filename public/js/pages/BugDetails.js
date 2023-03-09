'use strict'

import { bugService } from '../services/bug.service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <span :class='"severity" + bug.severity'>description: {{bug.description}}</span>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId).then((bug) => {
        this.bug = bug
      })
    }
  },
}

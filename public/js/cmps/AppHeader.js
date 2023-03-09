'use strict'

import { userService } from "../services/user.service.js"

import LoginSignup from './LoginSignup.js'

export default {
  template: `
        <header>
            <h1>Miss Bug</h1>    
            <hr />
            <section v-if="loggedinUser">
                <RouterLink :to="'/user/' + loggedinUser._id">
                    {{ loggedinUser.fullname }}
                </RouterLink>
                <button @click="logout">Logout</button>
            </section>
            <section v-else>
                <LoginSignup @onChangeLoginStatus="changeLoginStatus" />
            </section>
        </header>
    `,
     data() {
        return {
            loggedinUser: userService.getLoggedInUser()
        }
    },
    methods: {
        changeLoginStatus() {
            this.loggedinUser = userService.getLoggedInUser()
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.loggedinUser = null
                })
        },
    },
    components: {
        LoginSignup
    }
}

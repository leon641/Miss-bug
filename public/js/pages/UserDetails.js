import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"

export default {
    template: `
        <section class="user-details" v-if="user">
            <h5 v-if="isMyProfile">My Profile</h5>
            <pre>{{user}}</pre>    
            <h4>User bugs</h4>
        </section>
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser(),
            user: null,
        }
    },
    created() {
        
        const { userId } = this.$route.params
        this.loadUser(userId)
        // this.loadBugs()

    },
    computed: {
        userId() {
            return this.$route.params.userId
        },
        isMyProfile() {
            if (!this.loggedinUser) return false
            return this.loggedinUser._id === this.user._id
        }
    },
    methods: {
        loadUser() {
            userService.get(this.userId)
                .then(user => this.user = user)
        },
       
    }
}
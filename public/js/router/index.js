import bugApp from '../pages/BugIndex.js'
import bugEdit from '../pages/BugEdit.js'
import bugDetails from '../pages/BugDetails.js'
import UserDetails from '../pages/UserDetails.js'

const routes = [
	{ path: '/', redirect: '/bug' },
	{ path: '/bug', component: bugApp },
	{ path: '/bug/edit/:bugId?', component: bugEdit },
	{ path: '/bug/:bugId', component: bugDetails },
	{ path: '/user/:userId', component: UserDetails},
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })

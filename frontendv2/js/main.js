import routes from './routes.js';
import { userStore, loadUser, loadUnreadCount } from './user.js';

export { userStore };

export const store = Vue.reactive({
  dark: JSON.parse(localStorage.getItem('dark')) || false,
  isAdmin: !!localStorage.getItem('admin_token'),
  toggleDark() {
    this.dark = !this.dark;
    localStorage.setItem('dark', JSON.stringify(this.dark));
  },
  setAdmin(state) {
    this.isAdmin = state;
  },
});

const app = Vue.createApp({
  data: () => ({ store, userStore, navOpen: false }),
  methods: {
    onAdminLogout() {
      localStorage.removeItem('admin_token');
      store.setAdmin(false);
      window.location.hash = '/';
      window.location.reload();
    },
    toggleNav() {
      this.navOpen = !this.navOpen;
    },
    closeNav() {
      this.navOpen = false;
    },
  },
  watch: {
    '$route'() { this.navOpen = false; },
  },
});
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

app.use(router);
loadUser();
app.mount('#app');
setInterval(() => { if (userStore.user) loadUnreadCount(); }, 30000);

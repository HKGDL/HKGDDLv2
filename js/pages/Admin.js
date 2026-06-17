import { apiPost } from "../api.js";
import { store } from "../main.js";

export default {
  template: `
    <main class="page-admin">
      <div v-if="!authenticated" class="admin-login-wrap">
        <div class="admin-login-card">
          <h1>Admin</h1>
          <form @submit.prevent="onLogin">
            <div class="form-group">
              <label class="type-title-sm">Username</label>
              <input type="text" v-model="username" placeholder="Admin username" autocomplete="username" />
            </div>
            <div class="form-group">
              <label class="type-title-sm">Password</label>
              <div class="admin-password-wrap">
                <input :type="showPass ? 'text' : 'password'" v-model="password" placeholder="Enter admin password" autocomplete="current-password" />
                <button type="button" class="admin-password-toggle" @click="showPass = !showPass">{{ showPass ? 'Hide' : 'Show' }}</button>
              </div>
            </div>
            <button type="submit" class="admin-submit-btn">Login</button>
          </form>
          <p v-if="loginError" class="admin-msg error">{{ loginError }}</p>
        </div>
      </div>
      <router-view v-else />
    </main>
  `,
  data: () => ({
    username: '',
    password: '',
    showPass: false,
    authenticated: false,
    token: null,
    loginError: '',
  }),
  provide() {
    return {
      adminToken: () => this.token,
      adminLogout: this.onLogout,
    };
  },
  methods: {
    async onLogin() {
      this.loginError = '';
      try {
        const res = await apiPost('/api/auth/login', { username: this.username, password: this.password });
        if (res.success) {
          this.authenticated = true;
          this.token = res.token;
          localStorage.setItem('admin_token', res.token);
          store.setAdmin(true);
          this.$router.push('/admin/dashboard');
        }
      } catch (e) {
        this.loginError = e.message || 'Invalid password.';
      }
    },
    onLogout() {
      this.authenticated = false;
      this.token = null;
      this.password = '';
      localStorage.removeItem('admin_token');
      store.setAdmin(false);
      this.$router.push('/');
    },
  },
  mounted() {
    const saved = localStorage.getItem('admin_token');
    if (saved) {
      this.token = saved;
      this.authenticated = true;
      store.setAdmin(true);
    }
  },
};

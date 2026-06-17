const API_BASE = 'https://api.hkgdl.dpdns.org';

export default {
  template: `
    <div class="reset-password-page">
      <div class="reset-password-card" v-if="!success">
        <h2>Reset Password</h2>
        <form @submit.prevent="onReset" class="account-form">
          <div class="form-group">
            <label class="type-title-sm">New Password</label>
            <div class="account-password-wrap">
              <input :type="showPass ? 'text' : 'password'" v-model="password" placeholder="Min 6 characters" />
              <button type="button" class="account-pw-toggle" @click="showPass = !showPass">{{ showPass ? 'Hide' : 'Show' }}</button>
            </div>
          </div>
          <button type="submit" class="account-btn" :disabled="loading">{{ loading ? 'Resetting...' : 'Reset Password' }}</button>
          <p v-if="error" class="account-msg error">{{ error }}</p>
        </form>
      </div>
      <div v-else class="reset-password-card">
        <h2>Password Reset</h2>
        <p class="account-msg" style="color: var(--color-primary);">Your password has been reset successfully!</p>
        <router-link to="/account" class="account-btn" style="display: inline-block; text-decoration: none; margin-top: 1rem;">Go to Login</router-link>
      </div>
    </div>
  `,
  data() {
    return {
      password: '',
      loading: false,
      error: '',
      success: false,
      showPass: false,
    };
  },
  methods: {
    async onReset() {
      if (this.password.length < 6) { this.error = 'Password must be at least 6 characters'; return; }
      this.loading = true;
      this.error = '';
      try {
        const token = this.$route.query.token;
        if (!token) throw new Error('Missing reset token');
        const res = await fetch(`${API_BASE}/api/user/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password: this.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Reset failed');
        this.success = true;
      } catch (e) {
        this.error = e.message;
      }
      this.loading = false;
    },
  },
};

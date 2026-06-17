import { userStore, loginUser, registerUser, logoutUser, updateProfile, submitClaim, fetchNotifications, markNotifRead, markAllRead, loadUnreadCount } from "../user.js";
import { store } from "../main.js";

const API_BASE = 'https://api.hkgdl.dpdns.org';

export default {
  template: `
    <main class="page-account">
      <div v-if="!userStore.user" class="account-login-wrap">
        <div class="account-card">
          <div class="account-tabs">
            <button :class="{ active: tab === 'login' }" @click="tab = 'login'">Login</button>
            <button :class="{ active: tab === 'register' }" @click="tab = 'register'">Register</button>
            <button v-if="tab === 'forgot'" :class="{ active: tab === 'forgot' }" @click="tab = 'forgot'">Forgot</button>
          </div>

          <form v-if="tab === 'login'" @submit.prevent="onLogin" class="account-form">
            <div class="form-group">
              <label class="type-title-sm">Username</label>
              <input type="text" v-model="loginForm.username" placeholder="Your username" />
            </div>
            <div class="form-group">
              <label class="type-title-sm">Password</label>
              <div class="account-password-wrap">
                <input :type="loginShowPass ? 'text' : 'password'" v-model="loginForm.password" placeholder="Password" />
                <button type="button" class="account-pw-toggle" @click="loginShowPass = !loginShowPass">{{ loginShowPass ? 'Hide' : 'Show' }}</button>
              </div>
            </div>
            <button type="submit" class="account-btn" :disabled="loginLoading">{{ loginLoading ? 'Logging in...' : 'Login' }}</button>
            <p class="account-forgot-link" @click="tab = 'forgot'">Forgot password?</p>
            <p v-if="loginError" class="account-msg error">{{ loginError }}</p>
          </form>

          <form v-else-if="tab === 'forgot'" @submit.prevent="onForgot" class="account-form">
            <div class="form-group">
              <label class="type-title-sm">Email</label>
              <input type="email" v-model="forgotEmail" placeholder="Your registered email" />
            </div>
            <button type="submit" class="account-btn" :disabled="forgotLoading">{{ forgotLoading ? 'Sending...' : 'Send Reset Link' }}</button>
            <p v-if="forgotMsg" class="account-msg" :class="{ error: forgotError }">{{ forgotMsg }}</p>
            <p class="account-forgot-link" @click="tab = 'login'">Back to Login</p>
          </form>

          <form v-else-if="tab === 'register'" @submit.prevent="onRegister" class="account-form">
            <div class="form-group">
              <label class="type-title-sm">Username</label>
              <input type="text" v-model="registerForm.username" placeholder="Min 3 characters" />
            </div>
            <div class="form-group">
              <label class="type-title-sm">Display Name</label>
              <input type="text" v-model="registerForm.displayName" placeholder="How others see you" />
            </div>
            <div class="form-group">
              <label class="type-title-sm">Email</label>
              <input type="email" v-model="registerForm.email" placeholder="Valid email address" />
            </div>
            <div class="form-group">
              <label class="type-title-sm">Password</label>
              <div class="account-password-wrap">
                <input :type="regShowPass ? 'text' : 'password'" v-model="registerForm.password" placeholder="Min 6 characters" />
                <button type="button" class="account-pw-toggle" @click="regShowPass = !regShowPass">{{ regShowPass ? 'Hide' : 'Show' }}</button>
              </div>
            </div>
            <button type="submit" class="account-btn" :disabled="regLoading">{{ regLoading ? 'Registering...' : 'Register' }}</button>
            <p v-if="regError" class="account-msg error">{{ regError }}</p>
          </form>

        </div>
      </div>

      <div v-else class="account-dashboard">
        <div class="account-section">
          <div class="account-section-header">
            <h2>My Account</h2>
            <button class="account-btn account-btn--small" @click="onLogout">Logout</button>
          </div>
          <div class="account-profile-card">
            <div class="account-profile-row">
              <span class="type-label-md">Username</span>
              <span>{{ userStore.user.username }}</span>
            </div>
            <div class="account-profile-row">
              <span class="type-label-md">Display Name</span>
              <div class="account-inline-edit">
                <input type="text" v-model="editDisplayName" />
                <button class="account-btn account-btn--small" @click="saveDisplayName">Save</button>
              </div>
            </div>
            <div class="account-profile-row">
              <span class="type-label-md">Email</span>
              <div class="account-inline-edit">
                <input type="email" v-model="editEmail" placeholder="Your email" />
                <button class="account-btn account-btn--small" @click="saveEmail">Save</button>
              </div>
            </div>
            <div class="account-profile-row">
              <span class="type-label-md">Discord</span>
              <div class="account-inline-edit">
                <input type="text" v-model="editDiscord" placeholder="username#0000" />
                <button class="account-btn account-btn--small" @click="saveDiscord">Save</button>
              </div>
            </div>
          </div>
        </div>

        <div class="account-section">
          <h2>Claim Player Name</h2>
          <p class="type-label-md" style="opacity: 0.6; margin-bottom: 1rem;">
            Link your in-game name to your account. When a record with this name is approved, you'll get a notification.
            An admin must approve the claim.
          </p>
          <div class="account-inline-edit" style="max-width: 30rem;">
            <input type="text" v-model="claimPlayerName" :placeholder="userStore.user.playerName || 'e.g. Yorklui'" />
            <button class="account-btn account-btn--small" @click="onClaim" :disabled="!claimPlayerName">Submit Claim</button>
          </div>
          <p v-if="claimMsg" :class="'account-msg ' + (claimMsgOk ? 'success' : 'error')" style="margin-top: 0.5rem;">{{ claimMsg }}</p>
          <div v-if="claims.length" class="account-claims-list">
            <div v-for="c in claims" class="account-claim-row">
              <strong>{{ c.player_name }}</strong>
              <span :class="'account-claim-badge account-claim--' + c.status">{{ c.status }}</span>
            </div>
          </div>
        </div>

        <div class="account-section">
          <h2>My Submissions</h2>
          <div v-if="submissions.length === 0" class="type-label-md" style="opacity: 0.6; text-align: center; padding: 1.5rem;">No submissions yet.</div>
          <div v-for="s in submissions" class="account-sub-card">
            <div class="account-sub-info">
              <strong>{{ s.levelName }}</strong>
              <span class="type-label-md" style="opacity: 0.6; margin-left: 0.5rem;">{{ s.submittedAt ? formatDateISO(s.submittedAt) : '' }}</span>
            </div>
            <span :class="'account-claim-badge account-claim--' + (s.status === 'approved' ? 'approved' : s.status)">{{ s.status }}</span>
            <p v-if="s.adminNotes" class="type-body" style="opacity: 0.7; margin-top: 0.25rem; font-size: 0.85rem;">Note: {{ s.adminNotes }}</p>
          </div>
        </div>

        <div class="account-section">
          <h2>My Records</h2>
          <div v-if="records.length === 0" class="type-label-md" style="opacity: 0.6; text-align: center; padding: 1.5rem;">No records yet. Submit a record with your claimed name!</div>
          <div v-for="r in records" class="account-sub-card">
            <div class="account-sub-info">
              <strong>{{ r.levelName }}</strong>
              <span class="type-label-md" style="opacity: 0.6; margin-left: 0.5rem;">{{ r.date }} &middot; {{ r.fps || '?' }}fps</span>
            </div>
            <a v-if="r.videoUrl" :href="r.videoUrl" target="_blank" class="account-btn account-btn--small">Video</a>
          </div>
        </div>

        <div class="account-section">
          <div class="account-section-header">
            <h2>Notifications</h2>
            <button v-if="notifications.length" class="account-btn account-btn--small" @click="onMarkAllRead">Mark All Read</button>
          </div>
          <div v-if="notifications.length === 0" class="type-label-md" style="opacity: 0.6; text-align: center; padding: 2rem;">No notifications yet.</div>
          <div v-for="n in notifications" :class="['account-notif-card', { 'account-notif--unread': !n.read }]" @click="onNotifClick(n)">
            <div class="account-notif-title">{{ n.title }}</div>
            <div class="account-notif-msg">{{ n.message }}</div>
            <div class="account-notif-date">{{ formatDate(n.created_at) }}</div>
          </div>
        </div>

      </div>
    </main>
  `,
  data: () => ({
    userStore,
    tab: 'login',
    loginForm: { username: '', password: '' },
    loginShowPass: false,
    loginLoading: false,
    loginError: '',
    registerForm: { username: '', password: '', displayName: '', email: '' },
    regShowPass: false,
    regLoading: false,
    regError: '',
    forgotEmail: '',
    forgotLoading: false,
    forgotMsg: '',
    forgotError: false,
    editDisplayName: '',
    editEmail: '',
    editDiscord: '',
    claimPlayerName: '',
    claimMsg: '',
    claimMsgOk: false,
    claims: [],
    submissions: [],
    records: [],
    notifications: [],
  }),
  methods: {
    async onLogin() {
      this.loginLoading = true;
      this.loginError = '';
      try {
        // Try admin login first
        const adminRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.loginForm.username, password: this.loginForm.password }),
        });
        const adminData = await adminRes.json();
        if (adminData.success) {
          localStorage.setItem('admin_token', adminData.token);
          store.setAdmin(true);
          this.$router.push('/admin/dashboard');
          this.loginLoading = false;
          return;
        }
        if (adminData.error === 'IP banned') {
          this.loginError = 'You have failed login for 5 times, your IP is temporarily banned for 15 minutes, please try again later.';
          this.loginLoading = false;
          return;
        }
        // Fall back to user login
        await loginUser(this.loginForm.username, this.loginForm.password);
        this.loginForm = { username: '', password: '' };
        this.loadAccountData();
      } catch (e) {
        this.loginError = e.message;
      }
      this.loginLoading = false;
    },
    async onForgot() {
      if (!this.forgotEmail) { this.forgotMsg = 'Please enter your email'; this.forgotError = true; return; }
      this.forgotLoading = true;
      this.forgotMsg = '';
      this.forgotError = false;
      try {
        const res = await fetch(`${API_BASE}/api/user/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.forgotEmail }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        this.forgotMsg = data.message || 'Check your email for the reset link.';
        this.forgotEmail = '';
      } catch (e) {
        this.forgotMsg = e.message;
        this.forgotError = true;
      }
      this.forgotLoading = false;
    },
    async onRegister() {
      this.regLoading = true;
      this.regError = '';
      try {
        const email = this.registerForm.email.trim();
        if (!email) { this.regError = 'Email is required'; this.regLoading = false; return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.regError = 'Invalid email format'; this.regLoading = false; return; }
        await registerUser(this.registerForm.username, this.registerForm.password, this.registerForm.displayName, email);
        this.registerForm = { username: '', password: '', displayName: '', email: '' };
        this.loadAccountData();
      } catch (e) {
        this.regError = e.message;
      }
      this.regLoading = false;
    },
    onLogout() {
      logoutUser();
      this.notifications = [];
      this.claims = [];
    },
    async saveDisplayName() {
      if (!this.editDisplayName) return;
      try {
        await updateProfile({ displayName: this.editDisplayName });
      } catch (e) { alert(e.message); }
    },
    async saveDiscord() {
      if (!this.editDiscord) return;
      try {
        await updateProfile({ discordUsername: this.editDiscord });
      } catch (e) { alert(e.message); }
    },
    async saveEmail() {
      const email = this.editEmail.trim();
      if (!email) { alert('Email is required'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Invalid email format'); return; }
      try {
        await updateProfile({ email });
      } catch (e) { alert(e.message); }
    },
    async onClaim() {
      this.claimMsg = '';
      if (!this.claimPlayerName) return;
      try {
        await submitClaim(this.claimPlayerName);
        this.claimMsg = 'Claim submitted! Waiting for admin approval.';
        this.claimMsgOk = true;
        this.claimPlayerName = '';
        this.loadClaims();
      } catch (e) {
        this.claimMsg = e.message;
        this.claimMsgOk = false;
      }
    },
    async loadAccountData() {
      if (!userStore.user) return;
      this.editDisplayName = userStore.user.displayName || '';
      this.editEmail = userStore.user.email || '';
      this.editDiscord = userStore.user.discordUsername || '';
      this.claimPlayerName = userStore.user.playerName || '';
      this.loadClaims();
      this.loadSubmissions();
      this.loadRecords();
      this.loadNotifs();
    },
    async loadSubmissions() {
      if (!userStore.token) return;
      try {
        const res = await fetch(`${API_BASE}/api/user/submissions`, {
          headers: { 'Authorization': `Bearer ${userStore.token}` },
        });
        if (res.ok) this.submissions = await res.json();
      } catch {}
    },
    async loadRecords() {
      if (!userStore.token) return;
      try {
        const res = await fetch(`${API_BASE}/api/user/records`, {
          headers: { 'Authorization': `Bearer ${userStore.token}` },
        });
        if (res.ok) this.records = await res.json();
      } catch {}
    },
    async loadClaims() {
      if (!userStore.token) return;
      try {
        const res = await fetch(`${API_BASE}/api/claims`, {
          headers: { 'Authorization': `Bearer ${userStore.token}` },
        });
        if (res.ok) this.claims = await res.json();
      } catch {}
    },
    async loadNotifs() {
      const data = await fetchNotifications();
      this.notifications = data.notifications || [];
    },
    async onNotifClick(n) {
      if (!n.read) {
        await markNotifRead(n.id);
        n.read = 1;
        userStore.unreadCount = Math.max(0, userStore.unreadCount - 1);
      }
    },
    async onMarkAllRead() {
      await markAllRead();
      this.notifications.forEach(n => n.read = 1);
    },
    formatDate(ts) {
      const d = new Date(ts);
      return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    },
    formatDateISO(ts) {
      if (!ts) return '';
      return ts.split('T')[0] || ts.slice(0, 10);
    },
  },
  mounted() {
    if (userStore.user) this.loadAccountData();
  },
};

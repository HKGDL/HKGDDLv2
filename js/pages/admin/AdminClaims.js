import { apiGet, apiPut } from "../../api.js";

export default {
  template: `
    <div class="admin-dashboard">
      <div class="admin-section">
        <h2>Player Name Claims</h2>
        <div v-if="claims.length === 0" class="type-label-md" style="opacity: 0.6; text-align: center; padding: 2rem;">No claims yet.</div>
        <div v-for="c in claims" class="admin-level-card">
          <div class="admin-level-header">
            <span class="admin-level-name">
              <strong>{{ c.player_name }}</strong>
              <span class="type-label-md" style="margin-left: 0.5rem;">by {{ c.display_name || c.username }}</span>
            </span>
            <span :class="'admin-claim-badge admin-claim--' + c.status">{{ c.status }}</span>
          </div>
          <p class="type-body" style="margin-top: 0.25rem;">Submitted: {{ formatDate(c.created_at) }}</p>
          <div v-if="c.status === 'pending'" style="display: flex; gap: 0.75rem; margin-top: 0.75rem;">
            <button class="admin-submit-btn admin-submit-btn--accept" @click="approveClaim(c)">Approve</button>
            <button class="admin-submit-btn admin-submit-btn--reject" @click="rejectClaim(c)">Reject</button>
          </div>
        </div>
      </div>
    </div>
  `,
  inject: ['adminToken'],
  data: () => ({
    claims: [],
  }),
  methods: {
    async loadClaims() {
      try {
        this.claims = await apiGet('/api/admin/claims', this.adminToken());
      } catch {}
    },
    async approveClaim(c) {
      try {
        await apiPut(`/api/admin/claims/${c.id}`, { status: 'approved' }, this.adminToken());
        c.status = 'approved';
      } catch (e) { alert(e.message); }
    },
    async rejectClaim(c) {
      try {
        await apiPut(`/api/admin/claims/${c.id}`, { status: 'rejected' }, this.adminToken());
        c.status = 'rejected';
      } catch (e) { alert(e.message); }
    },
    formatDate(ts) {
      return new Date(ts).toLocaleDateString('en-GB');
    },
  },
  mounted() {
    this.loadClaims();
  },
};

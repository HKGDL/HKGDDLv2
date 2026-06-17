import { apiFetch, apiPut } from "../../api.js";

export default {
  template: `
    <div class="admin-dashboard">
      <div class="admin-section">
        <h2>Pending Submissions</h2>
        <div v-if="submissions.length === 0" class="type-label-md" style="opacity: 0.6; text-align: center; padding: 2rem;">No pending submissions.</div>
          <div v-for="sub in submissions" class="admin-level-card">
            <div class="admin-level-header">
              <span class="admin-level-name">
                <strong>{{ sub.levelName }}</strong>
                <span class="type-label-md" style="opacity: 0.5; margin-left: 0.5rem;">ID: {{ sub.levelId }}</span>
              </span>
              <span class="type-label-md">by {{ sub.record?.player || sub.submittedBy }}</span>
            </div>
            <p v-if="sub.record?.videoUrl" class="type-body" style="margin: 0.5rem 0;">
              <a :href="sub.record.videoUrl" target="_blank" rel="noopener">{{ sub.record.videoUrl }}</a>
            </p>
            <div class="form-group" style="margin-top: 0.5rem;">
              <textarea v-model="sub.adminNotes" placeholder="Admin notes (optional)" rows="2" style="width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text); resize: vertical;"></textarea>
            </div>
            <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
              <button class="admin-submit-btn admin-submit-btn--accept" @click.prevent="approveSub(sub)">Accept</button>
              <button class="admin-submit-btn admin-submit-btn--reject" @click.prevent="rejectSub(sub)">Reject</button>
            </div>
          </div>
      </div>
    </div>
  `,
  inject: ['adminToken'],
  data: () => ({
    submissions: [],
  }),
  methods: {
    async loadSubmissions() {
      try {
        this.submissions = await apiFetch('/api/pending-submissions');
      } catch {}
    },
    async approveSub(sub) {
      try {
        await apiPut(`/api/pending-submissions/${sub.id}`, { status: 'approved', adminNotes: sub.adminNotes || '' }, this.adminToken());
        this.submissions = this.submissions.filter(s => s.id !== sub.id);
      } catch (e) {
        alert('Failed: ' + (e.message || 'unknown error'));
      }
    },
    async rejectSub(sub) {
      try {
        await apiPut(`/api/pending-submissions/${sub.id}`, { status: 'rejected', adminNotes: sub.adminNotes || '' }, this.adminToken());
        this.submissions = this.submissions.filter(s => s.id !== sub.id);
      } catch (e) {
        alert('Failed: ' + (e.message || 'unknown error'));
      }
    },
  },
  mounted() {
    this.loadSubmissions();
  },
};

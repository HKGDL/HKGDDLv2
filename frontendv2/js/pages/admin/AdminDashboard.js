import { apiFetch, apiGet } from "../../api.js";

const API_BASE = 'https://api.hkgdl.dpdns.org';

export default {
  template: `
    <div class="admin-dashboard">
      <div class="admin-section">
        <h2>Dashboard</h2>
        <div class="admin-stats">
          <div class="admin-stat-card">
            <span class="admin-stat-num">{{ stats.pending }}</span>
            <span class="type-label-md">Pending</span>
          </div>
          <div class="admin-stat-card">
            <span class="admin-stat-num">{{ stats.levels }}</span>
            <span class="type-label-md">Levels</span>
          </div>
          <div class="admin-stat-card">
            <span class="admin-stat-num">{{ stats.mappings }}</span>
            <span class="type-label-md">Mappings</span>
          </div>
        </div>
        <div style="margin-top: 1rem;">
          <button class="admin-submit-btn" @click.prevent="onSyncDetails" :disabled="syncing">
            {{ syncing ? 'Syncing...' : 'Sync Level Details' }}
          </button>
          <div v-if="syncing" style="margin-top: 0.75rem;">
            <div class="sync-progress-bar">
              <div class="sync-progress-fill" :style="{ width: progressPct + '%' }"></div>
            </div>
            <p class="sync-progress-text" v-if="progressName">{{ progressCurrent }} / {{ progressTotal }} — {{ progressName }}</p>
            <p class="sync-progress-text" v-else>{{ progressCurrent }} / {{ progressTotal }}</p>
          </div>
          <p v-if="syncMsg" :class="syncMsgOk ? 'admin-msg success' : 'admin-msg error'" style="margin-top: 0.5rem;">{{ syncMsg }}</p>
        </div>
      </div>
    </div>
  `,
  inject: ['adminToken'],
  data: () => ({
    stats: { pending: 0, levels: 0, mappings: 0 },
    syncing: false,
    syncMsg: '',
    syncMsgOk: false,
    progressCurrent: 0,
    progressTotal: 0,
    progressName: '',
  }),
  computed: {
    progressPct() {
      if (!this.progressTotal) return 0;
      return Math.round((this.progressCurrent / this.progressTotal) * 100);
    },
  },
  methods: {
    async loadStats() {
      try {
        const [submissions, levels, mappings] = await Promise.all([
          apiFetch('/api/pending-submissions'),
          apiFetch('/api/levels'),
          apiGet('/api/player-mappings', this.adminToken()),
        ]);
        this.stats = {
          pending: submissions.length || 0,
          levels: levels.length || 0,
          mappings: mappings.length || 0,
        };
      } catch {}
    },
    async onSyncDetails() {
      this.syncing = true;
      this.syncMsg = '';
      this.progressCurrent = 0;
      this.progressTotal = 0;
      this.progressName = '';
      try {
        const token = this.adminToken();
        const res = await fetch(`${API_BASE}/api/levels/sync-details`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: '{}',
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Sync failed');
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (data.type === 'start') {
                this.progressTotal = data.total;
                this.progressCurrent = 0;
              } else if (data.type === 'progress') {
                this.progressCurrent = data.current;
                this.progressName = data.name;
              } else if (data.type === 'done') {
                this.progressCurrent = data.total;
                this.syncMsg = `Synced details for ${data.updated} levels.`;
                this.syncMsgOk = true;
              }
            } catch {}
          }
        }
      } catch (e) {
        this.syncMsg = e.message || 'Sync failed.';
        this.syncMsgOk = false;
      }
      this.syncing = false;
    },
  },
  mounted() {
    this.loadStats();
  },
};

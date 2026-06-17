import { apiFetch, apiPost, apiDelete } from "../../api.js";

export default {
  template: `
    <div class="admin-dashboard">
      <div class="admin-section">
        <h2>Changelog</h2>
        <form @submit.prevent="onAddChangelog" class="admin-inline-form">
          <input type="text" v-model="newChangelog.date" placeholder="Date (e.g. 2026/06/16)" />
          <input type="text" v-model="newChangelog.levelName" placeholder="Level name" />
          <select v-model="newChangelog.change">
            <option value="sync">Sync</option>
            <option value="rank_up">Rank Up</option>
            <option value="rank_down">Rank Down</option>
            <option value="added">Added</option>
            <option value="removed">Removed</option>
            <option value="update">Update</option>
          </select>
          <input type="text" v-model="newChangelog.description" placeholder="Description" />
          <button type="submit" class="admin-submit-btn">Add</button>
        </form>
        <p v-if="changelogMsg" :class="'admin-msg ' + (changelogMsgOk ? 'success' : 'error')" style="margin-bottom: 1rem;">{{ changelogMsg }}</p>
        <div v-for="entry in changelogEntries" class="admin-level-card" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>{{ entry.levelName }}</strong>
            <span class="type-label-md" style="margin-left: 0.5rem;">{{ entry.date }}</span>
            <span class="type-label-md" style="margin-left: 0.5rem; opacity: 0.6;">{{ entry.change }}</span>
            <p class="type-body" style="margin-top: 0.25rem;">{{ entry.description }}</p>
          </div>
          <button class="admin-record-delete" @click.prevent="onDeleteChangelog(entry.id)" title="Delete">&#x2715;</button>
        </div>
      </div>
    </div>
  `,
  inject: ['adminToken'],
  data: () => ({
    changelogEntries: [],
    newChangelog: { date: '', levelName: '', change: 'sync', description: '' },
    changelogMsg: '',
    changelogMsgOk: false,
  }),
  methods: {
    async loadChangelog() {
      try {
        this.changelogEntries = await apiFetch('/api/changelog');
      } catch {}
    },
    async onAddChangelog() {
      this.changelogMsg = '';
      if (!this.newChangelog.date || !this.newChangelog.levelName || !this.newChangelog.description) {
        this.changelogMsg = 'Date, level name, and description required.';
        this.changelogMsgOk = false;
        return;
      }
      try {
        const id = `admin-${Date.now()}`;
        const res = await apiPost('/api/changelog', {
          id,
          date: this.newChangelog.date,
          levelName: this.newChangelog.levelName,
          levelId: 'system',
          change: this.newChangelog.change,
          description: this.newChangelog.description,
          listType: 'classic',
        }, this.adminToken());
        if (res.id) {
          this.changelogMsg = 'Entry added.';
          this.changelogMsgOk = true;
          this.newChangelog = { date: '', levelName: '', change: 'sync', description: '' };
          try { this.changelogEntries = await apiFetch('/api/changelog'); } catch {}
        }
      } catch (e) {
        this.changelogMsg = e.message || 'Failed to add entry.';
        this.changelogMsgOk = false;
      }
    },
    async onDeleteChangelog(id) {
      try {
        await apiDelete(`/api/changelog/${id}`, this.adminToken());
        this.changelogEntries = this.changelogEntries.filter(e => e.id !== id);
      } catch (e) {
        alert('Failed: ' + (e.message || 'unknown error'));
      }
    },
  },
  mounted() {
    this.loadChangelog();
  },
};

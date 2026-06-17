import { apiFetch, apiDelete } from "../../api.js";

export default {
  template: `
    <div class="admin-dashboard">
      <div class="admin-section">
        <h2>Records</h2>
        <div class="admin-search-bar">
          <input type="text" v-model="recordSearch" placeholder="Search level by name..." />
          <select v-model="recordSort">
            <option value="rank">Rank</option>
            <option value="name">Name</option>
            <option value="records">Most Records</option>
          </select>
        </div>
        <div v-if="loadingLevels" class="admin-loading">Loading levels...</div>
        <div v-else>
          <div v-for="lvl in pagedLevels" class="admin-level-card">
            <div class="admin-level-header">
              <span class="admin-level-name">
                <strong>{{ lvl.name }}</strong>
                <span class="type-label-md" style="opacity: 0.5; margin-left: 0.5rem;">#{{ lvl.rank }}</span>
              </span>
              <span class="admin-level-rec-count">{{ lvl.records?.length || 0 }} records</span>
            </div>
            <div v-if="(lvl.records || []).length" class="admin-record-list">
              <div v-for="rec in lvl.records" class="admin-record-row">
                <span>{{ rec.player }}</span>
                <span class="type-label-md" style="opacity: 0.6;">{{ rec.fps || '?' }}fps &middot; {{ rec.date || '' }}</span>
                <button class="admin-record-delete" @click.prevent="deleteRecord(lvl, rec)" title="Delete record">&#x2715;</button>
              </div>
            </div>
          </div>
          <div v-if="filteredLevels.length > pageSize" class="admin-pagination">
            <button class="admin-page-btn" :disabled="page <= 1" @click="page--">Prev</button>
            <span class="type-label-md">Page {{ page }} of {{ totalPages }}</span>
            <button class="admin-page-btn" :disabled="page >= totalPages" @click="page++">Next</button>
          </div>
          <p v-if="filteredLevels.length === 0" class="type-label-md" style="opacity: 0.6; text-align: center; padding: 2rem;">No levels match your search.</p>
        </div>
      </div>
    </div>
  `,
  inject: ['adminToken'],
  data: () => ({
    allLevels: [],
    loadingLevels: false,
    recordSearch: '',
    recordSort: 'rank',
    page: 1,
    pageSize: 10,
  }),
  computed: {
    filteredLevels() {
      let list = [...this.allLevels];
      if (this.recordSearch) {
        const q = this.recordSearch.toLowerCase();
        list = list.filter(l => l.name.toLowerCase().includes(q));
      }
      if (this.recordSort === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.recordSort === 'records') {
        list.sort((a, b) => (b.records?.length || 0) - (a.records?.length || 0));
      } else {
        list.sort((a, b) => (a.rank || 9999) - (b.rank || 9999));
      }
      return list;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredLevels.length / this.pageSize));
    },
    pagedLevels() {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredLevels.slice(start, start + this.pageSize);
    },
  },
  watch: {
    recordSearch() { this.page = 1; },
    recordSort() { this.page = 1; },
  },
  methods: {
    async loadLevels() {
      this.loadingLevels = true;
      try {
        this.allLevels = await apiFetch('/api/levels');
      } catch {}
      this.loadingLevels = false;
    },
    async deleteRecord(lvl, rec) {
      if (!confirm(`Delete ${rec.player}'s record on ${lvl.name}?`)) return;
      try {
        await apiDelete(`/api/records/${rec.id}`, this.adminToken());
        lvl.records = lvl.records.filter(r => r.id !== rec.id);
      } catch (e) {
        alert('Failed: ' + (e.message || 'unknown error'));
      }
    },
  },
  mounted() {
    this.loadLevels();
  },
};

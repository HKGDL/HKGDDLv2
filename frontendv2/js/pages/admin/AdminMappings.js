import { apiFetch, apiPost } from "../../api.js";

export default {
  template: `
    <div class="admin-dashboard">
      <div class="admin-section">
        <h2>Player Mappings</h2>
        <form @submit.prevent="onAddMapping" class="admin-inline-form">
          <input type="text" v-model="newMapping.gameName" placeholder="Game name (typo)" />
          <input type="text" v-model="newMapping.dbName" placeholder="DB name (correct)" />
          <button type="submit" class="admin-submit-btn">Add</button>
        </form>
        <p v-if="mappingMsg" :class="'admin-msg ' + (mappingMsgOk ? 'success' : 'error')" style="margin-bottom: 1rem;">{{ mappingMsg }}</p>
        <table class="admin-table" v-if="mappings.length">
          <tr><th class="type-title-sm">Game Name</th><th class="type-title-sm">DB Name</th></tr>
          <tr v-for="m in mappings"><td>{{ m.gameName }}</td><td>{{ m.dbName }}</td></tr>
        </table>
        <p v-else class="type-label-md" style="opacity: 0.6; text-align: center; padding: 1rem;">No mappings yet.</p>
      </div>
    </div>
  `,
  inject: ['adminToken'],
  data: () => ({
    mappings: [],
    newMapping: { gameName: '', dbName: '' },
    mappingMsg: '',
    mappingMsgOk: false,
  }),
  methods: {
    async loadMappings() {
      try {
        this.mappings = await apiFetch('/api/player-mappings');
      } catch {}
    },
    async onAddMapping() {
      this.mappingMsg = '';
      if (!this.newMapping.gameName || !this.newMapping.dbName) {
        this.mappingMsg = 'Both fields required.';
        this.mappingMsgOk = false;
        return;
      }
      try {
        const res = await apiPost('/api/player-mapping', {
          gameName: this.newMapping.gameName,
          dbName: this.newMapping.dbName,
        }, this.adminToken());
        if (res.success) {
          this.mappingMsg = `Mapped "${res.gameName}" → "${res.dbName}"`;
          this.mappingMsgOk = true;
          this.newMapping = { gameName: '', dbName: '' };
          try { this.mappings = await apiFetch('/api/player-mappings'); } catch {}
        }
      } catch (e) {
        this.mappingMsg = e.message || 'Failed to add mapping.';
        this.mappingMsgOk = false;
      }
    },
  },
  mounted() {
    this.loadMappings();
  },
};

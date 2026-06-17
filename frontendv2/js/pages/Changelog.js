import Spinner from "../components/Spinner.js";
import { fetchChangelog } from "../api.js";

export default {
  components: { Spinner },
  template: `
    <main class="page-changelog">
      <div v-if="loading">
        <Spinner></Spinner>
      </div>
      <div v-else class="changelog-container">
        <h1>Changelog</h1>
        <div v-if="entries.length === 0" class="empty">
          <p>No changelog entries yet.</p>
        </div>
        <div v-for="entry in entries" class="changelog-entry">
          <div class="entry-header">
            <span class="type-title-sm">{{ entry.date }}</span>
            <span class="type-label-md">{{ entry.levelName }}</span>
            <span v-if="entry.change === 'sync'" class="entry-tag sync">Sync</span>
            <span v-else-if="entry.change === 'rank_up'" class="entry-tag rankup">Rank Up</span>
            <span v-else-if="entry.change === 'rank_down'" class="entry-tag rankdown">Rank Down</span>
            <span v-else class="entry-tag">{{ entry.change }}</span>
          </div>
          <p class="type-body entry-desc">{{ entry.description }}</p>
        </div>
      </div>
    </main>
  `,
  data: () => ({
    entries: [],
    loading: true,
  }),
  async mounted() {
    try {
      this.entries = await fetchChangelog();
    } catch {
      this.entries = [];
    }
    this.loading = false;
  },
};

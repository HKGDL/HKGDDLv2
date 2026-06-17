import { embed } from '../util.js';
import { score } from '../score.js';
import { fetchList } from '../content.js';
import LevelAuthors from '../components/List/LevelAuthors.js';
import Spinner from '../components/Spinner.js';

export default {
  components: { Spinner, LevelAuthors },
  data: () => ({ level: null, loading: true, totalLevels: 0 }),
  computed: {
    video() {
      if (!this.level) return '';
      const url = this.level.verification || (this.level.records?.[0]?.link) || '';
      return url ? embed(url) : '';
    },
  },
  async mounted() {
    const list = await fetchList();
    this.totalLevels = list.length;
    const found = list.find(([l]) => l && l.rank === Number(this.$route.params.rank));
    this.level = found ? found[0] : null;
    this.loading = false;
  },
  template: `
    <main v-if="loading">
      <Spinner></Spinner>
    </main>
    <main v-else class="page-list">
      <div class="level-detail-page">
        <p class="back-btn" @click="$router.back()">&larr; Back</p>
        <div class="level" v-if="level">
          <h1>{{ level.name }}</h1>
          <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
          <iframe v-if="video" class="video" id="videoframe" :src="video" frameborder="0"></iframe>
          <ul class="stats">
            <li>
              <div class="type-title-sm">ID</div>
              <p>{{ level.id }}</p>
            </li>
            <li>
              <div class="type-title-sm">Records</div>
              <p>{{ level.records.length }}</p>
            </li>
          </ul>
          <h2>Records</h2>
          <table class="records">
            <tr v-for="record in level.records" class="record">
              <td class="pts">
                <p>+{{ record.points != null ? record.points : score(level.rank, record.percent || 100, level.percentToQualify, totalLevels) }}</p>
              </td>
              <td class="user">
                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
              </td>
              <td class="hz">
                <p>{{ record.hz ? record.hz + 'Hz' : '-' }}</p>
              </td>
            </tr>
          </table>
        </div>
        <div v-else style="padding: 2rem; text-align: center;">
          <p>Level not found.</p>
          <a href="#/" class="type-label-lg">&larr; Back to list</a>
        </div>
      </div>
    </main>
  `,
};

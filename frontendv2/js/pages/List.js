import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
  owner: "crown",
  admin: "user-gear",
  helper: "user-shield",
  dev: "code",
  trial: "user-lock",
};

export default {
  components: { Spinner, LevelAuthors },
  template: `
    <main v-if="loading">
      <Spinner></Spinner>
    </main>
    <main v-else class="page-list">
      <div class="list-container">
        <table class="list" v-if="list">
          <tr v-for="([level, err], i) in list"
            @touchstart.passive="swipeStart($event, i)"
            @touchend.passive="swipeEnd($event, i)">
            <td class="rank">
              <p class="type-label-lg">#{{ level.rank }}</p>
            </td>
            <td class="level" :class="{ 'active': selected == i, 'error': !level }">
              <button @click="onLevelClick(i)">
                <span class="type-label-lg">{{ level?.name || 'Error' }}</span>
              </button>
            </td>
            <td class="points">
              <p class="type-label-lg">+{{ getPoints(level) }}</p>
            </td>
          </tr>
        </table>
      </div>
      <div class="level-container">
        <div class="level" v-if="level">
          <h1>{{ level.name }}</h1>
          <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
          <iframe v-if="video" class="video" id="videoframe" :src="video" frameborder="0"></iframe>
          <ul class="stats">
            <li>
              <div class="type-title-sm">Points when completed</div>
              <p>{{ scoreText }}</p>
            </li>
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
                <p>+{{ recordPoints(record) }}</p>
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
        <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
          <p>Select a level to view details</p>
        </div>
      </div>
      <div class="meta-container">
        <div class="meta">
          <div class="errors" v-show="errors.length > 0">
            <p class="error" v-for="error of errors">{{ error }}</p>
          </div>
          <template v-if="editors && editors.length">
            <h3>List Editors</h3>
            <ol class="editors">
              <li v-for="editor in editors">
                <img :src="'/assets/' + roleIconMap[editor.role] + (store.dark ? '-dark' : '') + '.svg'" :alt="editor.role">
                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                <p v-else>{{ editor.name }}</p>
              </li>
            </ol>
          </template>
        </div>
      </div>
    </main>
  `,
  data: () => ({
    list: [],
    editors: [],
    loading: true,
    selected: 0,
    errors: [],
    roleIconMap,
    store,
  }),
  computed: {
    level() {
      return this.list[this.selected]?.[0] || null;
    },
    video() {
      if (!this.level) return '';
      const url = this.level.verification || (this.level.records?.[0]?.link) || '';
      return url ? embed(url) : '';
    },
    scoreText() {
      if (!this.level) return '';
      return score(this.level.rank, 100, this.level.percentToQualify, this.list.length);
    },
  },
  async mounted() {
    this.list = await fetchList();
    this.editors = await fetchEditors();
    if (!this.list) {
      this.errors = ["Failed to load list. Retry in a few minutes or notify list staff."];
    } else {
      this.errors.push(...this.list.filter(([_, err]) => err).map(([_, err]) => `Failed to load level.`));
      if (!this.editors) {
        this.errors.push("Failed to load list editors.");
      }
    }
    this.loading = false;
  },
  methods: {
    getPoints(level) {
      return score(level.rank, 100, level.percentToQualify, this.list.length);
    },
    recordPoints(record) {
      if (record.points != null) return record.points;
      if (!this.level) return 0;
      return score(this.level.rank, record.percent || 100, this.level.percentToQualify, this.list.length);
    },
    onLevelClick(i) {
      if (window.innerWidth < 768) {
        const level = this.list[i]?.[0];
        if (level) this.$router.push('/level/' + level.rank);
      } else {
        this.selected = i;
      }
    },
    swipeStart(e, i) {
      this._swipeX = e.touches[0].clientX;
      this._swipeIdx = i;
    },
    swipeEnd(e, i) {
      const dx = e.changedTouches[0].clientX - this._swipeX;
      if (dx < -50) {
        const level = this.list[i]?.[0];
        if (level) this.$router.push('/level/' + level.rank);
      }
    },
  },
};

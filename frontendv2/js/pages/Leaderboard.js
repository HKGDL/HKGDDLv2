import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: window.innerWidth < 768 ? -1 : 0,
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard"
                            @touchstart.passive="swipeStart($event, i)"
                            @touchend.passive="swipeEnd($event, i)">
                            <td class="rank" @click="onPlayerClick(i)">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total" @click="onPlayerClick(i)">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="onPlayerClick(i)">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container" v-if="entry">
                    <div class="player">
                        <p v-if="isMobile" class="back-btn" @click="selected = -1">&larr; Back</p>
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ localize(entry.total) }}</h3>
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{entry.progressed.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
    watch: {
        selected() {
            this.$nextTick(() => {
                const el = this.$el?.querySelector('.player-container');
                if (el && window.innerWidth < 768) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        },
    },
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
        isMobile() {
            return window.innerWidth < 768;
        },
    },
    methods: {
        localize,
        onPlayerClick(i) {
            this.selected = i;
        },
        swipeStart(e, i) {
            this._swipeX = e.touches[0].clientX;
            this._swipeIdx = i;
        },
        swipeEnd(e, i) {
            const dx = e.changedTouches[0].clientX - this._swipeX;
            if (dx < -50) {
                this.selected = i;
            }
        },
    },
};

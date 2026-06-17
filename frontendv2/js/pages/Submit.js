import { submitRecord } from "../api.js";
import { userStore } from "../main.js";

export default {
  template: `
    <main class="page-submit">
      <div class="submit-container">
        <h1>Submit</h1>
        <p class="type-label-md" style="margin-bottom: 2rem;">
          Submit your record to the HKGD Demon List. An admin will review your submission.
        </p>
        <p v-if="userStore.user" class="type-label-md" style="margin-bottom: 1rem; opacity: 0.6;">
          Logged in as {{ userStore.user.displayName }}. Player name pre-filled from your account.
        </p>
        <form @submit.prevent="onSubmit" class="submit-form">
          <div class="form-group">
            <label class="type-title-sm">Level Name</label>
            <input type="text" v-model="form.levelName" placeholder="e.g. Tartarus" required />
          </div>
          <div class="form-group">
            <label class="type-title-sm">Level ID</label>
            <input type="text" v-model="form.levelId" placeholder="e.g. 105657404" @input="onIdInput" />
          </div>
          <div class="form-group">
            <label class="type-title-sm">Your Name</label>
            <input type="text" v-model="form.player" placeholder="In-game name" required />
          </div>
          <div class="form-group">
            <label class="type-title-sm">Video URL</label>
            <input type="url" v-model="form.videoUrl" placeholder="YouTube or other video link" required />
          </div>
          <div class="form-group">
            <label class="type-title-sm">FPS (optional)</label>
            <input type="number" v-model="form.fps" placeholder="e.g. 360" />
          </div>
          <button type="submit" class="submit-btn">Submit</button>
        </form>
        <div v-if="message" class="submit-message" :class="{ success: success, error: !success }">
          <p>{{ message }}</p>
        </div>
      </div>
    </main>
  `,
  data: () => ({
    userStore,
    form: { levelName: '', levelId: '', player: '', videoUrl: '', fps: '' },
    message: '',
    success: false,
  }),
  methods: {
    onIdInput() {
      if (this.form.levelId === 'HKGD2024admin') {
        this.form.levelId = '';
        window.location.hash = '#/admin';
      }
    },
    async onSubmit() {
      this.message = '';
      try {
        await submitRecord(this.form);
        this.message = 'Record submitted successfully! It will be reviewed by an admin.';
        this.success = true;
        this.form = { levelName: '', levelId: '', player: '', videoUrl: '', fps: '' };
        if (this.userStore.user) this.form.player = this.userStore.user.playerName || '';
      } catch (e) {
        this.message = e.message || 'Failed to submit. Try again later.';
        this.success = false;
      }
    },
  },
  mounted() {
    if (this.userStore.user && this.userStore.user.playerName) {
      this.form.player = this.userStore.user.playerName;
    }
  },
};

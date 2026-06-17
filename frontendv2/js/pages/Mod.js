import Spinner from "../components/Spinner.js";

function renderMarkdown(text) {
  return text
    .replace(/### (.+)/g, '<h4>$1</h4>')
    .replace(/## (.+)/g, '<h3>$1</h3>')
    .replace(/# (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- /g, '<br>• ')
    .replace(/\n/g, '<br>');
}

export default {
  components: { Spinner },
  template: `
    <main class="page-mod">
      <div class="mod-container" v-if="!loading">
        <div class="mod-header">
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <h1>HKGD Geode Mod</h1>
            <p class="type-label-md">The official HKGD mod for Geometry Dash</p>
          </div>
        </div>

        <div class="mod-info" v-if="release">
          <div class="mod-version-badge">
            <span class="version-label">Latest</span>
            <span class="version-tag">{{ release.tag_name }}</span>
            <span class="version-date">{{ release.published_at?.split('T')[0] }}</span>
          </div>

          <div class="mod-download" v-if="downloadUrl !== '#'">
            <a :href="downloadUrl" target="_blank" class="btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              <span class="type-label-lg">Download .geode</span>
            </a>
            <p class="type-body">Requires <a href="https://geode-sdk.org" target="_blank">Geode SDK</a></p>
          </div>

          <div class="mod-features">
            <h3>Features</h3>
            <ul>
              <li>View HKGD demon list in-game</li>
              <li>Submit completions directly</li>
              <li>Quick-switch between GD accounts</li>
            </ul>
          </div>

          <div class="mod-releases" v-if="allReleases.length">
            <h3>All Releases</h3>
            <div v-for="r in allReleases" class="release-card">
              <div class="release-header">
                <a :href="r.html_url" target="_blank" class="release-name">{{ r.tag_name }}</a>
                <span class="release-date">{{ r.published_at?.split('T')[0] }}</span>
              </div>
              <div class="release-body" v-if="r.body" v-html="renderMarkdown(r.body.slice(0, 500) + (r.body.length > 500 ? '...' : ''))"></div>
            </div>
          </div>
        </div>
        <p v-else-if="error" class="error">{{ error }}</p>
      </div>
      <div v-else>
        <Spinner></Spinner>
      </div>
    </main>
  `,
  data: () => ({
    release: null,
    allReleases: [],
    loading: true,
    error: null,
  }),
  computed: {
    downloadUrl() {
      if (!this.release) return '#';
      const asset = this.release.assets.find(a => a.name?.endsWith('.geode'));
      return asset?.browser_download_url || '#';
    },
  },
  methods: { renderMarkdown },
  async mounted() {
    try {
      const [latestRes, allRes] = await Promise.allSettled([
        fetch('https://api.github.com/repos/HKGDL/hkgdl-geode-mod/releases/latest'),
        fetch('https://api.github.com/repos/HKGDL/hkgdl-geode-mod/releases?per_page=5'),
      ]);
      if (latestRes.status === 'fulfilled' && latestRes.value.ok) {
        this.release = await latestRes.value.json();
      } else {
        throw new Error('Failed to fetch release');
      }
      if (allRes.status === 'fulfilled' && allRes.value.ok) {
        this.allReleases = (await allRes.value.json()).filter(r => r.tag_name !== this.release?.tag_name);
      }
    } catch (e) {
      this.error = 'Could not load mod info. Check GitHub for updates.';
    }
    this.loading = false;
  },
};

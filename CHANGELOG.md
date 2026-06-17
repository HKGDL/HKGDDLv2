# HKGD Website Changelog

## Version 2.0.0 - v2 Frontend (GDListTemplate)

### Frontend Changes
- **New Frontend** - Replaced React/Vite with Vue 3 CDN GDListTemplate (no build step)
- **AREDL Sorting** - List sorted by AREDL difficulty rank (matches v1 behavior)
- **Platformer Filter** - Platformer demons excluded from main demon list
- **Rank Display** - Sequential AREDL-based ranking with ties preserved

#### New Pages
- **Leaderboard** - Computed from completion records only (no verifier scoring), with player name resolution via API mappings + KNOWN_MAPPINGS fallback
- **Roulette** - Random level selector with video embed
- **Mod** - GitHub releases integration
- **Changelog** - Fetches from API
- **Submit Record** - Form POST to API pending submissions
- **Admin** - Hidden behind 5 clicks on HKGD logo; supports Pending Submissions accept/reject, Player Mappings, Sync Level Details

#### Player Name Resolution
- **API Priority Fix** - `KNOWN_MAPPINGS` now takes priority over API fallback (which returns unmapped names unchanged)
- **Known Mappings** - `nexus`→`Skyehi`, `3^3=7`→`3³=7`, `yourlui`→`Yorklui`

#### Infrastructure
- **Cloudflare Workers** - Deployed at `hkgd-v2.hkgdl.workers.dev`
- **DNS** - `v2.hkgdl.dpdns.org` CNAME to worker (pending manual DNS setup)
- **Static Assets** - Served directly by worker with SPA fallback

## Version 0.8.0 - The Biggest Update Since 0.5.0!

*(A lot of features were added between 0.5.0 and 0.8.0)*

### Backend (API) Changes

#### New Endpoints
- **`POST /api/levels/sync-details`** - Sync level details (creator, thumbnail, songs) from History GD API for rated levels
- **`POST /api/platformer-levels/sync-details`** - Sync platformer level details from History GD API
- **`GET /api/gdbrowser/level/:levelId`** - Fetch level details from History GD API
- **`GET /api/gdbrowser/search`** - Search levels using History GD API
- **`GET /api/root`** - Returns API info

#### Platformer System
- **Separate Platformer Tables** - Dedicated `platformer_levels` and `platformer_records` tables
- **Platformer Submissions** - Full submission support with admin difficulty placement
- **Difficulty Sync** - Admin tool to sync platformer level details

#### Improvements
- **History GD Integration** - Use History GD API for level lookups and search
- **Optimized Sync** - Batch sync limited to 50 levels to avoid timeouts
- **Better Fields** - Uses `cache_username`, `cache_song_id` from History GD

### Frontend Changes

#### Platformer List System
- **Separate Platformer List** - Platformer demons have their own dedicated list page
- **Drag & Drop Reordering** - New drag-and-drop modal to reorder platformer rankings
- **Auto-Fetch Details** - When adding levels, fetches creator, verifier, thumbnail, song automatically
- **Search by Name/ID** - Platformer search uses History GD API

#### Admin Panel
- **"Reorder" Button** - Added to Platformer Levels tab
- **Level Details Sync** - New buttons to sync classic and platformer level details
- **Difficulty Placement Modal** - For setting HKGD rank when approving platformer submissions

#### UI/UX
- **Mobile Experience** - Improved drag-and-drop modal for mobile
- **Better Search** - Enhanced level search functionality
- **Various Bug Fixes**

---

## Version 0.7.0 - (View previous changelog for details)

---

*For older changelogs, please check the GitHub releases page.*

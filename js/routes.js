import List from './pages/List.js';
import LevelDetail from './pages/LevelDetail.js';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Mod from './pages/Mod.js';
import Changelog from './pages/Changelog.js';
import Submit from './pages/Submit.js';
import Account from './pages/Account.js';
import ResetPassword from './pages/ResetPassword.js';
import Admin from './pages/Admin.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';
import AdminRecords from './pages/admin/AdminRecords.js';
import AdminSubmissions from './pages/admin/AdminSubmissions.js';
import AdminMappings from './pages/admin/AdminMappings.js';
import AdminChangelog from './pages/admin/AdminChangelog.js';
import AdminClaims from './pages/admin/AdminClaims.js';

export default [
  { path: '/', component: List },
  { path: '/level/:rank', component: LevelDetail },
  { path: '/leaderboard', component: Leaderboard },
  { path: '/roulette', component: Roulette },
  { path: '/mod', component: Mod },
  { path: '/changelog', component: Changelog },
  { path: '/submit', component: Submit },
  { path: '/account', component: Account },
  { path: '/reset-password', component: ResetPassword },
  {
    path: '/admin',
    component: Admin,
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'records', component: AdminRecords },
      { path: 'submissions', component: AdminSubmissions },
      { path: 'mappings', component: AdminMappings },
      { path: 'changelog', component: AdminChangelog },
      { path: 'claims', component: AdminClaims },
    ],
  },
];

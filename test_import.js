const levelsToImport = [
  { name: "Heavenly Echo", levelId: "125698552", hkgdRank: 30, records: [{ player: "3^3=7", date: "2026/04/04", fps: 240 }] },
  { name: "Chaos Ball Theory", levelId: "119638144", hkgdRank: 34, records: [{ player: "friendtm", date: "2026/03/31" }] },
  { name: "Void World", levelId: "107052022", hkgdRank: 42, records: [{ player: "Transparenty", date: "2025/06/22", fps: 240 }] },
  { name: "The Abyss", levelId: "98163412", hkgdRank: 83, records: [{ player: "3^3=7", date: "2024/06/08" }, { player: "Transparenty", date: "2024/10/06", fps: 144 }] },
  { name: "Life and Beauty", levelId: "99608524", hkgdRank: 85, records: [{ player: "3^3=7", date: "2025/05/10", fps: 240 }] },
  { name: "Terminal Heaven", levelId: "99335322", hkgdRank: 105, records: [{ player: "3^3=7", date: "2024/06/02" }] },
  { name: "FRUSTRATION", levelId: "103647687", hkgdRank: 108, records: [{ player: "3^3=7", date: "2024/06/23" }] },
  { name: "The Sun", levelId: "108338683", hkgdRank: 128, records: [{ player: "3^3=7", date: "2025/01/24", fps: 240 }] },
  { name: "Robot King", levelId: "99927952", hkgdRank: 144, records: [{ player: "3^3=7", date: "2024/03/21" }] },
  { name: "The SMR Collection", levelId: "114333632", hkgdRank: 150, records: [{ player: "3^3=7", date: "2025/02/08", fps: 240 }] },
  { name: "Qimu", levelId: "115945148", hkgdRank: 164, records: [{ player: "3^3=7", date: "2025/12/27", fps: 240 }] },
  { name: "Creepy Needle", levelId: "115691111", hkgdRank: 165, records: [{ player: "3^3=7", date: "2025/12/27", fps: 240 }] },
  { name: "Nextphase", levelId: "107420706", hkgdRank: 166, records: [{ player: "3^3=7", date: "2024/08/13" }] },
  { name: "Dungeon Treasures", levelId: "102010719", hkgdRank: 168, records: [{ player: "3^3=7", date: "2024/06/12" }] },
  { name: "Chief Needler", levelId: "102557379", hkgdRank: 174, records: [{ player: "3^3=7", date: "2024/08/11" }, { player: "Transparenty", date: "2024/09/20", fps: 240 }, { player: "Jamixiy", date: "2025/09/30", fps: 240 }] },
];

async function importLevels() {
  const token = localStorage.getItem('hkgd_admin_token');
  if (!token) {
    console.log('Please log into admin panel first to get a token');
    return;
  }

  console.log(`Importing ${levelsToImport.length} platformer levels...`);

  const response = await fetch('https://hkgdl.dpdns.org/api/platformer-levels/bulk-import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(levelsToImport)
  });

  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
}

importLevels();
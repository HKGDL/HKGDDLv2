interface PlatformerLevelInput {
  name: string;
  levelId: string;
  creator: string;
  verifier: string;
  thumbnail: string;
  hkgdRank: number;
  records: {
    player: string;
    date: string;
    videoUrl?: string;
    fps?: number;
    cbf?: boolean;
  }[];
}

// Platformer levels from CSV
const platformerLevels: PlatformerLevelInput[] = [
  { name: "Heavenly Echo", levelId: "125698552", hkgdRank: 30, records: [{ player: "3^3=7", date: "2026/04/04", videoUrl: "Geometry Dash | Heavenly Echo Clear - YouTube", fps: 240 }] },
  { name: "Chaos Ball Theory", levelId: "119638144", hkgdRank: 34, records: [{ player: "friendtm", date: "2026/03/31", videoUrl: "Chaos Ball Theory - YouTube" }] },
  { name: "Void World", levelId: "107052022", hkgdRank: 42, records: [{ player: "Transparenty", date: "2025/06/22", videoUrl: "(New Hardest) Void World by zYuko Clear! - YouTube", fps: 240 }] },
  { name: "Intervallum", levelId: "104049200", hkgdRank: 44, records: [{ player: "3^3=7", date: "2024/07/21", videoUrl: "(GD) Intervallum Clear - YouTube", fps: 0 }] },
  { name: "depth", levelId: "105549257", hkgdRank: 55, records: [{ player: "3^3=7", date: "2025/05/31", videoUrl: "Depth - YouTube", fps: 240 }] },
  { name: "Free Solo", levelId: "103998262", hkgdRank: 58, records: [{ player: "3^3=7", date: "2024/06/18", videoUrl: "(GD) Free Solo Clear - YouTube", fps: 0 }] },
  { name: "The Abyss", levelId: "98163412", hkgdRank: 83, records: [{ player: "3^3=7", date: "2024/06/08", videoUrl: "The Abyss Clear", fps: 0 }, { player: "Transparenty", date: "2024/10/06", videoUrl: "(Top 15) The Abyss by zYuko", fps: 144 }] },
  { name: "Life and Beauty", levelId: "99608524", hkgdRank: 85, records: [{ player: "3^3=7", date: "2025/05/10", videoUrl: "Discord Message", fps: 240 }] },
  { name: "HYPER GRAVITRON", levelId: "98745817", hkgdRank: 91, records: [{ player: "soth", date: "2024/08/09", videoUrl: "hyper gravitron 100% - YouTube", fps: 120 }, { player: "3^3=7", date: "2025/07/04", videoUrl: "Discord Message", fps: 240 }] },
  { name: "Terminal Heaven", levelId: "99335322", hkgdRank: 105, records: [{ player: "3^3=7", date: "2024/06/02", videoUrl: "terminal heaven clear", fps: 0 }] },
  { name: "Hexagonestestestest", levelId: "112346959", hkgdRank: 106, records: [{ player: "WhiteEmerald", date: "2024/12/20", videoUrl: "[Mobile] \"Hexagonestestestest\" (Extreme Demon) by Enlightenment | Geometry Dash 2.2", fps: 60 }, { player: "DevilCharlotte", date: "2024/12/26", videoUrl: "Discord Attachment", fps: 0 }, { player: "friendtm", date: "2026/03/04", videoUrl: "https://www.youtube.com/watch?v=aubSQs8-DlQ", fps: 60 }] },
  { name: "FRUSTRATION", levelId: "103647687", hkgdRank: 108, records: [{ player: "3^3=7", date: "2024/06/23", videoUrl: "Discord Message", fps: 0 }] },
  { name: "SUMMER", levelId: "122287167", hkgdRank: 127, records: [{ player: "WhiteEmerald", date: "2026/03/07", videoUrl: "[60Hz Mobile] \"SUMMER\" (Extreme Demon) by GHHH [1 Coin] | Geometry Dash 2.2 - YouTube", fps: 60 }, { player: "violatte", date: "2026/04/01", videoUrl: "summer - YouTube", fps: 240 }, { player: "NotAPerson", date: "2026/04/05", videoUrl: "[NEW PLAT HARDEST] \"SUMMER\" by GHHH Clear! (hk has 2 seasons☀️❄️ demon) - YouTube", fps: 240 }] },
  { name: "The Sun", levelId: "108338683", hkgdRank: 128, records: [{ player: "3^3=7", date: "2025/01/24", videoUrl: "Discord Message", fps: 240 }] },
  { name: "radio tower", levelId: "102805772", hkgdRank: 132, records: [{ player: "3^3=7", date: "2024/06/06", videoUrl: "Discord Attachment", fps: 0 }, { player: "Transparenty", date: "2024/09/02", videoUrl: "Discord Attachment", fps: 240 }, { player: "Yorklui", date: "2024/09/10", videoUrl: "Discord Attachment", fps: 180 }] },
  { name: "Beatpulse", levelId: "103346085", hkgdRank: 140, records: [{ player: "3^3=7", date: "2024/06/06", videoUrl: "https://www.bilibili.com/video/BV1Vy411b7vv", fps: 0 }, { player: "WhiteEmerald", date: "2024/08/29", videoUrl: "[Mobile] \"Beatpulse\" (Extreme Demon) by NDagger | Geometry Dash 2.2", fps: 60 }] },
  { name: "Robot King", levelId: "99927952", hkgdRank: 144, records: [{ player: "3^3=7", date: "2024/03/21", videoUrl: "Discord Message", fps: 0 }] },
  { name: "The SMR Collection", levelId: "114333632", hkgdRank: 150, records: [{ player: "3^3=7", date: "2025/02/08", videoUrl: "Discord Message", fps: 240 }] },
  { name: "FURY OF 500", levelId: "105382136", hkgdRank: 155, records: [{ player: "kwdash", date: "2024/07/08", videoUrl: "Discord Message", fps: 0 }, { player: "3^3=7", date: "2024/08/07", videoUrl: "Discord Message", fps: 0 }, { player: "Transparenty", date: "2024/08/07", videoUrl: "Fury of 500 CLEAR omg happy 😊", fps: 240 }, { player: "Yorklui", date: "2024/08/08", videoUrl: "Discord Message", fps: 180 }, { player: "soth", date: "2024/08/24", videoUrl: "fury of 500 100%", fps: 120 }, { player: "WhiteEmerald", date: "2024/08/30", videoUrl: "[Mobile] \"FURY OF 500\" (Extreme Demon) by Split72 & more | Geometry Dash 2.2 (Edited) - YouTube", fps: 60 }, { player: "Issanagay", date: "2025/02/01", videoUrl: "https://www.youtube.com/watch?v=Dl3n_yvDd0U", fps: 60 }, { player: "Jamixiy", date: "2025/09/30", videoUrl: "12th Extreme Demon | Fury of 500 100% - YouTube", fps: 240 }, { player: "Cheung", date: "2026/01/07", videoUrl: "Discord Message", fps: 60 }] },
  { name: "Storm Front", levelId: "100486532", hkgdRank: 159, records: [{ player: "3^3=7", date: "2024/04/03", videoUrl: "(GD) Storm Front Clear - YouTube", fps: 0 }, { player: "Skyehi", date: "2024/04/07", videoUrl: "Storm Front by rtnman 100% | 杏花邨 DEMON | Geometry Dash 2.205 Skyehi", fps: 240 }, { player: "Henry03", date: "2024/12/20", videoUrl: "Discord Attachment", fps: 60 }, { player: "tonas2", date: "2025/06/26", videoUrl: "Storm Front by rtnman 100% (extreme pemon)", fps: 480 }] },
  { name: "Qimu", levelId: "115945148", hkgdRank: 164, records: [{ player: "3^3=7", date: "2025/12/27", videoUrl: "Discord Message", fps: 240 }] },
  { name: "Creepy Needle", levelId: "115691111", hkgdRank: 165, records: [{ player: "3^3=7", date: "2025/12/27", videoUrl: "Discord Message", fps: 240 }] },
  { name: "Nextphase", levelId: "107420706", hkgdRank: 166, records: [{ player: "3^3=7", date: "2024/08/13", videoUrl: "Discord Message", fps: 0 }] },
  { name: "Dungeon Treasures", levelId: "102010719", hkgdRank: 168, records: [{ player: "3^3=7", date: "2024/06/12", videoUrl: "Discord Message", fps: 0 }] },
  { name: "The Tower XXII", levelId: "97692058", hkgdRank: 172, records: [{ player: "3^3=7", date: "2024/01/08", videoUrl: "https://www.youtube.com/watch?v=Rwma0aLtiWg", fps: 240 }, { player: "DevilCharlotte", date: "2024/01/16", videoUrl: "Discord Attachment", fps: 0 }] },
  { name: "Throat of the World", levelId: "109365157", hkgdRank: 177, records: [{ player: "Henry03", date: "2024/12/18", videoUrl: "Discord Attachment", fps: 60 }, { player: "henii :3", date: "2025/07/28", videoUrl: "Discord Message", fps: 0 }] },
  { name: "DETERNARY", levelId: "119022899", hkgdRank: 179, records: [{ player: "unaliver", date: "2025/07/09", videoUrl: "Discord Message", fps: 240 }, { player: "tonas2", date: "2025/12/12", videoUrl: "DETERNARY by TheRealXFuture 100% (extreme pemon)", fps: 120 }, { player: "friendtm", date: "2026/02/22", videoUrl: "Discord Message", fps: 60 }] },
  { name: "Chief Needler", levelId: "102557379", hkgdRank: 174, records: [{ player: "3^3=7", date: "2024/08/11", videoUrl: "Discord Message", fps: 0 }, { player: "Transparenty", date: "2024/09/20", videoUrl: "Discord Message", fps: 240 }, { player: "Jamixiy", date: "2025/09/30", videoUrl: "13th Extreme Demon | Chief Needler 100%", fps: 240 }] },
  { name: "Tower of Infinity", levelId: "97713011", hkgdRank: 178, records: [{ player: "soth", date: "2024/03/03", videoUrl: "https://www.youtube.com/watch?v=ulQDDMHGSKw", fps: 120 }, { player: "3^3=7", date: "2024/03/10", videoUrl: "https://www.youtube.com/watch?v=VI7CCbqVmUg", fps: 240 }, { player: "kwdash", date: "2024/06/29", videoUrl: "Discord Message", fps: 0 }, { player: "Yorklui", date: "2024/09/05", videoUrl: "https://www.youtube.com/watch?v=Ed3_qiPBK9U", fps: 180 }, { player: "SyrupGD", date: "2025/08/27", videoUrl: "https://www.youtube.com/watch?v=P-YXUBX8GZo" }, { player: "GDFlutter", date: "2026/01/01", videoUrl: "My First Extreme Pemon! \"Tower of Infinity\" by MadisonYuko (04:04:03.329) - YouTube", fps: 240 }] },
];

console.log(JSON.stringify(platformerLevels, null, 2));
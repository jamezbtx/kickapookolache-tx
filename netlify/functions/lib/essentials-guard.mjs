/**
 * Guard rails for the daily essentials function (daily-essentials.mjs).
 *
 * 1. VERIFIED_HISTORY: curated "This Day in History" facts keyed by MM-DD (America/Chicago).
 *    Every entry is copied from a documented source (TSHA Texas Day by Day) with its URL.
 *    Picks prefer East Texas / Southeast Texas when the source has one for that date, and
 *    skip culture-war / partisan / violent entries. EXTEND THIS LIST before it runs out
 *    (currently seeded through Oct. 19; Oct. 10, 2026 had no entry and published without history); after that the model's item needs a source or is dropped.
 * 2. HISTORY_DENYLIST: known-false claims the model has produced before.
 * 3. FALLBACK_JOKES: vetted, classic G-rated farm / livestock / weather / church / neighbor jokes
 *    (clear setup + punchline, no forced puns) used when the model's joke fails the filter twice.
 */

export const VERIFIED_HISTORY = {
  "09-24": {
    year: 1903,
    body: "On September 24, 1903, a Gulf and Inter-State Railway passenger train from Beaumont finally pulled into Port Bolivar, more than three years late. The Galveston hurricane of September 8, 1900, had destroyed the G&I tracks, and repairs took that long to finish.",
    keywords: ["port bolivar", "gulf and inter-state", "g&i"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/100",
    sourceName: "TSHA Texas Day by Day"
  },
  "09-25": {
    year: 1922,
    body: "On September 25, 1922, WOAI in San Antonio, the first radio station in South Texas, began broadcasting. Founded by G. A. C. Halff, it started at 500 watts and later grew into a 50,000-watt clear-channel station.",
    keywords: ["woai"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/313",
    sourceName: "TSHA Texas Day by Day"
  },
  "09-26": {
    year: 1928,
    body: "On September 26, 1928, railroad and town promoter Arthur Stilwell died in New York City. His syndicate founded Port Arthur, and his Kansas City, Pittsburg and Gulf Railroad (later Kansas City Southern) reached the Southeast Texas town in 1897.",
    keywords: ["stilwell", "port arthur"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/759",
    sourceName: "TSHA Texas Day by Day"
  },
  "09-27": {
    year: 1956,
    body: "On September 27, 1956, Port Arthur native Mildred \"Babe\" Didrikson Zaharias died in Galveston at age 45. She set three world records at the 1932 Olympics, helped found the Ladies Professional Golf Association in 1948, and is buried in Beaumont.",
    keywords: ["zaharias", "babe"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/469",
    sourceName: "TSHA Texas Day by Day"
  },
  "09-28": {
    year: 1769,
    body: "On September 28, 1769, Capt. Rafael Martínez Pacheco resumed command of San Agustín de Ahumada Presidio (El Orcoquisac) on the lower Trinity River in Southeast Texas, after an investigation cleared him of responsibility for the trouble that had led to the presidio's burning.",
    keywords: ["orcoquisac", "san agustín de ahumada", "san agustin de ahumada", "martínez pacheco", "martinez pacheco"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/401",
    sourceName: "TSHA Texas Day by Day"
  },
  "09-29": {
    year: 1856,
    body: "On September 29, 1856, Father Leopold Moczygemba consecrated the first Polish Catholic church in the United States at Panna Maria in Karnes County, the oldest permanent Polish settlement in the country.",
    keywords: ["panna maria", "moczygemba"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/788",
    sourceName: "TSHA Texas Day by Day"
  },
  "09-30": {
    year: 1972,
    body: "On September 30, 1972, Guadalupe Mountains National Park was established in Hudspeth and Culberson counties. The park includes Guadalupe Peak, the highest point in Texas at more than 8,700 feet.",
    keywords: ["guadalupe mountains", "guadalupe peak"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/561",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-01": {
    year: 1837,
    body: "On October 1, 1837, John P. Borden opened the General Land Office of the Republic of Texas in Houston. As first commissioner, he gathered the Spanish and Mexican land titles issued before the republic, and in 1839 he moved the office to Austin.",
    keywords: ["general land office", "borden"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/908",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-02": {
    year: 1835,
    body: "On October 2, 1835, Texas militiamen at Gonzales clashed with Mexican soldiers sent to retrieve a small cannon, the \"Come and Take It\" fight that became the first battle of the Texas Revolution.",
    keywords: ["gonzales", "come and take it"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/330",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-03": {
    year: 1930,
    body: "On October 3, 1930, Columbus Marion \"Dad\" Joiner brought in the Daisy Bradford No. 3 well about eight miles west of Henderson in Rusk County, opening the East Texas Oilfield, the largest in the world up to that time.",
    keywords: ["joiner", "daisy bradford"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/247",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-04": {
    year: 1876,
    body: "On October 4, 1876, the Agricultural and Mechanical College of Texas (today Texas A&M University) opened with its first class of 106 students, and Thomas S. Gathright took office as its first president.",
    keywords: ["a&m", "agricultural and mechanical", "gathright"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/680",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-05": {
    year: 1946,
    body: "On October 5, 1946, the Dallas Health Museum opened its first exhibit at the State Fair of Texas, and 40,000 visitors came through during the fair. The museum later became the Science Place and is part of today's Perot Museum of Nature and Science.",
    keywords: ["dallas health museum"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/762",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-06": {
    year: 1892,
    body: "On October 6, 1892, Clyde Littlefield was born in Oil City, Pennsylvania. His family moved to Spindletop, Texas, in 1904, and he went on to coach track at the University of Texas for 41 years and co-found the Texas Relays in 1925.",
    keywords: ["littlefield"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/119",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-07": {
    year: 1883,
    body: "On October 7, 1883, Susanna Dickinson, a survivor of the battle of the Alamo, died in Austin. After the battle, Santa Anna sent her and her young daughter, Angelina, to Sam Houston at Gonzales with a letter of warning.",
    keywords: ["dickinson"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/1085",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-08": {
    year: 1926,
    body: "On October 8, 1926, the Witte Memorial Museum opened in Brackenridge Park in San Antonio, built with public funds and a bequest from businessman Alfred G. Witte in memory of his parents.",
    keywords: ["witte"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/11",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-09": {
    year: 1866,
    body: "On October 9, 1866, the Houston Direct Navigation Company was chartered to improve shipping on Buffalo Bayou. By 1872 it was running four passenger steamers, eighteen barges and three tugs between Houston and Galveston Bay.",
    keywords: ["houston direct navigation", "buffalo bayou"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/329",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-11": {
    year: 1847,
    body: "On October 11, 1847, Isaac Van Zandt, a candidate for governor of Texas, died of yellow fever after falling ill while campaigning in Houston. Considered by many the founder of Marshall, he had served as the Republic of Texas chargé d'affaires to the United States and worked for annexation; he is buried in Marshall.",
    keywords: ["van zandt"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/1161",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-12": {
    year: 1874,
    body: "On October 12, 1874, fifteen-year-old George B. Dealey went to work as an office boy for the Galveston News. He later helped found the Dallas Morning News in 1885, bought the company in 1926, and was called the dean of American publishers.",
    keywords: ["dealey"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/547",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-13": {
    year: 1845,
    body: "On October 13, 1845, voters of the Republic of Texas approved annexation to the United States by a vote of 4,245 to 257, and adopted the proposed state constitution by 4,174 to 312.",
    keywords: ["annexation"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/220",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-14": {
    year: 1890,
    body: "On October 14, 1890, Dwight David Eisenhower, later general of the army and the thirty-fourth president of the United States, was born in a two-story frame house in Denison, Texas. His family moved to Abilene, Kansas, shortly after.",
    keywords: ["eisenhower", "denison"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/690",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-15": {
    year: 1853,
    body: "On October 15, 1853, the first state Sängerfest, a two-day German singers' festival, began in New Braunfels, with singing societies from Austin, San Antonio and Sisterdale joining the New Braunfels Germania society.",
    keywords: ["sängerfest", "sangerfest", "new braunfels"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/670",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-16": {
    year: 1909,
    body: "On October 16, 1909, President William Howard Taft and Mexican President Porfirio Díaz met in El Paso and Ciudad Juárez, the first meeting in history between a president of the United States and a president of Mexico.",
    keywords: ["taft", "díaz", "diaz", "el paso"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/982",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-17": {
    year: 1839,
    body: "On October 17, 1839, Mirabeau B. Lamar, second president of the Republic of Texas, and his cabinet arrived in the new capital city of Austin, laid out by Edwin Waller at the site of the community of Waterloo.",
    keywords: ["lamar", "waterloo"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/528",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-18": {
    year: 1942,
    body: "On October 18, 1942, the Longhorn Army Ammunition Plant began producing munitions on an 8,500-acre site beside Caddo Lake at Karnack, Harrison County. Much of the property is now the Caddo Lake National Wildlife Refuge.",
    keywords: ["longhorn", "karnack", "caddo"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/867",
    sourceName: "TSHA Texas Day by Day"
  },
  "10-19": {
    year: 1953,
    body: "On October 19, 1953, Presidents Dwight D. Eisenhower of the United States and Adolfo Ruiz Cortines of Mexico dedicated International Falcon Reservoir, bounded by Starr and Zapata counties in Texas, built for water conservation, flood control and hydroelectric power.",
    keywords: ["falcon"],
    sourceUrl: "https://www.tshaonline.org/texas-day-by-day/entry/390",
    sourceName: "TSHA Texas Day by Day"
  }
};

/** Known-false claims the model has produced. Each: regex + why it is wrong. */
export const HISTORY_DENYLIST = [
  {
    // e.g. "On September 25, 1868, the first Texas state fair was held in Dallas" (false)
    test: (s) =>
      /\b(first\s+)?(state fair of texas|texas state fair)\b/i.test(s) &&
      /\b(first|began|begin|founded|established|inaugurated|was held|opened)\b/i.test(s) &&
      !/\b1886\b/.test(s) &&
      !/\bdallas health museum\b/i.test(s),
    why: "State Fair of Texas (Dallas) began in 1886; model has claimed other founding years (1868)"
  },
  {
    test: (s) => /\b1868\b[^.]*\bstate fair\b|\bstate fair\b[^.]*\b1868\b/i.test(s),
    why: "No Texas state fair in 1868 (model hallucination seen 2026-09-25)"
  }
];

/** Vetted G-rated jokes (farm / weather / church potluck). Must pass the clean filter. */
export const FALLBACK_JOKES = [
  "What do you call a sleeping bull? A bulldozer.",
  "Why do cows wear bells? Because their horns don't work.",
  "What do you call a cow in an earthquake? A milkshake.",
  "What do you get from a pampered cow? Spoiled milk.",
  "What do you call a pig that knows karate? A pork chop.",
  "What do you call a horse that lives next door? A neigh-bor.",
  "Why did the farmer ride his horse to town? It was too heavy to carry.",
  "What has ears but can't hear? A cornfield.",
  "Why did the sheep get pulled over on the highway? She made an illegal ewe-turn.",
  "Why did the farmer plant light bulbs? He wanted to grow a power plant.",
  "What did the mama tomato say to the baby tomato who was lagging behind? Ketchup!",
  "What did one raindrop say to the other? Two's company, three's a cloud.",
  "Why couldn't anybody play cards on Noah's Ark? Because Noah was standing on the deck.",
  "What kind of car did the disciples drive? A Honda, because they were all in one Accord."
];

export function chicagoParts(d = new Date()) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(d);
  const get = (t) => f.find((p) => p.type === t).value;
  return { y: get("year"), m: get("month"), d: get("day"), key: `${get("month")}-${get("day")}` };
}

export function curatedFor(key) {
  return VERIFIED_HISTORY[key] || null;
}

export function denylistHit(body) {
  const s = String(body || "");
  for (const d of HISTORY_DENYLIST) if (d.test(s)) return d.why;
  return null;
}

/** true when the model's history clearly describes the curated fact (same year + a keyword). */
export function matchesCurated(body, curated) {
  if (!curated) return false;
  const s = String(body || "").toLowerCase();
  if (!new RegExp("\\b" + curated.year + "\\b").test(s)) return false;
  return curated.keywords.some((k) => s.includes(k.toLowerCase()));
}

export function pickFallbackJoke(exclude, isClean, seed) {
  const norm = (x) => String(x || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const ex = new Set((exclude || []).map(norm));
  const pool = FALLBACK_JOKES.filter((j) => !ex.has(norm(j)) && isClean(j));
  const list = pool.length ? pool : FALLBACK_JOKES.filter((j) => isClean(j));
  if (!list.length) return null;
  const n = Math.abs(Number(seed) || 0) % list.length;
  return list[n];
}

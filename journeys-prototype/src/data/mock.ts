export type PostType = "photo" | "video" | "text";

export type Post = {
  id: string;
  type: PostType;
  url?: string; // photo or video
  poster?: string; // video poster
  caption: string;
  daysAgo: number;
  likes: number;
};

export type Journey = {
  id: string;
  title: string;
  description: string;
  theme: string; // auto-tag
  stage: string;
  followers: number;
  startDate: string;
  timeline: string;
  cover: string;
  owner: string; // username
  ownerAvatar: string;
  posts: Post[];
  highlight?: { images: string[]; caption: string };
};

// Sample royalty-free MP4s (hot-link friendly CDN)
const VID_GOLF =
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4";
const VID_RUN =
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4";
const VID_TRAVEL =
  "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4";

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const CURRENT_USER = {
  username: "alex.rivera",
  displayName: "Alex Rivera",
  avatar: u("photo-1535713875002-d1d0cf377fde", 200),
  bio: "documenting the small wins ✨ runner · golfer · dad",
  posts: 142,
  followers: 1284,
  following: 318,
};

export const STORIES = [
  { id: "you", username: "Your story", avatar: CURRENT_USER.avatar, you: true },
  { id: "s1", username: "maya.k", avatar: u("photo-1438761681033-6461ffad8d80", 200) },
  { id: "s2", username: "devon", avatar: u("photo-1500648767791-00dcc994a43e", 200) },
  { id: "s3", username: "priya.s", avatar: u("photo-1544005313-94ddf0286df2", 200) },
  { id: "s4", username: "jordan", avatar: u("photo-1506794778202-cad84cf45f1d", 200) },
  { id: "s5", username: "lena.b", avatar: u("photo-1521146764736-56c929d59c83", 200) },
  { id: "s6", username: "tomás", avatar: u("photo-1463453091185-61582044d556", 200) },
];

export const FRIEND_POST = {
  id: "fp1",
  username: "maya.k",
  avatar: u("photo-1438761681033-6461ffad8d80", 200),
  url: u("photo-1504674900247-0877df9cc836", 1200),
  caption: "sunday slow mornings 🥐☕️",
  likes: 1284,
  timeAgo: "2h",
  location: "Brooklyn, NY",
};

export const JOURNEYS: Journey[] = [
  {
    id: "sourdough",
    title: "Learning Sourdough",
    description:
      "From flat bricks to airy crumb. Weekly bakes, every failure documented.",
    theme: "Cooking",
    stage: "Week 6 · finally got ears 🥖",
    followers: 178,
    startDate: "Apr 12, 2026",
    timeline: "ongoing",
    cover: u("photo-1509440159596-0249088772ff", 1200),
    owner: "maya.k",
    ownerAvatar: u("photo-1438761681033-6461ffad8d80", 200),
    posts: [
      {
        id: "sd5",
        type: "photo",
        url: u("photo-1549931319-a545dcf3bc73", 1000),
        caption: "loaf #14. the crumb is finally cooperating 🙏",
        daysAgo: 1,
        likes: 156,
      },
      {
        id: "sd4",
        type: "photo",
        url: u("photo-1586444248902-2f64eddc13df", 1000),
        caption: "starter is bubbling like crazy today",
        daysAgo: 4,
        likes: 92,
      },
      {
        id: "sd3",
        type: "photo",
        url: u("photo-1568471173242-461f0a730452", 1000),
        caption: "scoring practice. it's harder than it looks.",
        daysAgo: 9,
        likes: 71,
      },
      {
        id: "sd2",
        type: "text",
        caption: "loaf #6 came out like a frisbee. we move.",
        daysAgo: 18,
        likes: 45,
      },
      {
        id: "sd1",
        type: "text",
        caption: "Day 1 — named my starter Doughpac Shakur.",
        daysAgo: 40,
        likes: 210,
      },
    ],
  },
  {
    id: "golf",
    title: "Breaking 100 in Golf",
    description:
      "From a 120 hacker to a confident sub-100 player. Tracking every range session, lesson, and round.",
    theme: "Golf",
    stage: "Week 4 · trying to break 110",
    followers: 210,
    startDate: "Mar 2, 2026",
    timeline: "12 weeks",
    cover: u("photo-1535131749006-b7f58c99034b", 1200),
    owner: "alex.rivera",
    ownerAvatar: CURRENT_USER.avatar,
    posts: [
      {
        id: "g5",
        type: "video",
        url: VID_GOLF,
        poster: u("photo-1592919505780-303950717480", 800),
        caption: "finally getting some hip rotation. swing #84 of the week 🏌️",
        daysAgo: 1,
        likes: 88,
      },
      {
        id: "g4",
        type: "photo",
        url: u("photo-1587174486073-ae5e5cff23aa", 1000),
        caption: "shot a 108 today. one stroke closer.",
        daysAgo: 3,
        likes: 142,
      },
      {
        id: "g3",
        type: "photo",
        url: u("photo-1593111774240-d529f12cf4bb", 1000),
        caption: "new wedges. brave or stupid?",
        daysAgo: 7,
        likes: 73,
      },
      {
        id: "g2",
        type: "photo",
        url: u("photo-1551632811-561732d1e306", 1000),
        caption: "lesson #2 — apparently my grip was upside down 🙃",
        daysAgo: 14,
        likes: 61,
      },
      {
        id: "g1",
        type: "text",
        caption:
          "Day 1. Committing publicly so I actually do this. Goal: break 100 by July.",
        daysAgo: 28,
        likes: 204,
      },
    ],
  },
  {
    id: "marathon",
    title: "Couch to Marathon",
    description: "16 weeks. 26.2 miles. No prior running experience. Send help.",
    theme: "Running",
    stage: "Week 9 of 16",
    followers: 340,
    startDate: "Jan 8, 2026",
    timeline: "16 weeks",
    cover: u("photo-1552674605-db6ffd4facb5", 1200),
    owner: "alex.rivera",
    ownerAvatar: CURRENT_USER.avatar,
    posts: [
      {
        id: "m9",
        type: "video",
        url: VID_RUN,
        poster: u("photo-1486218119243-13883505764c", 800),
        caption: "first 10-miler in the books. legs = jelly 🦵",
        daysAgo: 2,
        likes: 312,
      },
      {
        id: "m8",
        type: "photo",
        url: u("photo-1571008887538-b36bb32f4571", 1000),
        caption: "new shoes day. they're stupidly bouncy.",
        daysAgo: 5,
        likes: 188,
      },
      {
        id: "m7",
        type: "photo",
        url: u("photo-1502904550040-7534597429ae", 1000),
        caption: "sunrise long run. worth the 5am alarm.",
        daysAgo: 9,
        likes: 240,
      },
      {
        id: "m6",
        type: "photo",
        url: u("photo-1530137073521-28cda9e9a59b", 1000),
        caption: "rest day = stretching + a lot of food.",
        daysAgo: 12,
        likes: 90,
      },
      {
        id: "m5",
        type: "photo",
        url: u("photo-1517649763962-0c623066013b", 1000),
        caption: "first race bib! 5k tune-up next weekend.",
        daysAgo: 18,
        likes: 220,
      },
      {
        id: "m4",
        type: "text",
        caption: "hit week 6. didn't quit. small wins.",
        daysAgo: 24,
        likes: 130,
      },
      {
        id: "m3",
        type: "photo",
        url: u("photo-1476480862126-209bfaa8edc8", 1000),
        caption: "trail miles >>> treadmill miles.",
        daysAgo: 32,
        likes: 175,
      },
      {
        id: "m2",
        type: "photo",
        url: u("photo-1461896836934-ffe607ba8211", 1000),
        caption: "lacing up for week 3. it's getting easier?",
        daysAgo: 45,
        likes: 98,
      },
      {
        id: "m1",
        type: "text",
        caption: "Day 1. I cannot currently run 1 mile. Goal: 26.2.",
        daysAgo: 63,
        likes: 415,
      },
    ],
  },
  {
    id: "baby",
    title: "Our First Baby",
    description:
      "Documenting the months with our daughter June. The good, the wild, the sleepless.",
    theme: "Parenting",
    stage: "Month 5",
    followers: 88,
    startDate: "Oct 14, 2025",
    timeline: "ongoing",
    cover: u("photo-1519689680058-324335c77eba", 1200),
    owner: "alex.rivera",
    ownerAvatar: CURRENT_USER.avatar,
    posts: Array.from({ length: 12 }, (_, i) => {
      const photos = [
        "photo-1519689680058-324335c77eba",
        "photo-1555252333-9f8e92e65df9",
        "photo-1492725764893-90b379c2b6e7",
        "photo-1607544127549-99cf09f81a72",
        "photo-1503454537195-1dcabb73ffb9",
        "photo-1544126592-807ade215a0b",
      ];
      const captions = [
        "month 5: she discovered her feet 🦶",
        "first giggle on video. heart = melted.",
        "nap strike day 4. send espresso.",
        "tummy time champion 💪",
        "first solid food = chaos",
        "she slept 6 hours. WE WON.",
      ];
      return {
        id: `b${12 - i}`,
        type: "photo" as const,
        url: u(photos[i % photos.length], 1000),
        caption: captions[i % captions.length],
        daysAgo: i * 10 + 2,
        likes: 40 + ((i * 13) % 80),
      };
    }),
  },
  {
    id: "asia",
    title: "6 Months Across Asia",
    description: "8 countries. Backpacks only. Following the noodles.",
    theme: "Travel",
    stage: "Country 3 of 8",
    followers: 512,
    startDate: "Feb 1, 2026",
    timeline: "6 months",
    cover: u("photo-1528127269322-539801943592", 1200),
    owner: "kai.matsuda",
    ownerAvatar: u("photo-1500648767791-00dcc994a43e", 200),
    posts: [
      {
        id: "a7",
        type: "video",
        url: VID_TRAVEL,
        poster: u("photo-1528181304800-259b08848526", 800),
        caption: "chiang mai night market. all of the smells.",
        daysAgo: 2,
        likes: 421,
      },
      {
        id: "a6",
        type: "photo",
        url: u("photo-1552465011-b4e21bf6e79a", 1000),
        caption: "temple #14. losing count.",
        daysAgo: 5,
        likes: 380,
      },
      {
        id: "a5",
        type: "photo",
        url: u("photo-1480796927426-f609979314bd", 1000),
        caption: "took a sleeper bus. survived.",
        daysAgo: 9,
        likes: 290,
      },
      {
        id: "a4",
        type: "photo",
        url: u("photo-1493780474015-ba834fd0ce2f", 1000),
        caption: "best $2 bowl of noodles of my life",
        daysAgo: 14,
        likes: 510,
      },
      {
        id: "a3",
        type: "photo",
        url: u("photo-1464817739973-0128fe77aaa1", 1000),
        caption: "country 2: vietnam. hello hanoi.",
        daysAgo: 22,
        likes: 333,
      },
      {
        id: "a2",
        type: "photo",
        url: u("photo-1506665531195-3566af2b4dfa", 1000),
        caption: "bag = 7kg. proud of myself.",
        daysAgo: 35,
        likes: 201,
      },
      {
        id: "a1",
        type: "text",
        caption: "Day 1 — landed in Tokyo. 6 months. let's go.",
        daysAgo: 50,
        likes: 605,
      },
    ],
  },
  {
    id: "pottery",
    title: "Wheel Throwing 30 Cups",
    description: "Learning to center clay, pull walls, trim feet, and glaze a shelf of usable mugs.",
    theme: "Craft",
    stage: "Cup 11 · handles are finally staying on",
    followers: 94,
    startDate: "May 3, 2026",
    timeline: "10 weeks",
    cover: u("photo-1493106819501-66d381c466f1", 1200),
    owner: "lena.b",
    ownerAvatar: u("photo-1521146764736-56c929d59c83", 200),
    posts: [
      { id: "p4", type: "photo", url: u("photo-1565193566173-7a0ee3dbe261", 1000), caption: "first matching pair. not twins, more like cousins.", daysAgo: 2, likes: 84 },
      { id: "p3", type: "photo", url: u("photo-1493106819501-66d381c466f1", 1000), caption: "trimmed bottoms without destroying them", daysAgo: 6, likes: 61 },
      { id: "p2", type: "text", caption: "today's lesson: wet clay forgives, dry clay remembers.", daysAgo: 12, likes: 39 },
      { id: "p1", type: "photo", url: u("photo-1452860606245-08befc0ff44b", 1000), caption: "day 1 at the wheel. clay everywhere.", daysAgo: 24, likes: 112 },
    ],
  },
  {
    id: "spanish",
    title: "Spanish Every Day",
    description: "A daily speaking streak from hesitant phrases to real conversations with neighbors.",
    theme: "Language",
    stage: "Day 38 · ordered lunch without switching to English",
    followers: 267,
    startDate: "Apr 28, 2026",
    timeline: "90 days",
    cover: u("photo-1521334884684-d80222895322", 1200),
    owner: "priya.s",
    ownerAvatar: u("photo-1544005313-94ddf0286df2", 200),
    posts: [
      { id: "sp4", type: "photo", url: u("photo-1495567720989-cebdbdd97913", 1000), caption: "new vocabulary wall is getting intense", daysAgo: 1, likes: 126 },
      { id: "sp3", type: "text", caption: "mistook embarazada for embarrassed. memorable mistake.", daysAgo: 5, likes: 208 },
      { id: "sp2", type: "photo", url: u("photo-1516321318423-f06f85e504b3", 1000), caption: "30 minute tutor call, zero hiding", daysAgo: 11, likes: 92 },
      { id: "sp1", type: "text", caption: "Day 1 — committing to speaking out loud every day.", daysAgo: 38, likes: 176 },
    ],
  },
  {
    id: "garden",
    title: "Balcony Tomato Season",
    description: "Turning one tiny balcony into a tomato jungle, from seedlings to the first sauce pot.",
    theme: "Gardening",
    stage: "Week 7 · first yellow flowers",
    followers: 143,
    startDate: "Apr 18, 2026",
    timeline: "summer",
    cover: u("photo-1591857177580-dc82b9ac4e1e", 1200),
    owner: "tomás",
    ownerAvatar: u("photo-1463453091185-61582044d556", 200),
    posts: [
      { id: "t4", type: "photo", url: u("photo-1466692476868-aef1dfb1e735", 1000), caption: "staking day. these plants are ambitious.", daysAgo: 3, likes: 77 },
      { id: "t3", type: "photo", url: u("photo-1591857177580-dc82b9ac4e1e", 1000), caption: "first blossoms. irrationally proud.", daysAgo: 7, likes: 101 },
      { id: "t2", type: "text", caption: "aphids arrived. counterattack: ladybugs.", daysAgo: 15, likes: 58 },
      { id: "t1", type: "photo", url: u("photo-1416879595882-3373a0480b5b", 1000), caption: "seedlings moved outside for their first sun", daysAgo: 32, likes: 130 },
    ],
  },
  {
    id: "piano",
    title: "Learning Piano After Work",
    description: "Twenty minutes a night, awkward scales included, until one full song feels natural.",
    theme: "Music",
    stage: "Week 5 · both hands at the same time somehow",
    followers: 321,
    startDate: "May 10, 2026",
    timeline: "8 weeks",
    cover: u("photo-1520523839897-bd0b52f945a0", 1200),
    owner: "devon",
    ownerAvatar: u("photo-1500648767791-00dcc994a43e", 200),
    posts: [
      { id: "pi4", type: "photo", url: u("photo-1520523839897-bd0b52f945a0", 1000), caption: "metronome humbled me again", daysAgo: 2, likes: 119 },
      { id: "pi3", type: "text", caption: "left hand finally stopped wandering off beat.", daysAgo: 8, likes: 88 },
      { id: "pi2", type: "photo", url: u("photo-1520523839897-bd0b52f945a0", 1000), caption: "sheet music now has more pencil than notes", daysAgo: 16, likes: 70 },
      { id: "pi1", type: "text", caption: "Day 1 — bought the keyboard. no excuses.", daysAgo: 35, likes: 215 },
    ],
  },
  {
    id: "bookclub",
    title: "Reading 20 Classics",
    description: "One big book at a time, with notes on what still hits and what absolutely does not.",
    theme: "Reading",
    stage: "Book 4 of 20 · underlining too much",
    followers: 189,
    startDate: "Mar 20, 2026",
    timeline: "1 year",
    cover: u("photo-1512820790803-83ca734da794", 1200),
    owner: "jordan",
    ownerAvatar: u("photo-1506794778202-cad84cf45f1d", 200),
    posts: [
      { id: "bk4", type: "photo", url: u("photo-1512820790803-83ca734da794", 1000), caption: "book 4 stack. intimidating in a good way.", daysAgo: 4, likes: 95 },
      { id: "bk3", type: "text", caption: "Moby-Dick update: whale still undefeated.", daysAgo: 13, likes: 142 },
      { id: "bk2", type: "photo", url: u("photo-1495446815901-a7297e633e8d", 1000), caption: "finished book 2 with only minor despair", daysAgo: 26, likes: 83 },
      { id: "bk1", type: "text", caption: "Day 1 — twenty classics, no fake summaries.", daysAgo: 62, likes: 234 },
    ],
  },
];

// Profile grid (regular IG posts unrelated to journeys)
export const PROFILE_GRID = [
  "photo-1517457373958-b7bdd4587205",
  "photo-1493612276216-ee3925520721",
  "photo-1483985988355-763728e1935b",
  "photo-1496843916299-590492c751f4",
  "photo-1469474968028-56623f02e42e",
  "photo-1502082553048-f009c37129b9",
  "photo-1490730141103-6cac27aaab94",
  "photo-1502082553048-f009c37129b9",
  "photo-1418065460487-3e41a6c84dc5",
].map((id, i) => ({ id: `pg${i}`, url: u(id, 600) }));

// Explore grid mixes themes including video thumbnails
export const EXPLORE_GRID = [
  { id: "e1", url: u("photo-1535131749006-b7f58c99034b", 600), tags: ["golf"], video: false },
  { id: "e2", url: u("photo-1552465011-b4e21bf6e79a", 600), tags: ["travel", "asia"], video: false },
  { id: "e3", url: u("photo-1486218119243-13883505764c", 600), tags: ["running"], video: true },
  { id: "e4", url: u("photo-1519689680058-324335c77eba", 600), tags: ["baby", "parenting"], video: false },
  { id: "e5", url: u("photo-1587174486073-ae5e5cff23aa", 600), tags: ["golf"], video: false },
  { id: "e6", url: u("photo-1502904550040-7534597429ae", 600), tags: ["running"], video: false },
  { id: "e7", url: u("photo-1528127269322-539801943592", 600), tags: ["travel"], video: false },
  { id: "e8", url: u("photo-1593111774240-d529f12cf4bb", 600), tags: ["golf"], video: true },
  { id: "e9", url: u("photo-1517649763962-0c623066013b", 600), tags: ["running"], video: false },
  { id: "e10", url: u("photo-1493780474015-ba834fd0ce2f", 600), tags: ["travel"], video: false },
  { id: "e11", url: u("photo-1555252333-9f8e92e65df9", 600), tags: ["baby"], video: false },
  { id: "e12", url: u("photo-1551632811-561732d1e306", 600), tags: ["golf"], video: false },
];

export const COVER_OPTIONS = [
  u("photo-1535131749006-b7f58c99034b", 800),
  u("photo-1552674605-db6ffd4facb5", 800),
  u("photo-1519689680058-324335c77eba", 800),
  u("photo-1528127269322-539801943592", 800),
  u("photo-1517649763962-0c623066013b", 800),
  u("photo-1493612276216-ee3925520721", 800),
];

// crude theme inference
export function inferTheme(text: string): string {
  const t = text.toLowerCase();
  if (/golf|swing|par|birdie/.test(t)) return "Golf";
  if (/run|marathon|5k|10k|jog/.test(t)) return "Running";
  if (/baby|parent|kid|child|toddler/.test(t)) return "Parenting";
  if (/travel|trip|country|backpack|asia|europe/.test(t)) return "Travel";
  if (/cook|recipe|food|bake/.test(t)) return "Cooking";
  if (/read|book|novel/.test(t)) return "Reading";
  if (/code|build|launch|startup/.test(t)) return "Building";
  return "Personal";
}

export function getJourney(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}
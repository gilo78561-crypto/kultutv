export type Stream = {
  id: string;
  name: string;
  url: string;
  cover: string;
};

export type Replay = {
  id: string;
  slug: string;
  title: string;
  emission: string;
  duration: string;
  date?: string;
  cover: string;
  description: string;
  streamUrl: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  cover: string;
};

export type Emission = {
  id: string;
  slug: string;
  title: string;
  host: string;
  schedule: string;
  category: string;
  description: string;
  cover: string;
  streamUrl: string;
};

export type Podcast = {
  id: string;
  title: string;
  show: string;
  duration: string;
  cover: string;
  audioUrl: string;
};

export type FlashInfo = {
  id: string;
  time: string;
  label: string;
  text: string;
};

export type Programme = {
  title: string;
  emission: string;
  host: string;
  startsAt: string;
  endsAt: string;
  progress: number;
  description: string;
  cover: string;
  streamUrl: string;
  next: { title: string; startsAt: string }[];
};

const AUDIO_DEMO = "https://stream.zeno.fm/s2nuoopwj6vtv";
const PODCAST_DEMO = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3";
const YOUTUBE_HOROSCOPE = "https://www.youtube.com/watch?v=IbMLT_55RuQ&t=2s";
const YOUTUBE_RECAP = "https://www.youtube.com/watch?v=Toh8DA3FBT0";
const YOUTUBE_MOMENT_DE_VERITE = "https://www.youtube.com/watch?v=1wUoKLYTefY";
const YOUTUBE_DIRECT = "https://www.youtube.com/watch?v=cBiQx0COYXM";

const youtubeCover = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

const cover = (seed: string, w = 800, h = 500) =>
  `https://picsum.photos/seed/kultu-${seed}/${w}/${h}`;

export const tvStreams: Stream[] = [
  { id: "tv-1", name: "KULTU TV — Direct", url: YOUTUBE_DIRECT, cover: youtubeCover("cBiQx0COYXM") },
  { id: "tv-2", name: "KULTU Culture", url: YOUTUBE_DIRECT, cover: youtubeCover("cBiQx0COYXM") },
];

export const radioStreams: Stream[] = [
  {
    id: "radio-1",
    name: "KULTU Radio — Le direct",
    url: AUDIO_DEMO,
    cover: cover("radio", 600, 600),
  },
];

const webzineCovers = ["/WEBZIN/webzine1.jpeg", "/WEBZIN/webzine2.jpeg", "/WEBZIN/webzine3.jpeg"];

const RECAP_DESCRIPTION =
  "Le résumé de l'actualité culturelle et sociale suivie par la rédaction KULTU.";
const ALBI_DESCRIPTION =
  "Une interview intimiste avec Queen Albi, entre confidences et vérités assumées.";

export const replays: Replay[] = [
  {
    id: "replay-horoscope-2023-10-09",
    slug: "horoscope-09-octobre-2023",
    title: "Horoscope — 09 octobre 2023",
    emission: "Horoscope Kultu",
    duration: "8 min",
    date: "2023-10-09",
    cover: youtubeCover("IbMLT_55RuQ"),
    description:
      "Les prédictions de la semaine, signe par signe, pour aborder les jours à venir avec sérénité.",
    streamUrl: YOUTUBE_HOROSCOPE,
  },
  {
    id: "replay-recap-2022-10-10",
    slug: "recap-10-octobre-2022",
    title: "Récap — 10 octobre 2022",
    emission: "Récap Kultu",
    duration: "30 min",
    date: "2022-10-10",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "replay-recap-2022-10-03",
    slug: "recap-03-octobre-2022",
    title: "Récap — 03 octobre 2022",
    emission: "Récap Kultu",
    duration: "22 min",
    date: "2022-10-03",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "replay-recap-2022-09-26",
    slug: "recap-26-septembre-2022",
    title: "Récap — 26 septembre 2022",
    emission: "Récap Kultu",
    duration: "19 min",
    date: "2022-09-26",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "replay-recap-2022-09-19",
    slug: "recap-19-septembre-2022",
    title: "Récap — 19 septembre 2022",
    emission: "Récap Kultu",
    duration: "15 min",
    date: "2022-09-19",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "replay-recap-2022-09-12",
    slug: "recap-12-septembre-2022",
    title: "Récap — 12 septembre 2022",
    emission: "Récap Kultu",
    duration: "16 min",
    date: "2022-09-12",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "replay-recap-2022-09-05",
    slug: "recap-05-septembre-2022",
    title: "Récap — 05 septembre 2022",
    emission: "Récap Kultu",
    duration: "16 min",
    date: "2022-09-05",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "replay-recap-2022-08-16",
    slug: "recap-16-aout-2022",
    title: "Récap — 16 août 2022",
    emission: "Récap Kultu",
    duration: "25 min",
    date: "2022-08-16",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "replay-recap-2022-08-08",
    slug: "recap-08-aout-2022",
    title: "Récap — 08 août 2022",
    emission: "Récap Kultu",
    duration: "21 min",
    date: "2022-08-08",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "replay-recap-2022-07-25",
    slug: "recap-25-juillet-2022",
    title: "Récap — 25 juillet 2022",
    emission: "Récap Kultu",
    duration: "28 min",
    date: "2022-07-25",
    cover: youtubeCover("Toh8DA3FBT0"),
    description: RECAP_DESCRIPTION,
    streamUrl: YOUTUBE_RECAP,
  },
  ...[
    ["moment-de-verite-queen-albi-01", "60 min"],
    ["moment-de-verite-queen-albi-02", "1 h 03"],
    ["moment-de-verite-queen-albi-03", "52 min"],
    ["moment-de-verite-queen-albi-04", "55 min"],
    ["moment-de-verite-queen-albi-05", "34 min"],
    ["moment-de-verite-queen-albi-06", "54 min"],
    ["moment-de-verite-queen-albi-07", "58 min"],
    ["moment-de-verite-queen-albi-08", "40 min"],
    ["moment-de-verite-queen-albi-09", "59 min"],
    ["moment-de-verite-queen-albi-10", "53 min"],
  ].map(([slug, duration], i) => ({
    id: `replay-${slug}`,
    slug,
    title: `Un moment de vérité avec Queen Albi — Épisode ${i + 1}`,
    emission: "Un moment de vérité",
    duration,
    cover: youtubeCover("1wUoKLYTefY"),
    description: ALBI_DESCRIPTION,
    streamUrl: YOUTUBE_MOMENT_DE_VERITE,
  })),
];

export const emissions: Emission[] = [
  {
    id: "emission-recap-kultu",
    slug: "recap-kultu",
    title: "Récap Kultu",
    host: "La rédaction KULTU",
    schedule: "Lundi — 20h00",
    category: "Actualités",
    description: RECAP_DESCRIPTION,
    cover: youtubeCover("Toh8DA3FBT0"),
    streamUrl: YOUTUBE_RECAP,
  },
  {
    id: "emission-un-moment-de-verite",
    slug: "un-moment-de-verite-avec-queen-albi",
    title: "Un moment de vérité",
    host: "Queen Albi",
    schedule: "Mercredi — 21h00",
    category: "Interview",
    description: ALBI_DESCRIPTION,
    cover: youtubeCover("1wUoKLYTefY"),
    streamUrl: YOUTUBE_MOMENT_DE_VERITE,
  },
  {
    id: "emission-horoscope-kultu",
    slug: "horoscope-kultu",
    title: "Horoscope Kultu",
    host: "Kultu Horoscope",
    schedule: "Vendredi — 18h00",
    category: "Bien-être",
    description:
      "Les prédictions de la semaine, signe par signe, pour aborder les jours à venir avec sérénité.",
    cover: youtubeCover("IbMLT_55RuQ"),
    streamUrl: YOUTUBE_HOROSCOPE,
  },
];

export const articles: Article[] = [
  [
    "renaissance-afrobeats",
    "La renaissance des Afrobeats sur la scène mondiale",
    "Musique",
    "Awa Diarra",
  ],
  ["nouvelle-vague-cinema", "La nouvelle vague du cinéma ouest-africain", "Cinéma", "Marc Attia"],
  ["mode-wax-couture", "Le wax entre dans la haute couture", "Mode", "Nadia Sissoko"],
  ["studios-lagos", "Dans les studios de Lagos qui réinventent le son", "Reportage", "DJ Lasso"],
  [
    "festival-kultu",
    "Festival KULTU : trois jours de scènes ouvertes",
    "Événement",
    "Ibrahim Koné",
  ],
  ["sport-diaspora", "Ces athlètes de la diaspora qui inspirent", "Sport", "Yann Mbappé"],
].map(([slug, title, category, author], i) => ({
  id: `article-${i + 1}`,
  slug: slug as string,
  title: title as string,
  excerpt:
    "Enquête, portraits et coulisses : la rédaction KULTU décrypte les mouvements qui redéfinissent la culture aujourd'hui.",
  body: [
    "Depuis deux ans, la scène s'est totalement recomposée. Ce qui n'était qu'un mouvement de niche irrigue désormais les plus grandes salles du monde, et les plateformes suivent le mouvement.",
    "Nous avons passé une semaine avec les artistes, producteurs et ingénieurs du son qui portent cette transformation. Leur point commun : une exigence artistique absolue et une maîtrise totale de la diffusion numérique.",
    "« On ne demande plus la permission », résume l'un d'eux. Le public, lui, a déjà tranché : les chiffres d'écoute doublent chaque saison, et les collaborations internationales s'enchaînent.",
    "Reste la question de la structuration : labels indépendants, droits voisins, export. C'est le prochain chantier, et il déterminera qui capte réellement la valeur de cette vague.",
  ],
  category: category as string,
  author: author as string,
  date: `2026-07-${String(25 - i).padStart(2, "0")}`,
  readTime: `${4 + i} min`,
  cover: webzineCovers[i] ?? cover(`article-${slug}`, 1000, 620),
}));

export const podcasts: Podcast[] = [
  ["Astuces du jour", "Godwin AM", "12 min", "MINIATURE_ASTUCES-DU-JOUR.png"],
  ["Flash Info", "La rédaction KULTU", "8 min", "MINIATURE_FLASH-INFO.png"],
  ["L'interview", "Mora Jacques Mansa", "22 min", "MINIATURE_LINTERVIEW.png"],
  ["On n'a pas idée", "Virgile Sedjro", "18 min", "MINIATURE_ON-NA-PAS-IDEE.png"],
  ["Vie hors scène", "Carmelle Gbeto", "20 min", "MINIATURE_VIE-HORS-SCENE.png"],
].map(([title, show, duration, image], i) => ({
  id: `podcast-${i + 1}`,
  title: title as string,
  show: show as string,
  duration: duration as string,
  cover: `/rere/${image}`,
  audioUrl: PODCAST_DEMO,
}));

export const flashInfos: FlashInfo[] = [
  ["18:42", "Culture", "Le Festival KULTU annonce sa programmation 2026 avec 40 artistes."],
  ["18:15", "Musique", "Nouvel album surprise attendu vendredi minuit."],
  ["17:50", "Société", "Table ronde sur les industries créatives ce jeudi en direct."],
  ["17:20", "Sport", "Qualification historique pour les U20 lors du tournoi régional."],
  ["16:58", "Cinéma", "Trois films africains sélectionnés en compétition internationale."],
].map(([time, label, text], i) => ({ id: `flash-${i + 1}`, time, label, text }));

export const programme: Programme = {
  title: "Kultu Mag — Édition spéciale Festival",
  emission: "Kultu Mag",
  host: "Awa Diarra",
  startsAt: "20:00",
  endsAt: "21:00",
  progress: 42,
  description:
    "Deux heures de direct depuis le studio KULTU : invités, sessions live et reportages exclusifs au cœur de la scène culturelle.",
  cover: "/Grand-Vodun-Ceremonies-Rituals.jpg",
  streamUrl: YOUTUBE_DIRECT,
  next: [
    { title: "Scène Ouverte — Session live", startsAt: "21:00" },
    { title: "Afro Beats Show", startsAt: "22:00" },
    { title: "Nuit KULTU — Mix continu", startsAt: "23:30" },
  ],
};

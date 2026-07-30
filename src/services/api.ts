import {
  articles,
  emissions,
  flashInfos,
  podcasts,
  programme,
  radioStreams,
  replays,
  tvStreams,
  type Article,
  type Emission,
  type FlashInfo,
  type Podcast,
  type Programme,
  type Replay,
  type Stream,
} from "./mock-data";

/**
 * Mock API layer — simulates network latency for:
 * /api/streams/tv, /api/streams/radio, /api/replays, /api/articles,
 * /api/emissions, /api/flash-info, /api/programme/en-cours
 */
const delay = <T>(data: T, ms = 320): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const api = {
  getTvStreams: (): Promise<Stream[]> => delay(tvStreams),
  getRadioStreams: (): Promise<Stream[]> => delay(radioStreams),
  getReplays: (): Promise<Replay[]> => delay(replays),
  getArticles: (): Promise<Article[]> => delay(articles),
  getArticle: (slug: string): Promise<Article | undefined> =>
    delay(articles.find((a) => a.slug === slug)),
  getEmissions: (): Promise<Emission[]> => delay(emissions),
  getEmission: (slug: string): Promise<Emission | undefined> =>
    delay(emissions.find((e) => e.slug === slug)),
  getPodcasts: (): Promise<Podcast[]> => delay(podcasts),
  getFlashInfo: (): Promise<FlashInfo[]> => delay(flashInfos, 200),
  getProgrammeEnCours: (): Promise<Programme> => delay(programme, 250),
  search: async (q: string) => {
    const term = q.trim().toLowerCase();
    if (!term) return { articles: [], emissions: [], replays: [], podcasts: [] };
    const match = (s: string) => s.toLowerCase().includes(term);
    return delay({
      articles: articles.filter((a) => match(a.title) || match(a.category)),
      emissions: emissions.filter((e) => match(e.title) || match(e.category) || match(e.host)),
      replays: replays.filter((r) => match(r.title) || match(r.emission)),
      podcasts: podcasts.filter((p) => match(p.title) || match(p.show)),
    });
  },
};

export const queryKeys = {
  tvStreams: ["streams", "tv"] as const,
  radioStreams: ["streams", "radio"] as const,
  replays: ["replays"] as const,
  articles: ["articles"] as const,
  article: (slug: string) => ["articles", slug] as const,
  emissions: ["emissions"] as const,
  emission: (slug: string) => ["emissions", slug] as const,
  podcasts: ["podcasts"] as const,
  flashInfo: ["flash-info"] as const,
  programme: ["programme", "en-cours"] as const,
  search: (q: string) => ["search", q] as const,
};

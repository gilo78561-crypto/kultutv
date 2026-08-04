import { getArticle, getArticles } from "@/functions/articles";
import { getEmission, getEmissions } from "@/functions/emissions";
import { getFlashInfo } from "@/functions/flash-info";
import { getPodcasts } from "@/functions/podcasts";
import { getProgrammeEnCours } from "@/functions/programme";
import { getReplay, getReplays } from "@/functions/replays";
import { getRadioStreams, getTvStreams } from "@/functions/streams";

/**
 * Public data layer — thin wrapper around the DB-backed server functions in
 * src/functions/*. Consumers (route loaders, useQuery calls) are unchanged from
 * when this called the mock data with a fake delay.
 */
export const api = {
  getTvStreams: () => getTvStreams(),
  getRadioStreams: () => getRadioStreams(),
  getReplays: () => getReplays(),
  getReplay: (slug: string) => getReplay({ data: { slug } }),
  getArticles: () => getArticles(),
  getArticle: (slug: string) => getArticle({ data: { slug } }),
  getEmissions: () => getEmissions(),
  getEmission: (slug: string) => getEmission({ data: { slug } }),
  getPodcasts: () => getPodcasts(),
  getFlashInfo: () => getFlashInfo(),
  getProgrammeEnCours: () => getProgrammeEnCours(),
  search: async (q: string) => {
    const term = q.trim().toLowerCase();
    if (!term) return { articles: [], emissions: [], replays: [], podcasts: [] };
    const match = (s: string) => s.toLowerCase().includes(term);
    const [articles, emissions, replays, podcasts] = await Promise.all([
      getArticles(),
      getEmissions(),
      getReplays(),
      getPodcasts(),
    ]);
    return {
      articles: articles.filter((a) => match(a.title) || match(a.category)),
      emissions: emissions.filter((e) => match(e.title) || match(e.category) || match(e.host)),
      replays: replays.filter((r) => match(r.title) || match(r.emission)),
      podcasts: podcasts.filter((p) => match(p.title) || match(p.show)),
    };
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

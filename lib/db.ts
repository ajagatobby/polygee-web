import Dexie, { type EntityTable } from "dexie";

/** Cached league shape matching ApiLeague */
export interface CachedLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  season: number;
  fixtureCount?: number;
}

/** Meta row to track when the league cache was last refreshed */
export interface CacheMeta {
  key: string;
  updatedAt: number; // epoch ms
}

const db = new Dexie("polygee") as Dexie & {
  leagues: EntityTable<CachedLeague, "id">;
  cacheMeta: EntityTable<CacheMeta, "key">;
};

db.version(1).stores({
  leagues: "id, name",
  cacheMeta: "key",
});

export { db };

import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// USERS — Clerk userId as PK
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),                 // Clerk userId
  username: text("username").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),              // server-side default timestamp
});

// MOVIES — local cache keyed by TMDB id
export const movies = sqliteTable("movies", {
  tmdbId: integer("tmdb_id").primaryKey(),
  title: text("title"),
  posterPath: text("poster_path"),
  releaseDate: text("release_date"),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// WATCHLIST — composite PK (userId, tmdbId)
export const watchlist = sqliteTable(
  "watchlist",
  {
    userId: text("user_id").notNull(),
    tmdbId: integer("tmdb_id").notNull(),
    addedAt: integer("added_at").notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.tmdbId] }),
    userIdx: index("watchlist_user_idx").on(t.userId),
    movieIdx: index("watchlist_movie_idx").on(t.tmdbId),
  })
);

// REVIEWS — composite PK (userId, tmdbId); rating with 0.1–10.0 granularity
export const reviews = sqliteTable(
  "reviews",
  {
    userId: text("user_id").notNull(),
    tmdbId: integer("tmdb_id").notNull(),
    rating: real("rating").notNull(),          // SQLite REAL (float)
    body: text("body"),
    createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.tmdbId] }),
    userIdx: index("reviews_user_idx").on(t.userId),
    movieIdx: index("reviews_movie_idx").on(t.tmdbId),
  })
);

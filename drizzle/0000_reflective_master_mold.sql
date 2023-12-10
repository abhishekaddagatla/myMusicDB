CREATE TABLE IF NOT EXISTS "songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_uploaded" date,
	"name" text,
	"length" integer,
	"genre" text,
	"artist" text
);

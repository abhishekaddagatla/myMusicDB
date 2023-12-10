import { pgTable, serial, text, varchar, date, integer} from "drizzle-orm/pg-core";

export const songs = pgTable('songs', {
  id: serial('id').primaryKey(),
  date_uploaded: date('date_uploaded'),
  name: text('name'),
  length: integer('length'),
  genre: text('genre'),
  artist: text('artist'),
});

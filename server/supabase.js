const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vfzlauiwyzcbcasiptnz.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemxhdWl3eXpjYmNhc2lwdG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4MTIzMTEsImV4cCI6MjAxNDM4ODMxMX0.rqDQDp8Bs-FLjl9liceayhxDGOM2kDgkitvuNZbLfF4'
);

async function addSongToDatabase(name, genre, artist, length) {
    const { data, error } = await supabase
      .from('songs')
      .insert([
        {
          name,
          genre,
          artist,
          length,
        },
      ]);
  
    if (error) {
      throw error;
    }
  
    return data;
}
  
  module.exports = {
    addSongToDatabase,
  };
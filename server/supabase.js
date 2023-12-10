const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vfzlauiwyzcbcasiptnz.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemxhdWl3eXpjYmNhc2lwdG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4MTIzMTEsImV4cCI6MjAxNDM4ODMxMX0.rqDQDp8Bs-FLjl9liceayhxDGOM2kDgkitvuNZbLfF4'
);
const { decode } =  require('base64-arraybuffer');

async function addSongToDatabase(name, genre, artist, length) {
    const { data, error } = await supabase
      .from('songs')
      .insert([
        {
          name,
          genre,
          artist,
          length,
          date_uploaded: new Date()
        },
      ]);
  
    if (error) {
      throw error;
    }
  
    return data;
}

async function serveFile(file_name) {
  console.log(file_name);
  const { publicURL, error } = await supabase
    .storage
    .from('songs')
    .createSignedUrl(file_name, 3600); // expires in 60 seconds
  
  if (error) {
    throw error;
  }

  return publicURL;
}

async function uploadSong(file, file_name, file_type) {
  //console.log(`file_name: ${file_name}, file_type: ${file_type}`);
  console.log(file);
  //converts file to base64
  const b64_file = Buffer.from(file.buffer).toString('base64');
  
  const { data, error } = await supabase
    .storage
    .from('songs')
    .upload(file_name, decode(b64_file), {
      contentType: file_type, // Set the content type based on the file's mimetype
    });

  if (error) {
    throw error;
  }

  return data;
}

async function getSongs(search_query) {
  // search_query can be querying names or genres or artists
  if (search_query) {
    const { data, error } = await supabase.rpc("search_songs", {search: search_query});
    if (error) {
      throw error;
    }
    return data;
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
}

async function deleteSong(id) {
  const { data, error } = await supabase
    .from('songs')
    .delete()
    .match({ id });

  if (error) {
    throw error;
  }

  return data;
}

async function editSong(id, name, genre, artist) {
  const { data, error } = await supabase
    .from('songs')
    .update({ name, genre, artist })
    .match({ id });

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  addSongToDatabase,
  getSongs,
  deleteSong,
  editSong,
  uploadSong,
  serveFile
};
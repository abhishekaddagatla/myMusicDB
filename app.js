const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ storage: multer.memoryStorage() } );
const port = process.env.PORT || 3000; // Use the provided port or default to 3000

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static('public')); // Serve static files from the 'public' directory


const supabaseFunctions = require('./server/supabase'); // Import the Supabase-related functions

// Define your routes
app.get('/', (req, res) => {
  res.redirect("/main.html");
});

app.post('/add-song', async (req, res) => {
  const { name, genre, artist, length } = req.body;

  try {
    const data = await supabaseFunctions.addSongToDatabase(name, genre, artist, length);
    res.json(data);
  } catch (error) {
    console.error('Error adding a song:', error);
    res.status(500).send('An error occurred while adding a song.');
  }
});

app.post('/serve-file', async (req, res) => {
  const { name } = req.body;

  try {
    const data = await supabaseFunctions.serveFile(name);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error('Error serving a file:', error);
    res.status(500).send('An error occurred while serving a file.');
  }
});

app.post('/upload-song', upload.single('file'), async (req, res) => {
  const { file_name, file_type } = req.body; 
  const file = req.file; 
  //console.log(file);
  try {
    const data = await supabaseFunctions.uploadSong(file, file_name, file_type);
    res.json(data);
  } catch (error) {
    console.error('Error uploading a song:', error);
    res.status(500).send('An error occurred while uploading a song.');
  }
});

app.post('/get-songs', async (req, res) => {
  const { search_query } = req.body;
  try {
    const data = await supabaseFunctions.getSongs(search_query);
    res.json(data);
  } catch (error) {
    console.error('Error getting songs:', error);
    res.status(500).send('An error occurred while getting songs.');
  }
});

app.post('/sign-up', async (req, res) => {
  const {email , password} = req.body;

  try {
    const data = await supabaseFunctions.signUp(email, password);
    res.json(data);
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('An error occurred while signing up.');
  }
});

app.post('/delete-song', async (req, res) => {
  const {id} = req.body;

  try {
    const data = await supabaseFunctions.deleteSong(id);
    res.json(data);
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).send('An error occurred while deleting song.');
  }
});

app.post('/edit-song', async (req, res) => {
  const {id, name, genre, artist} = req.body;

  try {
    const data = await supabaseFunctions.editSong(id, name, genre, artist);
    res.json(data);
  } catch (error) {
    console.error('Error editing song:', error);
    res.status(500).send('An error occurred while editing song.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const express = require('express');
const app = express();
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


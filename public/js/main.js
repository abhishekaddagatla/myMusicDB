function newSong() {
  console.log('Hello World!');
}

function isEmpty(value) {
  return (value == null || (typeof value === "string" && (value.trim().length === 0 || value == null)));
}

function insertNewSong() {
  var name = document.getElementById("name-input").value;
  var genre = document.getElementById("genre-input").value;
  var artist = document.getElementById("artist-input").value;
  var saveButton = document.getElementById("new-song-save");

  if (isEmpty(name) || isEmpty(genre) || isEmpty(artist)) {
    alert("a field is empty!");
    return;
  }

  $.ajax({
    url: '/add-song',
    type: 'POST',
    data: { 
      'name': name, 
      'genre': genre, 
      'artist': artist,
      'length': 100
    },
    success: function(response) {
      console.log(response);
    }
  });

}
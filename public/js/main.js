getSongs();

function isEmpty(value) {
  return (value == null || (typeof value === "string" && (value.trim().length === 0 || value == null)));
}

function getSongs() {
  $.ajax({
    url: '/get-songs',
    type: 'POST',
    success: function(response) {
      generateTable(response);
    }
  });
}

function generateTable(songs) {
  var container = document.getElementById("songs-table");
  var tableHTML = "<tr><th>Name</th><th>Genre</th><th>Artist</th><th>Upload Date</th><th>Functions</th></tr>";
  var songJson = songs;
  for (var i = 0; i < songJson.length; i++) {
    console.log(songJson[i]);
    var id = songJson[i].id;
    var name = songJson[i].name;
    var genre = songJson[i].genre;
    var artist = songJson[i].artist;
    var upload_date = songJson[i].upload_date;

    // Add a dropdown menu with two buttons, edit and delete, for each song and put it in the last column
    var dropdownHTML = '<div class="dropdown">' +
      '<button class="btn btn-secondary dropdown-toggle bg-dark" type="button" data-bs-toggle="dropdown" aria-expanded="false">' +
      '</button>' +
      '<ul class="dropdown-menu">' +
      '<li><a class="dropdown-item" onclick="deleteSong(' + id + ')"><i class="fa-solid fa-trash"></i></a></li>' +
      '<li><a class="dropdown-item" onclick="openEditModal(\'' + id + '\', \'' + name + '\', \'' + genre + '\', \'' + artist + '\')" ><i class="fa-solid fa-pen-to-square"></i></a></li>' +
      '</ul>' +
      '</div>';

    tableHTML += "<tr><td>" + name + "</td><td>" + genre + "</td><td>" + artist + "</td><td>" + upload_date + "</td><td>" + dropdownHTML + "</td></tr>";
  }
  container.innerHTML = tableHTML;
}

function openEditModal(name, genre, artist) {
  $('#edit-song-modal').modal('show');
  $('#name-edit').innerHTML = name;
  $('#genre-edit').text = genre;
  $('#artis-edit').text = artist;
}

function deleteSong(id) {
  $.ajax({
    url: '/delete-song',
    type: 'POST',
    data: { 'id': id },
    success: function(response) {
      getSongs();
      console.log(response);
    }
  });
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
      getSongs();
      console.log(response);
    }
  });
}

function signUp() {
  
}
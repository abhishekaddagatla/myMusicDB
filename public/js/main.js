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

function searchSongs() {
  var query = document.getElementById("search-bar").value;
  $.ajax({
    url: '/get-songs',
    type: 'POST',
    data: { 'search_query': query },
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
    // console.log(songJson[i]);
    var id = songJson[i].id;
    var name = songJson[i].name;
    var genre = songJson[i].genre;
    var artist = songJson[i].artist;
    var upload_date = songJson[i].date_uploaded;

    // console.log(name);

    // Add a dropdown menu with two buttons, edit and delete, for each song and put it in the last column
    var dropdownHTML = '<div class="dropdown">' +
      '<button class="btn btn-secondary dropdown-toggle bg-dark" type="button" data-bs-toggle="dropdown" aria-expanded="false">' +
      '</button>' +
      '<ul class="dropdown-menu">' +
      '<li><a class="dropdown-item" onclick="deleteSong(' + id + ')"><i class="fa-solid fa-trash"></i></a></li>' +
      '<li><a class="dropdown-item" onclick="openEditModal(\'' + id + '\', \'' + name + '\', \'' + genre + '\', \'' + artist + '\')" ><i class="fa-solid fa-pen-to-square"></i></a></li>' +
      '<li><a class="dropdown-item" onclick="serveFile(\'' + name + '\')" ><i class="fa-solid fa-download"></i></i></a></li>' +
      '</ul>' +
      '</div>';

    tableHTML += "<tr><td>" + name + "</td><td>" + genre + "</td><td>" + artist + "</td><td>" + upload_date + "</td><td>" + dropdownHTML + "</td></tr>";
  }
  container.innerHTML = tableHTML;
}

function serveFile(name) {
  //console.log(name);
  $.ajax({
    url: '/serve-file',
    type: 'POST',
    data: { 'name' : name },
    success: function(response) {
      //response is a link to the file and downloads it
      console.log(response);
      window.open(response, '_blank');
    }
  });
}

function openEditModal(id, name, genre, artist) {
  $('#edit-song-modal').modal('show');
  document.getElementById('edit-song-modal').setAttribute('data-song-id', id);
  document.getElementById('name-edit').value = name;
  document.getElementById('genre-edit').value = genre;
  document.getElementById('artist-edit').value = artist;
}

function saveEdits() {
  console.log('saving edits!!!');
  var name = document.getElementById('name-edit').value
  var genre = document.getElementById('genre-edit').value;
  var artist = document.getElementById('artist-edit').value;
  //checks if any of the fields are empty and if so, alerts the user
  if (isEmpty(name) || isEmpty(genre) || isEmpty(artist)) {
    alert("a field is empty!");
    return;
  }
  //gets the id of the song that is being edited
  var id = document.getElementById('edit-song-modal').getAttribute('data-song-id');
  //calls the edit song function
  $.ajax({
    url: '/edit-song',
    type: 'POST',
    data: {
      'id': id,
      'name': name,
      'genre': genre,
      'artist': artist
    },
    success: function(response) {
      name = "";
      genre = "";
      artist = "";
      $('#edit-song-modal').modal('hide');
      getSongs();
      console.log(response);
    }
  });
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
  var file = document.getElementById("file-input").files[0];
  var duration;
  if (file) {
    var audio = new Audio();
    audio.src = URL.createObjectURL(file);

    audio.addEventListener('loadedmetadata', function() {
      // Now we have the duration in seconds floored
      duration = Math.floor(audio.duration);
      console.log("Duration of the audio file is: " + duration + " seconds");

      var name = document.getElementById("name-input").value + "." + file.name.split('.').pop(); // add the file extension to the name
      var genre = document.getElementById("genre-input").value;
      var artist = document.getElementById("artist-input").value;
      var saveButton = document.getElementById("new-song-save");

      if (isEmpty(name) || isEmpty(genre) || isEmpty(artist)) {
        alert("a field is empty!");
        return;
      }

      const formData = new FormData();
          formData.append('file', file);
          formData.append('file_name', name);
          formData.append('file_type', file.type);

          $.ajax({
            url: '/upload-song',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
              $.ajax({
                url: '/add-song',
                type: 'POST',
                data: {
                  'name': name,
                  'genre': genre,
                  'artist': artist,
                  'length': duration
                },
                success: function(response) {
                  getSongs();
                  name = "";
                  genre = "";
                  artist = "";
                  document.getElementById("file-input").value = "";
                  $('#new-song-modal').modal('hide');
                }
              });
            }
          });
    });
  }
}

var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    {title: 'Blue', duration: '4:26'},
    {title: 'Green', duration: '3:14'},
    {title: 'Red', duration: '5:01'},
    {title: 'Pink', duration: '3:21'},
    {title: 'Magenta', duration: '2:15'}
  ]
};

 var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    {title: 'Hello, Operator?', duration: '1:01'},
    {title: 'Ring, ring, ring', duration: '5:01'},
    {title: 'Fits in your pocket', duration: '3:21'},
    {title: 'Can you hear me now?', duration: '3:14'},
    {title: 'Wrong phone number', duration: '2:15'}
  ]
};

var albumBlink = {
  title: 'Blink-182',
  artist: 'Blink-182',
  label: 'Sony',
  year: '2003',
  albumArtUrl: 'assets/images/album_covers/22.jpg',
  songs: [
    {title: 'Feeling This', duration: '2:53'},
    {title: 'Obvious', duration: '2:44'},
    {title: 'I Miss You', duration: '3:47'},
    {title: 'Violence', duration: '5:20'},
    {title: 'Stockholm Syndrome', duration: '2:41'}
  ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
    + ' <td class="song-item-number">' + songNumber + '</td>'
    +  ' <td class="song-item-title">' + songName + '</td>'
    +  ' <td class="song-item-duration">' + songLength + '</td>'
    +  '</tr>'
    ;

    return template;
};

var setCurrentAlbum = function(album) {
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  albumSongList.innerHTML = '';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

window.onload = function(event) {

  setCurrentAlbum(albumPicasso);

  var albumCover = document.getElementsByClassName('album-cover-art')[0];

  var albumChoice = [albumPicasso, albumMarconi, albumBlink]
  var i = 0
  albumCover.addEventListener('click', function(){
      if (i < albumChoice.length) {
        setCurrentAlbum(albumChoice[i]);
        i++
      } else {
        i = 0
      }
  });

};

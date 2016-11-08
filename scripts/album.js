var createSongRow = function(songNumber, songName, songLength) {
  var template =
       '<tr class="album-view-song-item">'
    +  ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +  ' <td class="song-item-title">' + songName + '</td>'
    +  ' <td class="song-item-duration">' + songLength + '</td>'
    +  '</tr>'
    ;

    var $row = $(template);

    var clickHandler = function() {
      var songNumber = $(this).attr('data-song-number');

      if (currentlyPlayingSongNumber !== null) {
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }

      if (currentlyPlayingSongNumber !== songNumber) {
        $(this).html(pauseButtonTemplate);
        currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();
      } else if (currentlyPlayingSongNumber === songNumber) {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
      }
    };

    var onHover = function(event) {
      var songItem = $(this).find('.song-item-number');
      var songNumber = songItem.attr('data-song-number');

      if (songNumber !== currentlyPlayingSongNumber) {
        songItem.html(playButtonTemplate);
      }
    };

    var offHover = function(event) {
      var songItem = $(this).find('.song-item-number');
      var songNumber = songItem.attr('data-song-number')

      if (songNumber !== currentlyPlayingSongNumber) {
        songItem.html(songNumber);
      }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title)
  $('.currently-playing .artist-name').text(currentSongFromAlbum.artist)
  $('.currently-playing .artist-song-name').text(currentSongFromAlbum.title + ' - ' + currentSongFromAlbum.artist)
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
  var previousSong = currentSongFromAlbum;
    //last song
  if (album.songs.indexOf(currentSongFromAlbum) - 1 === currentAlbum.length) {
    currentlyPlayingSongNumber = 0;
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber + 1];
    $('.song-item-number').html('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  } else {
    currentlyPlayingSongNumber = trackIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
    $('.song-item-number').html('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  }
  updatePlayerBarSong();
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

// On page load these functions should run
$(document).ready(function() {
  setCurrentAlbum(albumMarconi);
  $nextButton.click(nextSong);
});

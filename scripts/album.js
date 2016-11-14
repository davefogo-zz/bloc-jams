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
      var songNumber = parseInt($(this).attr('data-song-number'));
      setSong(songNumber);

      if (currentlyPlayingSongNumber !== null) {
        //Revert to song number for currently playing song. User has started playing another song.
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }

      if (currentlyPlayingSongNumber !== songNumber) {
        $(this).html(pauseButtonTemplate);
        setSong(songNumber);
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
      var songNumber = parseInt(songItem.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
        songItem.html(playButtonTemplate);
      }
    };

    var offHover = function(event) {
      var songItem = $(this).find('.song-item-number');
      var songNumber = parseInt(songItem.attr('data-song-number'));

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
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentSongFromAlbum.artist);
  $('.currently-playing .artist-song-name').text(currentSongFromAlbum.title + ' - ' + currentSongFromAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {

    var getLastSongNumber = function(index) {
      if (index == 0) {
        return currentAlbum.songs.length;
      } else {
        return index;
      };
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Set a new current song
    setSong(currentSongIndex + 1);

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = parseInt(getLastSongNumber(currentSongIndex));
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {

  var getLastSongNumber = function(index) {
    if (index == (currentAlbum.songs.length - 1)) {
      return 1;
    } else {
      return index + 2;
    }
  };

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  setSong(songNumber);

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = parseInt(getLastSongNumber(currentSongIndex));
  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

// setSong(SongNumber) => currentlyPlayingSongNumber => new value
//                        currentSongFromAlbum => new value
//example
//setSong(2);
//=> currentlyPlayingSongNumber = 3;
//=> currentSongFromAlbum = "Fits in your pocket";

var setSong = function(songNumber) {
  if (songNumber != null) {
    return currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    return currentlyPlayingSongNumber = currentSongFromAlbum.attr('data-song-number');
  }
};

// getSongNumberCell(number) => $('.song-item-number="number")
//example
//getSongNumberCell(2);
//=> $('.song-item-number=2');

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
}

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//Store state of playing songs
var currentAlbum = null; //this var holds album information
var currentlyPlayingSongNumber = null; //this var holds the song number of the song being played (its 1 + index)
var currentSongFromAlbum = null; //this variable will hold the songs complete object.

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

// On page load these functions should run
$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});

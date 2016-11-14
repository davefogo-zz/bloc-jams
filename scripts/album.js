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

      if (currentlyPlayingSongNumber !== null) {
        //Revert to song number for currently playing song. User has started playing another song.
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }

      if (currentlyPlayingSongNumber !== songNumber) {
        setSong(songNumber);
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
        updatePlayerBarSong();
      } else if (currentlyPlayingSongNumber === songNumber) {
          if (currentSoundFile.isPaused()) {
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
          } else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.pause();
          }
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
    currentSoundFile.play();

    // Update the Player Bar information
    updatePlayerBarSong();

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

  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  updatePlayerBarSong();

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
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: ['mp3'],
      preload: true
    });

    setVolume(currentVolume);
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};
// song => II => change the pauseButtonTemplate to playButtonTemplate
// song => |> => change the playButtonTemplate to pauseButtonTemplate if currentSoundFile exists.
var togglePlayFromPlayerBar = function (){
  if (currentSoundFile.isPaused()) {
    currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(pauseButtonTemplate);
    updatePlayerBarSong();
    currentSoundFile.play();
  } else if (currentSoundFile) {
    currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(playButtonTemplate);
    $playerBarPlayPauseButton.html(playerBarPlayButton);
    currentSoundFile.pause();
  }
}

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
var currentAlbum = null; //holds album information
var currentlyPlayingSongNumber = null; //holds the song number of the song being played (its 1 + index)
var currentSongFromAlbum = null; //holds the songs complete object.
var currentSoundFile = null; //holds the sound object when a new current song is set
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playerBarPlayPauseButton = $('.main-controls .play-pause');

// On page load these functions should run
$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);
});

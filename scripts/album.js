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

      updateSeekBarWhileSongPlays();

      if (currentlyPlayingSongNumber !== null) {
        //Revert to song number for currently playing song. User has started playing another song.
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }

      if (currentlyPlayingSongNumber !== songNumber) {
        setSong(songNumber);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        //Set the default volume in the volume bar
        $('.volume .seek-bar').find('.thumb').css({left: currentVolume + '%'});
        $('.volume .seek-bar').find('.fill').width(currentVolume + '%');

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

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100; // .05 * 100 = 5

  offsetXPercent = Math.max(0, offsetXPercent); // No number below 0
  offsetXPercent = Math.min(100, offsetXPercent);// No number above 100

  var percentageString = offsetXPercent + '%'; // 5 (from above) % = 5%
  $seekBar.find('.fill').width(percentageString); //width of the fill bar
  $seekBar.find('.thumb').css({left: percentageString});// position of the thumb in relation to the left edge of parent element.
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar'); // Selects all seek-bars under player-bar. Specific bar chosen by target of event.
  updateSeekBarWhileSongPlays();

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left; // makes the thumb movable by clicking the specific location in the seek-bar. pageX = horizontal pageY = vertical / offset from left edge of parent
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;


    if ($(this).parent().attr('class') === 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration())
    } else {
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);

  });

  $seekBars.find('.thumb').mousedown(function(event) { // makes thumb draggable to move across.
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) { // $(document).bind makes sure we can drag the mousedown outside the seek-bar.
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;


      if ($seekBar.parent().attr('class') === 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration())
      } else {
        setVolume(seekBarFillRatio);
      }

      updateSeekPercentage($seekBar, seekBarFillRatio);

    });

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb'); //removes specific event listeners
      $(document).unbind('mouseup.thumb');
    });
  })
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

  updateSeekBarWhileSongPlays();
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

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

// getSongNumberCell(number) => $('.song-item-number="number")
//example
//getSongNumberCell(2);
//=> $('.song-item-number=2');

// song => II => change the pauseButtonTemplate to playButtonTemplate
// song => |> => change the playButtonTemplate to pauseButtonTemplate if currentSoundFile exists.
var togglePlayFromPlayerBar = function() {

  currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

  if (currentSoundFile.isPaused()) {
    currentlyPlayingCell.html(pauseButtonTemplate);
    updatePlayerBarSong();
    currentSoundFile.play();
  } else if (currentSoundFile) {
    currentlyPlayingCell.html(playButtonTemplate);
    $playerBarPlayPauseButton.html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

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
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);
});

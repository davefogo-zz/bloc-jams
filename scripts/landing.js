var points = document.getElementsByClassName('point');

function revealPoint(array){
  for (var i = 0; i < array.length; i++) {
    array[i].style.opacity = 1;
    array[i].style.transform = "scaleX(1) translateY(0)";
    array[i].style.msTransform = "scaleX(1) translateY(0)";
    array[i].style.WebkitTransform = "scaleX(1) translateY(0)";
  }
};

revealPoint(points);

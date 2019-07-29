onload = function(){
  DrawBoard();
}

function DrawBoard(){
  var canvas = document.getElementById('board');
  var ctx = canvas.getContext('2d');

  var img = new Image();
  img.src = "board.png?" + new Date().getTime();
  img.onload = function() {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function DrawPiece(){

}

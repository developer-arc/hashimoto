var PLAYER_CONTROL_PHASE_STEP1 = 0;
var PLAYER_CONTROL_PHASE_STEP2 = 1;

var GAME_CONTROL = {
    TURN : 1,
    PLAYER_CONTROL_PHASE : PLAYER_CONTROL_PHASE_STEP1,
    PHASE_STEP1_TARGET_X : 0,
    PHASE_STEP1_TARGET_Y : 0
}

var tmp_obj = {
   piece:"",
   player:0,
};


//盤面初期化[y][x]
var board_status = new Array();
for(var y=0;y<=8;y++){
    board_status[y] = new Array();
    for(var x=0;x<=8;x++){
      var tmp_obj = {
        piece:"",
        player:0,
      };
      if( y == 2 || y == 6 ){
        tmp_obj.piece = "歩";
        if(y == 2){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if((y == 0 || y == 8) && (x == 0 || x == 8)){
        tmp_obj.piece = "香";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if((y == 0 || y == 8) && (x == 1 || x == 7)){
        tmp_obj.piece = "桂";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if((y == 0 || y == 8) && (x == 2 || x == 6)){
        tmp_obj.piece = "銀";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if((y == 0 || y == 8) && (x == 3 || x == 5)){
        tmp_obj.piece = "金";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if(y == 1 && x == 7 || y == 7 && x == 1){
        tmp_obj.piece = "角";
        if(y == 1){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if(y == 1 && x == 1 ||y == 7 && x == 7){
        tmp_obj.piece = "飛";
        if(y == 1){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if(x == 4 && (y ==0 ||y ==8)){
        tmp_obj.piece = "王";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }
      board_status[y][x] = tmp_obj;
    }
}
display();

const board = document.getElementById("board");
board.addEventListener("click", getTarget, false);

//クリックされた要素のカスタムデータ取得
function getTarget(event) {
   let target = event.target;
   var target_y = target.getAttribute('data-y');
   var target_x = target.getAttribute('data-x');
   console.log(GAME_CONTROL.TURN % 2);
   if(GAME_CONTROL.PLAYER_CONTROL_PHASE == PLAYER_CONTROL_PHASE_STEP1){
     //駒のないますならスルー
     if(board_status[target_y][target_x].player == 0){
       return ;
     }
     //自分のターンに自分の駒以外をクリックしたらスルー
     if(GAME_CONTROL.TURN % 2 == 1 && board_status[target_y][target_x].player != 1){
       return ;
     }
     if(GAME_CONTROL.TURN % 2 == 0 && board_status[target_y][target_x].player != 2){
       return ;
     }
     // 1度目に押された座標を格納
    GAME_CONTROL.PHASE_STEP1_TARGET_Y = target_y;
    GAME_CONTROL.PHASE_STEP1_TARGET_X = target_x;
    GAME_CONTROL.PLAYER_CONTROL_PHASE = PLAYER_CONTROL_PHASE_STEP2;
  }else if(GAME_CONTROL.PLAYER_CONTROL_PHASE == PLAYER_CONTROL_PHASE_STEP2){
    console.log(GAME_CONTROL.PHASE_STEP1_TARGET_Y == (target_y + 1));
    console.log(GAME_CONTROL.PHASE_STEP1_TARGET_Y);
    console.log(target_y);
    if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "歩" && board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
      if(GAME_CONTROL.PHASE_STEP1_TARGET_Y != (target_y + 1) && GAME_CONTROL.PHASE_STEP1_TARGET_X != target_x){
        return ;
      }
    }
    tmp_obj = board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X];
    board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X] = board_status[target_y][target_x];
    board_status[target_y][target_x] = tmp_obj;
    GAME_CONTROL.PLAYER_CONTROL_PHASE = PLAYER_CONTROL_PHASE_STEP1;
    GAME_CONTROL.TURN++;
  }
  event.preventDefault();
  display();
}


// 描画
function display(){
   //tableタグの子要素を全て削除
   let parent = document.getElementById('board');
   while(parent.lastChild){
     parent.removeChild(parent.lastChild);
   }
   for(var i = 0; i<board_status.length;i++){
      var tr = document.createElement('tr');
      tr.id = "y"+i;
      document.getElementById('board').appendChild(tr);
      for(var j = 0; j<board_status[i].length;j++){
        var td = document.createElement('td');
        //id属性追加
        td.id = "y" + i + "x" + j;
        td.onclick = "square";
        document.getElementById("y"+i).appendChild(td);
        //カスタムデータ属性追加
        var tmp_elem = document.getElementById("y" + i + "x" + j);
        tmp_elem.dataset.x = j;
        tmp_elem.dataset.y = i;
        td.innerHTML = board_status[i][j]["piece"];
      }
    }
}
